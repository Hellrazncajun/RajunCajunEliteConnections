import React from 'react';
import { Heart, MapPin, Briefcase, Eye, MessageSquare, Star, CreditCard, Shield, Lock, Zap } from 'lucide-react';
import type { User } from '../types/User';

interface MemberProfileListProps {
  profiles: User[];
  layout: 'card' | 'list' | 'grid' | 'sidebar';
  onViewProfile: (profileLink: string) => void;
  onMessageUser: (userId: number) => void;
  isAdmin?: boolean;
  onCustomMembership?: (user: User) => void;
  onManagePermissions?: (user: User) => void;
  onIDVerification?: (user: User) => void;
  onCustomCharge?: (user: User) => void;
  onViewActivity?: (user: User) => void;
}

const MemberProfileList: React.FC<MemberProfileListProps> = ({ 
  profiles, 
  layout, 
  onViewProfile, 
  onMessageUser,
  isAdmin = false,
  onCustomMembership,
  onManagePermissions,
  onIDVerification,
  onCustomCharge,
  onViewActivity
}) => {
  const renderCardLayout = () => (
    <div className="space-y-4">
      {profiles.map(profile => (
        <div key={profile.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="flex">
            <div className="relative w-24 h-24">
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
              {profile.isPremium && (
                <div className="absolute top-1 right-1 bg-gold-400 text-white p-1 rounded-full">
                  <Star size={10} fill="currentColor" />
                </div>
              )}
            </div>
            <div className="flex-1 p-4">
              <h4 className="font-semibold text-gray-800 mb-1">
                {profile.name}, {profile.age}
              </h4>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin size={12} className="mr-1" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <span className="text-xs">📧 {profile.email}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm mb-3">
                <Briefcase size={12} className="mr-1" />
                <span>{profile.job}</span>
              </div>
              <div className="flex space-x-2 flex-nowrap overflow-x-auto">
                <button
                  onClick={() => onViewProfile(profile.profileLink)}
                  className="px-2 py-1 bg-coral-500 text-white rounded-full text-xs hover:bg-coral-600 transition-colors"
                >
                  View
                </button>
                <button
                  onClick={() => onMessageUser(profile.id)}
                  className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs hover:bg-blue-600 transition-colors"
                >
                  Msg
                </button>
                {isAdmin && onCustomMembership && (
                  <button
                    onClick={() => onCustomMembership(profile)}
                    className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs hover:bg-orange-600 transition-colors"
                    title="Custom Membership"
                  >
                    💳
                  </button>
                )}
                {isAdmin && onCustomCharge && (
                  <button
                    onClick={() => onCustomCharge(profile)}
                    className="px-2 py-1 bg-green-500 text-white rounded-full text-xs hover:bg-green-600 transition-colors"
                    title="Custom Charge"
                  >
                    💰
                  </button>
                )}
                {isAdmin && onManagePermissions && (
                  <button
                    onClick={() => onManagePermissions(profile)}
                    className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs hover:bg-purple-600 transition-colors"
                    title="Manage Permissions"
                  >
                    🛡️
                  </button>
                )}
                {isAdmin && onIDVerification && profile.idVerification && (
                  <button
                    onClick={() => onIDVerification(profile)}
                    className={`px-2 py-1 rounded-full text-xs transition-colors ${
                      profile.idVerification.verified 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-purple-500 text-white hover:bg-purple-600'
                    }`}
                    title="ID Verification"
                  >
                    {profile.idVerification.verified ? '✅' : '🔍'}
                  </button>
                )}
                {isAdmin && onViewActivity && (
                  <button
                    onClick={() => onViewActivity(profile)}
                    className="px-2 py-1 bg-indigo-500 text-white rounded-full text-xs hover:bg-indigo-600 transition-colors"
                    title="View Activity"
                  >
                    📊
                  </button>
                )}
                {profile.customMembership?.isFreeOverride && (
                  <span className={`px-1 py-0.5 rounded-full text-xs font-medium ${
                    profile.customMembership.reason?.includes('VIP Custom')
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {profile.customMembership.reason?.includes('VIP Custom') ? '👑 VIP Custom' : 'Free'}
                  </span>
                )}
                {profile.permissions && (!profile.permissions.canViewProfiles || !profile.permissions.canMessageMembers) && (
                  <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded-full text-xs font-medium">
                    Restricted
                  </span>
                )}
              </div>
              {profile.permissions?.profileVisibility === 'limited' && (
                <span className="ml-2 bg-yellow-100 text-yellow-600 px-1 py-0.5 rounded-full text-xs font-medium">
                  Limited ({(profile.permissions.approvedViewers || []).length} viewers)
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListLayout = () => (
    <div className="space-y-2">
      {profiles.map(profile => (
        <div key={profile.id} className="flex items-center p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-100 transition-colors">
          <div className="relative">
            <img
              src={profile.photos[0]}
              alt={profile.name}
              className="w-12 h-12 rounded-full object-cover mr-3"
            />
            {profile.isPremium && (
              <div className="absolute -top-1 -right-1 bg-gold-400 text-white p-1 rounded-full">
                <Star size={8} fill="currentColor" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-gray-800">
              {profile.name}, {profile.age}
            </h4>
            <p className="text-sm text-gray-600">{profile.location}</p>
            <p className="text-xs text-gray-500">📧 {profile.email}</p>
          </div>
          <div className="flex space-x-2 flex-nowrap overflow-x-auto">
            <button
              onClick={() => onViewProfile(profile.profileLink)}
              className="p-1.5 text-coral-500 hover:bg-coral-50 rounded-lg transition-colors"
              title="View Profile"
            >
              <Eye size={14} />
            </button>
            <button
              onClick={() => onMessageUser(profile.id)}
              className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
              title="Message"
            >
              <MessageSquare size={14} />
            </button>
            {isAdmin && onCustomMembership && (
              <button
                onClick={() => onCustomMembership(profile)}
                className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                title="Custom Membership"
              >
                <CreditCard size={14} />
              </button>
            )}
            {isAdmin && onCustomCharge && (
              <button
                onClick={() => onCustomCharge(profile)}
                className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                title="Custom Charge"
              >
                <CreditCard size={14} />
              </button>
            )}
            {isAdmin && onManagePermissions && (
              <button
                onClick={() => onManagePermissions(profile)}
                className="p-1.5 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                title="Manage Permissions"
              >
                <Shield size={14} />
              </button>
            )}
            {isAdmin && onIDVerification && profile.idVerification && (
              <button
                onClick={() => onIDVerification(profile)}
                className={`p-1.5 rounded-lg transition-colors ${
                  profile.idVerification.verified 
                    ? 'text-green-500 hover:bg-green-50' 
                    : 'text-purple-500 hover:bg-purple-50'
                }`}
                title="ID Verification"
              >
                <Zap size={14} />
              </button>
            )}
          </div>
          {profile.permissions && (!profile.permissions.canViewProfiles || !profile.permissions.canMessageMembers) && (
            <div className="ml-auto">
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                Restricted
              </span>
            </div>
          )}
          {profile.permissions?.profileVisibility === 'limited' && (
            <div className="ml-2">
              <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-medium">
                Limited
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderGridLayout = () => (
    <div className="grid grid-cols-2 gap-4">
      {profiles.map(profile => (
        <div key={profile.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="relative aspect-square">
            <img
              src={profile.photos[0]}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
            {profile.isPremium && (
              <div className="absolute top-2 right-2 bg-gold-400 text-white px-2 py-1 rounded-full flex items-center">
                <Star size={10} className="mr-1" fill="currentColor" />
                <span className="text-xs font-semibold">VIP</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
              <h4 className="font-semibold text-white text-sm">
                {profile.name}, {profile.age}
              </h4>
              <p className="text-white text-opacity-90 text-xs">{profile.location}</p>
            </div>
          </div>
          <div className="p-3">
            <div className="flex space-x-2">
              <button
                onClick={() => onViewProfile(profile.profileLink)}
                className="px-2 py-1 bg-coral-500 text-white rounded text-xs hover:bg-coral-600 transition-colors"
              >
                View
              </button>
              <button
                onClick={() => onMessageUser(profile.id)}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Msg
              </button>
              {isAdmin && onCustomMembership && (
                <button
                  onClick={() => onCustomMembership(profile)}
                  className="px-2 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 transition-colors"
                  title="Custom Membership"
                >
                  💳
                </button>
              )}
              {isAdmin && onCustomCharge && (
                <button
                  onClick={() => onCustomCharge(profile)}
                  className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                  title="Custom Charge"
                >
                  💰
                </button>
              )}
              {isAdmin && onManagePermissions && (
                <button
                  onClick={() => onManagePermissions(profile)}
                  className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors"
                  title="Manage Permissions"
                >
                  🛡️
                </button>
              )}
              {isAdmin && onIDVerification && profile.idVerification && (
                <button
                  onClick={() => onIDVerification(profile)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    profile.idVerification.verified 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                  title="ID Verification"
                >
                  {profile.idVerification.verified ? '✅' : '🔍'}
                </button>
              )}
            </div>
            {profile.customMembership?.isFreeOverride && (
              <div className="mt-2">
                <span className="bg-purple-100 text-purple-600 px-1 py-0.5 rounded-full text-xs font-medium">
                  Free Override Active
                </span>
              </div>
            )}
            {profile.permissions && (!profile.permissions.canViewProfiles || !profile.permissions.canMessageMembers) && (
              <div className="mt-2">
                <span className="bg-red-100 text-red-600 px-1 py-0.5 rounded-full text-xs font-medium">
                  Access Restricted
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSidebarLayout = () => (
    <div className="flex space-x-6">
      {/* Sidebar Filters */}
      <div className="w-1/3 bg-white rounded-xl p-4 shadow-sm border border-gray-100 h-fit">
        <h4 className="font-semibold text-gray-800 mb-3">Filters</h4>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-600">Age Range</label>
            <div className="flex space-x-2 mt-1">
              <input type="number" placeholder="18" className="w-16 p-2 border rounded text-sm" />
              <span className="text-gray-400 self-center">-</span>
              <input type="number" placeholder="35" className="w-16 p-2 border rounded text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Location</label>
            <select className="w-full p-2 border rounded text-sm mt-1">
              <option>All Locations</option>
              <option>New York</option>
              <option>Brooklyn</option>
              <option>Manhattan</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Membership</label>
            <select className="w-full p-2 border rounded text-sm mt-1">
              <option>All Members</option>
              <option>VIP Only</option>
              <option>Basic Only</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 space-y-3">
        {profiles.map(profile => (
          <div key={profile.id} className="flex items-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="relative">
              <img
                src={profile.photos[0]}
                alt={profile.name}
                className="w-16 h-16 rounded-xl object-cover mr-4"
              />
              {profile.isPremium && (
                <div className="absolute -top-1 -right-1 bg-gold-400 text-white p-1 rounded-full">
                  <Star size={10} fill="currentColor" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800 mb-1">
                {profile.name}, {profile.age}
              </h4>
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <MapPin size={12} className="mr-1" />
                <span>{profile.location}</span>
              </div>
              <div className="text-xs text-gray-500 mb-1">📧 {profile.email}</div>
              <div className="flex items-center text-gray-600 text-sm">
                <Briefcase size={12} className="mr-1" />
                <span>{profile.job}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onViewProfile(profile.profileLink)}
                className="px-2 py-1 bg-coral-500 text-white rounded text-xs hover:bg-coral-600 transition-colors"
              >
                View
              </button>
              <button
                onClick={() => onMessageUser(profile.id)}
                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
              >
                Msg
              </button>
              {isAdmin && onCustomMembership && (
                <button
                  onClick={() => onCustomMembership(profile)}
                  className="px-2 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 transition-colors"
                  title="Custom Membership"
                >
                  💳
                </button>
              )}
              {isAdmin && onCustomCharge && (
                <button
                  onClick={() => onCustomCharge(profile)}
                  className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                  title="Custom Charge"
                >
                  💰
                </button>
              )}
              {isAdmin && onManagePermissions && (
                <button
                  onClick={() => onManagePermissions(profile)}
                  className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors"
                  title="Manage Permissions"
                >
                  🛡️
                </button>
              )}
              {isAdmin && onIDVerification && profile.idVerification && (
                <button
                  onClick={() => onIDVerification(profile)}
                  className={`px-2 py-1 rounded text-xs transition-colors ${
                    profile.idVerification.verified 
                      ? 'bg-green-500 text-white hover:bg-green-600' 
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                  title="ID Verification"
                >
                  {profile.idVerification.verified ? '✅' : '🔍'}
                </button>
              )}
            </div>
            {(profile.customMembership?.isFreeOverride || (profile.permissions && (!profile.permissions.canViewProfiles || !profile.permissions.canMessageMembers))) && (
              <div className="mt-2 flex flex-wrap gap-2">
                {profile.customMembership?.isFreeOverride && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    profile.customMembership.reason?.includes('VIP Custom')
                      ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700'
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    {profile.customMembership.reason?.includes('VIP Custom') ? '👑 VIP Custom' : 'Free Override'}
                  </span>
                )}
                {profile.permissions && (!profile.permissions.canViewProfiles || !profile.permissions.canMessageMembers) && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                    Restricted
                  </span>
                )}
                {profile.permissions?.profileVisibility === 'limited' && (
                  <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-medium">
                    Limited ({(profile.permissions.approvedViewers || []).length})
                  </span>
                )}
                {profile.permissions?.profileVisibility === 'limited' && (
                  <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full text-xs font-medium">
                    Limited Visibility
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  switch (layout) {
    case 'list':
      return renderListLayout();
    case 'grid':
      return renderGridLayout();
    case 'sidebar':
      return renderSidebarLayout();
    default:
      return renderCardLayout();
  }
};

export default MemberProfileList;