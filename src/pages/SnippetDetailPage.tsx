import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { snippetsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  HeartIcon, 
  ChatBubbleLeftIcon,
  EyeIcon,
  ClockIcon,
  ArrowLeftIcon,
  ShareIcon,
  BookmarkIcon,
  CodeBracketIcon,
  UserCircleIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, Form, Modal } from 'react-bootstrap';

const SnippetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useAuth();
  const [snippet, setSnippet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSnippet();
      fetchComments();
    }
  }, [id]);

  const fetchSnippet = async () => {
    try {
      setLoading(true);
      const response = await snippetsAPI.getSnippet(id!);
      setSnippet(response.data.snippet);
      
      // Check if user has liked this snippet
      if (state.isAuthenticated && response.data.snippet.likes) {
        setIsLiked(response.data.snippet.likes.includes(state.user?.id));
      }
      
      setError('');
    } catch (error: any) {
      setError('Failed to load snippet');
      console.error('Error fetching snippet:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await snippetsAPI.getSnippetComments(id!);
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!state.isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      if (isLiked) {
        // Unlike
        await snippetsAPI.unlikeSnippet(id!);
        setIsLiked(false);
        setSnippet((prev: any) => ({
          ...prev,
          likes: prev.likes.filter((userId: string) => userId !== state.user?.id)
        }));
      } else {
        // Like
        await snippetsAPI.likeSnippet(id!);
        setIsLiked(true);
        setSnippet((prev: any) => ({
          ...prev,
          likes: [...prev.likes, state.user?.id]
        }));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleBookmark = async () => {
    if (!state.isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      if (isBookmarked) {
        // Remove bookmark
        await snippetsAPI.unbookmarkSnippet(id!);
        setIsBookmarked(false);
      } else {
        // Add bookmark
        await snippetsAPI.bookmarkSnippet(id!);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleDownload = () => {
    if (snippet) {
      const element = document.createElement('a');
      const file = new Blob([snippet.code], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${snippet.title.replace(/\s+/g, '_')}.${snippet.language}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !state.isAuthenticated) return;

    try {
      setCommentLoading(true);
      const response = await snippetsAPI.addComment(id!, { content: newComment });
      setComments(prev => [response.data.comment, ...prev]);
      setNewComment('');
      setCommentLoading(false);
    } catch (error) {
      console.error('Error adding comment:', error);
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  const copyToClipboard = () => {
    if (snippet) {
      navigator.clipboard.writeText(snippet.code);
    }
  };

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading snippet...</p>
        </div>
      </Container>
    );
  }

  if (error || !snippet) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error || 'Snippet not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <Button variant="link" onClick={() => window.history.back()} className="text-muted me-3">
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="ms-1">Back</span>
          </Button>
          <div>
            <h1 className="h2 fw-bold mb-1">{snippet.title}</h1>
            <p className="text-muted mb-0">{snippet.description}</p>
          </div>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={handleShare}>
            <ShareIcon className="h-4 w-4 me-1" />
            Share
          </Button>
          <Button variant="outline-secondary" onClick={handleDownload}>
            <ArrowDownTrayIcon className="h-4 w-4 me-1" />
            Download
          </Button>
          <Button variant="outline-secondary" onClick={handleBookmark}>
            {isBookmarked ? (
              <BookmarkSolidIcon className="h-4 w-4 me-1" />
            ) : (
              <BookmarkIcon className="h-4 w-4 me-1" />
            )}
            {isBookmarked ? 'Saved' : 'Save'}
          </Button>
        </div>
      </div>

      <Row>
        {/* Main Content */}
        <Col lg={8}>
          {/* Code Display */}
          <Card className="mb-4">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Badge bg={getLanguageColor(snippet.language)} className="me-3">
                  {snippet.language}
                </Badge>
                <span className="text-muted">
                  {snippet.code.length} characters
                </span>
              </div>
              <Button variant="outline-secondary" size="sm" onClick={copyToClipboard}>
                Copy Code
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
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
                  <code>{snippet.code}</code>
                </pre>
              </div>
            </Card.Body>
          </Card>

          {/* Tags */}
          {snippet.tags && snippet.tags.length > 0 && (
            <Card className="mb-4">
              <Card.Body>
                <h5 className="mb-3">Tags</h5>
                <div className="d-flex flex-wrap gap-2">
                  {snippet.tags.map((tag: string, index: number) => (
                    <Badge key={index} bg="light" text="dark" className="p-2">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Comments Section */}
          <Card>
            <Card.Header>
              <h5 className="mb-0">Comments ({comments.length})</h5>
            </Card.Header>
            <Card.Body>
              {/* Add Comment */}
              {state.isAuthenticated ? (
                <Form onSubmit={handleComment} className="mb-4">
                  <Form.Group>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="mb-2"
                    />
                    <Button type="submit" variant="primary" disabled={commentLoading || !newComment.trim()}>
                      {commentLoading ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        'Post Comment'
                      )}
                    </Button>
                  </Form.Group>
                </Form>
              ) : (
                <Alert variant="info" className="mb-4">
                  <Link to="/login">Login</Link> to add comments
                </Alert>
              )}

              {/* Comments List */}
              <div className="comments-list">
                {comments.length === 0 ? (
                  <p className="text-muted text-center py-3">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment: any) => (
                    <div key={comment._id} className="comment-item mb-3 pb-3 border-bottom">
                      <div className="d-flex align-items-start">
                        <div className="author-avatar me-3">
                          {comment.author && typeof comment.author === 'object' 
                            ? comment.author.username?.charAt(0).toUpperCase() || 'U'
                            : 'U'}
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <Link
                              to={`/profile/${comment.author && typeof comment.author === 'object' ? comment.author._id : comment.author}`}
                              className="text-decoration-none fw-semibold text-dark"
                            >
                              {comment.author && typeof comment.author === 'object' 
                                ? comment.author.username || 'Unknown User'
                                : 'Unknown User'}
                            </Link>
                            <small className="text-muted">
                              {formatDate(comment.createdAt)}
                            </small>
                          </div>
                          <p className="mb-0">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Sidebar */}
        <Col lg={4}>
          {/* Author Info */}
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Author</h5>
              <div className="d-flex align-items-center mb-3">
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
                  <div className="text-muted small">
                    {snippet.author && typeof snippet.author === 'object' 
                      ? snippet.author.bio || 'No bio'
                      : 'No bio'}
                  </div>
                </div>
              </div>
              <Button variant="outline-primary" className="w-100">
                Follow
              </Button>
            </Card.Body>
          </Card>

          {/* Stats */}
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Statistics</h5>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                  <EyeIcon className="h-4 w-4 me-2 text-muted" />
                  <span>Views</span>
                </div>
                <span className="fw-semibold">{snippet.views || 0}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                  <HeartIcon className="h-4 w-4 me-2 text-muted" />
                  <span>Likes</span>
                </div>
                <span className="fw-semibold">{Array.isArray(snippet.likes) ? snippet.likes.length : snippet.likes || 0}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div className="d-flex align-items-center">
                  <ChatBubbleLeftIcon className="h-4 w-4 me-2 text-muted" />
                  <span>Comments</span>
                </div>
                <span className="fw-semibold">{Array.isArray(comments) ? comments.length : 0}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <ClockIcon className="h-4 w-4 me-2 text-muted" />
                  <span>Created</span>
                </div>
                <span className="fw-semibold">{formatDate(snippet.createdAt)}</span>
              </div>
            </Card.Body>
          </Card>

          {/* Actions */}
          <Card>
            <Card.Body>
              <h5 className="mb-3">Actions</h5>
              <div className="d-grid gap-2">
                <Button
                  variant={isLiked ? "danger" : "outline-danger"}
                  onClick={handleLike}
                  className="d-flex align-items-center justify-content-center"
                >
                  {isLiked ? (
                    <HeartSolidIcon className="h-4 w-4 me-2" />
                  ) : (
                    <HeartIcon className="h-4 w-4 me-2" />
                  )}
                  {isLiked ? 'Liked' : 'Like'}
                </Button>
                <Button variant="outline-primary" className="d-flex align-items-center justify-content-center">
                  <CodeBracketIcon className="h-4 w-4 me-2" />
                  Copy Code
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Share Modal */}
      <Modal show={showShareModal} onHide={() => setShowShareModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Share Snippet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Share this snippet with others:</p>
          <Form.Control
            type="text"
            value={window.location.href}
            readOnly
            className="mb-3"
          />
          <Button variant="primary" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            setShowShareModal(false);
          }}>
            Copy Link
          </Button>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default SnippetDetailPage;
