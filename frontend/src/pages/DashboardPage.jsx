import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { studentAPI, applicationAPI } from '../services/api';
import { Loader2, Briefcase, Calendar, MessageSquare, BookOpen, Building2, ArrowRight, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        studentAPI.getProfile(),
        applicationAPI.getMyStats()
      ]);
      setStudentData(profileRes.data.data);
      console.log('Stats response:', statsRes.data);
      setStats(statsRes.data.data || statsRes.data);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <main className="w-full px-4 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Welcome, {studentData?.fullName}</h1>
          <p className="text-xl text-gray-600">Your placement journey starts here</p>
        </div>

        {/* Stats Overview */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 md:p-6 border border-blue-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/companies')}>
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="h-6 md:h-8 w-6 md:w-8 text-blue-600" />
              <span className="text-2xl md:text-3xl font-bold text-gray-900">{stats?.totalApplications || 0}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-medium">Applications</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-4 md:p-6 border border-green-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/pipeline')}>
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-6 md:h-8 w-6 md:w-8 text-green-600" />
              <span className="text-2xl md:text-3xl font-bold text-gray-900">{stats?.selected || 0}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-medium">Selected</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 md:p-6 border border-amber-100 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/pipeline')}>
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-6 md:h-8 w-6 md:w-8 text-amber-600" />
              <span className="text-2xl md:text-3xl font-bold text-gray-900">{stats?.inProgress || 0}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-medium">In Progress</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-4 md:p-6 border border-purple-100 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-6 md:h-8 w-6 md:w-8 text-purple-600" />
              <span className="text-2xl md:text-3xl font-bold text-gray-900">{studentData?.cgpa || 'N/A'}</span>
            </div>
            <p className="text-xs md:text-sm text-gray-600 font-medium">CGPA</p>
          </div>
        </div>

        {/* Application Flow Visualization - Desktop Only */}
        <div className="hidden md:block max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Application Journey</h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between gap-4">
              {/* Step 1 */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Browse Companies</h3>
                <p className="text-sm text-gray-600 mb-3">Explore opportunities</p>
                <button onClick={() => navigate('/companies')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 mx-auto">
                  Start <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <ArrowRight className="h-6 w-6 text-gray-300" />

              {/* Step 2 */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Apply</h3>
                <p className="text-sm text-gray-600 mb-3">Submit applications</p>
                <div className="text-sm font-medium text-gray-900">{stats?.totalApplications || 0} Applied</div>
              </div>

              <ArrowRight className="h-6 w-6 text-gray-300" />

              {/* Step 3 */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Track Progress</h3>
                <p className="text-sm text-gray-600 mb-3">Monitor pipeline</p>
                <button onClick={() => navigate('/pipeline')} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1 mx-auto">
                  View <ArrowRight className="h-4 w-4" />
                </button>
              </div>

              <ArrowRight className="h-6 w-6 text-gray-300" />

              {/* Step 4 */}
              <div className="flex-1 text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Get Placed</h3>
                <p className="text-sm text-gray-600 mb-3">Receive offers</p>
                <div className="text-sm font-medium text-green-600">{stats?.selected || 0} Offers</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div onClick={() => navigate('/calendar')} className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-2xl transition-all hover:scale-105">
              <Calendar className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-2">View Calendar</h3>
              <p className="text-indigo-100 text-sm mb-4">Check upcoming events and interviews</p>
              <div className="flex items-center text-sm font-medium">
                Open Calendar <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </div>

            <div onClick={() => navigate('/resources')} className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-2xl transition-all hover:scale-105">
              <BookOpen className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-2">Study Resources</h3>
              <p className="text-pink-100 text-sm mb-4">Access interview prep materials</p>
              <div className="flex items-center text-sm font-medium">
                Browse Resources <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </div>

            <div onClick={() => navigate('/forum')} className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-2xl transition-all hover:scale-105">
              <MessageSquare className="h-10 w-10 mb-4" />
              <h3 className="text-xl font-bold mb-2">Discussion Forum</h3>
              <p className="text-amber-100 text-sm mb-4">Connect with peers and share insights</p>
              <div className="flex items-center text-sm font-medium">
                Join Discussion <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
