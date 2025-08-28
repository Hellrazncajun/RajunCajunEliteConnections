import React, { useState } from 'react';
import { Crown, Star, Zap, Check, CreditCard, Shield, Mail } from 'lucide-react';
import type { User } from '../types/User';

interface MembershipSelectionPageProps {
  currentUser: User;
  adminSettings: any;
  onMembershipSelected: (tierName: string, tierData: any) => void;
}

const MembershipSelectionPage: React.FC<MembershipSelectionPageProps> = ({
  currentUser,
  adminSettings,
  onMembershipSelected
}) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if user has VIP Custom status
  const hasVipCustom = currentUser.customMembership?.isFreeOverride && 
    currentUser.customMembership?.reason?.includes('VIP Custom');

  const handleTierSelection = async (tierName: string) => {
    setSelectedTier(tierName);
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const tierData = adminSettings.membershipTiers[tierName.toLowerCase()];
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + tierData.duration);

    onMembershipSelected(tierName, {
      ...tierData,
      expirationDate
    });

    setIsProcessing(false);
  };

  // If user has VIP Custom, show their current status
  if (hasVipCustom) {
    return (
      <div className="px-4 py-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
              <Crown className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">VIP Custom Member</h1>
          <p className="text-gray-600">You have exclusive VIP Custom access</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm border-2 border-purple-200 mb-6">
          <div className="text-center mb-4">
            <Crown className="text-purple-500 mx-auto mb-3" size={48} />
            <h2 className="text-xl font-bold text-purple-800 mb-2">VIP Custom Access</h2>
            <p className="text-purple-700">Personally granted by admin</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center">
              <Check className="text-purple-500 mr-3" size={16} />
              <span className="text-purple-700">All premium features included</span>
            </div>
            <div className="flex items-center">
              <Check className="text-purple-500 mr-3" size={16} />
              <span className="text-purple-700">Unlimited messaging and browsing</span>
            </div>
            <div className="flex items-center">
              <Check className="text-purple-500 mr-3" size={16} />
              <span className="text-purple-700">Priority profile visibility</span>
            </div>
            <div className="flex items-center">
              <Check className="text-purple-500 mr-3" size={16} />
              <span className="text-purple-700">Exclusive VIP Custom badge</span>
            </div>
            <div className="flex items-center">
              <Check className="text-purple-500 mr-3" size={16} />
              <span className="text-purple-700">Personal admin support</span>
            </div>
          </div>

          {currentUser.customMembership?.freeUntil && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200">
              <p className="text-sm text-purple-700">
                <strong>Access until:</strong> {currentUser.customMembership.freeUntil.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <h3 className="font-semibold text-green-800 mb-2">🎉 You're All Set!</h3>
          <p className="text-sm text-green-700">
            Your VIP Custom membership gives you full access to all platform features. 
            Enjoy connecting with other elite members!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-coral-500 to-rose-500 p-3 rounded-full">
            <Crown className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Choose Your Membership</h1>
        <p className="text-gray-600">Your profile has been approved! Select your membership tier to unlock full access.</p>
      </div>

      {/* Membership Tiers */}
      <div className="space-y-4 mb-8">
        {/* Basic Membership */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-200 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Shield className="text-blue-500" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">{adminSettings.membershipTiers.basic.name}</h3>
                <p className="text-sm text-gray-600">Essential features for meaningful connections</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                ${adminSettings.membershipTiers.basic.amount}
              </div>
              <div className="text-sm text-gray-600">per month</div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {adminSettings.membershipTiers.basic.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center">
                <Check className="text-blue-500 mr-3" size={16} />
                <span className="text-gray-700 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleTierSelection('Basic')}
            disabled={isProcessing}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isProcessing && selectedTier === 'Basic' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Choose Basic'
            )}
          </button>
        </div>

        {/* VIP Membership */}
        <div className="bg-gradient-to-br from-gold-50 to-yellow-50 rounded-2xl p-6 shadow-sm border-2 border-gold-300 hover:border-gold-400 transition-colors relative">
          <div className="absolute top-4 right-4">
            <div className="bg-gold-400 text-white px-2 py-1 rounded-full text-xs font-bold">
              POPULAR
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="bg-gold-100 p-2 rounded-full mr-3">
                <Star className="text-gold-500" size={20} fill="currentColor" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gold-800">{adminSettings.membershipTiers.vip.name}</h3>
                <p className="text-sm text-gold-700">Premium experience with exclusive benefits</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gold-600">
                ${adminSettings.membershipTiers.vip.amount}
              </div>
              <div className="text-sm text-gold-700">per month</div>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            {adminSettings.membershipTiers.vip.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center">
                <Check className="text-gold-500 mr-3" size={16} />
                <span className="text-gold-800 text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleTierSelection('VIP')}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-gold-500 to-yellow-500 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-shadow disabled:opacity-50"
          >
            {isProcessing && selectedTier === 'VIP' ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Choose VIP'
            )}
          </button>
        </div>
      </div>

      {/* VIP Custom Available */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm border-2 border-purple-300 hover:border-purple-400 transition-colors">
        <div className="flex items-center mb-3">
          <Zap className="text-purple-500 mr-2" size={16} />
          <h3 className="text-lg font-semibold text-purple-800">VIP Custom Available</h3>
        </div>
        <p className="text-purple-700 leading-relaxed">
          VIP Custom memberships are exclusively assigned by our admin team based on special circumstances or partnerships. 
          If you believe you qualify for VIP Custom access, please contact our support team.
        </p>
        <div className="mt-4 bg-white bg-opacity-60 rounded-xl p-3 border border-purple-200">
          <div className="flex items-center text-purple-800">
            <Zap className="text-purple-600 mr-2" size={14} />
            <span className="text-sm font-medium">Exclusive admin-assigned membership tier</span>
          </div>
        </div>
        
        <button
          onClick={() => {
            const subject = encodeURIComponent('VIP Custom Membership Inquiry');
            const body = encodeURIComponent(`Hello Admin,

I am interested in learning more about VIP Custom membership for ${currentUser.name}.

Profile Details:
- Name: ${currentUser.name}
- Age: ${currentUser.age}
- Location: ${currentUser.location}
- Profile Link: ${window.location.origin}/profile/${currentUser.profileLink}

Please let me know if I qualify for VIP Custom access and what the next steps would be.

Thank you for your time!

Best regards,
${currentUser.name}`);
            
            window.location.href = `mailto:${adminSettings.adminContactEmail}?subject=${subject}&body=${body}`;
          }}
          disabled={isProcessing}
          className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-shadow disabled:opacity-50 flex items-center justify-center"
        >
          <Mail size={16} className="mr-2" />
          Contact Admin for VIP Custom
        </button>
      </div>

      {/* Security Notice */}
      <div className="mt-6 bg-gray-50 border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center mb-2">
          <CreditCard className="text-gray-500 mr-2" size={16} />
          <h3 className="font-semibold text-gray-800">Secure Payment</h3>
        </div>
        <p className="text-sm text-gray-600">
          All payments are processed securely. You can cancel your membership at any time. 
          Your membership will remain active until the end of your billing period.
        </p>
      </div>
    </div>
  );
};

export default MembershipSelectionPage;