import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateCluster = () => {
  const [name, setName] = useState('');
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);
  const [search, setSearch] = useState('');
  const [workspaceNames, setWorkspaceNames] = useState([]);
  const { id } = useParams(); // Get the cluster ID from URL params
  const nav = useNavigate();

  useEffect(() => {
    // Fetch cluster data from API
    fetch(`http://127.0.0.1:5000/api/clusters/${id}`)
      .then(response => response.json())
      .then(data => {
        setName(data.name);
        setSelectedWorkspaces(data.workspaces); // Set selectedWorkspaces with workspace IDs
      })
      .catch(error => console.error('Error fetching cluster:', error));

    // Fetch workspace names from API
    fetch('https://apiplatform.finkraft.ai/meta/workspaces')
      .then(response => response.json())
      .then(data => {
        setWorkspaceNames(data);
      })
      .catch(error => console.error('Error fetching workspace names:', error));
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Prepare payload
    const payload = {
      id,
      name,
      workspaces: selectedWorkspaces
    };

    // POST request to update cluster data
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/cluster/${id}`, {
        method: 'PUT', // or 'PATCH' if appropriate
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        nav('/clusters');
        console.log('Cluster updated successfully');
        // Reset form fields if needed
      } else {
        console.error('Failed to update cluster');
      }
    } catch (error) {
      console.error('Error updating cluster:', error);
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearch(searchTerm);
    // Filter workspace names based on search term
    if (searchTerm === '') {
      // If search term is empty, display all workspace names
      setWorkspaceNames(workspaceNames);
    } else {
      // Otherwise, filter workspace names based on search term
      const filteredWorkspaces = workspaceNames.filter(workspace => workspace.name.toLowerCase().includes(searchTerm));
      setWorkspaceNames(filteredWorkspaces);
    }
  };

  const handleWorkspaceChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedWorkspaces(prevSelected => [...prevSelected, value]);
    } else {
      setSelectedWorkspaces(prevSelected => prevSelected.filter(workspaceId => workspaceId !== value));
    }
  };

  const handleWorkspaceNameClick = (workspaceId) => {
    if (!selectedWorkspaces.includes(workspaceId)) {
      setSelectedWorkspaces([...selectedWorkspaces, workspaceId]);
    } else {
      setSelectedWorkspaces(selectedWorkspaces.filter(id => id !== workspaceId));
    }
  };

  return (
    <div className='d-flex flex-column cmain'>
      <div className='d-flex flex-column align-items-center'>
        <Form onSubmit={handleSubmit} style={{ width: '900px' }}>
          <div className='d-flex justify-content-between mb-3'>
            <h2>Update Cluster</h2>
            <div>
              <Button variant="primary" type="submit">
                Save
              </Button>
            </div>
          </div>
          <Form.Group controlId="formName" className='mb-3'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              placeholder="Enter cluster name"
              value={name}
              onChange={handleNameChange}
            />
          </Form.Group>
          <Form.Group controlId="formSearch" className='mb-3'>
            <Form.Label>Search Cluster</Form.Label>
            <Form.Control
              type="text"
              name="search"
              placeholder="Search cluster"
              value={search}
              onChange={handleSearchChange}
            />
          </Form.Group>
          <Form.Group controlId="formWorkspaceNames" className='d-flex '>
            <Form.Label>Workspace Names</Form.Label>
            <div>
              {workspaceNames.map(workspace => (
                <div key={workspace.id} className='mx-5 d-flex mb-2'>
                  <Form.Check
                    type="checkbox"
                    value={workspace.id}
                    checked={selectedWorkspaces.includes(workspace.id)}
                    onChange={handleWorkspaceChange}
                  />
                  <span 
                    className='workspace-name-label mx-2' 
                    style={{cursor: 'pointer'}}
                    onClick={() => handleWorkspaceNameClick(workspace.id)}
                  >
                    {workspace.name}
                  </span>
                </div>
              ))}
            </div>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default UpdateCluster;
