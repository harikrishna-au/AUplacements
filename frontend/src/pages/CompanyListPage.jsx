import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, CheckCircle2, Loader2, Building2 } from "lucide-react";
import { companyAPI, applicationAPI } from '../services/api';

export default function CompanyListPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});

  useEffect(() => {
    fetchCompanies();
    fetchMyApplications();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await companyAPI.getAllCompanies();
      setCompanies(response.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyApplications = async () => {
    try {
      const response = await applicationAPI.getMyApplications();
      setMyApplications(response.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const hasApplied = (companyId) => {
    return myApplications.some(app => app.companyId?._id === companyId);
  };

  const handleApply = async (companyId) => {
    try {
      setApplying(prev => ({ ...prev, [companyId]: true }));
      
      await applicationAPI.applyToCompany(companyId);

      // Refresh applications
      await fetchMyApplications();
      alert('Successfully applied!');
    } catch (err) {
      console.error('Error applying:', err);
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(prev => ({ ...prev, [companyId]: false }));
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex space-x-8">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => navigate('/profile')}>
                Profile
              </Button>
              <Button variant="ghost" onClick={() => navigate('/calendar')}>
                Calendar
              </Button>
              <Button variant="ghost" onClick={() => navigate('/pipeline')}>
                Pipeline
              </Button>
              <Button variant="ghost" onClick={() => navigate('/forum')}>
                Forum
              </Button>
              <Button variant="ghost" onClick={() => navigate('/resources')}>
                Resources
              </Button>
              <Button variant="ghost" onClick={() => navigate('/support')}>
                Support
              </Button>
              <Button variant="ghost" className="text-indigo-600 font-semibold">
                Companies
              </Button>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Available Companies</h1>
          <p className="text-lg text-gray-600">
            Browse and apply to companies for placement opportunities
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Companies Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => {
              const applied = hasApplied(company._id);
              const isApplying = applying[company._id];

              return (
                <Card key={company._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle>{company.name}</CardTitle>
                        <CardDescription>{company.industry}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {company.description}
                    </p>

                    {/* Roles */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Roles Offered:</p>
                      <div className="flex flex-wrap gap-2">
                        {company.rolesOffered?.map((role, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Eligibility */}
                    <div className="mb-4 text-sm">
                      <p className="text-xs font-semibold text-gray-500 mb-2">Eligibility:</p>
                      <ul className="space-y-1 text-gray-600">
                        <li>• Min CGPA: {company.eligibilityCriteria?.minCGPA || 'N/A'}</li>
                        <li>• Max Backlogs: {company.eligibilityCriteria?.maxBacklogs ?? 'N/A'}</li>
                        <li>• Branches: {company.eligibilityCriteria?.allowedBranches?.join(', ') || 'All'}</li>
                      </ul>
                    </div>

                    {/* Package */}
                    <div className="mb-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-green-700 mb-1">Package Range</p>
                      <p className="font-semibold text-green-900">
                        {company.stats?.averagePackage} - {company.stats?.highestPackage}
                      </p>
                    </div>

                    {/* Apply Button */}
                    {applied ? (
                      <Button className="w-full" disabled variant="outline">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Already Applied
                      </Button>
                    ) : (
                      <Button 
                        className="w-full" 
                        onClick={() => handleApply(company._id)}
                        disabled={isApplying}
                      >
                        {isApplying ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Applying...
                          </>
                        ) : (
                          <>
                            <Briefcase className="w-4 h-4 mr-2" />
                            Apply Now
                          </>
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && companies.length === 0 && (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Companies Available
              </h3>
              <p className="text-gray-600">
                No companies are currently accepting applications
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
