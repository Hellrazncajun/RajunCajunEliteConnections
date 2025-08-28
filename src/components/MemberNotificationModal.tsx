import React, { useState } from 'react';
import { Mail, Copy, ExternalLink, X, Send } from 'lucide-react';
import { generateMailtoLink, copyEmailToClipboard } from '../utils/emailService';
import type { User } from '../types/User';

interface MemberNotificationModalProps {
  user: User;
  notification: {
    title: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  };
  onClose: () => void;
}

const MemberNotificationModal: React.FC<MemberNotificationModalProps> = ({
  user,
  notification,
  onClose
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopyEmail = async () => {
    const success = await copyEmailToClipboard(user.email, notification.title, notification.message);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleOpenMailto = () => {
    const mailtoLink = generateMailtoLink(user.email, notification.title, notification.message);
    window.location.href = mailtoLink;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Mail className="text-blue-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Send Member Notification</h3>
              <p className="text-sm text-gray-600">To: {user.name} ({user.email})</p>
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
          {/* Email Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line:</label>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="font-medium text-gray-800">{notification.title}</p>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Content:</label>
            <div className="bg-gray-50 p-4 rounded-lg border max-h-64 overflow-y-auto">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                {notification.message}
              </div>
            </div>
          </div>

          {/* Manual Sending Options */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-800">Manual Sending Options (Free):</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Copy to Clipboard */}
              <button
                onClick={handleCopyEmail}
                className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Copy size={16} className="mr-2" />
                {copySuccess ? 'Copied!' : 'Copy Email Content'}
              </button>

              {/* Open Email Client */}
              <button
                onClick={handleOpenMailto}
                className="flex items-center justify-center px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <ExternalLink size={16} className="mr-2" />
                Open in Email Client
              </button>
            </div>

            {/* Individual Copy Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => navigator.clipboard.writeText(user.email)}
                className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <Copy size={14} className="mr-1" />
                Copy Email Address
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(notification.title)}
                className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <Copy size={14} className="mr-1" />
                Copy Subject
              </button>
              <button
                onClick={() => navigator.clipboard.writeText(notification.message)}
                className="flex items-center px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <Copy size={14} className="mr-1" />
                Copy Message
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">📧 How to Send Manually (Free):</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Click "Open in Email Client" to auto-populate your email app</li>
              <li>OR copy the content and paste into Gmail, Outlook, etc.</li>
              <li>Verify the recipient email: <strong>{user.email}</strong></li>
              <li>Send the email from your personal or business email account</li>
            </ol>
            <p className="text-xs text-blue-600 mt-2">
              💡 This method is completely free and gives you full control over delivery
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberNotificationModal;