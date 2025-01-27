import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Container, 
  Table, 
  Badge, 
  Stack,
  Form 
} from 'react-bootstrap';
import { 
  loadRequests, 
  updateRequestStatus,
  adminDeleteRequest 
} from '../utils/storage';
import { getUsers } from '../utils/users';

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [userIdToName, setUserIdToName] = useState({});

  useEffect(() => {
    const users = getUsers();
    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user.username;
      return acc;
    }, {});
    
    setUserIdToName(userMap);
    setRequests(loadRequests().filter(req => !req.deletedByAdmin));
  }, []);

  const handleUpdateStatus = (id, status) => {
    const updatedRequests = updateRequestStatus(id, status);
    setRequests(updatedRequests.filter(req => !req.deletedByAdmin));
  };

  const handleAdminDelete = (id) => {
    const updatedRequests = adminDeleteRequest(id);
    setRequests(updatedRequests.filter(req => !req.deletedByAdmin));
  };

  // Helper to trigger a download from a base64 Data URL
  const handleDownload = (image) => {
    if (!image || !image.data) return;
    const link = document.createElement('a');
    link.href = image.data;       // base64 string
    link.download = image.name;   // original filename
    link.click();
  };

  const filteredRequests = 
    selectedCategory === 'All'
      ? requests
      : requests.filter(req => req.category === selectedCategory);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      
      <Card className="mb-4 shadow">
        <Card.Body>
          <Stack direction="horizontal" gap={3} className="align-items-center">
            <div>Filter by category:</div>
            <Form.Select
              style={{ width: '200px' }}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="General">General</option>
              <option value="Target-Change">Target Change</option>
              <option value="Merge">Merge</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Stack>
        </Card.Body>
      </Card>

      <Card className="shadow">
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>User</th>
                <th>Request</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Description</th>
                {/* New column for Image */}
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td>{userIdToName[req.userId] || 'Unknown User'}</td>
                  <td>{req.title}</td>
                  <td>
                    <Badge bg="secondary">{req.category}</Badge>
                  </td>
                  <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Badge bg={req.status === 'Pending' ? 'warning' : 'success'}>
                      {req.status}
                    </Badge>
                  </td>
                  <td>{req.description}</td>

                  {/* Image column with optional Download button */}
                  <td>
                    {req.image ? (
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => handleDownload(req.image)}
                      >
                        Download Image
                      </Button>
                    ) : (
                      <span className="text-muted">No Image</span>
                    )}
                  </td>

                  <td>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleUpdateStatus(req.id, 'Completed')}
                        disabled={req.status === 'Completed'}
                      >
                        Complete
                      </Button>
                      {req.status === 'Completed' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleAdminDelete(req.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {filteredRequests.length === 0 && (
            <div className="text-center text-muted py-4">
              No requests found in this category
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
