import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Container, Card, Alert } from 'react-bootstrap';
import { authenticateUser } from '../utils/users';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const user = authenticateUser(username, password);
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate(user.role === 'admin' ? '/admin' : '/user');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '400px' }}>
      <Card className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4">Request System Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Sign In
            </Button>

            <div className="text-center mt-3">
                Don't have an account?{' '}
                <Button variant = "link" onClick = {() => navigate('/signup')}>
                    Sign Up
                </Button>
            </div>
            
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;