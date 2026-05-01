import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateSnippetPage from './pages/CreateSnippetPage';
import ExplorePage from './pages/ExplorePage';
import SnippetDetailPage from './pages/SnippetDetailPage';
import ProfilePage from './pages/ProfilePage';
import AnalyticsPage from './pages/AnalyticsPage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-vh-100">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/create" element={<CreateSnippetPage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/snippet/:id" element={<SnippetDetailPage />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/test" element={<TestPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
