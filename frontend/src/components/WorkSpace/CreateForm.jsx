// CreateForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { Form, Button } from 'react-bootstrap';

const CreateForm = () => {
  const [formData, setFormData] = useState({ name: '', is_active: true });
  const navigate = useNavigate(); // Initialize useNavigate
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://apiplatform.finkraft.ai/meta/workspace/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        throw new Error('Failed to create workspace');
      }
      // Navigate to workspace page after successful creation
      navigate('/workspaces'); // Use navigate to navigate to '/workspaces'
    } catch (error) {
      console.error('Error creating workspace:', error);
      // Handle error if needed
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const val = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: val });
  };

  return (
    <div className="d-flex justify-content-center align-items-center main" style={{ minHeight: "100vh" }}>
    <div className='border p-5 form'>
      <Form onSubmit={handleSubmit} style={{ width: '500px' }} >
        <h2 className='mb-5' >Create Workspace</h2>
        <Form.Group controlId="formName" className='mb-4'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Enter workspace name"
            value={formData.name}
            onChange={handleChange}
            style={{ width:'500px' }}
          />
        </Form.Group>
        <Form.Group controlId="formActive"  className='mb-4'>
          <Form.Check
            type="checkbox"
            name="is_active"
            label="Active"
            checked={formData.is_active}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit"  className='mb-4'>
          Create
        </Button>
      </Form>
    </div>
  </div>
  

  );
};

export default CreateForm;
