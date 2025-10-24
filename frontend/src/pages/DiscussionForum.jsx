import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { discussionAPI } from '../services/api';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ForumCompanyList from '../components/ForumCompanyList';
import ForumChannelList from '../components/ForumChannelList';
import ForumChatArea from '../components/ForumChatArea';
import RefreshButton from '../components/RefreshButton';

export default function DiscussionForum() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  
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
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      

      <main className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-4 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-900">Discussion Forums</h2>
            <p className="text-sm md:text-base text-gray-600 mt-1">Connect with peers</p>
          </div>
          <RefreshButton onClick={fetchForums} loading={loading} />
        </div>

        {/* Loading State */}
        {loading ? (
          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
                <p className="ml-4 text-gray-600">Loading forums...</p>
              </div>
            </CardContent>
          </Card>
        ) : forums.length === 0 ? (
          <Card className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5">
            <CardContent className="pt-6">
              <p className="text-center text-gray-600 py-12">
                No forums available. Apply to companies to access their discussion forums!
              </p>
              <div className="text-center">
                <Button onClick={() => navigate('/companies')} className="mt-4 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-600/20">
                  Browse Companies
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {/* Company Tabs */}
            <ForumCompanyList
              forums={forums}
              selectedCompany={selectedCompany}
              onCompanySelect={handleCompanySelect}
            />

            {/* Channel Tabs + Chat Area */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-48 md:flex-shrink-0">
                <ForumChannelList
                  channels={selectedCompany?.channels}
                  selectedChannel={selectedChannel}
                  onChannelSelect={handleChannelSelect}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <ForumChatArea
                  selectedCompany={selectedCompany}
                  selectedChannel={selectedChannel}
                  messages={messages}
                  messagesLoading={messagesLoading}
                  message={message}
                  setMessage={setMessage}
                  sending={sending}
                  onSendMessage={handleSendMessage}
                  onRefresh={fetchMessages}
                  formatTimestamp={formatTimestamp}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
