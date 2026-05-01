import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CodeBracketIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';

const LoginPage: React.FC = () => {
  const { state, login, clearError } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (state.error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData);
      navigate('/');
    } catch (err) {
      // Error is handled by AuthContext
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Container>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="text-center mb-4">
              <CodeBracketIcon className="h-12 w-12 text-primary mb-3" />
              <h2 className="h3 fw-bold">Sign in to Code Connect</h2>
              <p className="text-muted">
                Or{' '}
                <Link to="/register" className="text-primary text-decoration-none">
                  create a new account
                </Link>
              </p>
            </div>

            <Card>
              <Card.Body className="p-4">
                {state.error && (
                  <Alert variant="danger" className="mb-4">
                    {state.error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="email">Email address</Form.Label>
                    <Form.Control
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="password">Password</Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                      />
                      <Button
                        type="button"
                        variant="link"
                        className="position-absolute end-0 top-0 text-muted"
                        style={{ zIndex: 10 }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Check
                      id="remember-me"
                      label="Remember me"
                      className="text-muted"
                    />
                    <Link to="/forgot-password" className="text-primary text-decoration-none small">
                      Forgot your password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    disabled={state.loading}
                  >
                    {state.loading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Signing in...</span>
                      </div>
                    ) : (
                      'Sign in'
                    )}
                  </Button>
                </Form>

                <div className="mt-4">
                  <div className="position-relative">
                    <hr />
                    <div className="position-absolute top-50 start-50 translate-middle bg-white px-3">
                      <span className="text-muted small">Or continue with</span>
                    </div>
                  </div>

                  <div className="d-grid gap-2 mt-3">
                    <Button variant="outline-secondary" className="d-flex align-items-center justify-content-center">
                      <svg className="h-5 w-5 me-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                      </svg>
                      GitHub
                    </Button>

                    <Button variant="outline-secondary" className="d-flex align-items-center justify-content-center">
                      <svg className="h-5 w-5 me-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LoginPage;
