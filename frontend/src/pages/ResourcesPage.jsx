import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { applicationAPI, resourceAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Search, Upload, AlertCircle } from "lucide-react";
import ResourceCard from '../components/ResourceCard';
import UploadResourceModal from '../components/UploadResourceModal';
import CompanyLogo from '../components/CompanyLogo';
import RefreshButton from '../components/RefreshButton';

export default function ResourcesPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [selectedCompany, setSelectedCompany] = useState(searchParams.get('company') || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState([]);
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Fetch companies from pipeline
  useEffect(() => {
    fetchPipelineCompanies();
  }, []);

  // Fetch resources when company changes
  useEffect(() => {
    if (selectedCompany && companies.length > 0) {
      fetchResources();
    }
  }, [selectedCompany, companies]);

  // Filter resources based on search
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = resources.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredResources(filtered);
    } else {
      setFilteredResources(resources);
    }
  }, [searchQuery, resources]);

  const fetchPipelineCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch user's applications (pipeline)
      const response = await applicationAPI.getMyApplications();
      const applications = response.data;
      
      // Extract unique companies with application info
      const companyMap = new Map();
      applications.forEach(app => {
        if (app.companyId && !companyMap.has(app.companyId._id)) {
          companyMap.set(app.companyId._id, {
            id: app.companyId._id,
            name: app.companyId.name,
            logo: app.companyId.logo,
            currentStage: app.currentStage,
            status: app.status
          });
        }
      });
      
      const pipelineCompanies = Array.from(companyMap.values());
      
      // Add "All Companies" option at the beginning
      const allCompaniesOption = {
        id: 'all',
        name: 'All Companies',
        logo: '📚'
      };
      
      setCompanies([allCompaniesOption, ...pipelineCompanies]);
      
      // Set default selection if none exists
      if (!selectedCompany && pipelineCompanies.length > 0) {
        setSelectedCompany('all');
      }
      
    } catch (error) {
      console.error('Error fetching pipeline companies:', error);
      setError('Failed to load your pipeline companies');
    } finally {
      setLoading(false);
    }
  };

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let resourcesData = [];
      
      if (selectedCompany === 'all') {
        // Fetch resources for all companies in pipeline
        const allResourcesPromises = companies
          .filter(c => c.id !== 'all')
          .map(company => 
            resourceAPI.getResourcesByCompany(company.id)
              .then(res => res.data)
              .catch(err => {
                console.error(`Error fetching resources for ${company.name}:`, err);
                return [];
              })
          );
        
        const allResourcesArrays = await Promise.all(allResourcesPromises);
        resourcesData = allResourcesArrays.flat();
      } else {
        // Fetch resources for selected company
        const response = await resourceAPI.getResourcesByCompany(selectedCompany);
        resourcesData = response.data;
      }
      
      setResources(resourcesData);
      setFilteredResources(resourcesData);
      
    } catch (error) {
      console.error('Error fetching resources:', error);
      setError('Failed to load resources');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (companyId) => {
    setSelectedCompany(companyId);
    setSearchParams({ company: companyId });
  };

  const handleDownload = async (resource) => {
    try {
      await resourceAPI.incrementDownload(resource._id);
      
      if (resource.fileUrl) {
        window.open(resource.fileUrl, '_blank');
      } else if (resource.externalUrl) {
        window.open(resource.externalUrl, '_blank');
      }
    } catch (error) {
      console.error('Error downloading resource:', error);
    }
  };

  const handleView = async (resource) => {
    try {
      await resourceAPI.incrementView(resource._id);
      
      if (resource.externalUrl) {
        window.open(resource.externalUrl, '_blank');
      } else if (resource.fileUrl) {
        window.open(resource.fileUrl, '_blank');
      }
    } catch (error) {
      console.error('Error viewing resource:', error);
    }
  };



  const selectedCompanyData = companies.find(c => c.id === selectedCompany);
  const resourceCount = filteredResources.length;

  return (
    <div className="min-h-screen pt-20">
      

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-200/50 py-6 md:py-8">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-900">📚 Placement Resources</h1>
              <p className="text-gray-600">
                Company-wise study materials, guides, and preparation resources from your pipeline
              </p>
            </div>
            <RefreshButton onClick={fetchResources} loading={loading} />
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="text-2xl font-bold text-gray-900">{companies.length - 1}</div>
              <div className="text-sm text-gray-600">Companies</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
              <div className="text-2xl font-bold text-gray-900">{resources.length}</div>
              <div className="text-sm text-gray-600">Total Resources</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-100">
              <div className="text-2xl font-bold text-gray-900">
                {resources.filter(r => r.resourceType === 'PDF' || r.resourceType === 'document').length}
              </div>
              <div className="text-sm text-gray-600">PDF Documents</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
              <div className="text-2xl font-bold text-gray-900">
                {resources.filter(r => r.resourceType === 'video').length}
              </div>
              <div className="text-sm text-gray-600">Video Tutorials</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-3 sm:px-4 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          {/* Sidebar - Companies */}
          <div className="lg:w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Companies</CardTitle>
                <CardDescription>Your pipeline companies</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {loading && companies.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                    Loading...
                  </div>
                ) : companies.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">No companies in pipeline</p>
                    <Button
                      onClick={() => navigate('/pipeline')}
                      className="mt-3"
                      size="sm"
                    >
                      Browse Companies
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {companies.map((company) => (
                      <button
                        key={company.id}
                        onClick={() => handleCompanyChange(company.id)}
                        className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between ${
                          selectedCompany === company.id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {company.id === 'all' ? (
                            <span className="text-2xl">{company.logo}</span>
                          ) : (
                            <CompanyLogo 
                              logo={company.logo}
                              companyName={company.name}
                              size="sm"
                            />
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{company.name}</div>
                            {company.currentStage && (
                              <div className="text-xs text-gray-500">Stage {company.currentStage}</div>
                            )}
                          </div>
                        </div>
                        {selectedCompany === company.id && company.id !== 'all' && (
                          <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
                            {resources.filter(r => r.companyId._id === company.id).length}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Resources */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Resources Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCompanyData?.name || 'Resources'}
                </h2>
                <p className="text-gray-600 text-sm">
                  {resourceCount} resource{resourceCount !== 1 ? 's' : ''} available
                </p>
              </div>
              {(selectedCompany !== 'all' && companies.length > 0) ? (
                <Button
                  onClick={() => setShowUploadModal(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
              ) : (
                <Button
                  disabled
                  title={companies.length === 0 ? 'No companies available' : 'Select a company to upload resources'}
                  className="bg-gray-300 text-gray-500 cursor-not-allowed"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {!loading && !error && filteredResources.length === 0 && companies.length > 1 && (
              <Card className="border-gray-200">
                <CardContent className="pt-6 text-center">
                  <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Resources Available
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery 
                      ? 'No resources match your search query.'
                      : 'No resources have been uploaded for this company yet.'}
                  </p>
                  {searchQuery && (
                    <Button
                      onClick={() => setSearchQuery('')}
                      variant="outline"
                    >
                      Clear Search
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* No Pipeline Companies */}
            {!loading && companies.length <= 1 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No Companies in Pipeline
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Apply to companies to access their resources and study materials.
                  </p>
                  <Button
                    onClick={() => navigate('/pipeline')}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  >
                    Browse Companies
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Resources Grid */}
            {!loading && !error && filteredResources.length > 0 && (
              <div className="space-y-4">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource._id}
                    resource={resource}
                    onDownload={handleDownload}
                    onView={handleView}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadResourceModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        companies={companies.filter(c => c.id !== 'all' && c.name !== 'All Companies')}
        onSuccess={() => {
          fetchResources();
        }}
      />
    </div>
  );
}
