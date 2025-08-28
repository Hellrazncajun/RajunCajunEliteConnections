import React from 'react';
import { X, Activity, Eye, MessageSquare, Heart, Calendar, Clock } from 'lucide-react';
import type { User } from '../types/User';

interface ActivityModalProps {
  user: User;
  onClose: () => void;
}

const ActivityModal: React.FC<ActivityModalProps> = ({ user, onClose }) => {
  // Mock activity data - in a real app, this would come from your backend
  const mockActivity = {
    profileViews: 45,
    messagesReceived: 12,
    messagesSent: 8,
    likesReceived: 23,
    likesGiven: 15,
    lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    joinDate: new Date('2024-01-15'),
    totalSessions: 34,
    averageSessionTime: '12 minutes',
    recentActivity: [
      { action: 'Viewed profile', target: 'Sarah Mitchell', timestamp: new Date(Date.now() - 30 * 60 * 1000) },
      { action: 'Sent message', target: 'Emma Johnson', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
      { action: 'Updated profile', target: 'Bio section', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000) },
      { action: 'Liked profile', target: 'Maria Garcia', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
      { action: 'Logged in', target: 'Mobile app', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000) }
    ]
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Activity className="text-indigo-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Member Activity</h3>
              <p className="text-sm text-gray-600">{user.name} - Engagement Analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Member Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-3">
              <img
                src={user.photos[0]}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold text-gray-800 text-lg">{user.name}, {user.age}</h4>
                <p className="text-sm text-gray-600">{user.location}</p>
                <p className="text-sm text-gray-600">Member since: {mockActivity.joinDate.toLocaleDateString()}</p>
                <div className="flex items-center mt-1">
                  <div className={`w-2 h-2 rounded-full mr-2 ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600">
                    Last active: {formatTimeAgo(mockActivity.lastLogin)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
              <Eye className="text-blue-500 mb-2" size={20} />
              <p className="text-2xl font-bold text-blue-900">{mockActivity.profileViews}</p>
              <p className="text-sm text-blue-700">Profile Views</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
              <MessageSquare className="text-green-500 mb-2" size={20} />
              <p className="text-2xl font-bold text-green-900">{mockActivity.messagesReceived}</p>
              <p className="text-sm text-green-700">Messages Received</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
              <MessageSquare className="text-purple-500 mb-2" size={20} />
              <p className="text-2xl font-bold text-purple-900">{mockActivity.messagesSent}</p>
              <p className="text-sm text-purple-700">Messages Sent</p>
            </div>
            <div className="bg-coral-50 p-4 rounded-xl border border-coral-100">
              <Heart className="text-coral-500 mb-2" size={20} />
              <p className="text-2xl font-bold text-coral-900">{mockActivity.likesReceived}</p>
              <p className="text-sm text-coral-700">Likes Received</p>
            </div>
          </div>

          {/* Session Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <Calendar className="text-gray-500 mr-2" size={16} />
                <span className="font-medium text-gray-800">Total Sessions</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{mockActivity.totalSessions}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <Clock className="text-gray-500 mr-2" size={16} />
                <span className="font-medium text-gray-800">Avg Session Time</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{mockActivity.averageSessionTime}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center mb-2">
                <Activity className="text-gray-500 mr-2" size={16} />
                <span className="font-medium text-gray-800">Engagement</span>
              </div>
              <p className="text-xl font-bold text-green-600">High</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Recent Activity</h4>
            <div className="space-y-3">
              {mockActivity.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    {activity.action.includes('Viewed') && <Eye className="text-indigo-500" size={14} />}
                    {activity.action.includes('message') && <MessageSquare className="text-indigo-500" size={14} />}
                    {activity.action.includes('Updated') && <Activity className="text-indigo-500" size={14} />}
                    {activity.action.includes('Liked') && <Heart className="text-indigo-500" size={14} />}
                    {activity.action.includes('Logged') && <Clock className="text-indigo-500" size={14} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800">
                      {activity.action}: <span className="text-indigo-600">{activity.target}</span>
                    </p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Engagement Insights */}
          <div className="mt-6 bg-indigo-50 border border-indigo-200 rounded-xl p-4">
            <h4 className="font-semibold text-indigo-800 mb-2">📊 Engagement Insights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-700">
              <div>
                <h5 className="font-medium mb-2">Positive Indicators:</h5>
                <ul className="space-y-1">
                  <li>• Regular login activity</li>
                  <li>• Active messaging engagement</li>
                  <li>• Profile views indicate interest</li>
                  <li>• Recent profile updates</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium mb-2">Recommendations:</h5>
                <ul className="space-y-1">
                  <li>• Member shows high engagement</li>
                  <li>• Consider for VIP upgrade offer</li>
                  <li>• Good candidate for success stories</li>
                  <li>• Monitor for quality matches</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;