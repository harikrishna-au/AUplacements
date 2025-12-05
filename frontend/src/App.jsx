import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PlacementsCalendar from './pages/PlacementsCalendar';
import CompanyPipeline from './pages/CompanyPipeline';
import DiscussionForum from './pages/DiscussionForum';
import ResourcesPage from './pages/ResourcesPage';
import CompanyListPage from './pages/CompanyListPage';
import FeedbackSupport from './pages/FeedbackSupport';
import './App.css'
import AppLayout from './components/AppLayout';
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter
        onError={(error) => {
          console.error('Router error:', error);
        }}
      >
        <AuthProvider>
          <ErrorBoundary>
            <Routes>
              <Route path="/login" element={<AppLayout><LoginPage /></AppLayout>} />
              <Route path="/signup" element={<AppLayout><SignUpPage /></AppLayout>} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DashboardPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProfilePage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <PlacementsCalendar />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pipeline"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <CompanyPipeline />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/forum"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DiscussionForum />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/resources"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ResourcesPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/companies"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <CompanyListPage />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/support"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <FeedbackSupport />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

