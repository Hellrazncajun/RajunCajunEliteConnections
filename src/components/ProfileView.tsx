import React from 'react';
import { ArrowLeft, MapPin, Briefcase, Heart, Star, Shield, Upload, MessageSquare, Edit3, Save, X } from 'lucide-react';
import { getPlatformDisplayName } from '../utils/videoEmbed';
import type { User } from '../types/User';

interface ProfileViewProps {
  user: User;
  onBack: () => void;
  isAdmin?: boolean;
  onMessage?: () => void;
  onUpdateUser?: (updatedUser: User) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, onBack, isAdmin = false, onMessage, onUpdateUser }) => {
  const [isEditingProfileLink, setIsEditingProfileLink] = React.useState(false);
  const [tempProfileLink, setTempProfileLink] = React.useState(user.profileLink);

  const handleSaveProfileLink = () => {
    if (onUpdateUser && tempProfileLink.trim()) {
      const updatedUser = {
        ...user,
        profileLink: tempProfileLink.trim()
      };
      onUpdateUser(updatedUser);
      setIsEditingProfileLink(false);
    }
  };

  const handleCancelEdit = () => {
    setTempProfileLink(user.profileLink);
    setIsEditingProfileLink(false);
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center space-x-2">
          {isAdmin && (
            <span className="bg-coral-100 text-coral-600 px-3 py-1 rounded-full text-sm font-medium">
              Admin View
            </span>
          )}
          {onMessage && (
            <button
              onClick={onMessage}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
              title="Send Message"
            >
              <MessageSquare size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Admin-only sections */}
      {isAdmin && (
        <>
          {/* ID Verification Section */}
          {user.idVerification && (
            <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Shield className={`mr-2 ${user.idVerification.verified ? 'text-green-500' : 'text-yellow-500'}`} size={20} />
                  ID Verification
                </h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.idVerification.verified 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {user.idVerification.verified ? 'Verified' : 'Pending Review'}
                </span>
              </div>
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-3">
                <img
                  src={user.idVerification.imageUrl}
                  alt="ID Verification"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600">
                Uploaded: {user.idVerification.uploadedAt.toLocaleDateString()}
              </p>
            </div>
          )}

          {/* Membership Status */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Membership Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.membershipStatus === 'paid' 
                    ? 'bg-green-100 text-green-600'
                    : user.membershipStatus === 'free'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {user.membershipStatus === 'paid' ? 'Paid Member' : 
                   user.membershipStatus === 'free' ? 'Free Member' : 'Expired'}
                </span>
              </div>
              {user.membershipExpiresAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Expires:</span>
                  <span className="font-medium">{user.membershipExpiresAt.toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium capitalize">{user.gender}</span>
              </div>
            </div>
          </div>
        </>
        )}

      {/* Profile Card */}
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
          {user.isPremium && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-gold-400 to-yellow-400 text-white px-3 py-1 rounded-full flex items-center">
              <Star size={12} className="mr-1" fill="currentColor" />
              <span className="text-xs font-semibold">Premium</span>
            </div>
          )}
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

          {/* Questionnaire Responses */}
          {user.questionnaire && user.questionnaire.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                About Me 
                {isAdmin && (
                  <span className="ml-2 bg-coral-100 text-coral-600 px-2 py-1 rounded text-xs font-medium">
                    {user.questionnaire.length} Responses
                  </span>
                )}
              </h3>
              <div className="space-y-4">
                {user.questionnaire.map((response, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border-l-4 border-coral-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-800 flex-1">{response.question}</h4>
                      {isAdmin && (
                        <span className="bg-white text-gray-500 px-2 py-1 rounded text-xs ml-2">
                          Q{response.questionId}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {Array.isArray(response.answer) 
                        ? response.answer.join(', ') 
                        : response.answer}
                    </p>
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

      {/* Profile Link Info (Admin Only) */}
      {isAdmin && (
        <div className="bg-coral-50 border border-coral-200 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-coral-800">Profile Access</h3>
            {!isEditingProfileLink && onUpdateUser && (
              <button
                onClick={() => setIsEditingProfileLink(true)}
                className="flex items-center px-3 py-1 text-coral-600 hover:text-coral-800 transition-colors"
              >
                <Edit3 size={14} className="mr-1" />
                Edit Link
              </button>
            )}
          </div>
          <p className="text-sm text-coral-700 mb-2">
            This profile can only be accessed via its unique link:
          </p>
          
          {isEditingProfileLink ? (
            <div className="space-y-3">
              <div className="flex items-center bg-white p-2 rounded border">
                <span className="text-sm text-gray-600 mr-1">{window.location.origin}/profile/</span>
                <input
                  type="text"
                  value={tempProfileLink}
                  onChange={(e) => setTempProfileLink(e.target.value)}
                  className="flex-1 text-sm font-mono bg-transparent border-none outline-none text-gray-800"
                  placeholder="unique-profile-link"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveProfileLink}
                  disabled={!tempProfileLink.trim() || tempProfileLink === user.profileLink}
                  className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save size={14} className="mr-1" />
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={14} className="mr-1" />
                  Cancel
                </button>
              </div>
              <p className="text-xs text-coral-600">
                Note: Changing the profile link will make the old link invalid. Make sure to share the new link with the member.
              </p>
            </div>
          ) : (
            <p className="text-sm font-mono bg-white p-2 rounded border text-gray-800 break-all">
              {window.location.origin}/profile/{user.profileLink}
            </p>
          )}
        </div>
      )}

      {/* Admin Profile Settings */}
      {isAdmin && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Settings</h3>
          
          {/* Membership Status */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Membership Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Current Status</div>
                <div className={`text-lg font-bold ${
                  user.membershipStatus === 'paid' 
                    ? 'text-green-600'
                    : user.membershipStatus === 'free'
                    ? 'text-blue-600'
                    : 'text-red-600'
                }`}>
                  {user.membershipStatus === 'paid' ? 'Paid Member' : 
                   user.membershipStatus === 'free' ? 'Free Member' : 'Expired'}
                </div>
              </div>
              {user.membershipExpiresAt && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600 mb-1">Expires</div>
                  <div className="text-lg font-bold text-gray-800">
                    {user.membershipExpiresAt.toLocaleDateString()}
                  </div>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Account Type</div>
                <div className="text-lg font-bold text-gray-800 capitalize">
                  {user.gender}
                </div>
              </div>
            </div>
          </div>

          {/* Custom Membership Override */}
          {user.customMembership?.isFreeOverride && (
            <div className={`mb-6 rounded-xl p-4 border ${
              user.customMembership.reason?.includes('VIP Custom')
                ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-300'
                : 'bg-purple-50 border-purple-200'
            }`}>
              <h4 className={`font-medium mb-2 ${
                user.customMembership.reason?.includes('VIP Custom')
                  ? 'text-purple-800 flex items-center'
                  : 'text-purple-800'
              }`}>
                {user.customMembership.reason?.includes('VIP Custom') && <span className="mr-2">👑</span>}
                {user.customMembership.reason?.includes('VIP Custom') ? 'VIP Custom Access Active' : 'Free Override Active'}
              </h4>
              <div className="text-sm text-purple-700 space-y-1">
                <div>Reason: {user.customMembership.reason || 'Admin granted free access'}</div>
                {user.customMembership.freeUntil && (
                  <div>Free until: {user.customMembership.freeUntil.toLocaleDateString()}</div>
                )}
                {user.customMembership.reason?.includes('VIP Custom') && (
                  <div className="mt-2 p-2 bg-white bg-opacity-60 rounded-lg">
                    <div className="text-xs text-purple-800 font-medium">
                      ✨ Includes all VIP features + exclusive VIP Custom badge
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Permissions */}
          {user.permissions && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-800 mb-3">Profile Permissions</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Can View Profiles</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.permissions.canViewProfiles 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {user.permissions.canViewProfiles ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Can Search Profiles</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.permissions.canSearchProfiles 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {user.permissions.canSearchProfiles ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Can Message Members</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.permissions.canMessageMembers 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {user.permissions.canMessageMembers ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Can Receive Messages</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.permissions.canReceiveMessages 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {user.permissions.canReceiveMessages ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Can Browse Members</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.permissions.canBrowseMembers 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {user.permissions.canBrowseMembers ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Profile Visibility</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.permissions.profileVisibility === 'public' 
                        ? 'bg-green-100 text-green-600' 
                        : user.permissions.profileVisibility === 'limited'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {user.permissions.profileVisibility}
                    </span>
                  </div>
                </div>
              </div>
              
              {user.permissions.profileVisibility === 'limited' && user.permissions.approvedViewers && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="text-sm text-yellow-800">
                    <strong>Limited Visibility:</strong> Only {user.permissions.approvedViewers.length} approved viewer(s) can see this profile
                  </div>
                </div>
              )}
              
              {user.permissions.notes && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Admin Notes:</strong> {user.permissions.notes}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Activity */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-800 mb-3">Profile Activity</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Profile Status</div>
                <div className={`text-lg font-bold ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600 mb-1">Layout Preference</div>
                <div className="text-lg font-bold text-gray-800 capitalize">
                  {user.layoutPreference || 'Card'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;