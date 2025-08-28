/**
 * Email service utilities for sending notifications to members
 * This file provides functions to send emails via various methods
 */

export interface EmailNotification {
  to: string;
  subject: string;
  message: string;
  type: 'verification' | 'approval' | 'rejection' | 'general';
}

/**
 * Send member notification email via Supabase Edge Function
 * This would call a backend endpoint that handles the actual email sending
 */
export const sendMemberNotificationEmail = async (
  email: string, 
  subject: string, 
  message: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // In a real implementation, this would call your Supabase Edge Function
    // Example: const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, { ... });
    
    console.log('📧 Email would be sent via backend service:');
    console.log('To:', email);
    console.log('Subject:', subject);
    console.log('Message:', message);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // For demo purposes, return success
    return { success: true };
    
  } catch (error) {
    console.error('Failed to send email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Generate mailto link for manual email sending
 * This creates a mailto: URL that opens the user's default email client
 */
export const generateMailtoLink = (
  email: string, 
  subject: string, 
  message: string
): string => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedMessage = encodeURIComponent(message);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedMessage}`;
};

/**
 * Copy email content to clipboard for manual sending
 */
export const copyEmailToClipboard = async (
  email: string, 
  subject: string, 
  message: string
): Promise<boolean> => {
  try {
    const emailContent = `To: ${email}
Subject: ${subject}

${message}`;
    
    await navigator.clipboard.writeText(emailContent);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Email service provider options and their free tier limits
 */
export const EMAIL_PROVIDERS = {
  sendgrid: {
    name: 'SendGrid',
    freeTier: '100 emails/day',
    website: 'https://sendgrid.com',
    pricing: 'Free tier: 100 emails/day, Paid: $14.95/month for 40k emails'
  },
  resend: {
    name: 'Resend',
    freeTier: '3,000 emails/month',
    website: 'https://resend.com',
    pricing: 'Free tier: 3k emails/month, Paid: $20/month for 50k emails'
  },
  mailgun: {
    name: 'Mailgun',
    freeTier: '5,000 emails/month',
    website: 'https://mailgun.com',
    pricing: 'Free tier: 5k emails/month, Paid: $35/month for 50k emails'
  },
  aws_ses: {
    name: 'AWS SES',
    freeTier: '62,000 emails/month (if sent from EC2)',
    website: 'https://aws.amazon.com/ses',
    pricing: 'Very low cost: $0.10 per 1,000 emails'
  }
};