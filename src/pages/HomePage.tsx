import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { snippetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  CodeBracketIcon, 
  HeartIcon, 
  EyeIcon,
  UserCircleIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Container, Row, Col, Card, Badge, Button, Form, Alert, Spinner } from 'react-bootstrap';

const HomePage: React.FC = () => {
  const { state } = useAuth();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    language: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const [likedSnippets, setLikedSnippets] = useState<Set<string>>(new Set());

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'go', label: 'Go' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Latest' },
    { value: 'likes', label: 'Most Liked' },
    { value: 'views', label: 'Most Viewed' },
  ];

  useEffect(() => {
    fetchSnippets();
  }, [filters]);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      let params: any = {
        ...filters,
        limit: 12
      };
      
      if (filters.language === 'all') {
        const { language, ...restParams } = params;
        params = restParams;
      }
      
      const response = await snippetsAPI.getSnippets(params);
      setSnippets(response.data.snippets);
      setError('');
    } catch (err: any) {
      setError('Failed to fetch snippets');
      console.error('Error fetching snippets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (snippetId: string) => {
    if (!state.isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    try {
      // Get current snippet to determine if it's already liked
      const currentSnippet = snippets.find(s => s._id === snippetId);
      const isLiked = Array.isArray(currentSnippet?.likes) && 
                      currentSnippet.likes.some((like: any) => like === state.user?.id);
      
      // Simple UI update - treat likes as a number for display
      setSnippets(prev => prev.map(snippet => {
        if (snippet._id === snippetId) {
          const currentCount = Array.isArray(snippet.likes) ? snippet.likes.length : (snippet.likes || 0);
          return {
            ...snippet,
            likes: isLiked ? Math.max(0, currentCount - 1) : currentCount + 1
          };
        }
        return snippet;
      }));
      
      // Call API
      await snippetsAPI.likeSnippet(snippetId);
    } catch (err) {
      console.error('Error liking snippet:', err);
      fetchSnippets();
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      javascript: 'warning',
      python: 'primary',
      java: 'danger',
      cpp: 'secondary',
      html: 'success',
      css: 'info',
      typescript: 'dark',
      go: 'light',
      other: 'secondary',
    };
    return colors[language] || colors.other;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Professional Hero Section - TEST */}
      <div className="hero-section" style={{background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', padding: '6rem 0', marginBottom: '4rem'}}>
        <Container>
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-4" style={{fontSize: '3.5rem', fontWeight: '800'}}>Code Connect</h1>
            <p className="lead mb-5" style={{fontSize: '1.25rem', color: 'rgba(255, 255, 255, 0.9)'}}>
              A professional platform for sharing, discovering, and collaborating on code snippets
            </p>
            <div className="d-flex justify-content-center gap-3">
              {state.isAuthenticated ? (
                <>
                  <Button href="/create" variant="light" size="lg" className="px-4" style={{padding: '0.75rem 1.5rem', fontWeight: '600'}}>
                    <PlusIcon className="h-5 w-5 me-2" />
                    Create Snippet
                  </Button>
                  <Button href="/explore" variant="outline-light" size="lg" className="px-4" style={{padding: '0.75rem 1.5rem', fontWeight: '600'}}>
                    <MagnifyingGlassIcon className="h-5 w-5 me-2" />
                    Explore
                  </Button>
                </>
              ) : (
                <>
                  <Button href="/register" variant="light" size="lg" className="px-4" style={{padding: '0.75rem 1.5rem', fontWeight: '600'}}>
                    Get Started
                  </Button>
                  <Button href="/login" variant="outline-light" size="lg" className="px-4" style={{padding: '0.75rem 1.5rem', fontWeight: '600'}}>
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>
        </Container>
      </div>

      {/* Professional Stats Section */}
      <Container className="py-4">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-number">1,234</div>
            <div className="stat-label">Code Snippets</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">567</div>
            <div className="stat-label">Active Developers</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">8</div>
            <div className="stat-label">Programming Languages</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">12.5K</div>
            <div className="stat-label">Total Views</div>
          </div>
        </div>

      {/* Professional Filters Section */}
      <div className="mb-5">
        <h3 className="h4 mb-4">Explore Snippets</h3>
        <Card className="border-0 shadow-sm">
          <Card.Body className="p-4">
            <Row className="align-items-center g-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Programming Language</Form.Label>
                  <Form.Select
                    value={filters.language}
                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                    size="lg"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Sort By</Form.Label>
                  <Form.Select
                    value={filters.sortBy}
                    onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                    size="lg"
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4} className="d-flex align-items-end">
                <div className="d-flex gap-2 w-100">
                  <Button variant="outline-primary" className="flex-grow-1" size="lg">
                    <MagnifyingGlassIcon className="h-5 w-5 me-2" />
                    Search
                  </Button>
                  <Button variant="primary" className="flex-grow-1" size="lg">
                    <PlusIcon className="h-5 w-5 me-2" />
                    Create
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Professional Empty State */}
      {snippets.length === 0 && !loading && (
        <div className="empty-state">
          <CodeBracketIcon className="empty-state-icon mb-4" />
          <h3 className="h4 mb-3">No snippets found</h3>
          <p className="text-muted mb-4">
            {state.isAuthenticated ? 'Create your first snippet to get started!' : 'Sign up to start sharing code snippets!'}
          </p>
          {state.isAuthenticated ? (
            <Button href="/create" variant="primary" size="lg" className="px-4">
              <PlusIcon className="h-5 w-5 me-2" />
              Create Your First Snippet
            </Button>
          ) : (
            <Button href="/register" variant="primary" size="lg" className="px-4">
              Get Started Now
            </Button>
          )}
        </div>
      )}

      {/* Professional Snippets Grid */}
      <Row className="g-4">
        {snippets.map((snippet) => (
          <Col xl={4} lg={6} className="mb-4" key={snippet._id}>
            <Card className="h-100 snippet-card border-0">
              <Card.Body>
                {/* Header */}
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div className="d-flex align-items-center">
                    {snippet.author && typeof snippet.author === 'object' && snippet.author.avatar ? (
                      <img
                        src={snippet.author.avatar}
                        alt={snippet.author.username || 'User'}
                        className="rounded-circle me-3"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="author-avatar me-3">
                        {snippet.author && typeof snippet.author === 'object' 
                          ? snippet.author.username?.charAt(0).toUpperCase() || 'U'
                          : 'U'}
                      </div>
                    )}
                    <div>
                      <Link
                        to={`/profile/${snippet.author && typeof snippet.author === 'object' ? snippet.author._id : snippet.author}`}
                        className="text-decoration-none fw-semibold text-dark"
                      >
                        {snippet.author && typeof snippet.author === 'object' 
                          ? snippet.author.username || 'Unknown User'
                          : 'Unknown User'}
                      </Link>
                      <div className="d-flex align-items-center text-muted small">
                        <ClockIcon className="h-4 w-4 me-1" />
                        {formatDate(snippet.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Badge bg={getLanguageColor(snippet.language)} className="language-badge">
                    {snippet.language}
                  </Badge>
                </div>

                {/* Title and Description */}
                <Link to={`/snippet/${snippet._id}`} className="text-decoration-none">
                  <h4 className="fw-bold mb-3 text-dark">
                    {snippet.title}
                  </h4>
                  <p className="text-muted mb-4">
                    {snippet.description}
                  </p>
                </Link>

                {/* Professional Code Preview */}
                <div className="code-preview mb-4">
                  {snippet.code.substring(0, 200)}
                  {snippet.code.length > 200 && '...'}
                </div>

                {/* Tags */}
                {snippet.tags.length > 0 && (
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {snippet.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} bg="light" text="dark" className="small">
                        #{tag}
                      </Badge>
                    ))}
                    {snippet.tags.length > 3 && (
                      <Badge bg="light" text="dark" className="small">
                        +{snippet.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Stats */}
                <div className="d-flex justify-content-between text-muted small">
                  <div className="d-flex gap-3">
                    <Button
                      variant="link"
                      className="p-0 text-decoration-none text-muted like-button"
                      onClick={() => handleLike(snippet._id)}
                      disabled={!state.isAuthenticated}
                    >
                      <HeartIcon className="h-4 w-4" />
                      <span className="ms-1">{Array.isArray(snippet.likes) ? snippet.likes.length : snippet.likes || 0}</span>
                    </Button>

                    <div className="d-flex align-items-center">
                      <EyeIcon className="h-4 w-4" />
                      <span className="ms-1">{snippet.views}</span>
                    </div>

                    <div className="d-flex align-items-center">
                      <ChatBubbleLeftIcon className="h-4 w-4" />
                      <span className="ms-1">{Array.isArray(snippet.comments) ? snippet.comments.length : 0}</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      </Container>
    </>
  );
};

export default HomePage;
