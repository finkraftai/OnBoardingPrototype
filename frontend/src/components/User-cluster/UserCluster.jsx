import React, { useState, useEffect } from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const UserCluster = () => {
  const [users, setUsers] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [selectedCluster, setSelectedCluster] = useState('');

  useEffect(() => {
    // Fetch users data from API
    fetch('https://apiplatform.finkraft.ai/meta/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => console.error('Error fetching users:', error));

    // Fetch clusters data from API
    fetch('https://apiplatform.finkraft.ai/meta/clusters')
      .then(response => response.json())
      .then(data => setClusters(data))
      .catch(error => console.error('Error fetching clusters:', error));
  }, []);

  const handleSave = (userId) => {
    // Handle save action
    console.log('Save user cluster:', userId, selectedCluster);
  };

  return (
    <div>
      <h2>User Clusters</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Cluster</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <Form.Control
                  as="select"
                  value={selectedCluster}
                  onChange={(e) => setSelectedCluster(e.target.value)}
                >
                  <option value="">Select Cluster</option>
                  {clusters.map(cluster => (
                    <option key={cluster.id} value={cluster.id}>{cluster.name}</option>
                  ))}
                </Form.Control>
              </td>
              <td>
                <Button variant="primary" onClick={() => handleSave(user.id)}>Save</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserCluster;
