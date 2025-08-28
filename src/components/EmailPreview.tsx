import React from 'react';
import { Mail, Copy, Eye, X } from 'lucide-react';
import { mockAdminSettings } from '../data/mockData';

interface EmailPreviewProps {
  inviteCode: string;
  recipientEmail: string;
  onClose: () => void;
  adminSettings?: any;
}

const EmailPreview: React.FC<EmailPreviewProps> = ({ 
  inviteCode, 
  recipientEmail, 
  onClose,
  adminSettings = mockAdminSettings
}) => {
  const inviteLink = `${window.location.origin}/invite/${inviteCode}`;
  
  const emailSubject = `🌹 You're Invited to Join ${adminSettings.siteName} - Exclusive Dating Community`;
  
  const emailContent = `
Hello!

You've been personally invited to join ${adminSettings.siteName}, an exclusive and private dating community where meaningful connections are made.

🌟 What makes ${adminSettings.siteName} special:
• Completely private profiles - only accessible via unique links
• Curated community with verified members
• Personal matchmaking assistance from our admin team
• Safe, respectful environment focused on genuine relationships

🎯 Your Personal Invitation:
Invitation Code: ${inviteCode}
Join here: ${inviteLink}

📝 Getting Started:
1. Click the link above or visit our site and enter your invitation code
2. Complete your detailed profile (photos, bio, questionnaire)
3. Upload ID verification for safety
4. Your profile will be reviewed and approved within 24-48 hours
5. Receive your private profile link to share with potential matches

💝 Membership Information:
• Women join completely FREE
• Men: $29.99/month Basic or $49.99/month VIP
• All payments are secure and can be cancelled anytime

🔒 Privacy Promise:
Your profile will NEVER be publicly searchable. Only people with your unique link can view your profile, giving you complete control over who sees your information.

Questions? Simply reply to this email and our admin team will help you personally.

Welcome to a more meaningful way to find love!

Best regards,
The ${adminSettings.siteName} Team

---
This invitation expires in 30 days. Join today to secure your spot in our exclusive community.
  `.trim();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In a real app, show toast notification
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Mail className="text-coral-500 mr-3" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Email Preview</h3>
              <p className="text-sm text-gray-600">To: {recipientEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Email Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Subject Line */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject Line:</label>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="font-medium text-gray-800">{emailSubject}</p>
            </div>
          </div>

          {/* Email Body */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Content:</label>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div className="whitespace-pre-line text-gray-800 leading-relaxed">
                {emailContent}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-3">
            <button
              onClick={() => copyToClipboard(emailSubject)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Copy size={16} className="mr-2" />
              Copy Subject
            </button>
            <button
              onClick={() => copyToClipboard(emailContent)}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Copy size={16} className="mr-2" />
              Copy Email Content
            </button>
            <button
              onClick={() => copyToClipboard(inviteLink)}
              className="flex items-center px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors"
            >
              <Copy size={16} className="mr-2" />
              Copy Invite Link
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-800 mb-2">📧 Email Integration Options:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Manual:</strong> Copy content and send via your email client</li>
              <li>• <strong>Gmail Integration:</strong> Connect your Gmail account for automatic sending</li>
              <li>• <strong>Email Service:</strong> Integrate with Mailgun, SendGrid, or similar</li>
              <li>• <strong>Custom SMTP:</strong> Use your own email server settings</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreview;