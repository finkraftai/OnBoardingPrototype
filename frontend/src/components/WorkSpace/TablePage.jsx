import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../../App.css';

const TablePage = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    // Fetch all workspaces
    fetch('https://apiplatform.finkraft.ai/meta/workspaces')
      .then(response => response.json())
      .then(data => setWorkspaces(data))
      .catch(error => console.error('Error fetching workspaces:', error));
  }, []);

  const handleDelete = async (workspaceId) => {
    const confirmed = window.confirm('Are you sure you want to delete this workspace?');
    if (!confirmed) {
      return; // Do nothing if user cancels the deletion
    }
  
    try {
      const response = await fetch(`https://apiplatform.finkraft.ai/meta/workspace/delete/${workspaceId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete workspace');
      }
      // Refresh workspaces after successful deletion
      const updatedWorkspaces = workspaces.filter(workspace => workspace.id !== workspaceId);
      setWorkspaces(updatedWorkspaces);
    } catch (error) {
      console.error('Error deleting workspace:', error);
      // Handle error if needed
    }
  };

  const columnDefs = [
    { headerName: 'ID', field: 'id', width: 500, headerClass: 'custom-header',filter: true },
    { headerName: 'Name', field: 'name',width: 350,headerClass: 'custom-header',filter: true },
    { headerName: 'Active', field: 'is_active',width: 350, cellRenderer: 'agAnimateShowChangeCellRenderer',headerClass: 'custom-header',filter: true },
    {
      headerName: 'Action',headerClass: 'custom-header',filter: true,
      cellRenderer: (params) => {
        const id = params.data.id;
        return (
          <div>
            <Link to={`/UpdateForm/${id}`}><Button variant="info">Update</Button></Link>
            <Button variant="danger"  className='mx-3' onClick={() => handleDelete(id)}>Delete</Button>
          </div>
        );
      }
    }
  ];

  const gridOptions = {
    domLayout: 'autoHeight',
    // Apply custom CSS class to ag-Grid cells
    defaultColDef: {
      cellClass: 'ag-cell'
    },
    rowClass: 'ag-row' // Set font size for rows
  };

  return (
    <>
      <div className='d-flex justify-content-between'>
        <h2>Workspaces</h2>
        <div>
          <Link to='/Createworkspace'><Button variant="primary">+ New</Button></Link>
        </div>
      </div>
      <div className="ag-theme-alpine mt-5" style={{ height: '90vh', width: '100%' }}>
        <AgGridReact
          rowData={workspaces}
          columnDefs={columnDefs}
          gridOptions={gridOptions}
          animateRows={true}
          onGridReady={params => setGridApi(params.api)}
        />
      </div>
    </>
  );
};

export default TablePage;
