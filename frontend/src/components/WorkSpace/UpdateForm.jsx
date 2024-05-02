// UpdateForm.jsx
import React, { useState } from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';

const UpdateForm = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', is_active: false });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        console.log(workspaceId);
      const response = await fetch(`https://apiplatform.finkraft.ai/meta/workspace/update/${workspaceId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      console.log(formData);
      if (!response.ok) {
        throw new Error('Failed to update workspace');
      }
      navigate('/workspaces');
    } catch (error) {
      console.error('Error updating workspace:', error);
      
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
        <Button variant="primary" type="submit" className='mb-4'>
          Update
        </Button>
      </Form>
    </div>
    </div>  
  );
};

export default UpdateForm;
