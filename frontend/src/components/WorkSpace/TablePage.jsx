import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "../../App.css";

const TablePage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] = useState(null);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch(
        "https://apiplatform.finkraft.ai/meta/workspaces"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }
      const data = await response.json();
      setWorkspaces(data);
    } catch (error) {
      console.error("Error fetching workspaces:", error);
    }
  };

  const handleDelete = async (workspaceId) => {
    setWorkspaceToDelete(workspaceId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!workspaceToDelete) return;
    try {
      const response = await fetch(
        `https://apiplatform.finkraft.ai/meta/workspace/delete/${workspaceToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete workspace");
      }
      // Update the state to remove the deleted workspace
      setWorkspaces((prevWorkspaces) =>
        prevWorkspaces.filter((workspace) => workspace.id !== workspaceToDelete)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const fetchPANsForWorkspace = async (workspaceId) => {
    try {
      const response = await fetch(
        `https://apiplatform.finkraft.ai/meta/pans/${workspaceId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch PANs");
      }
      const data = await response.json();
      return data.map((pan) => pan.pan);
    } catch (error) {
      console.error(`Error fetching PANs for workspace ${workspaceId}:`, error);
      return [];
    }
  };

  const columnDefs = [
    // { headerName: 'ID', field: 'id',  },
    { headerName: "Name", field: "name", flex: 1, headerClass: 'custom-header' },
    {
      headerName: "Active",
      field: "is_active",
      headerClass: 'custom-header',
      width: 300,
      cellRenderer: (params) => (params.value ? "true" : "false"),
    },
    {
      headerName: "PANs",
      headerClass: 'custom-header',
      field: "id",
      width: 500,
      cellRenderer: (params) => {
        const workspaceId = params.value;
        const pansPromise = fetchPANsForWorkspace(workspaceId);
        return <PANsCellRenderer promise={pansPromise} />;
      },
    },
    {
      headerName: "Action",
      headerClass: 'custom-header',
      flex: 1,
      cellRenderer: (params) => {
        const id = params.data.id;
        return (
          <div>
            <Link
              to={`/UpdateForm/${id}?name=${encodeURIComponent(
                params.data.name
              )}&isActive=${params.data.is_active}`}
            >
              <Button variant="info">Update</Button>
            </Link>

            <Button
              variant="danger"
              className="mx-3"
              onClick={() => handleDelete(id)}
            >
              Delete
            </Button>
          </div>
        );
      },
      width: 300,
    },
  ];

  const gridOptions = {
    domLayout: "autoHeight",
    defaultColDef: {
      sortable: true,
      filter: true,
    },
  };

  return (
    <>
      <div className="d-flex justify-content-between">
        <h2>Workspaces</h2>
        <div>
          <Link to="/Createworkspace">
            <Button variant="primary">+ New</Button>
          </Link>
        </div>
      </div>
      <div
        className="ag-theme-alpine mt-5"
        style={{ height: "90vh", width: "100%" }}
      >
        <AgGridReact
          rowGroupPanelShow="always"
          rowData={workspaces}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          animateRows={true}
          onGridReady={(params) => setGridApi(params.api)}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Workspace</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this workspace?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

const PANsCellRenderer = ({ promise }) => {
  const [pans, setPans] = useState([]);

  useEffect(() => {
    let isMounted = true;
    promise
      .then((data) => {
        if (isMounted) {
          setPans(data);
        }
      })
      .catch((error) => {
        console.error("Error fetching PANs:", error);
      });

    return () => {
      isMounted = false;
    };
  }, [promise]);

  return (
    <div>
      {pans.map((pan, index) => (
        <span key={index} className="workspacename">
          {pan}
        </span>
      ))}
    </div>
  );
};

export default TablePage;
