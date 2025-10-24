import { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, RefreshCw, Loader2, MessageCircle } from "lucide-react";
import ForumMessage from './ForumMessage';

export default function ForumChatArea({
  selectedCompany,
  selectedChannel,
  messages,
  messagesLoading,
  message,
  setMessage,
  sending,
  onSendMessage,
  onRefresh,
  formatTimestamp
}) {
  const messagesEndRef = useRef(null);
  const prevMessagesLengthRef = useRef(0);

  useEffect(() => {
    if (messages.length > prevMessagesLengthRef.current && prevMessagesLengthRef.current > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    prevMessagesLengthRef.current = messages.length;
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const channelInfo = selectedCompany?.channels.find(c => c.name === selectedChannel);

  return (
    <Card className="flex flex-col" style={{ height: 'calc(100vh - 320px)' }}>
      <CardHeader className="border-b bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">{channelInfo?.icon}</span>
            <span className="text-gray-700">{channelInfo?.displayName}</span>
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onRefresh} disabled={messagesLoading}>
            <RefreshCw className={`h-4 w-4 ${messagesLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
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
            <ForumMessage key={msg._id} message={msg} formatTimestamp={formatTimestamp} />
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message #${channelInfo?.displayName || 'channel'}...`}
            disabled={sending || !selectedCompany}
            className="flex-1"
          />
          <Button
            onClick={onSendMessage}
            disabled={sending || !message.trim() || !selectedCompany}
            className="bg-indigo-600 text-white hover:bg-indigo-700"
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
  );
}
