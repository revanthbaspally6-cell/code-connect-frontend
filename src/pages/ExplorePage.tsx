import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { snippetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  CodeBracketIcon, 
  HeartIcon, 
  EyeIcon,
  ChatBubbleLeftIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { Container, Row, Col, Card, Badge, Button, Form, Alert, Spinner } from 'react-bootstrap';

const ExplorePage: React.FC = () => {
  const { state } = useAuth();
  const [snippets, setSnippets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    language: 'all',
    sortBy: 'createdAt',
    search: ''
  });
  const [likedSnippets, setLikedSnippets] = useState<Set<string>>(new Set());

  const languages = [
    { value: 'all', label: 'All Languages' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'go', label: 'Go' },
  ];

  const sortOptions = [
    { value: 'createdAt', label: 'Latest' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'likes', label: 'Most Liked' },
    { value: 'comments', label: 'Most Discussed' },
  ];

  useEffect(() => {
    fetchSnippets();
  }, [filters]);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      let params: any = {
        limit: 20
      };
      
      if (filters.language !== 'all') {
        params.language = filters.language;
      }
      
      if (filters.sortBy !== 'createdAt') {
        params.sortBy = filters.sortBy;
      }
      
      if (filters.search) {
        params.search = filters.search;
      }

      const response = await snippetsAPI.getSnippets(params);
      setSnippets(response.data.snippets);
      setError('');
    } catch (error: any) {
      setError('Failed to load snippets');
      console.error('Error fetching snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleLike = (snippetId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (!state.isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    const isLiked = likedSnippets.has(snippetId);
    
    if (isLiked) {
      // Unlike - just update UI state
      setLikedSnippets(prev => {
        const newSet = new Set(prev);
        newSet.delete(snippetId);
        return newSet;
      });
      
      // Update snippet in local state (decrement like count)
      setSnippets(prev => prev.map(snippet => 
        snippet._id === snippetId 
          ? { 
              ...snippet, 
              likes: Array.isArray(snippet.likes) 
                ? Math.max(0, snippet.likes.length - 1) 
                : Math.max(0, (snippet.likes || 0) - 1)
            }
          : snippet
      ));
    } else {
      // Like - just update UI state
      setLikedSnippets(prev => new Set(prev).add(snippetId));
      
      // Update snippet in local state (increment like count)
      setSnippets(prev => prev.map(snippet => 
        snippet._id === snippetId 
          ? { 
              ...snippet, 
              likes: Array.isArray(snippet.likes) 
                ? snippet.likes.length + 1 
                : (snippet.likes || 0) + 1 
            }
          : snippet
      ));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      javascript: 'warning',
      typescript: 'info',
      python: 'primary',
      java: 'danger',
      cpp: 'success',
      html: 'warning',
      css: 'info',
      go: 'dark'
    };
    return colors[language] || 'secondary';
  };

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="mb-5">
        <h1 className="display-5 fw-bold mb-3">Explore Snippets</h1>
        <p className="lead text-muted">
          Discover amazing code snippets from the community
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body className="p-4">
          <Row className="align-items-center g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Search</Form.Label>
                <div className="input-group">
                  <Form.Control
                    type="text"
                    placeholder="Search snippets..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    size="lg"
                  />
                  <Button variant="outline-primary" size="lg">
                    <MagnifyingGlassIcon className="h-5 w-5" />
                  </Button>
                </div>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Language</Form.Label>
                <Form.Select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
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

            <Col md={3}>
              <Form.Group>
                <Form.Label className="fw-semibold">Sort By</Form.Label>
                <Form.Select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
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

            <Col md={3} className="d-flex align-items-end">
              <Button variant="primary" className="w-100" size="lg">
                <FunnelIcon className="h-5 w-5 me-2" />
                Apply Filters
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading amazing snippets...</p>
        </div>
      )}

      {/* Snippets Grid */}
      {!loading && (
        <Row className="g-4">
          {snippets.map((snippet) => (
            <Col xl={4} lg={6} key={snippet._id}>
              <Card className="h-100 snippet-card border-0">
                <Card.Body>
                  {/* Header */}
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div className="d-flex align-items-center">
                      <div className="author-avatar me-3">
                        {snippet.author && typeof snippet.author === 'object' 
                          ? snippet.author.username?.charAt(0).toUpperCase() || 'U'
                          : 'U'}
                      </div>
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

                  {/* Code Preview */}
                  <div className="code-preview mb-4">
                    <div className="code-block">
                      <div className="code-header">
                        <div className="code-dots">
                          <span className="dot red"></span>
                          <span className="dot yellow"></span>
                          <span className="dot green"></span>
                        </div>
                        <div className="code-language">{snippet.language}</div>
                      </div>
                      <pre className="code-content">
                        <code>
                          {snippet.code.substring(0, 300)}
                          {snippet.code.length > 300 && '\n...'}
                        </code>
                      </pre>
                    </div>
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
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex gap-3">
                      <button
                        className={`like-button d-flex align-items-center ${likedSnippets.has(snippet._id) ? 'liked' : 'text-muted'}`}
                        onClick={(e) => handleLike(snippet._id, e)}
                      >
                        {likedSnippets.has(snippet._id) ? (
                          <HeartSolidIcon className="h-4 w-4 me-1" />
                        ) : (
                          <HeartIcon className="h-4 w-4 me-1" />
                        )}
                        {Array.isArray(snippet.likes) ? snippet.likes.length : snippet.likes || 0}
                      </button>
                      <div className="d-flex align-items-center text-muted">
                        <ChatBubbleLeftIcon className="h-4 w-4 me-1" />
                        {Array.isArray(snippet.comments) ? snippet.comments.length : 0}
                      </div>
                      <div className="d-flex align-items-center text-muted">
                        <EyeIcon className="h-4 w-4 me-1" />
                        {snippet.views || 0}
                      </div>
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => window.location.href = `/snippet/${snippet._id}`}
                    >
                      View Code
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Empty State */}
      {!loading && snippets.length === 0 && (
        <div className="empty-state">
          <CodeBracketIcon className="empty-state-icon mb-4" />
          <h3 className="h4 mb-3">No snippets found</h3>
          <p className="text-muted mb-4">
            Try adjusting your filters or search terms
          </p>
          <Button variant="primary" size="lg" className="px-4">
            Clear Filters
          </Button>
        </div>
      )}
    </Container>
  );
};

export default ExplorePage;
