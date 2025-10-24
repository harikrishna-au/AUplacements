import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Circle, XCircle, Loader2 } from "lucide-react";
import PipelineCard from '../components/PipelineCard';
import RefreshButton from '../components/RefreshButton';

export default function CompanyPipeline() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    inProgress: 0,
    selected: 0,
    rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch student's applications
  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationAPI.getMyApplications();
      setApplications(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching applications:', err);
      if (err.response?.status === 404 || err.response?.data?.message?.includes('No applications')) {
        setApplications([]);
        setError(null);
      } else {
        setError('Failed to load applications');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await applicationAPI.getMyStats();
      setStats(response.data || {
        totalApplications: 0,
        inProgress: 0,
        selected: 0,
        rejected: 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };



  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Company Pipeline</h1>
              <p className="text-gray-600">Track your application progress</p>
            </div>
            <RefreshButton onClick={fetchApplications} loading={loading} />
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5 hover:bg-white/80 transition-all">
            <CardHeader className="pb-3">
              <CardDescription>Total Applications</CardDescription>
              <CardTitle className="text-3xl">{stats.totalApplications}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5 hover:bg-white/80 transition-all">
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5 hover:bg-white/80 transition-all">
            <CardHeader className="pb-3">
              <CardDescription>Offers Received</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.selected}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5 hover:bg-white/80 transition-all">
            <CardHeader className="pb-3">
              <CardDescription>Rejected</CardDescription>
              <CardTitle className="text-3xl text-red-600">{stats.rejected}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mb-4" />
            <p className="text-gray-600">Loading your applications...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-xl bg-gray-500/10 flex items-center justify-center mx-auto mb-4">
                  <Circle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Applications Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't applied to any companies yet. Start applying to track your progress!
                </p>
                <Button onClick={() => navigate('/dashboard')} className="bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20">
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pipeline Cards */}
        {!loading && applications.length > 0 && (
          <div className="space-y-6">
            {applications.map((application) => (
              <PipelineCard key={application._id} application={application} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
