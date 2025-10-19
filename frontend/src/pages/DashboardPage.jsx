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
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="h-8 w-8 text-blue-600" />
              <span className="text-3xl font-bold text-gray-900">{stats?.totalApplications || 0}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Applications</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <span className="text-3xl font-bold text-gray-900">{stats?.shortlisted || 0}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">Shortlisted</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="h-8 w-8 text-amber-600" />
              <span className="text-3xl font-bold text-gray-900">{stats?.inProgress || 0}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">In Progress</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <span className="text-3xl font-bold text-gray-900">{studentData?.cgpa || 'N/A'}</span>
            </div>
            <p className="text-sm text-gray-600 font-medium">CGPA</p>
          </div>
        </div>


      </main>
    </div>
  );
}
