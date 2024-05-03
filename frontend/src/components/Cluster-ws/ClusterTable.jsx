import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const ClusterTable = () => {
  const [clusters, setClusters] = useState([]);
  const [workspacesMap, setWorkspacesMap] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clusterToDelete, setClusterToDelete] = useState(null);

  useEffect(() => {
    // Fetch clusters data from API
    fetch('http://127.0.0.1:5000/api/clusters')
      .then(response => response.json())
      .then(data => setClusters(data))
      .catch(error => console.error('Error fetching clusters:', error));

    // Fetch workspaces data from API
    fetch('https://apiplatform.finkraft.ai/meta/workspaces')
      .then(response => response.json())
      .then(data => {
        // Create a map of workspace IDs to their corresponding names
        const workspaceMap = {};
        data.forEach(workspace => {
          workspaceMap[workspace.id] = workspace.name;
        });
        setWorkspacesMap(workspaceMap);
      })
      .catch(error => console.error('Error fetching workspaces:', error));
  }, []);

  const handleDelete = (id) => {
    setClusterToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!clusterToDelete) return;
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/cluster/${clusterToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // Remove the deleted cluster from the state
        setClusters(clusters.filter(cluster => cluster.id !== clusterToDelete));
        console.log('Cluster deleted successfully');
      } else {
        console.error('Failed to delete cluster');
      }
    } catch (error) {
      console.error('Error deleting cluster:', error);
    }
    setShowDeleteModal(false);
  };

  const actionCellRenderer = ({ data }) => {
    const handleEditClick = () => {
      // Handle edit action
      console.log('Edit button clicked for cluster:', data.id);
    };

    const handleDeleteClick = () => {
      handleDelete(data.id);
    };

    return (
      <div>
        <Link to={`/updatecluster/${data.id}`}>
          <Button variant="info" onClick={handleEditClick}>Edit</Button>
        </Link>
        <Button variant="danger" className='mx-3' onClick={handleDeleteClick}>Delete</Button>
      </div>
    );
  };

  const cellRenderer = params => {
    const workspaceNames = params.value.map(workspaceId => workspacesMap[workspaceId]);
    const formattedNames = workspaceNames.map((name, index) => (
      <span key={index} className='workspacename'>{name}</span>
    ));
    return <div>{formattedNames}</div>;
  };

  const columnDefs = [
    { headerName: 'Name', field: 'name', flex:1, headerClass: 'custom-header' },
    { 
      headerName: 'Workspaces', 
      field: 'workspaces', 
      flex:1,
      headerClass: 'custom-header',
      cellRenderer: cellRenderer
    },
    { headerName: 'Action', cellRenderer: actionCellRenderer, width: 250,flex:1, headerClass: 'custom-header' }
  ];

  const gridOptions = {
    domLayout: 'autoHeight',
    defaultColDef: {
      cellClass: 'ag-cell'
    },
    rowClass: 'ag-row',
    suppressSanitizeHtml: false
  };
  
  return (
    <>
      <div className='d-flex justify-content-between'>
        <h2>Clusters</h2>
        <div>
          <Link to='/Createcluster'><Button variant="primary">+ New</Button></Link>
        </div>
      </div>
      <div className="ag-theme-alpine mt-5" style={{ height:'100vh', width: '100%' }}>
        <AgGridReact
          rowData={clusters}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Cluster</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this cluster?</Modal.Body>
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

export default ClusterTable;
