import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { Form, Button, Modal } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const UpdateForm = () => {
  const { search } = useLocation();
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(search);
  const name = queryParams.get('name') || '';
  const isActive = queryParams.get('isActive') === 'true';

  const [formData, setFormData] = useState({ name: name, is_active: isActive });
  const [rowData, setRowData] = useState([]);
  const [deletePan, setDeletePan] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [initialFormData, setInitialFormData] = useState({ name: name, is_active: isActive });

  useEffect(() => {
    if (workspaceId) {
      fetchPANs(workspaceId);
    }
  }, [workspaceId]);

  useEffect(() => {
    setInitialFormData({ name: name, is_active: isActive });
  }, [name, isActive, workspaceId]);

  const fetchPANs = async (workspaceId) => {
    try {
      const response = await fetch(`https://apiplatform.finkraft.ai/meta/pans/${workspaceId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch PANs');
      }
      const data = await response.json();
      const formattedData = data.map(pan => ({
        pan: pan.pan,
        entity: pan.entity_name !== '' ? pan.entity_name : 'null'
      }));
      setRowData(formattedData);
    } catch (error) {
      console.error('Error fetching PANs:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let workspaceUpdated = false; 

      if (formData.name !== initialFormData.name || formData.is_active !== initialFormData.is_active) {
        workspaceUpdated = true;

        const workspaceResponse = await fetch(`https://apiplatform.finkraft.ai/meta/workspace/update/${workspaceId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        console.log(workspaceResponse);
        if (!workspaceResponse.ok) {
          throw new Error('Failed to update workspace');
        }
      }

      const updatedRowData = await Promise.all(
        rowData.map(async (row) => {
          try {
                        const { pan, entity, editableEntity, newEntity } = row;
                        const updatedEntity = editableEntity === entity ? newEntity : entity; // Use the edited entity name if available
                        const payload = { entity_name: updatedEntity, workspace_id: workspaceId };
              
                        console.log('PAN:', pan);
                        console.log('Payload:', payload);
              
                        const response = await fetch(`https://apiplatform.finkraft.ai/meta/pan/update/${pan}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(payload)
                        });
                        if (!response.ok) {
                          throw new Error(`Failed to update PAN ${pan}`);
                        }
              
                        const result = await response.json();
                        console.log(`Result for PAN ${pan}:`, result);
              
                        return { ...row, entity: updatedEntity }; // Update entity name in the row data
                      } catch (error) {
                        console.error('Error updating PAN:', error);
                        return row; // Return unchanged row data if update fails
                      }
                     
          
        })
      );

      setRowData(updatedRowData);

      navigate('/workspaces')
    } catch (error) {
      console.error('Error updating workspace:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  const handleDelete = async () => {
    if (!deletePan) return;
    try {
      const response = await fetch(`https://apiplatform.finkraft.ai/meta/pan/delete/${deletePan}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete PAN');
      }
      setShowDeleteConfirmation(false);
      fetchPANs(workspaceId);
    } catch (error) {
      console.error('Error deleting PAN:', error);
    }
  };

  const handleShowDeleteConfirmation = (pan) => {
    setDeletePan(pan);
    setShowDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setDeletePan(null);
    setShowDeleteConfirmation(false);
  };

  const columnDefs = [
    { headerName: 'PAN', field: 'pan', flex: 1 },
    {
      headerName: 'Entity',
      field: 'entity',
      flex: 1,
      editable: true,
      cellEditor: 'agLargeTextCellEditor',
      cellEditorParams: { maxLength: 100 },
    },
    {
      headerName: "Action",
      flex: 1,
      cellRenderer: (params) => {
        return (
          <div>
            <Button variant="danger" onClick={() => handleShowDeleteConfirmation(params.data.pan)}>Delete</Button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="d-flex flex-column align-items-center main" style={{ minHeight: "100vh" }}>
      <div className='border p-5 form'>
        <Form onSubmit={handleSubmit} style={{ width: '500px' }}>
          <h2 className='mb-4'>Update Workspace</h2>
          <Form.Group controlId="formName" className='mb-4'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter workspace name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formActive" className='mb-4'>
            <Form.Check
              type="checkbox"
              name="is_active"
              label="Active"
              checked={formData.is_active}
              onChange={handleChange}
            />
          </Form.Group>
          <div>
            <Link to='/createpan'><Button>+ New</Button></Link>
          </div>
          <div className="ag-theme-alpine" style={{ height: '300px', width: '100%' }}>
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              domLayout='autoHeight'
            />
          </div>
          <Button variant="primary" type="submit" className='mt-4'>
            Update
          </Button>
        </Form>
      </div>
      <Modal show={showDeleteConfirmation} onHide={handleCloseDeleteConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Delete PAN</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this PAN?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteConfirmation}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UpdateForm;

