import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
const ClusterForm = () => {
  const [name, setName] = useState("");
  const [selectedWorkspaces, setSelectedWorkspaces] = useState([]);
  const [search, setSearch] = useState("");
  const [workspaceNames, setWorkspaceNames] = useState([]);
  const [filteredWorkspaces, setFilteredWorkspaces] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    fetch("https://apiplatform.finkraft.ai/meta/workspaces")
      .then((response) => response.json())
      .then((data) => {
        setWorkspaceNames(data);
        setFilteredWorkspaces(data);
      })
      .catch((error) =>
        console.error("Error fetching workspace names:", error)
      );
  }, []);

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   // Convert workspace names to IDs
  //   const workspaceIDs = selectedWorkspaces
  //     .map((workspaceName) => {
  //       const workspace = workspaceNames.find(
  //         (workspace) => workspace.name === workspaceName
  //       );
  //       return workspace ? workspace.id : null;
  //     })
  //     .filter(Boolean);

  //   // Prepare payload
  //   const payload = {
  //     name,
  //     workspaces: workspaceIDs,
  //   };

  //   // POST request to your API
  //   console.log(payload);
  //   try {
  //     const response = await fetch("http://127.0.0.1:5000/api/clusters", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (response.ok) {
  //       nav("/clusters");
  //       console.log("Cluster created successfully");
  //       // Reset form fields if needed
  //     } else {
  //       console.error("Failed to create cluster");
  //     }
  //   } catch (error) {
  //     console.error("Error creating cluster:", error);
  //   }
  // };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    filterWorkspaces(event.target.value);
  };

  const handleWorkspaceChange = (event) => {
    const { value } = event.target;
    setSelectedWorkspaces(prevSelected => {
      if (prevSelected.includes(value)) {
        // If the workspace ID is already selected, remove it
        return prevSelected.filter(id => id !== value);
      } else {
        // Otherwise, add the workspace ID to the selectedWorkspaces
        return [...prevSelected, value];
      }
    });
  };
  

  const handleWorkspaceNameClick = (workspaceId) => {
    if (!selectedWorkspaces.includes(workspaceId)) {
      setSelectedWorkspaces([...selectedWorkspaces, workspaceId]);
    } else {
      setSelectedWorkspaces(
        selectedWorkspaces.filter((id) => id !== workspaceId)
      );
    }
  };

  const filterWorkspaces = (searchTerm) => {
    const filtered = workspaceNames.filter((workspace) =>
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkspaces(filtered);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const payload = {
      name,
      workspaces: selectedWorkspaces
    };
  
    console.log(payload); // Check if the payload includes the selected workspaces
  
    try {
      const response = await fetch("http://127.0.0.1:5000/api/clusters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        nav("/clusters");
        console.log("Cluster created successfully");
      } else {
        console.error("Failed to create cluster");
      }
    } catch (error) {
      console.error("Error creating cluster:", error);
    }
  };
  

  return (
    <div className="d-flex flex-column cmain">
      <div className="d-flex flex-column align-items-center">
        <Form onSubmit={handleSubmit} style={{ width: "900px" }}>
          <div className="d-flex justify-content-between mb-3">
            <h2>New Cluster</h2>
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
          <Form.Group controlId="formWorkspaceNames" className="d-flex ">
            <Form.Label>Workspace Names</Form.Label>
            <div>
              {filteredWorkspaces.map((workspace) => (
                <div key={workspace.id} className="mx-5 d-flex mb-2">
                  <Form.Check
                    type="checkbox"
                    value={workspace.id}
                    checked={selectedWorkspaces.includes(workspace.id)}
                    onChange={handleWorkspaceChange}
                  />
                  <span
                    className="workspace-name-label mx-2"
                    style={{ cursor: "pointer" }}
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

export default ClusterForm;
