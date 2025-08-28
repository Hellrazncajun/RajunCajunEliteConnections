export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female';
  location: string;
  photos: string[];
  bio: string;
  interests: string[];
  job: string;
  isPremium?: boolean;
  profileLink: string;
  isActive: boolean;
  inviteCode?: string;
  questionnaire?: QuestionnaireResponse[];
  idVerification?: {
    imageUrl: string;
    uploadedAt: Date;
    verified: boolean;
    verificationResult?: IDVerificationResult;
  };
  membershipStatus: 'free' | 'paid' | 'expired';
  membershipExpiresAt?: Date;
  paymentHistory?: Payment[];
  customMembership?: {
    isFreeOverride: boolean;
    freeUntil?: Date;
    reason?: string;
    chargeAmount?: number;
    chargeCurrency?: string;
    chargeDescription?: string;
  };
  permissions?: {
    canViewProfiles: boolean;
    canSearchProfiles: boolean;
    canMessageMembers: boolean;
    canReceiveMessages: boolean;
    canBrowseMembers: boolean;
    profileVisibility: 'public' | 'limited' | 'hidden';
    approvedViewers?: number[]; // User IDs who can view this limited profile
    notes?: string;
  };
  layoutPreference?: 'card' | 'list' | 'grid' | 'sidebar';
  profileVideo?: {
    platform: 'youtube' | 'tiktok';
    videoId: string;
    embedUrl: string;
    url: string;
    title: string;
    description?: string;
  };
}

export interface Question {
  id: number;
  question: string;
  type: 'text' | 'textarea' | 'select';
  options?: string[];
  required: boolean;
  category: string;
}

export interface QuestionnaireResponse {
  questionId: number;
  question: string;
  answer: string | string[];
}

export interface Match extends User {
  matchDate: Date;
  lastMessage?: string;
  isOnline?: boolean;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface InviteCode {
  id: string;
  code: string;
  email: string;
  used: boolean;
  createdAt: Date;
  expiresAt: Date;
}

export interface Payment {
  id: string;
  userId: number;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  stripePaymentId?: string;
  description?: string;
  customCharge?: boolean;
  adminNotes?: string;
  isVipCustom?: boolean;
  customMembershipType?: 'standard_free' | 'vip_custom_free';
}

export interface AdminSettings {
  siteName: string;
  siteTagline: string;
  adminContactEmail: string;
  idVerification: {
    enabled: boolean;
    aiVerification: boolean;
    confidenceThreshold: number;
    autoApprove: boolean;
    requireManualReview: boolean;
  };
  aiMatching: {
    enabled: boolean;
    compatibilityThreshold: number; // 0-100
    weightings: {
      lifestyle: number;
      values: number;
      personality: number;
      physicalPreferences: number;
      relationshipGoals: number;
    };
    autoSuggestMatches: boolean;
  };
  membershipTiers: {
    basic: {
      name: string;
      amount: number;
      currency: string;
      duration: number; // in days
      features: string[];
    };
    vip: {
      name: string;
      amount: number;
      currency: string;
      duration: number; // in days
      features: string[];
    };
  };
  bankAccount: {
    accountNumber: string;
    routingNumber: string;
    accountName: string;
  };
  memberStatsVisibility: {
    showActiveMemberCount: boolean;
  };
  youtubeVideo: {
    enabled: boolean;
    videoUrl: string;
    title: string;
    description: string;
    placement?: 'top' | 'middle' | 'bottom';
  };
  aboutWebsiteSection: {
    title: string;
    content: string;
  };
  profileVisibility: {
    allowMemberBrowsing: boolean;
    allowMemberSearch: boolean;
    requireMutualMatch: boolean;
    adminApprovalRequired: boolean;
  };
  questionnaire: {
    men: {
      introText: string;
      questions: Question[];
    };
    women: {
      introText: string;
      questions: Question[];
    };
  };
}

export interface IDVerificationResult {
  isMatch: boolean;
  confidence: number;
  matchScore: number;
  reasons: string[];
  concerns: string[];
  timestamp: Date;
  status: 'verified' | 'rejected' | 'needs_review';
}

export interface QuestionComparison {
  questionId: number;
  question: string;
  user1Answer: string | string[];
  user2Answer: string | string[];
  status: 'match' | 'partial' | 'mismatch' | 'not_applicable';
  category: string;
  score: number;
}