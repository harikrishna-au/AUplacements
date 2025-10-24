import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supportAPI } from '../services/api';
import { MessageSquare, Bug, Lightbulb, HelpCircle } from "lucide-react";
import SupportTypeSelector from '../components/SupportTypeSelector';
import SupportForm from '../components/SupportForm';
import SupportFAQ from '../components/SupportFAQ';
import SupportSidebar from '../components/SupportSidebar';
import RefreshButton from '../components/RefreshButton';

export default function FeedbackSupport() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [selectedType, setSelectedType] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'feedback',
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
    rating: 0
  });
  const [myTickets, setMyTickets] = useState([]);
  const [ticketStats, setTicketStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    // Only fetch tickets if not on feedback page
    fetchMyTickets();
    fetchTicketStats();
  }, []);

  const fetchMyTickets = async () => {
    try {
      setTicketsLoading(true);
      const response = await supportAPI.getMyTickets();
      setMyTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setTicketsLoading(false);
    }
  };

  const fetchTicketStats = async () => {
    try {
      const response = await supportAPI.getTicketStats();
      setTicketStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const supportTypes = [
    { id: 'feedback', name: 'Feedback', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-blue-500', description: 'Share thoughts' },
    { id: 'bug', name: 'Bug Report', icon: <Bug className="w-5 h-5" />, color: 'bg-red-500', description: 'Report issues' },
    { id: 'feature', name: 'Feature Request', icon: <Lightbulb className="w-5 h-5" />, color: 'bg-yellow-500', description: 'Suggest features' },
    { id: 'help', name: 'Get Help', icon: <HelpCircle className="w-5 h-5" />, color: 'bg-green-500', description: 'Ask questions' }
  ];

  const categories = {
    feedback: ['User Experience', 'Content Quality', 'Navigation', 'Performance', 'Other'],
    bug: ['Login Issues', 'Profile Problems', 'Calendar Errors', 'Forum Issues', 'Other'],
    feature: ['New Feature', 'Enhancement', 'Integration', 'Mobile App', 'Other'],
    help: ['How to Use', 'Account Help', 'Technical Support', 'General Query', 'Other']
  };



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData(prev => ({ 
      ...prev, 
      type
    }));
    setShowFormModal(true);
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validation
      if (!formData.category || !formData.subject || !formData.message) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // For feedback, save to Feedback collection (no ticket)
      if (formData.type === 'feedback') {
        console.log('🔵 FRONTEND: Submitting feedback type detected');
        console.log('🔵 FRONTEND: Form data:', formData);
        console.log('🔵 FRONTEND: Calling supportAPI.submitFeedback...');
        const response = await supportAPI.submitFeedback({
          category: formData.category,
          subject: formData.subject,
          message: formData.message,
          rating: formData.rating || null
        });
        console.log('🔵 FRONTEND: Feedback response:', response.data);
        
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setShowFormModal(false);
          setFormData({
            type: 'feedback',
            subject: '',
            category: '',
            priority: 'medium',
            message: '',
            rating: 0
          });
          // Don't refresh tickets for feedback
        }, 3000);
      } else {
        // Create ticket for bug, feature, help
        await supportAPI.createTicket({
          type: formData.type,
          category: formData.category,
          subject: formData.subject,
          message: formData.message,
          priority: formData.priority
        });

        setSubmitted(true);
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setSubmitted(false);
          setShowFormModal(false);
          setFormData({
            type: selectedType,
            subject: '',
            category: '',
            priority: 'medium',
            message: '',
            rating: 0
          });
          // Refresh tickets
          fetchMyTickets();
          fetchTicketStats();
        }, 3000);
      }

    } catch (error) {
      console.error('Error submitting ticket:', error);
      setError(error.response?.data?.message || 'Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Resolved</span>;
      case 'in-progress':
        return <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">In Progress</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Pending</span>;
      case 'closed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">Closed</span>;
      default:
        return null;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };



  const currentType = supportTypes.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen pt-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Feedback & Support</h2>
            <p className="text-gray-600 mt-1">We're here to help! Share your feedback or get assistance</p>
          </div>
          <RefreshButton onClick={fetchMyTickets} loading={ticketsLoading} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SupportTypeSelector
              supportTypes={supportTypes}
              selectedType={selectedType}
              onTypeSelect={handleTypeSelect}
            />

            {showFormModal && selectedType && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h3 className="text-xl font-semibold text-gray-900">Submit {currentType?.name}</h3>
                    <button
                      onClick={() => setShowFormModal(false)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-6">
                    <SupportForm
                      currentType={currentType}
                      formData={formData}
                      onInputChange={handleInputChange}
                      onRatingClick={handleRatingClick}
                      onSubmit={handleSubmit}
                      loading={loading}
                      submitted={submitted}
                      error={error}
                      categories={categories}
                      user={user}
                    />
                  </div>
                </div>
              </div>
            )}

            <SupportFAQ />
          </div>

          <SupportSidebar
            ticketStats={ticketStats}
            myTickets={myTickets}
            ticketsLoading={ticketsLoading}
            onRefresh={fetchMyTickets}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
          />
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Developed with <span className="text-red-500 animate-pulse inline-block">❤️</span> by{' '}
              <span className="font-semibold text-indigo-600">Hari Krishna</span>
            </p>
            <p className="text-gray-400 text-xs mt-2">
              © {new Date().getFullYear()} AU Placements Portal. All rights reserved.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
