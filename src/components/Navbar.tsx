import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  CodeBracketIcon, 
  UserCircleIcon, 
  ArrowRightOnRectangleIcon,
  PlusIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Container, Nav, Navbar as BootstrapNavbar, Button, Dropdown } from 'react-bootstrap';

const CustomNavbar: React.FC = () => {
  const { state, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <BootstrapNavbar bg="white" expand="lg" className="shadow-sm border-bottom">
      <Container>
        <BootstrapNavbar.Brand as={Link} to="/" className="d-flex align-items-center text-decoration-none text-dark">
          <CodeBracketIcon className="h-8 w-8 text-primary me-2" />
          <span className="fw-bold">Code Connect</span>
        </BootstrapNavbar.Brand>

        <BootstrapNavbar.Toggle 
          aria-controls="basic-navbar-nav" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`navbar-link d-flex align-items-center ${isActivePath('/') ? 'active' : ''}`}
            >
              <HomeIcon className="h-4 w-4 me-1" />
              Home
            </Nav.Link>

            {state.isAuthenticated && (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/create" 
                  className={`navbar-link d-flex align-items-center ${isActivePath('/create') ? 'active' : ''}`}
                >
                  <PlusIcon className="h-4 w-4 me-1" />
                  Create
                </Nav.Link>

                <Nav.Link 
                  as={Link} 
                  to="/explore" 
                  className={`navbar-link d-flex align-items-center ${isActivePath('/explore') ? 'active' : ''}`}
                >
                  <MagnifyingGlassIcon className="h-4 w-4 me-1" />
                  Explore
                </Nav.Link>

                <Nav.Link 
                  as={Link} 
                  to="/analytics" 
                  className={`navbar-link d-flex align-items-center ${isActivePath('/analytics') ? 'active' : ''}`}
                >
                  <ChartBarIcon className="h-4 w-4 me-1" />
                  Analytics
                </Nav.Link>
              </>
            )}
          </Nav>

          <Nav className="ms-auto align-items-center">
            {/* Theme Toggle */}
            <Button
              variant="outline-secondary"
              onClick={toggleTheme}
              className="me-3 d-flex align-items-center"
              size="sm"
            >
              {theme === 'light' ? (
                <MoonIcon className="h-4 w-4" />
              ) : (
                <SunIcon className="h-4 w-4" />
              )}
            </Button>

            {state.isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="light" id="user-dropdown" className="d-flex align-items-center">
                  {state.user?.avatar ? (
                    <img
                      src={state.user.avatar}
                      alt={state.user.username}
                      className="rounded-circle me-2"
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                  ) : (
                    <UserCircleIcon className="h-8 w-8 me-2" />
                  )}
                  <span className="d-none d-md-inline">{state.user?.username}</span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to={`/profile/${state.user?.id}`}>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <ArrowRightOnRectangleIcon className="h-4 w-4 me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                <Button 
                  href="/login" 
                  variant="outline-primary" 
                  className="me-2"
                >
                  Login
                </Button>
                <Button 
                  href="/register" 
                  variant="primary"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default CustomNavbar;
