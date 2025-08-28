import React, { useState } from 'react';
import { ArrowLeft, Send, Paperclip, Smile } from 'lucide-react';
import { mockUsers, mockMessages } from '../data/mockData';
import type { User, Message } from '../types/User';

interface MessagingInterfaceProps {
  currentUserId: number;
  targetUserId: number;
  onBack: () => void;
  isAdmin?: boolean;
}

const MessagingInterface: React.FC<MessagingInterfaceProps> = ({ 
  currentUserId, 
  targetUserId, 
  onBack, 
  isAdmin = false 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const currentUser = mockUsers.find(u => u.id === currentUserId);
  const targetUser = mockUsers.find(u => u.id === targetUserId);

  if (!currentUser || !targetUser) {
    return <div>User not found</div>;
  }

  const conversationMessages = messages
    .filter(msg => 
      (msg.senderId === currentUserId && msg.receiverId === targetUserId) ||
      (msg.senderId === targetUserId && msg.receiverId === currentUserId)
    )
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      senderId: currentUserId,
      receiverId: targetUserId,
      message: newMessage.trim(),
      timestamp: new Date(),
      read: false
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center">
            <img
              src={targetUser.photos[0]}
              alt={targetUser.name}
              className="w-10 h-10 rounded-full object-cover mr-3"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{targetUser.name}</h3>
              <p className="text-sm text-green-500">Online</p>
            </div>
          </div>
        </div>
        {isAdmin && (
          <span className="bg-coral-100 text-coral-600 px-3 py-1 rounded-full text-sm font-medium">
            Admin
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {conversationMessages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-coral-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Send className="text-coral-500" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Start the conversation</h3>
            <p className="text-gray-600">Send the first message to {targetUser.name}</p>
          </div>
        ) : (
          conversationMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-2xl ${
                  message.senderId === currentUserId
                    ? 'bg-gradient-to-r from-coral-500 to-rose-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm border border-gray-100'
                }`}
              >
                <p className="leading-relaxed">{message.message}</p>
                <p className={`text-xs mt-2 ${
                  message.senderId === currentUserId ? 'text-white text-opacity-70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="flex items-end space-x-3">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Paperclip size={20} />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Message ${targetUser.name}...`}
              className="w-full bg-gray-100 border-none rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-coral-500 resize-none max-h-32"
              rows={1}
            />
          </div>
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Smile size={20} />
          </button>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="w-12 h-12 bg-gradient-to-r from-coral-500 to-rose-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md transition-shadow"
          >
            <Send size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessagingInterface;