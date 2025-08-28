import React, { useState } from 'react';
import { Users, Mail, Settings, Brain, FileText, LogOut, Plus, Eye, MessageSquare, Shield, Zap, CreditCard } from 'lucide-react';
import MemberProfileList from './MemberProfileList';
import EmailPreview from './EmailPreview';
import AIMatchingDashboard from './AIMatchingDashboard';
import QuestionnaireManager from './QuestionnaireManager';
import IDVerificationModal from './IDVerificationModal';
import CustomChargeModal from './CustomChargeModal';
import NotificationSystem, { type Notification } from './NotificationSystem';
import ActivityModal from './ActivityModal';
import PermissionsModal from './PermissionsModal';
import { mockUsers, mockInviteCodes, mockAdminSettings } from '../data/mockData';
import { generateVerificationNotifications } from '../utils/idVerification';
import type { User, InviteCode, IDVerificationResult } from '../types/User';

interface AdminDashboardProps {
  onViewProfile: (profileLink: string) => void;
  onMessageUser: (userId: number) => void;
  adminSettings?: any;
  onSettingsChange?: (settings: any) => void;
  onLogout?: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  onViewProfile, 
  onMessageUser,
  adminSettings = mockAdminSettings,
  onSettingsChange = () => {},
  onLogout = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'profiles' | 'invites' | 'settings' | 'ai-matching' | 'questionnaires'>('profiles');
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [inviteCodes, setInviteCodes] = useState<InviteCode[]>(mockInviteCodes);
  const [newInviteEmail, setNewInviteEmail] = useState('');
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [selectedInviteCode, setSelectedInviteCode] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [showIDVerification, setShowIDVerification] = useState(false);
  const [showCustomCharge, setShowCustomCharge] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [currentLayout, setCurrentLayout] = useState<'card' | 'list' | 'grid' | 'sidebar'>('card');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [customChargeConfig, setCustomChargeConfig] = useState<{
    modalTitle: string;
    initialFreeOverride: boolean;
  }>({ modalTitle: 'Custom Charge', initialFreeOverride: false });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showMemberNotification, setShowMemberNotification] = useState(false);
  const [memberNotificationData, setMemberNotificationData] = useState<any>(null);

  // Generate new invite code
  const generateInviteCode = () => {
    if (!newInviteEmail.trim()) {
      alert('Please enter an email address for the invite.');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newInviteEmail.trim())) {
      alert('Please enter a valid email address.');
      return;
    }
    
    const newCode = `INVITE-${Date.now()}`;
    const newInvite: InviteCode = {
      id: Date.now().toString(),
      code: newCode,
      email: newInviteEmail.trim(),
      used: false,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    };
    setInviteCodes([...inviteCodes, newInvite]);
    setNewInviteEmail(''); // Clear the email input after generating
    
    // Add notification
    setNotifications(prev => [...prev, {
      id: Date.now().toString(),
      title: 'Invite Code Generated',
      message: `New invite code "${newCode}" created for ${newInviteEmail.trim()}`,
      type: 'success',
      timestamp: new Date(),
      read: false
    }]);
  };

  const handleEmailPreview = (code: string, email: string) => {
    setSelectedInviteCode(code);
    setSelectedEmail(email);
    setShowEmailPreview(true);
  };

  const handleIDVerification = (user: User) => {
    setSelectedUser(user);
    setShowIDVerification(true);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    // Add notification for profile link change
    setNotifications(prev => [...prev, {
      id: Date.now().toString(),
      title: 'Profile Link Updated',
      message: `Profile link for ${updatedUser.name} has been changed to: ${updatedUser.profileLink}`,
      type: 'success',
      timestamp: new Date(),
      read: false
    }]);
  };

  const handleCustomCharge = (user: User) => {
    setSelectedUser(user);
    setCustomChargeConfig({
      modalTitle: 'Custom Charge',
      initialFreeOverride: false
    });
    setShowCustomCharge(true);
  };

  const handleManagePermissions = (user: User) => {
    setSelectedUser(user);
    setShowPermissionsModal(true);
  };

  const handleCustomMembership = (user: User) => {
    setSelectedUser(user);
    setCustomChargeConfig({
      modalTitle: 'Custom Membership',
      initialFreeOverride: true
    });
    setShowCustomCharge(true);
  };

  const handleViewActivity = (user: User) => {
    setSelectedUser(user);
    setShowActivityModal(true);
  };

  const handlePermissionsUpdate = (userId: number, permissions: any) => {
    // Update user permissions
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? {
              ...user,
              permissions: permissions
            }
          : user
      )
    );

    // Add notification
    const user = users.find(u => u.id === userId);
    if (user) {
      setNotifications(prev => [...prev, {
        id: Date.now().toString(),
        title: 'Permissions Updated',
        message: `Permissions for ${user.name} have been updated`,
        type: 'success',
        timestamp: new Date(),
        read: false
      }]);
    }
  };

  const handleVerificationComplete = (userId: number, result: IDVerificationResult) => {
    // Update user verification status
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? {
              ...user,
              idVerification: {
                ...user.idVerification!,
                verified: result.status === 'verified',
                verificationResult: result
              }
            }
          : user
      )
    );

    // Generate notifications
    const user = users.find(u => u.id === userId);
    if (user) {
      const { adminNotification, memberNotification } = generateVerificationNotifications(result, {
        name: user.name,
        email: 'user@example.com'
      });

      // Add admin notification
      setNotifications(prev => [...prev, {
        id: Date.now().toString(),
        ...adminNotification,
        read: false
      }]);

      console.log('Member notification would be sent:', memberNotification);
    }
  };

  const handleCustomChargeComplete = (userId: number, chargeData: any) => {
    // Update user with custom charge/membership data
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? {
              ...user,
              membershipStatus: chargeData.isFreeOverride ? 'free' : 'paid',
              membershipExpiresAt: chargeData.endDate,
              isPremium: chargeData.membershipType === 'vip' || chargeData.membershipType === 'vip_custom',
              customMembership: {
                isFreeOverride: chargeData.isFreeOverride,
                freeUntil: chargeData.isFreeOverride ? chargeData.endDate : undefined,
                reason: chargeData.description,
                chargeAmount: chargeData.isFreeOverride ? 0 : chargeData.amount,
                chargeCurrency: chargeData.currency,
                chargeDescription: chargeData.description
              }
            }
          : user
      )
    );

    // Add notification
    const user = users.find(u => u.id === userId);
    if (user) {
      const getMembershipTypeName = () => {
        switch (chargeData.membershipType) {
          case 'vip_custom':
            return '👑 VIP Custom';
          case 'vip':
            return '⭐ VIP';
          case 'basic':
            return '🛡️ Basic';
          default:
            return 'Custom';
        }
      };
      
      const notificationTitle = chargeData.isFreeOverride 
        ? `${getMembershipTypeName()} Access Granted (Free)`
        : `${getMembershipTypeName()} Membership Processed`;
      
      const notificationMessage = chargeData.isFreeOverride
        ? `${getMembershipTypeName()} access granted to ${user.name} until ${chargeData.endDate.toLocaleDateString()}. ${
            chargeData.membershipType === 'vip_custom' 
              ? 'User now has premium status and exclusive VIP Custom badge.'
              : chargeData.membershipType === 'vip'
              ? 'User now has VIP status and premium features.'
              : 'User has free access to basic features.'
          }`
        : `${getMembershipTypeName()} membership charge of $${chargeData.amount} ${chargeData.currency} processed for ${user.name}. Membership expires ${chargeData.endDate.toLocaleDateString()}`;

      setNotifications(prev => [...prev, {
        id: Date.now().toString(),
        title: notificationTitle,
        message: notificationMessage,
        type: 'success',
        timestamp: new Date(),
        read: false
      }]);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const handleDismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const renderProfiles = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Member Profiles</h2>
          <p className="text-gray-600">Manage and view all member profiles</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
          <Users className="text-blue-500 mb-2" size={24} />
          <h3 className="font-semibold text-blue-800 mb-1">Total Members</h3>
          <p className="text-2xl font-bold text-blue-900">{users.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
          <Shield className="text-green-500 mb-2" size={24} />
          <h3 className="font-semibold text-green-800 mb-1">Verified</h3>
          <p className="text-2xl font-bold text-green-900">
            {users.filter(u => u.idVerification?.verified).length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-coral-50 to-rose-50 p-4 rounded-2xl border border-coral-100">
          <CreditCard className="text-coral-500 mb-2" size={24} />
          <h3 className="font-semibold text-coral-800 mb-1">Paid Members</h3>
          <p className="text-2xl font-bold text-coral-900">
            {users.filter(u => u.membershipStatus === 'paid').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
          <Zap className="text-purple-500 mb-2" size={24} />
          <h3 className="font-semibold text-purple-800 mb-1">Free Override</h3>
          <p className="text-2xl font-bold text-purple-900">
            {users.filter(u => u.customMembership?.isFreeOverride).length}
          </p>
        </div>
      </div>

      {/* Member List */}
      <div className="bg-white rounded-2xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">All Members</h3>
        </div>
        <div className="p-6">
          <MemberProfileList
            profiles={users}
            layout="card"
            onViewProfile={onViewProfile}
            onMessageUser={onMessageUser}
            isAdmin={true}
            onCustomMembership={handleCustomMembership}
            onManagePermissions={handleManagePermissions}
            onIDVerification={handleIDVerification}
            onCustomCharge={handleCustomCharge}
            onViewActivity={handleViewActivity}
          />
        </div>
      </div>
    </div>
  );

  const renderInvites = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Invite Management</h2>
          <p className="text-gray-600">Create and manage member invitations</p>
        </div>
      </div>

      {/* Generate New Invite */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Generate New Invite Code</h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={newInviteEmail}
              onChange={(e) => setNewInviteEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && generateInviteCode()}
              placeholder="Enter member's email address"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The invite code will be associated with this email address
            </p>
          </div>
          <div className="flex items-end">
            <button
              onClick={generateInviteCode}
              disabled={!newInviteEmail.trim()}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-coral-500 to-rose-500 text-white rounded-xl hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={16} className="mr-2" />
              Generate Code
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Invite Codes</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {inviteCodes.map((invite) => (
            <div key={invite.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <div className="font-mono text-sm bg-gray-100 px-3 py-1 rounded">
                  {invite.code}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Created: {invite.createdAt.toLocaleDateString()}
                  {invite.email && ` • ${invite.email}`}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Expires: {invite.expiresAt.toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  invite.used 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {invite.used ? 'Used' : 'Active'}
                </span>
                <button
                  onClick={() => handleEmailPreview(invite.code, invite.email || 'newmember@example.com')}
                  className="flex items-center px-3 py-1 text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <Mail size={14} className="mr-1" />
                  Preview Email
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Site Settings</h2>
        <p className="text-gray-600">Configure your dating site</p>
      </div>

      {/* Basic Site Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Site Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
            <input
              type="text"
              value={adminSettings.siteName}
              onChange={(e) => onSettingsChange({
                ...adminSettings,
                siteName: e.target.value
              })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Tagline</label>
            <input
              type="text"
              value={adminSettings.siteTagline}
              onChange={(e) => onSettingsChange({
                ...adminSettings,
                siteTagline: e.target.value
              })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Contact Email</label>
            <input
              type="email"
              value={adminSettings.adminContactEmail}
              onChange={(e) => onSettingsChange({
                ...adminSettings,
                adminContactEmail: e.target.value
              })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
              placeholder="admin@yourdomain.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email address where VIP Custom inquiries and admin communications will be sent
            </p>
          </div>
        </div>
      </div>

      {/* YouTube Video Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">YouTube Video Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-800">Enable YouTube Video</span>
              <p className="text-sm text-gray-600">Show a YouTube video on the member homepage</p>
            </div>
            <button
              onClick={() => onSettingsChange({
                ...adminSettings,
                youtubeVideo: {
                  ...adminSettings.youtubeVideo,
                  enabled: !adminSettings.youtubeVideo.enabled
                }
              })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                adminSettings.youtubeVideo.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                adminSettings.youtubeVideo.enabled ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          {adminSettings.youtubeVideo.enabled && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL</label>
                <input
                  type="url"
                  value={adminSettings.youtubeVideo.videoUrl}
                  onChange={(e) => onSettingsChange({
                    ...adminSettings,
                    youtubeVideo: {
                      ...adminSettings.youtubeVideo,
                      videoUrl: e.target.value
                    }
                  })}
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Title</label>
                  <input
                    type="text"
                    value={adminSettings.youtubeVideo.title}
                    onChange={(e) => onSettingsChange({
                      ...adminSettings,
                      youtubeVideo: {
                        ...adminSettings.youtubeVideo,
                        title: e.target.value
                      }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Placement</label>
                  <select
                    value={adminSettings.youtubeVideo.placement}
                    onChange={(e) => onSettingsChange({
                      ...adminSettings,
                      youtubeVideo: {
                        ...adminSettings.youtubeVideo,
                        placement: e.target.value as 'top' | 'middle' | 'bottom'
                      }
                    })}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                  >
                    <option value="top">Top of Page</option>
                    <option value="middle">Middle of Page</option>
                    <option value="bottom">Bottom of Page</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video Description</label>
                <textarea
                  value={adminSettings.youtubeVideo.description}
                  onChange={(e) => onSettingsChange({
                    ...adminSettings,
                    youtubeVideo: {
                      ...adminSettings.youtubeVideo,
                      description: e.target.value
                    }
                  })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 resize-none"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* About Website Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">About Website Section</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
            <input
              type="text"
              value={adminSettings.aboutWebsiteSection.title}
              onChange={(e) => onSettingsChange({
                ...adminSettings,
                aboutWebsiteSection: {
                  ...adminSettings.aboutWebsiteSection,
                  title: e.target.value
                }
              })}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Section Content</label>
            <textarea
              value={adminSettings.aboutWebsiteSection.content}
              onChange={(e) => onSettingsChange({
                ...adminSettings,
                aboutWebsiteSection: {
                  ...adminSettings.aboutWebsiteSection,
                  content: e.target.value
                }
              })}
              rows={5}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Member Statistics Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Member Statistics</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-800">Show Active Member Count</span>
              <p className="text-sm text-gray-600">Display the number of active members on the homepage</p>
            </div>
            <button
              onClick={() => onSettingsChange({
                ...adminSettings,
                memberStatsVisibility: {
                  ...adminSettings.memberStatsVisibility,
                  showActiveMemberCount: !adminSettings.memberStatsVisibility.showActiveMemberCount
                }
              })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                adminSettings.memberStatsVisibility.showActiveMemberCount ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                adminSettings.memberStatsVisibility.showActiveMemberCount ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Visibility Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Profile Visibility & Privacy</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-800">Allow Member Browsing</span>
              <p className="text-sm text-gray-600">Let members browse other profiles freely</p>
            </div>
            <button
              onClick={() => onSettingsChange({
                ...adminSettings,
                profileVisibility: {
                  ...adminSettings.profileVisibility,
                  allowMemberBrowsing: !adminSettings.profileVisibility.allowMemberBrowsing
                }
              })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                adminSettings.profileVisibility.allowMemberBrowsing ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                adminSettings.profileVisibility.allowMemberBrowsing ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-800">Allow Member Search</span>
              <p className="text-sm text-gray-600">Enable search functionality for members</p>
            </div>
            <button
              onClick={() => onSettingsChange({
                ...adminSettings,
                profileVisibility: {
                  ...adminSettings.profileVisibility,
                  allowMemberSearch: !adminSettings.profileVisibility.allowMemberSearch
                }
              })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                adminSettings.profileVisibility.allowMemberSearch ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                adminSettings.profileVisibility.allowMemberSearch ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-800">Require Mutual Match</span>
              <p className="text-sm text-gray-600">Both members must match to see each other</p>
            </div>
            <button
              onClick={() => onSettingsChange({
                ...adminSettings,
                profileVisibility: {
                  ...adminSettings.profileVisibility,
                  requireMutualMatch: !adminSettings.profileVisibility.requireMutualMatch
                }
              })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                adminSettings.profileVisibility.requireMutualMatch ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                adminSettings.profileVisibility.requireMutualMatch ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-800">Admin Approval Required</span>
              <p className="text-sm text-gray-600">New profiles need admin approval before going live</p>
            </div>
            <button
              onClick={() => onSettingsChange({
                ...adminSettings,
                profileVisibility: {
                  ...adminSettings.profileVisibility,
                  adminApprovalRequired: !adminSettings.profileVisibility.adminApprovalRequired
                }
              })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                adminSettings.profileVisibility.adminApprovalRequired ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                adminSettings.profileVisibility.adminApprovalRequired ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-800">Allow Member Messaging</span>
              <p className="text-sm text-gray-600">Enable direct messaging between members</p>
            </div>
            <button
              onClick={() => onSettingsChange({
                ...adminSettings,
                profileVisibility: {
                  ...adminSettings.profileVisibility,
                  allowMemberMessaging: !adminSettings.profileVisibility.allowMemberMessaging
                }
              })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                adminSettings.profileVisibility.allowMemberMessaging ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                adminSettings.profileVisibility.allowMemberMessaging ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Membership Pricing */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Membership Pricing</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Membership */}
          <div className="border border-gray-200 rounded-xl p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Basic Membership</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={adminSettings.membershipTiers.basic.name}
                  onChange={(e) => onSettingsChange({
                    ...adminSettings,
                    membershipTiers: {
                      ...adminSettings.membershipTiers,
                      basic: {
                        ...adminSettings.membershipTiers.basic,
                        name: e.target.value
                      }
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={adminSettings.membershipTiers.basic.amount}
                    onChange={(e) => onSettingsChange({
                      ...adminSettings,
                      membershipTiers: {
                        ...adminSettings.membershipTiers,
                        basic: {
                          ...adminSettings.membershipTiers.basic,
                          amount: parseFloat(e.target.value) || 0
                        }
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    value={adminSettings.membershipTiers.basic.duration}
                    onChange={(e) => onSettingsChange({
                      ...adminSettings,
                      membershipTiers: {
                        ...adminSettings.membershipTiers,
                        basic: {
                          ...adminSettings.membershipTiers.basic,
                          duration: parseInt(e.target.value) || 30
                        }
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* VIP Membership */}
          <div className="border border-gold-200 rounded-xl p-4 bg-gold-50">
            <h4 className="font-semibold text-gold-800 mb-3">VIP Membership</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={adminSettings.membershipTiers.vip.name}
                  onChange={(e) => onSettingsChange({
                    ...adminSettings,
                    membershipTiers: {
                      ...adminSettings.membershipTiers,
                      vip: {
                        ...adminSettings.membershipTiers.vip,
                        name: e.target.value
                      }
                    }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    value={adminSettings.membershipTiers.vip.amount}
                    onChange={(e) => onSettingsChange({
                      ...adminSettings,
                      membershipTiers: {
                        ...adminSettings.membershipTiers,
                        vip: {
                          ...adminSettings.membershipTiers.vip,
                          amount: parseFloat(e.target.value) || 0
                        }
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    value={adminSettings.membershipTiers.vip.duration}
                    onChange={(e) => onSettingsChange({
                      ...adminSettings,
                      membershipTiers: {
                        ...adminSettings.membershipTiers,
                        vip: {
                          ...adminSettings.membershipTiers.vip,
                          duration: parseInt(e.target.value) || 30
                        }
                      }
                    })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ID Verification Settings */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">ID Verification Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-800">Enable ID Verification</span>
              <p className="text-sm text-gray-600">Require members to verify their identity</p>
            </div>
            <button
              onClick={() => onSettingsChange({
                ...adminSettings,
                idVerification: {
                  ...adminSettings.idVerification,
                  enabled: !adminSettings.idVerification.enabled
                }
              })}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                adminSettings.idVerification.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                adminSettings.idVerification.enabled ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
          
          {adminSettings.idVerification.enabled && (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">AI Verification</span>
                  <p className="text-sm text-gray-600">Use AI to automatically verify IDs</p>
                </div>
                <button
                  onClick={() => onSettingsChange({
                    ...adminSettings,
                    idVerification: {
                      ...adminSettings.idVerification,
                      aiVerification: !adminSettings.idVerification.aiVerification
                    }
                  })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    adminSettings.idVerification.aiVerification ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    adminSettings.idVerification.aiVerification ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confidence Threshold: {adminSettings.idVerification.confidenceThreshold}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={adminSettings.idVerification.confidenceThreshold}
                  onChange={(e) => onSettingsChange({
                    ...adminSettings,
                    idVerification: {
                      ...adminSettings.idVerification,
                      confidenceThreshold: parseInt(e.target.value)
                    }
                  })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum confidence level required for automatic approval
                </p>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">Auto Approve</span>
                  <p className="text-sm text-gray-600">Automatically approve high-confidence verifications</p>
                </div>
                <button
                  onClick={() => onSettingsChange({
                    ...adminSettings,
                    idVerification: {
                      ...adminSettings.idVerification,
                      autoApprove: !adminSettings.idVerification.autoApprove
                    }
                  })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    adminSettings.idVerification.autoApprove ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    adminSettings.idVerification.autoApprove ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Save All Settings */}
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">💾 Save All Settings</h3>
        <p className="text-green-700 mb-4">
          All changes are automatically saved. Your site configuration is ready.
        </p>
        <button
          onClick={() => {
            // Force save all settings
            onSettingsChange(adminSettings);
            alert('All settings have been saved successfully!');
          }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-shadow"
        >
          💾 Save All Configuration
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600">{adminSettings.siteName}</p>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationSystem
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
              onDismiss={handleDismissNotification}
              onClearAll={handleClearAllNotifications}
            />
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 px-6 overflow-x-auto">
        <div className="flex space-x-8 min-w-max" style={{ minWidth: 'max-content' }}>
          {[
            { id: 'profiles', label: 'Profiles', icon: Users },
            { id: 'invites', label: 'Invites', icon: Mail },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'ai-matching', label: 'AI Matching', icon: Brain },
            { id: 'questionnaires', label: 'Questionnaires', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center py-4 px-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === id
                  ? 'border-coral-500 text-coral-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon size={16} className="mr-2" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'profiles' && renderProfiles()}
        {activeTab === 'invites' && renderInvites()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'ai-matching' && (
          <AIMatchingDashboard
            users={users}
            adminSettings={adminSettings}
            onSettingsChange={onSettingsChange}
            onViewProfile={onViewProfile}
            onMessageUser={onMessageUser}
          />
        )}
        {activeTab === 'questionnaires' && (
          <QuestionnaireManager
            adminSettings={adminSettings}
            onSettingsChange={onSettingsChange}
          />
        )}
      </div>

      {/* Modals */}
      {showEmailPreview && (
        <EmailPreview
          inviteCode={selectedInviteCode}
          recipientEmail={selectedEmail}
          onClose={() => setShowEmailPreview(false)}
          adminSettings={adminSettings}
        />
      )}

      {showIDVerification && selectedUser && (
        <IDVerificationModal
          user={selectedUser}
          onClose={() => {
            setShowIDVerification(false);
            setSelectedUser(null);
          }}
          onVerificationComplete={handleVerificationComplete}
        />
      )}

      {showCustomCharge && selectedUser && (
        <CustomChargeModal
          user={selectedUser}
          modalTitle={customChargeConfig.modalTitle}
          initialFreeOverride={customChargeConfig.initialFreeOverride}
          onClose={() => {
            setShowCustomCharge(false);
            setSelectedUser(null);
          }}
          onSave={handleCustomChargeComplete}
        />
      )}

      {showPermissionsModal && selectedUser && (
        <PermissionsModal
          user={selectedUser}
          onClose={() => {
            setShowPermissionsModal(false);
            setSelectedUser(null);
          }}
          onSave={handlePermissionsUpdate}
        />
      )}

      {showActivityModal && selectedUser && (
        <ActivityModal
          user={selectedUser}
          onClose={() => {
            setShowActivityModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {showMemberNotification && memberNotificationData && (
        <MemberNotificationModal
          user={memberNotificationData.user}
          notification={memberNotificationData.notification}
          onClose={() => {
            setShowMemberNotification(false);
            setMemberNotificationData(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;