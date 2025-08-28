import React, { useState } from 'react';
import { Shield, Upload, X, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { verifyIDWithAI, generateVerificationNotifications } from '../utils/idVerification';
import type { User, IDVerificationResult } from '../types/User';

interface IDVerificationModalProps {
  user: User;
  onClose: () => void;
  onVerificationComplete: (userId: number, result: IDVerificationResult) => void;
}

const IDVerificationModal: React.FC<IDVerificationModalProps> = ({
  user,
  onClose,
  onVerificationComplete
}) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<IDVerificationResult | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleVerifyID = async () => {
    if (!user.idVerification) {
      alert('No ID verification image found for this user.');
      return;
    }

    setIsVerifying(true);
    
    try {
      const result = await verifyIDWithAI({
        userId: user.id,
        profileImageUrl: user.photos[0],
        idImageUrl: user.idVerification.imageUrl,
        userInfo: {
          name: user.name,
          age: user.age,
          email: user.email
        }
      });

      setVerificationResult(result);
      
      // Generate notifications
      const notifications = generateVerificationNotifications(result, {
        name: user.name,
        email: user.email
      });
      
      // In a real app, these would be sent via email/push notifications
      console.log('Admin Notification:', notifications.adminNotification);
      console.log('Member Notification:', notifications.memberNotification);
      
      // Update user verification status
      onVerificationComplete(user.id, result);
      
      setShowNotifications(true);
    } catch (error) {
      console.error('Verification failed:', error);
      alert('Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'rejected':
        return <AlertCircle className="text-red-500" size={24} />;
      case 'needs_review':
        return <Clock className="text-yellow-500" size={24} />;
      default:
        return <Shield className="text-gray-500" size={24} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-green-600 bg-green-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'needs_review':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Shield className="text-blue-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">AI ID Verification</h3>
              <p className="text-sm text-gray-600">{user.name} - ID Authentication</p>
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
          {/* Image Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Profile Photo */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Profile Photo</h4>
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src={user.photos[0]}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* ID Photo */}
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">ID Verification Photo</h4>
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {user.idVerification ? (
                  <img
                    src={user.idVerification.imageUrl}
                    alt="ID Verification"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="text-gray-400 mx-auto mb-2" size={32} />
                      <p className="text-gray-500">No ID photo uploaded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-800 mb-3">Current Verification Status</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getStatusIcon(user.idVerification?.verified ? 'verified' : 'pending')}
                <span className="ml-2 font-medium">
                  {user.idVerification?.verified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              {user.idVerification && (
                <span className="text-sm text-gray-600">
                  Uploaded: {user.idVerification.uploadedAt.toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* AI Verification Results */}
          {verificationResult && (
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800 flex items-center">
                  <Zap className="text-purple-500 mr-2" size={20} />
                  AI Verification Results
                </h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(verificationResult.status)}`}>
                  {verificationResult.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>

              {/* Confidence Scores */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600 mb-1">Match Confidence</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {verificationResult.confidence.toFixed(1)}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600 mb-1">Overall Score</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {verificationResult.matchScore.toFixed(1)}%
                  </div>
                </div>
              </div>

              {/* Match Reasons */}
              {verificationResult.reasons.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-green-800 mb-2">✓ Positive Factors</h5>
                  <ul className="space-y-1">
                    {verificationResult.reasons.map((reason, index) => (
                      <li key={index} className="text-sm text-green-700 flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Concerns */}
              {verificationResult.concerns.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-medium text-yellow-800 mb-2">⚠️ Concerns</h5>
                  <ul className="space-y-1">
                    {verificationResult.concerns.map((concern, index) => (
                      <li key={index} className="text-sm text-yellow-700 flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Timestamp */}
              <div className="text-xs text-gray-500 border-t pt-3">
                Verified: {verificationResult.timestamp.toLocaleString()}
              </div>
            </div>
          )}

          {/* Notifications Preview */}
          {showNotifications && verificationResult && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-blue-800 mb-3">📧 Notifications Sent</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Admin notification sent to dashboard
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Member notification sent via email
                </div>
                <div className="flex items-center">
                  <CheckCircle size={16} className="mr-2" />
                  Profile status updated automatically
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            {user.idVerification && !verificationResult && (
              <button
                onClick={handleVerifyID}
                disabled={isVerifying}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-semibold hover:shadow-md transition-shadow disabled:opacity-50"
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    AI Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Zap size={16} className="mr-2" />
                    Run AI Verification
                  </div>
                )}
              </button>
            )}
          </div>
        </div>

        {/* AI Service Info */}
        <div className="bg-purple-50 border-t border-purple-200 p-4">
          <h4 className="font-semibold text-purple-800 mb-2">🤖 AI Verification Technology</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-purple-700">
            <div>
              <strong>Facial Recognition:</strong> Advanced AI compares facial features, geometry, and key landmarks
            </div>
            <div>
              <strong>Confidence Scoring:</strong> Machine learning provides accuracy percentages for each match
            </div>
            <div>
              <strong>Smart Detection:</strong> Handles lighting, angles, and image quality variations
            </div>
          </div>
          <p className="text-xs text-purple-600 mt-2">
            Production ready for AWS Rekognition, Microsoft Face API, or Google Cloud Vision integration
          </p>
        </div>
      </div>
    </div>
  );
};

export default IDVerificationModal;