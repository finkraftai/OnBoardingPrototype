import React, { useState, useEffect } from 'react';
import { Form, Button, Dropdown } from 'react-bootstrap';
import '../../App.css';

const CreatePan = () => {
  const [pan, setPan] = useState('');
  const [entityName, setEntityName] = useState('');
  const [workspaceId, setWorkspaceId] = useState('');
  const [error, setError] = useState('');
  const [workspaceNames, setWorkspaceNames] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchWorkspaceNames();
  }, []);

  const fetchWorkspaceNames = async () => {
    try {
      const response = await fetch('https://apiplatform.finkraft.ai/meta/workspaces');
      if (!response.ok) {
        throw new Error('Failed to fetch workspace names');
      }
      const data = await response.json();
      setWorkspaceNames(data);
    } catch (error) {
      console.error('Error fetching workspace names:', error);
      setError('Failed to fetch workspace names. Please try again.');
    }
  };

  const handleWorkspaceSelect = (workspaceId) => {
    setWorkspaceId(workspaceId);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://apiplatform.finkraft.ai/meta/pan/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pan, entity_name: entityName, workspace_id: workspaceId })
      });

      if (!response.ok) {
        throw new Error('Failed to create PAN');
      }

      // PAN created successfully, do something if needed
      console.log(response);
      console.log('PAN created successfully');

      // Reset form fields
      setPan('');
      setEntityName('');
      setWorkspaceId('');
      setError('');
    } catch (error) {
      console.error('Error creating PAN:', error);
      setError('Failed to create PAN. Please try again.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center main" >
      <div className='border p-5 form'>
      <Form onSubmit={handleSubmit} style={{ width: '500px' }}>
      <h2>Create PAN</h2>
        {error && <p className="text-danger">{error}</p>}
        <Form.Group controlId="pan" className='mb-4'>
          <Form.Label>PAN</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter PAN"
            value={pan}
            onChange={(e) => setPan(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="entityName" className='mb-4'>
          <Form.Label>Entity Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Entity Name"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            required
          />
        </Form.Group>
        <Dropdown show={showDropdown} onToggle={toggleDropdown} className='mb-4'>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {workspaceId ? workspaceNames.find((workspace) => workspace.id === workspaceId)?.name : 'Select Workspace'}
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ width: "500px" }}>
            {workspaceNames.map((workspace) => (
              <Dropdown.Item key={workspace.id} onClick={() => handleWorkspaceSelect(workspace.id)}>
                {workspace.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
    </div>
  );
};

export default CreatePan;
