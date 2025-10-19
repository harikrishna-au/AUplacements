import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { studentAPI } from '../services/api';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      const response = await studentAPI.getProfile();
      setStudentData(response.data.data);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  const displayData = studentData || user;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="w-full px-3 sm:px-4 lg:px-8 py-6 md:py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 md:p-8 text-white mb-6 md:mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {displayData?.fullName || displayData?.name}! 👋
          </h2>
          <p className="text-indigo-100">
            {displayData?.universityRegisterNumber || displayData?.registerNumber} • {displayData?.branch || 'N/A'} • {displayData?.course || 'N/A'}
          </p>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-xl shadow-md p-5 md:p-6 mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Your Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-semibold text-gray-900">{displayData?.fullName || displayData?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Register Number</p>
              <p className="font-semibold text-gray-900">{displayData?.universityRegisterNumber || displayData?.registerNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{displayData?.collegeEmail || displayData?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Branch</p>
              <p className="font-semibold text-gray-900">{displayData?.branch || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Course</p>
              <p className="font-semibold text-gray-900">{displayData?.course || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">College</p>
              <p className="font-semibold text-gray-900">{displayData?.collegeName || 'Andhra University'}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div 
            onClick={() => navigate('/profile')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-4xl mb-3">👤</div>
            <h4 className="font-bold text-gray-900 mb-2">My Profile</h4>
            <p className="text-gray-600 text-sm">View your personal and academic information</p>
          </div>

          <div 
            onClick={() => navigate('/calendar')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-4xl mb-3">📅</div>
            <h4 className="font-bold text-gray-900 mb-2">Placements Calendar</h4>
            <p className="text-gray-600 text-sm">Track placement drives and company schedules</p>
          </div>

          <div 
            onClick={() => navigate('/pipeline')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-4xl mb-3">🔄</div>
            <h4 className="font-bold text-gray-900 mb-2">Company Pipeline</h4>
            <p className="text-gray-600 text-sm">Track your application status with companies</p>
          </div>

          <div 
            onClick={() => navigate('/forum')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-4xl mb-3">💬</div>
            <h4 className="font-bold text-gray-900 mb-2">Discussion Forum</h4>
            <p className="text-gray-600 text-sm">Chat with peers about placements and companies</p>
          </div>

          <div 
            onClick={() => navigate('/resources')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-4xl mb-3">📚</div>
            <h4 className="font-bold text-gray-900 mb-2">Resources</h4>
            <p className="text-gray-600 text-sm">Access study materials and preparation guides</p>
          </div>

          <div 
            onClick={() => navigate('/support')}
            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="text-4xl mb-3">🆘</div>
            <h4 className="font-bold text-gray-900 mb-2">Support & Feedback</h4>
            <p className="text-gray-600 text-sm">Get help or share your feedback with us</p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
          <h4 className="font-bold text-blue-900 mb-2">📢 Important Notice</h4>
          <p className="text-blue-800">
            This is your placement portal dashboard. You can access all placement-related information here.
            Your session will remain active for 7 days.
          </p>
        </div>
      </main>
    </div>
  );
}
