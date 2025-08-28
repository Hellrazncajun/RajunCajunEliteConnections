import React, { useState } from 'react';
import { Camera, Edit3, Settings, Star, MapPin, Briefcase, Heart, Eye } from 'lucide-react';
import MemberLayoutSelector from './MemberLayoutSelector';
import { getVideoEmbedDetails, getPlatformDisplayName } from '../utils/videoEmbed';
import type { User } from '../types/User';

interface ProfilePageProps {
  user: User;
  onNavigate: (page: 'home' | 'browse' | 'chat' | 'profile' | 'search') => void;
  layoutPreference?: 'card' | 'list' | 'grid' | 'sidebar';
  onLayoutChange?: (layout: 'card' | 'list' | 'grid' | 'sidebar') => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ 
  user, 
  onNavigate, 
  layoutPreference = 'card',
  onLayoutChange 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleLayoutChange = (newLayout: 'card' | 'list' | 'grid' | 'sidebar') => {
    if (onLayoutChange) {
      onLayoutChange(newLayout);
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would save to backend
  };

  if (isEditing) {
    return (
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Profile</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gradient-to-r from-coral-500 to-rose-500 text-white rounded-full hover:shadow-md transition-shadow"
            >
              Save
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Photo Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Photos</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {editedUser.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden">
                  <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                  <button className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full">
                    <Edit3 size={12} />
                  </button>
                </div>
              ))}
              {Array.from({ length: Math.max(0, 10 - editedUser.photos.length) }).map((_, index) => (
                <button key={`empty-${index}`} className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-coral-400 transition-colors">
                  <Camera className="text-gray-400 mb-1" size={20} />
                  <span className="text-xs text-gray-500">Add Photo</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              You can upload up to 10 photos total ({editedUser.photos.length}/10 used)
            </p>
          </div>

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editedUser.name}
                  onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  value={editedUser.age}
                  onChange={(e) => setEditedUser({...editedUser, age: parseInt(e.target.value)})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editedUser.location}
                  onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job</label>
                <input
                  type="text"
                  value={editedUser.job}
                  onChange={(e) => setEditedUser({...editedUser, job: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editedUser.bio}
                  onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube or TikTok)</label>
                <input
                  type="url"
                  value={editedUser.profileVideo?.url || ''}
                  onChange={(e) => {
                    const url = e.target.value;
                    if (!url.trim()) {
                      setEditedUser({
                        ...editedUser,
                        profileVideo: undefined
                      });
                      return;
                    }

                    const videoDetails = getVideoEmbedDetails(url);
                    if (videoDetails.isValid) {
                      setEditedUser({
                        ...editedUser,
                        profileVideo: {
                          platform: videoDetails.platform as 'youtube' | 'tiktok',
                          videoId: videoDetails.videoId,
                          embedUrl: videoDetails.embedUrl,
                          url: url,
                          title: editedUser.profileVideo?.title || 'My Introduction Video',
                          description: editedUser.profileVideo?.description || ''
                        }
                      });
                    } else {
                      setEditedUser({
                        ...editedUser,
                        profileVideo: {
                          platform: 'youtube',
                          videoId: '',
                          embedUrl: '',
                          url: url,
                          title: editedUser.profileVideo?.title || 'My Introduction Video',
                          description: editedUser.profileVideo?.description || ''
                        }
                      });
                    }
                  }}
                  placeholder="Paste YouTube or TikTok video URL here"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
                <div className="mt-2 space-y-1">
                  {editedUser.profileVideo?.url && (
                    <div className="flex items-center text-xs">
                      {getVideoEmbedDetails(editedUser.profileVideo.url).isValid ? (
                        <span className="text-green-600">
                          ✓ Valid {getPlatformDisplayName(getVideoEmbedDetails(editedUser.profileVideo.url).platform)} video detected
                        </span>
                      ) : (
                        <span className="text-red-600">
                          ⚠️ Invalid video URL. Please check the link.
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Supports YouTube and TikTok videos. Just paste the video URL from your browser.
                  </p>
                </div>
              </div>

              {editedUser.profileVideo?.url && getVideoEmbedDetails(editedUser.profileVideo.url).isValid && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                    <input
                      type="text"
                      value={editedUser.profileVideo?.title || ''}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        profileVideo: {
                          ...editedUser.profileVideo!,
                          title: e.target.value
                        }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video Description (Optional)</label>
                    <textarea
                      value={editedUser.profileVideo?.description || ''}
                      onChange={(e) => setEditedUser({
                        ...editedUser,
                        profileVideo: {
                          ...editedUser.profileVideo!,
                          description: e.target.value
                        }
                      })}
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 resize-none"
                      placeholder="Tell viewers what they'll learn about you in this video..."
                    />
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <div className="flex space-x-2">
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <Settings size={20} />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 text-coral-500 hover:text-coral-600 transition-colors"
          >
            <Edit3 size={20} />
          </button>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-coral-50 to-rose-50 p-4 rounded-2xl text-center border border-coral-100">
          <Heart className="text-coral-500 mx-auto mb-2" size={20} fill="currentColor" />
          <p className="text-2xl font-bold text-gray-800">127</p>
          <p className="text-sm text-coral-600">Likes</p>
        </div>
        <div className="bg-gradient-to-br from-gold-50 to-yellow-50 p-4 rounded-2xl text-center border border-gold-100">
          <Star className="text-gold-500 mx-auto mb-2" size={20} fill="currentColor" />
          <p className="text-2xl font-bold text-gray-800">23</p>
          <p className="text-sm text-gold-600">Matches</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl text-center border border-purple-100">
          <Eye className="text-purple-500 mx-auto mb-2" size={20} />
          <p className="text-2xl font-bold text-gray-800">892</p>
          <p className="text-sm text-purple-600">Views</p>
        </div>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-6">
        <div className="relative h-80">
          <img
            src={user.photos[0]}
            alt={user.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <h2 className="text-3xl font-bold text-white mb-1">
              {user.name}, {user.age}
            </h2>
            <div className="flex items-center text-white text-opacity-90">
              <MapPin size={16} className="mr-1" />
              <span className="text-sm">{user.location}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center text-gray-600 mb-4">
            <Briefcase size={16} className="mr-2" />
            <span>{user.job}</span>
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">{user.bio}</p>

          {/* Interests */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-coral-50 to-rose-50 text-coral-600 px-4 py-2 rounded-full text-sm font-medium border border-coral-100"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Additional Photos */}
          {user.photos.length > 1 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">More Photos</h3>
              <div className="grid grid-cols-3 gap-2">
                {user.photos.slice(1).map((photo, index) => (
                  <div key={index} className="aspect-square rounded-xl overflow-hidden">
                    <img
                      src={photo}
                      alt={`${user.name} photo ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* YouTube Video Section */}
      {user.profileVideo?.embedUrl && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {user.profileVideo.title || 'Introduction Video'}
          </h3>
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg mb-3">
            <iframe
              width="100%"
              height="100%"
              src={user.profileVideo.embedUrl}
              title={user.profileVideo.title || 'Introduction Video'}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              {getPlatformDisplayName(user.profileVideo.platform)} Video
            </span>
          </div>
          {user.profileVideo.description && (
            <p className="text-gray-700 leading-relaxed">
              {user.profileVideo.description}
            </p>
          )}
        </div>
      )}

      {/* Layout Preferences */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Display Preferences</h3>
        <div className="mb-4 p-3 bg-blue-50 rounded-xl">
          <p className="text-sm text-blue-700">
            <strong>Current Layout:</strong> <span className="capitalize">{layoutPreference}</span>
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Change your layout preference and then go to "Browse" to see the effect!
          </p>
        </div>
        <MemberLayoutSelector 
          currentLayout={layoutPreference}
          onLayoutChange={handleLayoutChange}
        />
        <p className="text-sm text-gray-600 mt-2">
          Choose how you prefer to view other member profiles. Go to Browse to see the effect.
        </p>
      </div>

      {/* Action Button */}
      <div className="space-y-4 mb-6">
        <button
          onClick={() => onNavigate('browse')}
          className="w-full bg-gradient-to-r from-coral-500 to-rose-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
        >
          Start Matching
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;