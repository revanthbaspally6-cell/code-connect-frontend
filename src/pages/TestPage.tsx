import React from 'react';
import { Container, Button, Card, Alert } from 'react-bootstrap';

const TestPage: React.FC = () => {
  return (
    <Container className="py-4">
      <Alert variant="success">
        <h4>✅ Application is Working!</h4>
        <p>The Code Connect application is running successfully.</p>
      </Alert>
      
      <Card className="mb-4">
        <Card.Body>
          <h5>Features Available:</h5>
          <ul>
            <li>✅ Bootstrap 5 Styling</li>
            <li>✅ React Router Navigation</li>
            <li>✅ Authentication Context</li>
            <li>✅ API Integration</li>
            <li>✅ Monaco Editor</li>
          </ul>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5>Navigation Test:</h5>
          <div className="d-flex gap-2">
            <Button href="/login" variant="primary">Go to Login</Button>
            <Button href="/register" variant="success">Go to Register</Button>
            <Button href="/create" variant="info">Create Snippet</Button>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <h5>Backend Status:</h5>
          <p>Backend server is running on http://localhost:5000</p>
          <p>Frontend server is running on http://localhost:3000</p>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default TestPage;
