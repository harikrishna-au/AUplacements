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
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="w-full px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hi, {studentData?.fullName?.split(' ')[0] || 'Student'}</h1>
          <p className="text-gray-600 mt-1">{studentData?.universityRegisterNumber}</p>
        </div>

        {/* Stats Overview */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-lg shadow-black/5 hover:bg-white/80 transition-all cursor-pointer" onClick={() => navigate('/companies')}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats?.totalApplications || 0}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Applications</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-lg shadow-black/5 hover:bg-white/80 transition-all cursor-pointer" onClick={() => navigate('/pipeline')}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats?.selected || 0}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">Selected</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-lg shadow-black/5 hover:bg-white/80 transition-all cursor-pointer" onClick={() => navigate('/pipeline')}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{stats?.inProgress || 0}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">In Progress</p>
          </div>

          <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-5 shadow-lg shadow-black/5">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <span className="text-3xl font-bold text-gray-900">{studentData?.cgpa || 'N/A'}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">CGPA</p>
          </div>
        </div>

        {stats?.totalApplications === 0 && (
          <div className="max-w-6xl mx-auto mb-8">
            <div className="bg-blue-500/10 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-lg shadow-blue-500/5">
              <h2 className="font-semibold text-gray-900 mb-2">No applications yet</h2>
              <p className="text-sm text-gray-600 mb-4">Browse companies and start applying</p>
              <button onClick={() => navigate('/companies')} className="px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
                View Companies
              </button>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button onClick={() => navigate('/calendar')} className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg shadow-black/5 hover:bg-white/80 transition-all text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Calendar</h3>
              </div>
              <p className="text-sm text-gray-600">Events & deadlines</p>
            </button>

            <button onClick={() => navigate('/resources')} className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg shadow-black/5 hover:bg-white/80 transition-all text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Resources</h3>
              </div>
              <p className="text-sm text-gray-600">Study materials</p>
            </button>

            <button onClick={() => navigate('/forum')} className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg shadow-black/5 hover:bg-white/80 transition-all text-left">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Forum</h3>
              </div>
              <p className="text-sm text-gray-600">Student discussions</p>
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
