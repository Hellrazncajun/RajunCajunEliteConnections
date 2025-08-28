import React, { useState } from 'react';
import { Heart, Users, MessageCircle, Search, User, Home, Eye, Settings } from 'lucide-react';
import HomePage from './HomePage';
import BrowseProfiles from './BrowseProfiles';
import ChatPage from './ChatPage';
import SearchPage from './SearchPage';
import ProfilePage from './ProfilePage';
import MemberProfileList from './MemberProfileList';
import MembershipSelectionPage from './MembershipSelectionPage';
import { filterProfilesByGender } from '../utils/profileFilters';
import { mockUsers, mockAdminSettings } from '../data/mockData';

type MemberPage = 'home' | 'browse' | 'chat' | 'profile' | 'search';

interface MemberDashboardProps {
  adminSettings?: any;
}

const MemberDashboard: React.FC<MemberDashboardProps> = ({ adminSettings = mockAdminSettings }) => {
  const [currentPage, setCurrentPage] = useState<MemberPage>('home');
  const [memberLayout, setMemberLayout] = useState<'card' | 'list' | 'grid' | 'sidebar'>('card');
  
  // Simulate current user (Sarah Mitchell - female member)
  const [currentUser, setCurrentUser] = useState(mockUsers.find(u => u.id === 2) || mockUsers[0]);
  const otherProfiles = filterProfilesByGender(
    mockUsers.filter(u => u.id !== currentUser.id),
    currentUser.gender
  );

  // Check if user needs to select membership
  const needsMembershipSelection = 
    currentUser.idVerification?.verified === true && 
    (currentUser.membershipStatus === 'free' || currentUser.membershipStatus === 'expired') &&
    !currentUser.customMembership?.isFreeOverride &&
    !currentUser.customMembership?.reason?.includes('VIP Custom');

  // Handle layout change from ProfilePage
  const handleLayoutChange = (newLayout: 'card' | 'list' | 'grid' | 'sidebar') => {
    setMemberLayout(newLayout);
  };

  const handleMembershipSelected = (tierName: string, tierData: any) => {
    // Update current user with new membership
    const updatedUser = {
      ...currentUser,
      membershipStatus: 'paid' as const,
      membershipExpiresAt: tierData.expirationDate,
      isPremium: tierName === 'VIP'
    };
    setCurrentUser(updatedUser);
    
    // In a real app, this would also update the backend
    console.log(`User selected ${tierName} membership:`, tierData);
  };

  // If user needs to select membership, show membership selection page
  if (needsMembershipSelection) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Demo Mode Header */}
        <div className="bg-blue-500 text-white px-4 py-2 text-center">
          <p className="text-sm">
            🎭 <strong>Member Demo Mode</strong> - Profile approved! Choose your membership tier
          </p>
        </div>

        {/* Membership Selection */}
        <div className="flex-1 overflow-y-auto">
          <MembershipSelectionPage
            currentUser={currentUser}
            adminSettings={adminSettings}
            onMembershipSelected={handleMembershipSelected}
          />
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage 
          onNavigate={setCurrentPage} 
          adminSettings={adminSettings}
        />;
      case 'browse':
        return (
          <div className="px-4 py-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Browse Members</h1>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Current Layout: <span className="font-semibold capitalize">{memberLayout}</span></p>
            </div>
            <MemberProfileList
              profiles={otherProfiles}
              layout={memberLayout}
              onViewProfile={(profileLink) => {
                // In a real app, this would navigate to profile view
                console.log('View profile:', profileLink);
              }}
              onMessageUser={(userId) => {
                // In a real app, this would open messaging
                console.log('Message user:', userId);
              }}
              isAdmin={false}
            />
          </div>
        );
      case 'search':
        return <SearchPage currentUser={currentUser} />;
      case 'chat':
        return <ChatPage currentUser={currentUser} />;
      case 'profile':
        return (
          <ProfilePage 
            user={currentUser} 
            onNavigate={setCurrentPage}
            layoutPreference={memberLayout}
            onLayoutChange={handleLayoutChange}
          />
        );
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Demo Mode Header */}
      <div className="bg-blue-500 text-white px-4 py-2 text-center">
        <p className="text-sm">
          🎭 <strong>Member Demo Mode</strong> - You're experiencing what members see 
          {currentUser.isPremium && <span className="ml-2">👑 VIP Member</span>}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {renderPage()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="flex justify-around">
          <button
            onClick={() => setCurrentPage('home')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentPage === 'home'
                ? 'text-coral-500 bg-coral-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('browse')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentPage === 'browse'
                ? 'text-coral-500 bg-coral-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users size={20} />
            <span className="text-xs mt-1">Browse</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('profile')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentPage === 'profile'
                ? 'text-coral-500 bg-coral-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <User size={20} />
            <span className="text-xs mt-1">Profile</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('chat')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentPage === 'chat'
                ? 'text-coral-500 bg-coral-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <MessageCircle size={20} />
            <span className="text-xs mt-1">Messages</span>
          </button>
          
          <button
            onClick={() => setCurrentPage('search')}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              currentPage === 'search'
                ? 'text-coral-500 bg-coral-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Search size={20} />
            <span className="text-xs mt-1">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;