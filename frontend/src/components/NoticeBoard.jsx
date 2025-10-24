import { useState, useEffect } from 'react';
import { noticeAPI } from '../services/api';
import { Bell, X, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';

export default function NoticeBoard() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await noticeAPI.getNotices();
      setNotices(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'urgent':
        return {
          bg: 'bg-red-500/10',
          border: 'border-red-500/20',
          icon: <AlertTriangle className="h-4 w-4 text-red-600" />,
          text: 'text-red-900'
        };
      case 'warning':
        return {
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/20',
          icon: <AlertCircle className="h-4 w-4 text-orange-600" />,
          text: 'text-orange-900'
        };
      case 'success':
        return {
          bg: 'bg-green-500/10',
          border: 'border-green-500/20',
          icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          text: 'text-green-900'
        };
      default:
        return {
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/20',
          icon: <Info className="h-4 w-4 text-blue-600" />,
          text: 'text-blue-900'
        };
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now - d;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 24) {
      if (hours < 1) return 'Just now';
      return `${hours}h ago`;
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      {/* Floating Notice Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl shadow-blue-600/30 hover:bg-blue-700 transition-all flex items-center justify-center"
      >
        {isExpanded ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <Bell className="h-6 w-6" />
            {notices.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notices.length}
              </span>
            )}
          </div>
        )}
      </button>

      {/* Notice Board Panel */}
      {isExpanded && (
        <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] max-h-[70vh] bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/10 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Notice Board</h3>
              </div>
              <span className="text-xs text-gray-500">{notices.length} notices</span>
            </div>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(70vh-5rem)] p-3 space-y-2">
            {notices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No notices yet</p>
              </div>
            ) : (
              notices.map((notice) => {
                const styles = getTypeStyles(notice.type);
                return (
                  <div
                    key={notice._id}
                    className={`${styles.bg} ${styles.border} border backdrop-blur-xl rounded-xl p-3 transition-all hover:scale-[1.02]`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">{styles.icon}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-sm ${styles.text} mb-1`}>
                          {notice.title}
                        </h4>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {notice.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {formatDate(notice.createdAt)}
                          </span>
                          {notice.createdBy && (
                            <span className="text-xs text-gray-500">
                              by {notice.createdBy}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}
