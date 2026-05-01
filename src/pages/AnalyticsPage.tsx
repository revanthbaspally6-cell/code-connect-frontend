import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ChartBarIcon,
  UsersIcon,
  CodeBracketIcon,
  HeartIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';

const AnalyticsPage: React.FC = () => {
  const { state } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    if (state.isAuthenticated) {
      fetchAnalytics();
    }
  }, [state.isAuthenticated, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Mock analytics data for demonstration
      const mockAnalytics = {
        overview: {
          totalSnippets: 42,
          totalViews: 8900,
          totalLikes: 1250,
          totalComments: 340,
          totalUsers: 156,
          newUsersToday: 12,
          activeUsers: 89
        },
        chartData: {
          dailyViews: [
            { date: 'Mon', views: 1200, likes: 45, comments: 12 },
            { date: 'Tue', views: 1500, likes: 58, comments: 15 },
            { date: 'Wed', views: 1800, likes: 72, comments: 18 },
            { date: 'Thu', views: 1400, likes: 52, comments: 14 },
            { date: 'Fri', views: 2100, likes: 85, comments: 22 },
            { date: 'Sat', views: 900, likes: 35, comments: 8 },
            { date: 'Sun', views: 1000, likes: 40, comments: 10 }
          ],
          languageDistribution: [
            { language: 'JavaScript', count: 15, percentage: 35.7 },
            { language: 'Python', count: 12, percentage: 28.6 },
            { language: 'TypeScript', count: 8, percentage: 19.0 },
            { language: 'React', count: 7, percentage: 16.7 }
          ],
          topSnippets: [
            { title: 'React Custom Hook', views: 450, likes: 23, comments: 5 },
            { title: 'Python Data Pipeline', views: 380, likes: 18, comments: 3 },
            { title: 'TypeScript Utility', views: 320, likes: 15, comments: 2 },
            { title: 'CSS Grid Layout', views: 290, likes: 12, comments: 4 },
            { title: 'Node.js API', views: 260, likes: 10, comments: 2 }
          ],
          userGrowth: [
            { month: 'Jan', users: 45 },
            { month: 'Feb', users: 68 },
            { month: 'Mar', users: 92 },
            { month: 'Apr', users: 118 },
            { month: 'May', users: 135 },
            { month: 'Jun', users: 156 }
          ]
        },
        trends: {
          viewsGrowth: 15.2,
          likesGrowth: 8.7,
          commentsGrowth: 12.3,
          usersGrowth: 18.9
        }
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalytics(mockAnalytics);
      setError('');
    } catch (error: any) {
      setError('Failed to load analytics data');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      javascript: '#f7df1e',
      typescript: '#3178c6',
      python: '#3776ab',
      react: '#61dafb'
    };
    return colors[language] || '#6c757d';
  };

  if (!state.isAuthenticated) {
    return (
      <Container className="py-4">
        <Alert variant="warning">
          Please log in to view analytics dashboard.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-4">
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading analytics...</span>
          </Spinner>
          <p className="mt-3 text-muted">Loading analytics data...</p>
        </div>
      </Container>
    );
  }

  if (error || !analytics) {
    return (
      <Container className="py-4">
        <Alert variant="danger">
          {error || 'Failed to load analytics data'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold mb-1">Analytics Dashboard</h1>
          <p className="text-muted mb-0">Monitor your platform performance and user engagement</p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant={timeRange === '7d' ? 'primary' : 'outline-secondary'}
            onClick={() => setTimeRange('7d')}
            size="sm"
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'primary' : 'outline-secondary'}
            onClick={() => setTimeRange('30d')}
            size="sm"
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'primary' : 'outline-secondary'}
            onClick={() => setTimeRange('90d')}
            size="sm"
          >
            90 Days
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <CodeBracketIcon className="h-8 w-8 text-primary mb-2" />
              <h3 className="h4 fw-bold">{analytics.overview.totalSnippets}</h3>
              <p className="text-muted mb-0">Total Snippets</p>
              <Badge bg="success" className="mt-2">
                <ArrowTrendingUpIcon className="h-3 w-3 me-1" />
                +12.5%
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <EyeIcon className="h-8 w-8 text-info mb-2" />
              <h3 className="h4 fw-bold">{analytics.overview.totalViews.toLocaleString()}</h3>
              <p className="text-muted mb-0">Total Views</p>
              <Badge bg="success" className="mt-2">
                <ArrowTrendingUpIcon className="h-3 w-3 me-1" />
                +{analytics.trends.viewsGrowth}%
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <HeartIcon className="h-8 w-8 text-danger mb-2" />
              <h3 className="h4 fw-bold">{analytics.overview.totalLikes.toLocaleString()}</h3>
              <p className="text-muted mb-0">Total Likes</p>
              <Badge bg="success" className="mt-2">
                <ArrowTrendingUpIcon className="h-3 w-3 me-1" />
                +{analytics.trends.likesGrowth}%
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <UsersIcon className="h-8 w-8 text-success mb-2" />
              <h3 className="h4 fw-bold">{analytics.overview.totalUsers}</h3>
              <p className="text-muted mb-0">Total Users</p>
              <Badge bg="success" className="mt-2">
                <ArrowTrendingUpIcon className="h-3 w-3 me-1" />
                +{analytics.trends.usersGrowth}%
              </Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Daily Activity</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-end justify-content-between" style={{ height: '300px' }}>
                {analytics.chartData.dailyViews.map((day: any, index: number) => (
                  <div key={index} className="text-center flex-grow-1">
                    <div
                      className="mx-auto mb-2"
                      style={{
                        width: '40px',
                        height: `${(day.views / 2100) * 250}px`,
                        backgroundColor: '#0d6efd',
                        borderRadius: '4px 4px 0 0',
                        position: 'relative'
                      }}
                    />
                    <div className="small text-muted">{day.date}</div>
                    <div className="small fw-semibold">{day.views}</div>
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-center gap-4 mt-3">
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#0d6efd', borderRadius: '2px' }} />
                  <span className="small">Views</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#dc3545', borderRadius: '2px' }} />
                  <span className="small">Likes</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2" style={{ width: '12px', height: '12px', backgroundColor: '#198754', borderRadius: '2px' }} />
                  <span className="small">Comments</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Language Distribution</h5>
            </Card.Header>
            <Card.Body>
              {analytics.chartData.languageDistribution.map((lang: any, index: number) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <div className="d-flex align-items-center">
                      <div
                        className="me-2"
                        style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: getLanguageColor(lang.language),
                          borderRadius: '2px'
                        }}
                      />
                      <span className="fw-semibold">{lang.language}</span>
                    </div>
                    <span className="text-muted">{lang.count} ({lang.percentage}%)</span>
                  </div>
                  <div className="progress" style={{ height: '6px' }}>
                    <div
                      className="progress-bar"
                      style={{
                        width: `${lang.percentage}%`,
                        backgroundColor: getLanguageColor(lang.language)
                      }}
                    />
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Top Content and User Growth */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Top Performing Snippets</h5>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Views</th>
                      <th>Likes</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.chartData.topSnippets.map((snippet: any, index: number) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <Badge bg="primary" className="me-2">#{index + 1}</Badge>
                            {snippet.title}
                          </div>
                        </td>
                        <td>{snippet.views}</td>
                        <td>{snippet.likes}</td>
                        <td>{snippet.comments}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-0 shadow-sm">
            <Card.Header>
              <h5 className="mb-0">User Growth</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-end justify-content-between" style={{ height: '200px' }}>
                {analytics.chartData.userGrowth.map((month: any, index: number) => (
                  <div key={index} className="text-center flex-grow-1">
                    <div
                      className="mx-auto mb-2"
                      style={{
                        width: '30px',
                        height: `${(month.users / 156) * 150}px`,
                        backgroundColor: '#198754',
                        borderRadius: '4px 4px 0 0'
                      }}
                    />
                    <div className="small text-muted">{month.month}</div>
                    <div className="small fw-semibold">{month.users}</div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm">
        <Card.Header>
          <h5 className="mb-0">Recent Activity</h5>
        </Card.Header>
        <Card.Body>
          <div className="d-flex align-items-center mb-3">
            <div className="me-3">
              <div className="d-flex align-items-center text-success">
                <ArrowTrendingUpIcon className="h-4 w-4 me-1" />
                <span className="fw-semibold">Platform is growing!</span>
              </div>
              <div className="text-muted small">
                {analytics.overview.newUsersToday} new users today, {analytics.overview.activeUsers} active users
              </div>
            </div>
          </div>
          <Alert variant="info">
            <DocumentTextIcon className="h-4 w-4 me-2" />
            Advanced analytics including real-time monitoring, custom reports, and export features are coming soon!
          </Alert>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AnalyticsPage;
