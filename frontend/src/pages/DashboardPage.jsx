import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🎓</span>
              <h1 className="text-xl font-bold text-gray-900">
                AU Placements Portal
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/profile')}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                👤 My Profile
              </button>
              <button
                onClick={() => navigate('/calendar')}
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                📅 Calendar
              </button>
              <button
                onClick={() => navigate('/pipeline')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                🔄 Pipeline
              </button>
              <button
                onClick={() => navigate('/forum')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                💬 Forum
              </button>
              <button
                onClick={() => navigate('/resources')}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                📚 Resources
              </button>
              <button
                onClick={() => navigate('/support')}
                className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                💬 Support
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome, {user?.name}! 👋
          </h2>
          <p className="text-indigo-100">
            {user?.registerNumber} • {user?.branch} • {user?.course}
          </p>
        </div>

        {/* Student Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Your Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Full Name</p>
              <p className="font-semibold text-gray-900">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Register Number</p>
              <p className="font-semibold text-gray-900">{user?.registerNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Branch</p>
              <p className="font-semibold text-gray-900">{user?.branch}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Course</p>
              <p className="font-semibold text-gray-900">{user?.course}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">College</p>
              <p className="font-semibold text-gray-900">{user?.collegeName}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
