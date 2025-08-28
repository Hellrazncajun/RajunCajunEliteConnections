import React, { useState } from 'react';
import { X, Shield, Eye, MessageSquare, Search, Users, Lock } from 'lucide-react';
import type { User } from '../types/User';

interface PermissionsModalProps {
  user: User;
  onClose: () => void;
  onSave: (userId: number, permissions: any) => void;
}

const PermissionsModal: React.FC<PermissionsModalProps> = ({
  user,
  onClose,
  onSave
}) => {
  const [permissions, setPermissions] = useState(user.permissions || {
    canViewProfiles: true,
    canSearchProfiles: true,
    canMessageMembers: true,
    canReceiveMessages: true,
    canBrowseMembers: true,
    profileVisibility: 'public' as const,
    approvedViewers: [],
    notes: ''
  });

  const [newViewerId, setNewViewerId] = useState('');

  const handleSave = () => {
    onSave(user.id, permissions);
    onClose();
  };

  const addApprovedViewer = () => {
    const viewerId = parseInt(newViewerId);
    if (viewerId && !permissions.approvedViewers?.includes(viewerId)) {
      setPermissions(prev => ({
        ...prev,
        approvedViewers: [...(prev.approvedViewers || []), viewerId]
      }));
      setNewViewerId('');
    }
  };

  const removeApprovedViewer = (viewerId: number) => {
    setPermissions(prev => ({
      ...prev,
      approvedViewers: prev.approvedViewers?.filter(id => id !== viewerId) || []
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="text-purple-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Manage Permissions</h3>
              <p className="text-sm text-gray-600">{user.name} - Advanced Access Control</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Member Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center mb-3">
              <img
                src={user.photos[0]}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div>
                <h4 className="font-semibold text-gray-800">{user.name}, {user.age}</h4>
                <p className="text-sm text-gray-600">{user.location}</p>
                <p className="text-sm text-gray-600 capitalize">Status: {user.membershipStatus}</p>
              </div>
            </div>
          </div>

          {/* Core Permissions */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Core Permissions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Eye className="text-blue-500 mr-2" size={16} />
                  <span className="text-sm font-medium">Can View Profiles</span>
                </div>
                <button
                  onClick={() => setPermissions(prev => ({ ...prev, canViewProfiles: !prev.canViewProfiles }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    permissions.canViewProfiles ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    permissions.canViewProfiles ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Search className="text-purple-500 mr-2" size={16} />
                  <span className="text-sm font-medium">Can Search Profiles</span>
                </div>
                <button
                  onClick={() => setPermissions(prev => ({ ...prev, canSearchProfiles: !prev.canSearchProfiles }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    permissions.canSearchProfiles ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    permissions.canSearchProfiles ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <MessageSquare className="text-green-500 mr-2" size={16} />
                  <span className="text-sm font-medium">Can Send Messages</span>
                </div>
                <button
                  onClick={() => setPermissions(prev => ({ ...prev, canMessageMembers: !prev.canMessageMembers }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    permissions.canMessageMembers ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    permissions.canMessageMembers ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <MessageSquare className="text-orange-500 mr-2" size={16} />
                  <span className="text-sm font-medium">Can Receive Messages</span>
                </div>
                <button
                  onClick={() => setPermissions(prev => ({ ...prev, canReceiveMessages: !prev.canReceiveMessages }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    permissions.canReceiveMessages ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    permissions.canReceiveMessages ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="text-indigo-500 mr-2" size={16} />
                  <span className="text-sm font-medium">Can Browse Members</span>
                </div>
                <button
                  onClick={() => setPermissions(prev => ({ ...prev, canBrowseMembers: !prev.canBrowseMembers }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    permissions.canBrowseMembers ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${
                    permissions.canBrowseMembers ? 'translate-x-5' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Visibility */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Profile Visibility</h4>
            <div className="grid grid-cols-3 gap-3">
              {['public', 'limited', 'hidden'].map((visibility) => (
                <button
                  key={visibility}
                  onClick={() => setPermissions(prev => ({ ...prev, profileVisibility: visibility as any }))}
                  className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                    permissions.profileVisibility === visibility
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center mb-2">
                    {visibility === 'public' && <Eye className="text-green-500" size={20} />}
                    {visibility === 'limited' && <Users className="text-yellow-500" size={20} />}
                    {visibility === 'hidden' && <Lock className="text-red-500" size={20} />}
                  </div>
                  <div className="text-sm font-medium">{visibility}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Approved Viewers (for limited visibility) */}
          {permissions.profileVisibility === 'limited' && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Approved Viewers</h4>
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={newViewerId}
                    onChange={(e) => setNewViewerId(e.target.value)}
                    placeholder="Enter User ID"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={addApprovedViewer}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {permissions.approvedViewers?.map((viewerId) => (
                    <div key={viewerId} className="flex items-center bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                      <span className="text-sm">User {viewerId}</span>
                      <button
                        onClick={() => removeApprovedViewer(viewerId)}
                        className="ml-2 text-purple-500 hover:text-purple-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Admin Notes */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Admin Notes</h4>
            <textarea
              value={permissions.notes || ''}
              onChange={(e) => setPermissions(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              placeholder="Add notes about this member's permissions or restrictions..."
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-md transition-shadow"
            >
              Save Permissions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsModal;