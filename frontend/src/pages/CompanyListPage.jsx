import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Building2 } from "lucide-react";
import { companyAPI, applicationAPI } from '../services/api';
import CompanyCard from '../components/CompanyCard';
import CompanyDetailsModal from '../components/CompanyDetailsModal';
import RefreshButton from '../components/RefreshButton';

export default function CompanyListPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [companies, setCompanies] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState({});
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const [companiesRes, applicationsRes] = await Promise.all([
        companyAPI.getAllCompanies(),
        applicationAPI.getMyApplications()
      ]);
      
      console.log('Companies:', companiesRes.data);
      console.log('My Applications:', applicationsRes.data);
      
      setCompanies(companiesRes.data);
      setMyApplications(applicationsRes.data);
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
    const applied = myApplications.some(app => app.companyId?._id === companyId);
    console.log(`Checking company ${companyId}: Applied = ${applied}`);
    return applied;
  };

  const handleApply = async (companyId) => {
    try {
      setApplying(prev => ({ ...prev, [companyId]: true }));
      await applicationAPI.applyToCompany(companyId);
      alert('Successfully applied!');
      setIsModalOpen(false);
      await fetchCompanies();
    } catch (err) {
      console.error('Error applying:', err);
      alert(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(prev => ({ ...prev, [companyId]: false }));
    }
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Available Companies</h1>
            <p className="text-gray-600">Browse and apply to companies for placement opportunities</p>
          </div>
          <RefreshButton onClick={fetchCompanies} loading={loading} />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Companies Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {companies.map((company) => (
              <CompanyCard
                key={company._id}
                company={company}
                hasApplied={hasApplied(company._id)}
                isApplying={applying[company._id]}
                onApply={handleApply}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        )}

        {/* Company Details Modal */}
        <CompanyDetailsModal
          company={selectedCompany}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          hasApplied={selectedCompany ? hasApplied(selectedCompany._id) : false}
          isApplying={selectedCompany ? applying[selectedCompany._id] : false}
          onApply={handleApply}
        />

        {/* Empty State */}
        {!loading && companies.length === 0 && (
          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5">
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-xl bg-gray-500/10 flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Companies Available</h3>
              <p className="text-gray-600">No companies are currently accepting applications</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
