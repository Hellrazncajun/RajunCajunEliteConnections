import React from 'react';
import { Heart, Sparkles, Users, MessageCircle, Shield } from 'lucide-react';
import { mockAdminSettings } from '../data/mockData';

interface HomePageProps {
  onNavigate: (page: 'home' | 'browse' | 'chat' | 'profile' | 'search') => void;
  adminSettings: any;
}

const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  adminSettings = mockAdminSettings
}) => {
  const showActiveMemberCount = adminSettings.memberStatsVisibility.showActiveMemberCount;

  // YouTube Video Component
  const YoutubeVideoSection = () => {
    if (!adminSettings.youtubeVideo?.enabled || !adminSettings.youtubeVideo?.videoUrl) {
      return null;
    }

    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          {adminSettings.youtubeVideo.title || 'Welcome Video'}
        </h3>
        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg">
          <iframe
            width="100%"
            height="100%"
            src={adminSettings.youtubeVideo.videoUrl}
            title={adminSettings.youtubeVideo.title || 'Welcome Video'}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>
        {adminSettings.youtubeVideo.description && (
          <p className="text-sm text-gray-600 text-center mt-3">
            {adminSettings.youtubeVideo.description}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-coral-500 to-rose-500 p-3 rounded-full">
            <Heart className="text-white" size={32} fill="currentColor" />
          </div>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-coral-600 to-rose-600 bg-clip-text text-transparent mb-2">
          {adminSettings.siteName}
        </h1>
        <p className="text-gray-600">{adminSettings.siteTagline}</p>
      </div>

      {/* Video at Top */}
      {adminSettings.youtubeVideo?.placement === 'top' && <YoutubeVideoSection />}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-coral-50 to-rose-50 p-4 rounded-2xl border border-coral-100">
          <div className="flex items-center mb-2">
            <Shield className="text-coral-500 mr-2" size={20} />
            <span className="text-coral-600 font-semibold">Privacy First</span>
          </div>
          <p className="text-2xl font-bold text-gray-800">100%</p>
          <p className="text-sm text-gray-600">Private profiles</p>
        </div>
        {showActiveMemberCount ? (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
            <div className="flex items-center mb-2">
              <Users className="text-blue-500 mr-2" size={20} />
              <span className="text-blue-600 font-semibold">Active Members</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">127</p>
            <p className="text-sm text-gray-600">Currently active</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gold-50 to-yellow-50 p-4 rounded-2xl border border-gold-100">
            <div className="flex items-center mb-2">
              <Heart className="text-gold-500 mr-2" size={20} />
              <span className="text-gold-600 font-semibold">Connections</span>
            </div>
            <p className="text-2xl font-bold text-gray-800">Quality</p>
            <p className="text-sm text-gray-600">Over quantity</p>
          </div>
        )}
      </div>

      {/* Video in Middle */}
      {adminSettings.youtubeVideo?.placement === 'middle' && <YoutubeVideoSection />}

      {/* About Website Section */}
      {adminSettings.aboutWebsiteSection && (adminSettings.aboutWebsiteSection.title || adminSettings.aboutWebsiteSection.content) && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          {adminSettings.aboutWebsiteSection.title && (
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {adminSettings.aboutWebsiteSection.title}
            </h3>
          )}
          {adminSettings.aboutWebsiteSection.content && (
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {adminSettings.aboutWebsiteSection.content}
            </p>
          )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="space-y-4 mb-8">
        <button
          onClick={() => onNavigate('profile')}
          className="w-full bg-gradient-to-r from-coral-500 to-rose-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          View My Profile
        </button>
        <div className="bg-coral-50 border border-coral-200 rounded-2xl p-4">
          <h3 className="font-semibold text-coral-800 mb-2">How It Works</h3>
          <ul className="text-sm text-coral-700 space-y-1">
            <li>• Your profile is completely private</li>
            <li>• Only people with your unique link can view it</li>
            <li>• Admin will share your link with potential matches</li>
            <li>• No browsing or searching - maximum privacy</li>
          </ul>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-coral-400 to-rose-400 rounded-full flex items-center justify-center mr-3">
              <Heart className="text-white" size={18} fill="currentColor" />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">You have 3 new matches!</p>
              <p className="text-gray-500 text-sm">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-yellow-400 rounded-full flex items-center justify-center mr-3">
              <MessageCircle className="text-white" size={18} />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">Sarah sent you a message</p>
              <p className="text-gray-500 text-sm">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mr-3">
              <Sparkles className="text-white" size={18} />
            </div>
            <div className="flex-1">
              <p className="text-gray-800 font-medium">Profile views increased 20%</p>
              <p className="text-gray-500 text-sm">1 day ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video at Bottom */}
      {adminSettings.youtubeVideo?.placement === 'bottom' && <YoutubeVideoSection />}
    </div>
  );
};

export default HomePage;