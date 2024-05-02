import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const ClusterTable = () => {
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    // Fetch clusters data from API
    fetch('http://127.0.0.1:5000/api/clusters')
      .then(response => response.json())
      .then(data => setClusters(data))
      .catch(error => console.error('Error fetching clusters:', error));
  }, []);

  const handleDelete = (id) => {
    // Display confirmation dialog
    const confirmDelete = window.confirm('Are you sure you want to delete this cluster?');
    
    // Check if user confirmed
    if (confirmDelete) {
      // Proceed with delete action
      fetch(`http://127.0.0.1:5000/api/cluster/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        if (response.ok) {
          // Remove the deleted cluster from the state
          setClusters(clusters.filter(cluster => cluster.id !== id));
          console.log('Cluster deleted successfully');
        } else {
          console.error('Failed to delete cluster');
        }
      })
      .catch(error => console.error('Error deleting cluster:', error));
    } else {
      console.log('Delete action canceled by user');
    }
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
          <Button variant="info"  onClick={handleEditClick}>Edit</Button>
        </Link>
        <Button variant="danger" className='mx-3' onClick={handleDeleteClick}>Delete</Button>
      </div>
    );
  };

  const columnDefs = [
    { headerName: 'ID', field: 'id', width: 400 ,headerClass: 'custom-header',},
    { headerName: 'Name', field: 'name', width: 200 ,headerClass: 'custom-header',},
    { 
      headerName: 'Workspaces', 
      field: 'workspaces', 
      width: 650, // Adjust the width as needed
      autoHeight: true, // Enable auto-height to display multiline content
      wrapText: true, // Enable text wrapping
      headerClass: 'custom-header',
      valueFormatter: (params) => `[${params.value.join(', ')}]`
    },
    { headerName: 'Action', cellRenderer: actionCellRenderer, width: 250, headerClass: 'custom-header' }
  ];
  
  

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
      />
    </div>
   </>
  );
};

export default ClusterTable;
