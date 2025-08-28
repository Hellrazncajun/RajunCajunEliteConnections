import React, { useState } from 'react';
import { X, Calendar, CreditCard, DollarSign } from 'lucide-react';
import type { User } from '../types/User';

interface CustomChargeModalProps {
  user: User;
  modalTitle: string;
  initialFreeOverride: boolean;
  onClose: () => void;
  onSave: (userId: number, chargeData: CustomChargeData) => void;
}

export interface CustomChargeData {
  amount: number;
  currency: string;
  duration: number; // in days
  endDate: Date;
  membershipType: 'basic' | 'vip';
  description: string;
  isFreeOverride: boolean;
  freeUntil?: Date;
}

const CustomChargeModal: React.FC<CustomChargeModalProps> = ({
  user,
  modalTitle,
  initialFreeOverride,
  onClose,
  onSave
}) => {
  const getDefaultAmount = (membershipType: 'basic' | 'vip' | 'vip_custom'): number => {
    if (membershipType === 'basic') {
      return user.gender === 'male' ? 29.99 : 0;
    } else if (membershipType === 'vip') {
      return user.gender === 'male' ? 49.99 : 0;
    } else if (membershipType === 'vip_custom') {
      return user.gender === 'male' ? 99.99 : 0;
    }
    return 0;
  };

  const getDefaultDescription = (membershipType: 'basic' | 'vip' | 'vip_custom', isFreeOverride: boolean): string => {
    if (isFreeOverride) {
      if (membershipType === 'vip_custom') {
        return 'VIP Custom Access - Admin Granted';
      }
      return 'Free Override Access - Admin Granted';
    }
    
    if (membershipType === 'basic') {
      return 'Basic Membership';
    } else if (membershipType === 'vip') {
      return 'VIP Membership';
    } else if (membershipType === 'vip_custom') {
      return 'VIP Custom Membership';
    }
    return 'Custom Membership';
  };

  const [chargeData, setChargeData] = useState<CustomChargeData>({
    amount: user.gender === 'male' ? 29.99 : 0,
    currency: 'USD',
    duration: 30,
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    membershipType: 'basic',
    description: `${user.gender === 'male' ? 'Basic' : 'Free'} Membership`,
    isFreeOverride: initialFreeOverride,
    freeUntil: initialFreeOverride ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
    isVipCustom: false,
    customMembershipType: 'standard_free'
  });

  const handleDurationChange = (days: number) => {
    const newEndDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setChargeData(prev => ({
      ...prev,
      duration: days,
      endDate: newEndDate,
      freeUntil: prev.isFreeOverride ? newEndDate : undefined
    }));
  };

  const handleEndDateChange = (dateString: string) => {
    const newEndDate = new Date(dateString);
    const today = new Date();
    const diffTime = newEndDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    setChargeData(prev => ({
      ...prev,
      endDate: newEndDate,
      duration: Math.max(1, diffDays),
      freeUntil: prev.isFreeOverride ? newEndDate : undefined
    }));
  };

  const handleMembershipTypeChange = (type: 'basic' | 'vip' | 'vip_custom') => {
    const defaultAmount = chargeData.isFreeOverride ? 0 : getDefaultAmount(type);
    const description = getDefaultDescription(type, chargeData.isFreeOverride);
    
    setChargeData(prev => ({
      ...prev,
      membershipType: type,
      amount: defaultAmount,
      description: description,
      isVipCustom: type === 'vip_custom',
      customMembershipType: chargeData.isFreeOverride 
        ? (type === 'vip_custom' ? 'vip_custom_free' : 'standard_free')
        : undefined
    }));
  };

  const handleFreeOverrideToggle = () => {
    const newFreeOverride = !chargeData.isFreeOverride;
    const newAmount = newFreeOverride ? 0 : getDefaultAmount(chargeData.membershipType);
    const newDescription = getDefaultDescription(chargeData.membershipType, newFreeOverride);
    
    setChargeData(prev => ({
      ...prev,
      isFreeOverride: newFreeOverride,
      amount: newAmount,
      description: newDescription,
      freeUntil: newFreeOverride ? prev.endDate : undefined,
      customMembershipType: newFreeOverride 
        ? (prev.membershipType === 'vip_custom' ? 'vip_custom_free' : 'standard_free')
        : undefined
    }));
  };

  const handleSave = () => {
    onSave(user.id, chargeData);
    onClose();
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">{modalTitle}</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-purple-700">
                Grant free access for the selected membership type
              </p>
              <button
                onClick={handleFreeOverrideToggle}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  chargeData.isFreeOverride ? 'bg-purple-500' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  chargeData.isFreeOverride ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
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
                <p className="text-sm text-gray-600 capitalize">Current: {user.membershipStatus}</p>
              </div>
            </div>
          </div>

          {/* Free Override Toggle (for all members) */}
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200">
            <div>
              <h4 className="font-semibold text-purple-800">Free Override</h4>
              <p className="text-sm text-purple-700">Grant free access instead of charging</p>
            </div>
            <button
              onClick={() => setChargeData(prev => ({
                ...prev,
                isFreeOverride: !prev.isFreeOverride,
                amount: !prev.isFreeOverride ? 0 : (user.gender === 'male' ? 29.99 : 0),
                freeUntil: !prev.isFreeOverride ? prev.endDate : undefined,
                customMembershipType: !prev.isFreeOverride ? 'standard_free' : undefined,
                isVipCustom: false
              }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                chargeData.isFreeOverride ? 'bg-purple-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                chargeData.isFreeOverride ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>

          {/* Custom Membership Type (only when free override is enabled) */}
          {chargeData.isFreeOverride && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Custom Membership Type
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleMembershipTypeChange('basic')}
                  className={`p-4 rounded-xl border-2 transition-colors text-left ${
                    chargeData.customMembershipType === 'standard_free'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-800">Standard Free Access</h4>
                    <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
                      {chargeData.customMembershipType === 'standard_free' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Grant temporary free access to platform features
                  </p>
                  <div className="mt-2 text-xs text-blue-600">
                    • Access to basic features
                    • Standard member privileges
                    • Time-limited access
                  </div>
                </button>

                <button
                  onClick={() => handleMembershipTypeChange('vip_custom')}
                  className={`p-4 rounded-xl border-2 transition-colors text-left ${
                    chargeData.customMembershipType === 'vip_custom'
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-purple-800 flex items-center">
                      <span className="mr-2">👑</span>
                      VIP Custom Access
                    </h4>
                    <div className="w-4 h-4 rounded-full border-2 border-purple-500 flex items-center justify-center">
                      {chargeData.customMembershipType === 'vip_custom' && (
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-purple-700">
                    Grant exclusive VIP Custom status with all premium features
                  </p>
                  <div className="mt-2 text-xs text-purple-600">
                    • All VIP features included
                    • Exclusive VIP Custom badge
                    • Premium profile visibility
                    • Personal admin support
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Charge Amount (only if not free override) */}
          {!chargeData.isFreeOverride && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Charge Amount
              </label>
              <div className="flex items-center">
                <DollarSign className="text-gray-400 mr-2" size={20} />
                <input
                  type="number"
                  step="0.01"
                  value={chargeData.amount}
                  onChange={(e) => setChargeData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <select
                  value={chargeData.currency}
                  onChange={(e) => setChargeData(prev => ({ ...prev, currency: e.target.value }))}
                  className="ml-2 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="PHP">PHP</option>
                </select>
              </div>
            </div>
          )}

          {/* Membership Type (only if not free override) */}
          {!chargeData.isFreeOverride && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Membership Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setChargeData(prev => ({ 
                    ...prev, 
                    membershipType: 'basic',
                    amount: 29.99,
                    description: 'Basic Membership'
                  }))}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    chargeData.membershipType === 'basic'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">Basic</div>
                  <div className="text-sm">$29.99/month</div>
                </button>
                <button
                  onClick={() => setChargeData(prev => ({ 
                    ...prev, 
                    membershipType: 'vip',
                    amount: 49.99,
                    description: 'VIP Membership'
                  }))}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    chargeData.membershipType === 'vip'
                      ? 'border-gold-500 bg-gold-50 text-gold-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold">VIP</div>
                  <div className="text-sm">$49.99/month</div>
                </button>
                <button
                  onClick={() => setChargeData(prev => ({ 
                    ...prev, 
                    membershipType: 'vip_custom',
                    amount: user.gender === 'male' ? 99.99 : 0,
                    description: 'VIP Custom Membership'
                  }))}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    chargeData.membershipType === 'vip_custom'
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold flex items-center">
                    <span className="mr-1">👑</span>
                    VIP Custom
                  </div>
                  <div className="text-sm">$99.99/month</div>
                </button>
              </div>
            </div>
          )}

          {/* Duration Presets */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration Presets
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[7, 30, 60, 90].map(days => (
                <button
                  key={days}
                  onClick={() => handleDurationChange(days)}
                  className={`p-2 rounded-lg border text-sm transition-colors ${
                    chargeData.duration === days
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>

          {/* Custom Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Duration (Days)
            </label>
            <input
              type="number"
              min="1"
              value={chargeData.duration}
              onChange={(e) => handleDurationChange(parseInt(e.target.value) || 1)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline mr-2" size={16} />
              End Date
            </label>
            <input
              type="date"
              value={formatDateForInput(chargeData.endDate)}
              onChange={(e) => handleEndDateChange(e.target.value)}
              min={formatDateForInput(new Date())}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <p className="text-sm text-gray-600 mt-1">
              Membership will expire on {chargeData.endDate.toLocaleDateString()}
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={chargeData.description}
              onChange={(e) => setChargeData(prev => ({ ...prev, description: e.target.value }))}
              disabled={chargeData.isFreeOverride && chargeData.membershipType !== 'vip_custom'}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Custom membership description"
            />
            {chargeData.isFreeOverride && chargeData.membershipType !== 'vip_custom' && (
              <p className="text-xs text-purple-600 mt-1">
                Description is automatically set for free override memberships
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-2">Summary</h4>
            <div className="space-y-1 text-sm text-green-700">
              <div className="flex justify-between">
                <span>Member:</span>
                <span>{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Type:</span>
                <span>
                  {chargeData.isFreeOverride 
                    ? (chargeData.customMembershipType === 'vip_custom' ? '👑 VIP Custom' : 'Free Override')
                    : `${chargeData.membershipType} Membership`
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>{chargeData.isFreeOverride ? 'FREE' : `$${chargeData.amount} ${chargeData.currency}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span>{chargeData.duration} days</span>
              </div>
              <div className="flex justify-between">
                <span>Expires:</span>
                <span>{chargeData.endDate.toLocaleDateString()}</span>
              </div>
            </div>
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
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold hover:shadow-md transition-shadow"
            >
              {chargeData.isFreeOverride ? 'Grant Free Access' : 'Process Charge'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomChargeModal;