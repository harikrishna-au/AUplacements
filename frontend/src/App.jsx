import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import VerifyPage from './pages/VerifyPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import PlacementsCalendar from './pages/PlacementsCalendar';
import CompanyPipeline from './pages/CompanyPipeline';
import DiscussionForum from './pages/DiscussionForum';
import ResourcesPage from './pages/ResourcesPage';
import FeedbackSupport from './pages/FeedbackSupport';
import CompanyListPage from './pages/CompanyListPage';
import './App.css'
import AppLayout from './components/AppLayout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<AppLayout><LoginPage /></AppLayout>} />
          <Route path="/auth/verify" element={<AppLayout><VerifyPage /></AppLayout>} />
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
            path="/support"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <FeedbackSupport />
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
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

