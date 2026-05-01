import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { snippetsAPI } from '../services/api';
import { 
  UserCircleIcon,
  CodeBracketIcon,
  HeartIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  CalendarIcon,
  MapPinIcon,
  LinkIcon,
  PencilIcon,
  TrashIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { state } = useAuth();
  const [user, setUser] = useState<any>(null);
  const [snippets, setSnippets] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('snippets');

  const isOwnProfile = state.isAuthenticated && state.user?.id === id;

  useEffect(() => {
    if (id) {
      fetchUserProfile();
      fetchUserSnippets();
      fetchUserStats();
    }
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      // For now, we'll use a mock user profile
      // In a real app, you'd have an API endpoint for user profiles
      const mockUser = {
        _id: id,
        username: id === '1' ? 'john_developer' : id === '2' ? 'sarah_coder' : 'mike_programmer',
        email: 'user@example.com',
        bio: id === '1' ? 'Full-stack developer passionate about clean code and best practices' : 
              id === '2' ? 'Frontend specialist focused on React and modern web technologies' : 
              'Backend architect with expertise in scalable systems',
        avatar: null,
        location: 'San Francisco, CA',
        website: 'https://example.com',
        github: 'https://github.com/username',
        joinedAt: '2024-01-15T00:00:00Z',
        followers: 245,
        following: 128
      };
      setUser(mockUser);
    } catch (error: any) {
      setError('Failed to load user profile');
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserSnippets = async () => {
    try {
      const response = await snippetsAPI.getUserSnippets(id!, { limit: 20 });
      setSnippets(response.data.snippets || []);
    } catch (error: any) {
      console.error('Error fetching user snippets:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Mock stats for now
      const mockStats = {
        totalSnippets: 42,
        totalLikes: 1250,
        totalViews: 8900,
        totalComments: 340,
        languages: [
          { name: 'JavaScript', count: 15 },
          { name: 'Python', count: 12 },
          { name: 'TypeScript', count: 8 },
          { name: 'React', count: 7 }
        ],
        monthlyActivity: [
          { month: 'Jan', snippets: 3, likes: 45 },
          { month: 'Feb', snippets: 5, likes: 78 },
          { month: 'Mar', snippets: 4, likes: 62 },
          { month: 'Apr', snippets: 6, likes: 95 },
          { month: 'May', snippets: 8, likes: 120 },
          { month: 'Jun', snippets: 7, likes: 98 }
        ]
      };
      setStats(mockStats);
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSnippet = async (snippetId: string) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      try {
        await snippetsAPI.deleteSnippet(snippetId);
        setSnippets(prev => prev.filter(s => s._id !== snippetId));
      } catch (error: any) {
        console.error('Error deleting snippet:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
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

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading profile...</p>
        </div>
      </Container>
    );
  }

  if (error || !user) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error || 'User not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Profile Header */}
      <Card className="mb-4">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={3} className="text-center mb-3 mb-md-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="rounded-circle"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
              ) : (
                <div className="author-avatar mx-auto" style={{ width: '120px', height: '120px', fontSize: '3rem' }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}
            </Col>
            <Col md={6}>
              <h1 className="h2 fw-bold mb-2">{user.username}</h1>
              <p className="text-muted mb-3">{user.bio}</p>
              <div className="d-flex flex-wrap gap-3 mb-3">
                <div className="d-flex align-items-center text-muted">
                  <MapPinIcon className="h-4 w-4 me-1" />
                  {user.location}
                </div>
                <div className="d-flex align-items-center text-muted">
                  <CalendarIcon className="h-4 w-4 me-1" />
                  Joined {formatDate(user.joinedAt)}
                </div>
                {user.website && (
                  <div className="d-flex align-items-center">
                    <LinkIcon className="h-4 w-4 me-1" />
                    <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-primary">
                      Website
                    </a>
                  </div>
                )}
              </div>
              <div className="d-flex gap-3">
                <div className="text-center">
                  <div className="fw-bold h5">{user.followers}</div>
                  <div className="text-muted small">Followers</div>
                </div>
                <div className="text-center">
                  <div className="fw-bold h5">{user.following}</div>
                  <div className="text-muted small">Following</div>
                </div>
                <div className="text-center">
                  <div className="fw-bold h5">{stats?.totalSnippets || 0}</div>
                  <div className="text-muted small">Snippets</div>
                </div>
              </div>
            </Col>
            <Col md={3} className="text-center">
              {isOwnProfile ? (
                <div className="d-grid gap-2">
                  <Button variant="primary">
                    <PencilIcon className="h-4 w-4 me-2" />
                    Edit Profile
                  </Button>
                  <Button variant="outline-secondary">
                    Settings
                  </Button>
                </div>
              ) : (
                <div className="d-grid gap-2">
                  <Button variant="primary">Follow</Button>
                  <Button variant="outline-secondary">Message</Button>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Statistics */}
      {stats && (
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <CodeBracketIcon className="h-8 w-8 text-primary mb-2" />
                <h3 className="h4 fw-bold">{stats.totalSnippets}</h3>
                <p className="text-muted mb-0">Total Snippets</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <HeartIcon className="h-8 w-8 text-danger mb-2" />
                <h3 className="h4 fw-bold">{stats.totalLikes}</h3>
                <p className="text-muted mb-0">Total Likes</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <EyeIcon className="h-8 w-8 text-info mb-2" />
                <h3 className="h4 fw-bold">{stats.totalViews}</h3>
                <p className="text-muted mb-0">Total Views</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <ChatBubbleLeftIcon className="h-8 w-8 text-success mb-2" />
                <h3 className="h4 fw-bold">{stats.totalComments}</h3>
                <p className="text-muted mb-0">Total Comments</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Content Tabs */}
      <Card>
        <Card.Header>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k || 'snippets')}
            className="mb-0"
          >
            <Tab eventKey="snippets" title="Snippets" />
            <Tab eventKey="analytics" title="Analytics" />
            <Tab eventKey="activity" title="Activity" />
          </Tabs>
        </Card.Header>
        <Card.Body>
          {activeTab === 'snippets' && (
            <Row className="g-4">
              {snippets.map((snippet) => (
                <Col md={6} key={snippet._id}>
                  <Card className="h-100">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="fw-bold mb-1">{snippet.title}</h5>
                          <p className="text-muted small mb-2">{snippet.description}</p>
                          <Badge bg={getLanguageColor(snippet.language)} className="me-2">
                            {snippet.language}
                          </Badge>
                        </div>
                        {isOwnProfile && (
                          <div className="d-flex gap-1">
                            <Button variant="outline-secondary" size="sm">
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline-danger" 
                              size="sm"
                              onClick={() => handleDeleteSnippet(snippet._id)}
                            >
                              <TrashIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="code-preview mb-3">
                        {snippet.code.substring(0, 150)}
                        {snippet.code.length > 150 && '...'}
                      </div>
                      <div className="d-flex justify-content-between align-items-center text-muted small">
                        <div className="d-flex gap-3">
                          <div className="d-flex align-items-center">
                            <HeartIcon className="h-4 w-4 me-1" />
                            {snippet.likes?.length || snippet.likes || 0}
                          </div>
                          <div className="d-flex align-items-center">
                            <EyeIcon className="h-4 w-4 me-1" />
                            {snippet.views || 0}
                          </div>
                          <div className="d-flex align-items-center">
                            <ChatBubbleLeftIcon className="h-4 w-4 me-1" />
                            {snippet.comments?.length || 0}
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <ClockIcon className="h-4 w-4 me-1" />
                          {formatDate(snippet.createdAt)}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
              {snippets.length === 0 && (
                <Col md={12}>
                  <div className="text-center py-5">
                    <CodeBracketIcon className="h-16 w-16 text-muted mb-3" />
                    <h4>No snippets yet</h4>
                    <p className="text-muted">
                      {isOwnProfile ? 'Start sharing your code snippets with the community!' : 'This user hasn\'t shared any snippets yet.'}
                    </p>
                    {isOwnProfile && (
                      <Button variant="primary" href="/create">
                        Create Your First Snippet
                      </Button>
                    )}
                  </div>
                </Col>
              )}
            </Row>
          )}

          {activeTab === 'analytics' && stats && (
            <Row>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Language Distribution</h5>
                  </Card.Header>
                  <Card.Body>
                    {stats.languages.map((lang: any, index: number) => (
                      <div key={index} className="mb-3">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-semibold">{lang.name}</span>
                          <span className="text-muted">{lang.count} snippets</span>
                        </div>
                        <div className="progress" style={{ height: '8px' }}>
                          <div
                            className="progress-bar"
                            style={{
                              width: `${(lang.count / stats.totalSnippets) * 100}%`,
                              backgroundColor: getLanguageColor(lang.name) === 'primary' ? '#0d6efd' :
                                               getLanguageColor(lang.name) === 'success' ? '#198754' :
                                               getLanguageColor(lang.name) === 'danger' ? '#dc3545' :
                                               getLanguageColor(lang.name) === 'warning' ? '#ffc107' :
                                               getLanguageColor(lang.name) === 'info' ? '#0dcaf0' : '#6c757d'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-4">
                  <Card.Header>
                    <h5 className="mb-0">Monthly Activity</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="d-flex align-items-end justify-content-between" style={{ height: '200px' }}>
                      {stats.monthlyActivity.map((month: any, index: number) => (
                        <div key={index} className="text-center flex-grow-1">
                          <div
                            className="mx-auto mb-2"
                            style={{
                              width: '30px',
                              height: `${(month.snippets / 10) * 150}px`,
                              backgroundColor: '#0d6efd',
                              borderRadius: '4px 4px 0 0'
                            }}
                          />
                          <div className="small text-muted">{month.month}</div>
                          <div className="small fw-semibold">{month.snippets}</div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeTab === 'activity' && (
            <div className="text-center py-5">
              <ChartBarIcon className="h-16 w-16 text-muted mb-3" />
              <h4>Activity Timeline</h4>
              <p className="text-muted">User activity and engagement over time</p>
              <Alert variant="info">
                This feature is coming soon! It will show detailed activity logs, engagement metrics, and user interactions.
              </Alert>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfilePage;
