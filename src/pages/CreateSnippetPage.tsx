import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { snippetsAPI } from '../services/api';
import CodeEditor from '../components/CodeEditor';
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Container, Card, Form, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';

const CreateSnippetPage: React.FC = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    code: string;
    language: string;
    tags: string[];
    isPublic: boolean;
  }>({
    title: '',
    description: '',
    code: '',
    language: 'javascript',
    tags: [],
    isPublic: true,
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'go', label: 'Go' },
  ];

  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
    }
  }, [state.isAuthenticated, navigate]);

  useEffect(() => {
    const handleLanguageChange = (e: any) => {
      setFormData(prev => ({
        ...prev,
        language: e.detail.language
      }));
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCodeChange = (code: string) => {
    setFormData(prev => ({
      ...prev,
      code
    }));
  };

  const addTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.code) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const snippetData = {
        ...formData,
        tags: formData.tags.join(',')
      };
      
      const response = await snippetsAPI.createSnippet(snippetData);
      setSuccess(true);
      setLoading(false);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        code: '',
        language: 'javascript',
        tags: [],
        isPublic: true,
      });
      setCurrentTag('');
      
      // Scroll to top to show success message
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create snippet');
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  if (!state.isAuthenticated) {
    return null;
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <Button variant="link" onClick={handleCancel} className="text-muted me-3">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="ms-1">Back</span>
          </Button>
          <div>
            <h1 className="h2 fw-bold">Create Snippet</h1>
            <p className="text-muted">Share your code with the community</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <Alert variant="success" className="mb-4">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <div className="success-icon">✓</div>
            </div>
            <div>
              <h5 className="alert-heading mb-1">Snippet Created Successfully!</h5>
              <p className="mb-0">Your code snippet has been shared with the community.</p>
            </div>
          </div>
          <div className="mt-3">
            <Button variant="success" onClick={() => navigate('/')} className="me-2">
              View on Home
            </Button>
            <Button variant="outline-success" onClick={() => navigate('/explore')}>
              Explore More
            </Button>
          </div>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Form */}
      <Form onSubmit={handleSubmit}>
        <Card className="mb-4">
          <Card.Body className="p-4">
            <Row>
              <Col lg={6}>
                <div className="pe-lg-4">
                  {/* Title */}
                  <Form.Group className="mb-3">
                    <Form.Label>Title *</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      placeholder="Enter a descriptive title"
                    />
                    <Form.Text className="text-muted">
                      {formData.title.length}/100 characters
                    </Form.Text>
                  </Form.Group>

                  {/* Description */}
                  <Form.Group className="mb-3">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      maxLength={500}
                      placeholder="Describe what your code does"
                    />
                    <Form.Text className="text-muted">
                      {formData.description.length}/500 characters
                    </Form.Text>
                  </Form.Group>

                  {/* Language */}
                  <Form.Group className="mb-3">
                    <Form.Label>Programming Language *</Form.Label>
                    <Form.Select
                      name="language"
                      value={formData.language}
                      onChange={handleChange}
                    >
                      {languages.map(lang => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  {/* Tags */}
                  <Form.Group className="mb-3">
                    <Form.Label>Tags</Form.Label>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} bg="primary" className="d-flex align-items-center">
                          #{tag}
                          <Button
                            type="button"
                            variant="link"
                            className="text-white p-0 ms-2"
                            onClick={() => removeTag(tag)}
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="d-flex gap-2">
                      <Form.Control
                        type="text"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
                        placeholder="Add a tag"
                        maxLength={20}
                      />
                      <Button
                        type="button"
                        onClick={addTag}
                        disabled={!currentTag.trim() || formData.tags.length >= 5}
                      >
                        <PlusIcon className="h-5 w-5" />
                      </Button>
                    </div>
                    <Form.Text className="text-muted">
                      Add up to 5 tags to help others find your snippet
                    </Form.Text>
                  </Form.Group>

                  {/* Visibility */}
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="isPublic"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleChange}
                      label="Make this snippet public"
                    />
                    <Form.Text className="text-muted d-block">
                      Public snippets can be seen by everyone. Private snippets are only visible to you.
                    </Form.Text>
                  </Form.Group>
                </div>
              </Col>

              <Col lg={6}>
                <Form.Label className="mb-2">Code *</Form.Label>
                <CodeEditor
                  language={formData.language}
                  value={formData.code}
                  onChange={handleCodeChange}
                  height="500px"
                  placeholder="// Write your code here..."
                />
                <Form.Text className="text-muted mt-1 d-block">
                  {formData.code.length} characters
                </Form.Text>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <div className="d-flex justify-content-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.title || !formData.description || !formData.code}
          >
            {loading ? (
              <div className="d-flex align-items-center">
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Creating...</span>
              </div>
            ) : (
              'Create Snippet'
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default CreateSnippetPage;
