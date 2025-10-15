import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { discussionAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Hash, MessageCircle, RefreshCw, Loader2 } from "lucide-react";

export default function DiscussionForum() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const messagesEndRef = useRef(null);
  
  // Get company and channel from URL params
  const urlCompanyId = searchParams.get('company');
  const urlChannel = searchParams.get('channel');
  
  const [forums, setForums] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available forums
  useEffect(() => {
    fetchForums();
  }, []);

  // Load messages when company or channel changes
  useEffect(() => {
    if (selectedCompany) {
      fetchMessages();
    }
  }, [selectedCompany, selectedChannel]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set initial company and channel from URL
  useEffect(() => {
    if (urlCompanyId && forums.length > 0) {
      const company = forums.find(f => f.companyId === urlCompanyId);
      if (company) {
        setSelectedCompany(company);
      }
    }
    if (urlChannel) {
      setSelectedChannel(urlChannel);
    }
  }, [urlCompanyId, urlChannel, forums]);

  const fetchForums = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await discussionAPI.getMyForums();
      setForums(response.data);
      
      // Set first company as default if none selected
      if (response.data.length > 0 && !selectedCompany) {
        setSelectedCompany(response.data[0]);
      }
    } catch (err) {
      console.error('Error fetching forums:', err);
      setError(err.response?.data?.message || 'Failed to load forums');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    if (!selectedCompany) return;
    
    try {
      setMessagesLoading(true);
      const response = await discussionAPI.getChannelMessages(
        selectedCompany.companyId,
        selectedChannel
      );
      setMessages(response.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedCompany) return;
    
    try {
      setSending(true);
      await discussionAPI.sendMessage({
        companyId: selectedCompany.companyId,
        channelType: 'company',
        channelName: selectedChannel,
        message: message.trim()
      });
      
      setMessage('');
      // Refresh messages
      await fetchMessages();
    } catch (err) {
      console.error('Error sending message:', err);
      alert(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCompanySelect = (forum) => {
    setSelectedCompany(forum);
    setSelectedChannel('general');
    // Update URL
    setSearchParams({ company: forum.companyId, channel: 'general' });
  };

  const handleChannelSelect = (channelName) => {
    setSelectedChannel(channelName);
    // Update URL
    if (selectedCompany) {
      setSearchParams({ company: selectedCompany.companyId, channel: channelName });
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🎓</span>
              <h1 className="text-xl font-bold text-gray-900">AU Placements</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate('/dashboard')}>Dashboard</Button>
              <Button variant="ghost" onClick={() => navigate('/profile')}>Profile</Button>
              <Button variant="ghost" onClick={() => navigate('/calendar')}>Calendar</Button>
              <Button variant="ghost" onClick={() => navigate('/companies')}>Companies</Button>
              <Button variant="ghost" onClick={() => navigate('/pipeline')}>Pipeline</Button>
              <Button variant="ghost" className="text-indigo-600">Forum</Button>
              <Button variant="ghost" onClick={() => navigate('/resources')}>Resources</Button>
              <Button variant="ghost" onClick={() => navigate('/support')}>Support</Button>
              <Button variant="destructive" onClick={logout}>Logout</Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Discussion Forums</h2>
            <p className="text-gray-600 mt-2">Connect with peers and discuss company placements</p>
          </div>
          <Button onClick={fetchForums} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-800">❌ {error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                <p className="ml-4 text-gray-600">Loading forums...</p>
              </div>
            </CardContent>
          </Card>
        ) : forums.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 py-12">
                No forums available. Apply to companies to access their discussion forums!
              </p>
              <div className="text-center">
                <Button onClick={() => navigate('/companies')} className="mt-4">
                  Browse Companies
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-12 gap-6">
            {/* Companies Sidebar */}
            <div className="col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    Companies
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                  {forums.map((forum) => (
                    <button
                      key={forum.companyId}
                      onClick={() => handleCompanySelect(forum)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedCompany?.companyId === forum.companyId
                          ? 'bg-indigo-100 border-2 border-indigo-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {forum.companyLogo ? (
                          <img src={forum.companyLogo} alt={forum.companyName} className="w-8 h-8 object-contain" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                            {forum.companyName.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate">{forum.companyName}</p>
                          {forum.hasApplied && (
                            <span className="text-xs text-green-600">✓ Applied</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Channels Sidebar */}
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {selectedCompany?.channels.map((channel) => (
                    <button
                      key={channel.name}
                      onClick={() => handleChannelSelect(channel.name)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                        selectedChannel === channel.name
                          ? 'bg-indigo-100 text-indigo-900 font-semibold'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <span>{channel.icon}</span>
                      <span className="text-sm">{channel.displayName}</span>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="col-span-7">
              <Card className="h-[700px] flex flex-col">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {selectedCompany?.channels.find(c => c.name === selectedChannel)?.icon}
                        {selectedCompany?.companyName} - {selectedCompany?.channels.find(c => c.name === selectedChannel)?.displayName}
                      </CardTitle>
                    </div>
                    <Button size="sm" variant="outline" onClick={fetchMessages} disabled={messagesLoading}>
                      <RefreshCw className={`h-4 w-4 ${messagesLoading ? 'animate-spin' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <MessageCircle className="h-16 w-16 mb-4 opacity-50" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg._id} className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                          {msg.senderId?.fullName?.charAt(0) || '?'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-gray-900">
                              {msg.senderId?.fullName || 'Unknown User'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {msg.senderId?.universityRegisterNumber || 'N/A'}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTimestamp(msg.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 mt-1 whitespace-pre-wrap">{msg.message}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Message #${selectedCompany?.channels.find(c => c.name === selectedChannel)?.displayName || 'channel'}...`}
                      disabled={sending || !selectedCompany}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={sending || !message.trim() || !selectedCompany}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      {sending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
