import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, Clock, XCircle, ArrowRight, Loader2, RefreshCw } from "lucide-react";

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

  // Get status for a specific stage
  const getStageStatus = (application, stageNumber) => {
    if (application.status === 'rejected' && stageNumber > application.currentStage) {
      return 'failed';
    }
    if (stageNumber < application.currentStage) return 'completed';
    if (stageNumber === application.currentStage) return 'current';
    return 'pending';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'current': return 'bg-blue-500 text-white';
      case 'failed': return 'bg-red-500 text-white';
      default: return 'bg-gray-200 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-6 h-6" />;
      case 'current': return <Clock className="w-6 h-6" />;
      case 'failed': return <XCircle className="w-6 h-6" />;
      default: return <Circle className="w-6 h-6" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      'applied': 'bg-gray-100 text-gray-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'selected': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'withdrawn': 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      

      {/* Main Content */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Company Pipeline Tracker</h1>
              <p className="text-lg text-gray-600">
                Track your application progress across different companies
              </p>
            </div>
            <Button onClick={fetchApplications} variant="outline" disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Applications</CardDescription>
              <CardTitle className="text-3xl">{stats.totalApplications}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl text-blue-600">{stats.inProgress}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Offers Received</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.selected}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
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

        {/* Error State */}
        {error && !loading && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600" />
                <div>
                  <p className="font-semibold text-red-900">{error}</p>
                  <p className="text-sm text-red-700 mt-1">
                    Please ensure the backend server is running on port 3001
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && !error && applications.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Circle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Applications Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't applied to any companies yet. Start applying to track your progress!
                </p>
                <Button onClick={() => navigate('/dashboard')}>
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
              <Card key={application._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-3xl">
                        {application.companyId?.logo || '🏢'}
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          {application.companyId?.name || 'Unknown Company'}
                        </CardTitle>
                        <CardDescription className="text-base mt-1">
                          Applied on {new Date(application.appliedDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadge(application.status)}`}>
                      {application.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="pt-8 pb-8">
                  {/* Pipeline Stages */}
                  <div className="relative">
                    <div className="flex justify-between items-center">
                      {application.companyId?.recruitmentStages?.map((stage, index) => {
                        const stageNumber = stage.order;
                        const status = getStageStatus(application, stageNumber);
                        const StatusIcon = getStatusIcon(status);

                        return (
                          <div key={stage._id || index} className="flex items-center">
                            <div className="flex flex-col items-center z-10 relative">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(status)} transition-all duration-300`}>
                                {StatusIcon}
                              </div>
                              <div className="mt-3 text-center max-w-[120px]">
                                <p className={`text-sm font-semibold ${
                                  status === 'current' ? 'text-blue-600' : 
                                  status === 'completed' ? 'text-green-600' :
                                  status === 'failed' ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                  {stage.stageName}
                                </p>
                                {application.stageHistory?.find(h => h.stageNumber === stageNumber)?.completedDate && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(application.stageHistory.find(h => h.stageNumber === stageNumber).completedDate).toLocaleDateString()}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Connector Line */}
                            {index < application.companyId.recruitmentStages.length - 1 && (
                              <div className={`flex-1 h-1 mx-2 ${
                                stageNumber < application.currentStage ? 'bg-green-500' :
                                stageNumber === application.currentStage ? 'bg-blue-500' : 'bg-gray-200'
                              }`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stage Details */}
                  {application.stageHistory && application.stageHistory.length > 0 && (
                    <div className="mt-8 pt-6 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">Stage History</h4>
                      <div className="space-y-2">
                        {application.stageHistory.slice().reverse().map((history, index) => (
                          <div key={index} className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className={`px-2 py-1 rounded ${
                                history.status === 'cleared' ? 'bg-green-100 text-green-800' :
                                history.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {history.stageName}
                              </span>
                              <span className="text-gray-600">
                                {history.status === 'cleared' ? '✓ Cleared' :
                                 history.status === 'failed' ? '✗ Failed' : '⏳ Pending'}
                              </span>
                              {history.score && (
                                <span className="text-gray-500">Score: {history.score}</span>
                              )}
                            </div>
                            {history.completedDate && (
                              <span className="text-gray-500">
                                {new Date(history.completedDate).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Outcome for Selected */}
                  {application.status === 'selected' && application.outcome?.package && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <h4 className="font-semibold text-green-900">Offer Details</h4>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3">
                        {application.outcome.package && (
                          <div>
                            <p className="text-sm text-green-700">Package</p>
                            <p className="font-semibold text-green-900">{application.outcome.package}</p>
                          </div>
                        )}
                        {application.outcome.role && (
                          <div>
                            <p className="text-sm text-green-700">Role</p>
                            <p className="font-semibold text-green-900">{application.outcome.role}</p>
                          </div>
                        )}
                        {application.outcome.joiningDate && (
                          <div>
                            <p className="text-sm text-green-700">Joining Date</p>
                            <p className="font-semibold text-green-900">
                              {new Date(application.outcome.joiningDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
