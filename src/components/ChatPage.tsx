import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, Video, MoreHorizontal, Heart } from 'lucide-react';
import { mockUsers, mockMessages } from '../data/mockData';
import { filterProfilesByGender } from '../utils/profileFilters';
import type { User, Match, Message } from '../types/User';

interface ChatPageProps {
  currentUser: User;
}

const ChatPage: React.FC<ChatPageProps> = ({ currentUser }) => {
  const [selectedMatch, setSelectedMatch] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const sendMessage = () => {
    if (newMessage.trim() && selectedMatch) {
      const message: Message = {
        id: messages.length + 1,
        senderId: currentUser.id,
        receiverId: selectedMatch.id,
        message: newMessage.trim(),
        timestamp: new Date(),
        read: false
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const getConversationMessages = (matchId: number) => {
    return messages.filter(
      msg => (msg.senderId === currentUser.id && msg.receiverId === matchId) ||
             (msg.senderId === matchId && msg.receiverId === currentUser.id)
    ).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  };

  const getLastMessage = (matchId: number) => {
    const conversation = getConversationMessages(matchId);
    return conversation[conversation.length - 1];
  };

  if (selectedMatch) {
    const conversationMessages = getConversationMessages(selectedMatch.id);
    
    return (
      <div className="flex flex-col h-screen">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedMatch(null)}
              className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div className="flex items-center">
              <img
                src={selectedMatch.photos[0]}
                alt={selectedMatch.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{selectedMatch.name}</h3>
                <p className="text-sm text-green-500">Online</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Phone size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Video size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreHorizontal size={20} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
              <img
                src={selectedMatch.photos[0]}
                alt={selectedMatch.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{selectedMatch.name}</h3>
            <p className="text-sm text-gray-600 mb-3">You matched with {selectedMatch.name}</p>
            <div className="flex justify-center">
              <Heart className="text-coral-500" size={20} fill="currentColor" />
            </div>
          </div>

          {conversationMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl ${
                  message.senderId === currentUser.id
                    ? 'bg-gradient-to-r from-coral-500 to-rose-500 text-white'
                    : 'bg-white text-gray-800 shadow-sm'
                }`}
              >
                <p>{message.message}</p>
                <p className={`text-xs mt-1 ${
                  message.senderId === currentUser.id ? 'text-white text-opacity-70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 px-4 py-4">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-coral-500"
            />
            <button
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="w-10 h-10 bg-gradient-to-r from-coral-500 to-rose-500 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>
      
      {mockUsers.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-coral-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-coral-500" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No matches yet</h3>
          <p className="text-gray-600">Start swiping to find your perfect match!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filterProfilesByGender(
            mockUsers.filter(user => user.id !== currentUser.id),
            currentUser.gender
          ).map((match) => {
            const lastMessage = getLastMessage(match.id);
            return (
              <div
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
              >
                <div className="flex items-center">
                  <div className="relative">
                    <img
                      src={match.photos[0]}
                      alt={match.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{match.name}</h3>
                      {lastMessage && (
                        <span className="text-xs text-gray-500">
                          {lastMessage.timestamp.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm truncate">
                      {lastMessage ? lastMessage.message : 'Start a conversation'}
                    </p>
                  </div>
                  {lastMessage && !lastMessage.read && lastMessage.senderId !== currentUser.id && (
                    <div className="w-2 h-2 bg-coral-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatPage;