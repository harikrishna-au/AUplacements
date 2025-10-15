import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supportAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  Star,
  RefreshCw,
  Loader2
} from "lucide-react";

export default function FeedbackSupport() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const [selectedType, setSelectedType] = useState('feedback');
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
    {
      id: 'feedback',
      name: 'General Feedback',
      icon: <MessageSquare className="w-6 h-6" />,
      color: 'bg-blue-500',
      description: 'Share your thoughts and suggestions'
    },
    {
      id: 'bug',
      name: 'Report a Bug',
      icon: <Bug className="w-6 h-6" />,
      color: 'bg-red-500',
      description: 'Report technical issues or errors'
    },
    {
      id: 'feature',
      name: 'Feature Request',
      icon: <Lightbulb className="w-6 h-6" />,
      color: 'bg-yellow-500',
      description: 'Suggest new features or improvements'
    },
    {
      id: 'help',
      name: 'Get Help',
      icon: <HelpCircle className="w-6 h-6" />,
      color: 'bg-green-500',
      description: 'Ask questions or get assistance'
    }
  ];

  const categories = {
    feedback: ['User Experience', 'Content Quality', 'Navigation', 'Performance', 'Other'],
    bug: ['Login Issues', 'Profile Problems', 'Calendar Errors', 'Forum Issues', 'Other'],
    feature: ['New Feature', 'Enhancement', 'Integration', 'Mobile App', 'Other'],
    help: ['How to Use', 'Account Help', 'Technical Support', 'General Query', 'Other']
  };

  const faqs = [
    {
      question: 'How do I update my profile information?',
      answer: 'Go to the Profile page from the dashboard. Your profile is currently read-only, but you can contact the placement cell to update your information.',
      category: 'Account'
    },
    {
      question: 'How do I track my placement applications?',
      answer: 'Visit the Pipeline page to see the status of all your applications. Each company shows your current stage in their recruitment process.',
      category: 'Features'
    },
    {
      question: 'Where can I find company-specific resources?',
      answer: 'Check the Resources page where you\'ll find study materials, interview guides, and preparation resources organized by company.',
      category: 'Resources'
    },
    {
      question: 'How do I join company discussions?',
      answer: 'Go to the Forum page and select any company channel to read discussions and post messages. You can search for specific topics too.',
      category: 'Forum'
    },
    {
      question: 'Can I download placement calendar events?',
      answer: 'Currently, the calendar is view-only. We\'re working on adding export and notification features soon.',
      category: 'Calendar'
    },
    {
      question: 'Who can I contact for placement-related queries?',
      answer: 'Use the contact information below to reach the Placement Cell. You can also submit a query through this support form.',
      category: 'Support'
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setFormData(prev => ({ 
      ...prev, 
      type, 
      category: '',
      subject: '',
      message: '',
      rating: type === 'feedback' ? prev.rating : 0
    }));
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

      // Create ticket
      await supportAPI.createTicket({
        type: formData.type,
        category: formData.category,
        subject: formData.subject,
        message: formData.message,
        priority: formData.priority,
        rating: formData.type === 'feedback' ? formData.rating : null
      });

      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const currentType = supportTypes.find(t => t.id === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Feedback & Support</h2>
          <p className="text-gray-600 mt-2">We're here to help! Share your feedback or get assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Support Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {supportTypes.map((type) => (
                <Card 
                  key={type.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedType === type.id ? 'ring-2 ring-indigo-500 shadow-lg' : ''
                  }`}
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`${type.color} text-white p-3 rounded-lg`}>
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">{type.name}</h3>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                      {selectedType === type.id && (
                        <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Form */}
            <Card>
              <CardHeader className={`${currentType?.color} text-white`}>
                <div className="flex items-center gap-3">
                  {currentType?.icon}
                  <div>
                    <CardTitle className="text-white">{currentType?.name}</CardTitle>
                    <CardDescription className="text-white/80 mt-1">
                      {currentType?.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Submitted Successfully!</h3>
                    <p className="text-gray-600">
                      Thank you for your {selectedType}. We'll get back to you within 24-48 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Rating for Feedback */}
                    {selectedType === 'feedback' && (
                      <div>
                        <Label>How would you rate your experience? *</Label>
                        <div className="flex items-center gap-2 mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => handleRatingClick(star)}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(0)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-8 h-8 transition-colors ${
                                  star <= (hoveredStar || formData.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Category */}
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">Select a category</option>
                        {categories[selectedType]?.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Subject */}
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Brief description of your feedback"
                        required
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message">Your message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Please provide detailed information..."
                        rows={6}
                        required
                      />
                    </div>

                    {/* Priority (for bug/help) */}
                    {(selectedType === 'bug' || selectedType === 'help') && (
                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <select
                          id="priority"
                          name="priority"
                          value={formData.priority}
                          onChange={handleInputChange}
                          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                          <option value="urgent">Urgent</option>
                        </select>
                      </div>
                    )}

                    {/* Submitting as */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Submitting as:</p>
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <p className="text-sm text-gray-600">{user?.registerNumber}</p>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                        <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-red-800">{error}</span>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit {currentType?.name}
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* FAQs */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Quick answers to common questions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                      <span className="inline-block mt-2 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        {faq.category}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Stats */}
            {ticketStats && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Ticket Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Tickets</span>
                      <span className="font-bold text-lg">{ticketStats.total}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-600">Pending</span>
                      <span className="font-bold text-yellow-600">{ticketStats.pending}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-600">In Progress</span>
                      <span className="font-bold text-blue-600">{ticketStats.inProgress}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-green-600">Resolved</span>
                      <span className="font-bold text-green-600">{ticketStats.resolved}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Us */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Contact Us</CardTitle>
                <CardDescription>Reach out to the Placement Cell</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">placements@andhrauniversity.edu.in</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+91 891 234 5678</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Office</p>
                    <p className="text-sm text-gray-600">
                      Placement Cell<br />
                      Andhra University<br />
                      Visakhapatnam, AP 530003
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-indigo-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Office Hours</p>
                    <p className="text-sm text-gray-600">
                      Monday - Friday<br />
                      9:00 AM - 5:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Tickets */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Your Recent Tickets</CardTitle>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={fetchMyTickets}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>Track your submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {ticketsLoading ? (
                  <div className="text-center py-4">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  </div>
                ) : myTickets.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No tickets yet. Submit your first feedback above!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {myTickets.slice(0, 5).map((ticket) => (
                      <div key={ticket._id} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-gray-900">
                              {ticket.ticketNumber}
                            </p>
                            <p className="text-sm text-gray-600 line-clamp-1">
                              {ticket.subject}
                            </p>
                          </div>
                          {getStatusBadge(ticket.status)}
                        </div>
                        {ticket.response?.message && (
                          <p className="text-xs text-gray-600 mb-2">
                            {ticket.response.message}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">
                          {formatDate(ticket.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="bg-indigo-50 border-indigo-200">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-900">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-indigo-800">
                  <li>• Be specific and detailed</li>
                  <li>• Include error messages if any</li>
                  <li>• Check FAQ before submitting</li>
                  <li>• Response time: 24-48 hours</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
