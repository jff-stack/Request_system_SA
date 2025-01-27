import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import { 
  Button, 
  Card, 
  Container, 
  Form, 
  Alert 
} from 'react-bootstrap';
import { 
  loadRequests, 
  createRequest, 
  userDeleteRequest 
} from '../utils/storage';

const RequestForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);

  const handleFileChange = (e) => {
    // Store the raw file in state
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If an image was selected, convert it to base64
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newRequest = {
          title,
          category,
          description,
          // Store both the base64 string & original filename
          image: {
            name: imageFile.name,
            data: reader.result, // Base64 data
          },
        };
        onSubmit(newRequest);
        resetForm();
      };
      reader.readAsDataURL(imageFile);
    } else {
      // If no image, just pass null for `image`
      const newRequest = {
        title,
        category,
        description,
        image: null,
      };
      onSubmit(newRequest);
      resetForm();
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('General');
    setDescription('');
    setImageFile(null);
  };

  return (
    <Card className="mb-4 shadow">
      <Card.Body>
        <h4 className="mb-4">New Request</h4>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Request Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter request title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Merge">Merge</option>
              <option value="Target-Change">Target Change</option>
              <option value="General">General</option>
              <option value="Other">Other</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Attach Image (optional)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Form.Group>

          <Button variant="success" type="submit" className="w-100">
            Submit Request
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};


const UserDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const navigate = useNavigate();
  
    useEffect(() => {
      if (!currentUser) {
        navigate('/');
      }
    }, [currentUser, navigate]);
  
  useEffect(() => {
    setRequests(loadRequests().filter(r => 
      r.userId === currentUser?.id && !r.deletedByUser
    ));
  }, [currentUser?.id]);

  const handleSubmitRequest = (request) => {
    const newRequest = createRequest(request);
    setRequests([...requests, newRequest]);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDeleteRequest = (id) => {
    const updatedRequests = userDeleteRequest(id);
    setRequests(updatedRequests.filter(
      req => req.userId === currentUser?.id && !req.deletedByUser
    ));
  };

  return (
    <Container className="mt-4">
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
          Request submitted successfully!
        </Alert>
      )}

      <h2 className="mb-4">Welcome, {currentUser?.username}</h2>
      <RequestForm onSubmit={handleSubmitRequest} />

      <Card className="shadow">
        <Card.Body>
          <h4 className="mb-3">Your Requests</h4>
          {requests.length === 0 ? (
            <Alert variant="info">No requests submitted yet</Alert>
          ) : (
            requests.map((req) => (
              <Card key={req.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{req.title}</h5>
                      <div className="text-muted">
                        Category: {req.category} | Status: {' '}
                        <span className={`badge ${
                          req.status === 'Pending' ? 'bg-warning' : 'bg-success'
                        }`}>
                          {req.status}
                        </span>
                      </div>
                      <small className="text-muted">
                        Submitted on: {new Date(req.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      onClick={() => handleDeleteRequest(req.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDashboard;