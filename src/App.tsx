import React, { useState } from 'react';
import { Heart, Lock } from 'lucide-react';
import AdminDashboard from './components/AdminDashboard';
import MemberDashboard from './components/MemberDashboard';
import ProfileView from './components/ProfileView';
import InviteSignup from './components/InviteSignup';
import MessagingInterface from './components/MessagingInterface';
import { mockUsers, mockAdminSettings } from './data/mockData';
import type { User } from './types/User';

type AppState = 'login' | 'admin' | 'profile' | 'invite' | 'success' | 'messaging';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('login');
  const [selectedProfileLink, setSelectedProfileLink] = useState<string>('');
  const [inviteCode, setInviteCode] = useState<string>('');
  const [messagingUsers, setMessagingUsers] = useState<{ currentUserId: number; targetUserId: number } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [users, setUsers] = useState(mockUsers);
  
  // Initialize settings with localStorage or defaults
  const [adminSettings, setAdminSettings] = useState(() => {
    // Force clear settings and use low threshold for testing
    if (typeof window !== 'undefined') {
      // Clear any existing settings to force reset
      localStorage.removeItem('adminSettings');
      
      // Set complete default settings with LOW threshold for testing
      const completeSettings = {
        siteName: 'RajunCajun Elite Connections',
        siteTagline: 'Where Elite Singles Connect',
        adminContactEmail: 'admin@rajuncajuneliteconnections.com',
        idVerification: {
          enabled: true,
          aiVerification: true,
          confidenceThreshold: 75,
          autoApprove: true,
          requireManualReview: false
        },
        aiMatching: {
          enabled: true,
          compatibilityThreshold: 10,
          weightings: {
            lifestyle: 20,
            values: 30,
            personality: 25,
            physicalPreferences: 10,
            relationshipGoals: 15
          },
          autoSuggestMatches: true
        },
        membershipTiers: {
          basic: {
            name: 'Basic Membership',
            amount: 29.99,
            currency: 'USD',
            duration: 30,
            features: [
              'Access to all premium features',
              'Unlimited messaging',
              'Profile visibility',
              'Basic customer support',
              'Mobile app access'
            ]
          },
          vip: {
            name: 'VIP Membership',
            amount: 49.99,
            currency: 'USD',
            duration: 30,
            features: [
              'All Basic features',
              'Priority profile visibility',
              'Exclusive VIP badge',
              'Priority customer support',
              'Advanced matching preferences',
              'Early access to new features'
            ]
          }
        },
        bankAccount: {
          accountNumber: '****1234',
          routingNumber: '****5678',
          accountName: 'RajunCajun Elite Connections LLC'
        },
        memberStatsVisibility: {
          showActiveMemberCount: true
        },
        youtubeVideo: {
          enabled: true,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          title: 'Welcome to RajunCajun Elite Connections',
          description: 'Learn more about our exclusive dating community',
          placement: 'middle'
        },
        aboutWebsiteSection: {
          title: 'About RajunCajun Elite Connections',
          content: 'We are an exclusive dating community focused on creating meaningful connections between elite singles. Our platform prioritizes privacy, quality matches, and personalized service to help you find your perfect partner.'
        },
        profileVisibility: {
          allowMemberBrowsing: false,
          allowMemberSearch: false,
          requireMutualMatch: true,
          adminApprovalRequired: true
        },
        questionnaire: {
          men: {
            introText: `This is a questionnaire to assist me in finding a true love match for you or more specifically whatever you are looking for. 
Please answer these honestly. I want to know the real you 😊
Also, it is ok to give a complete explanation and not just one word answers. Take your time and be thorough. 
I cannot express enough how important it is to just be honest. There are no right or wrong answers. This will allow me to know you better for the best match for you. 😊`,
            questions: [
              { id: 1, question: "What is your full name?", type: "text", required: true, category: "basic" },
              { id: 2, question: "Age? Birthdate? Height? Weight?", type: "text", required: true, category: "basic" },
              { id: 3, question: "Are you Male or Female?", type: "select", options: ["Male", "Female"], required: true, category: "basic" },
              { id: 4, question: "What is your status? Single? Married? Divorced? Separated?", type: "select", options: ["Single", "Married", "Divorced", "Separated", "It's complicated"], required: true, category: "basic" },
              { id: 5, question: "What is your sexual orientation? Straight? Bisexual? Gay?", type: "select", options: ["Straight", "Bisexual", "Gay", "Other"], required: true, category: "basic" },
              { id: 6, question: "How would you describe your body type?", type: "textarea", required: true, category: "basic" },
              { id: 7, question: "Where do you live? What Country? What State? What City? What Province?", type: "textarea", required: true, category: "basic" },
              { id: 8, question: "How well do you speak English?", type: "select", options: ["Fluent", "Good", "Basic", "Learning"], required: true, category: "basic" },
              { id: 9, question: "What do you do for work?", type: "textarea", required: true, category: "basic" },
              { id: 10, question: "What is your annual income?", type: "text", required: true, category: "basic" },
              { id: 11, question: "What education level did you complete?", type: "select", options: ["High School", "Some College", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Doctorate", "Other"], required: true, category: "basic" },
              { id: 12, question: "Do you have children? If so, what are their ages?", type: "textarea", required: true, category: "family" },
              { id: 13, question: "Do you want more children?", type: "select", options: ["Yes", "No", "Maybe", "Undecided"], required: true, category: "family" },
              { id: 14, question: "If your Man/Woman does not want to have any newborn children with you is that a deal breaker?", type: "select", options: ["Yes, deal breaker", "No, not a deal breaker", "Depends on circumstances"], required: true, category: "family" },
              { id: 15, question: "What is your preferred age range for your man/woman?", type: "text", required: true, category: "preferences" },
              { id: 16, question: "Do you consider yourself a province woman/man or city woman/man?", type: "select", options: ["Province", "City", "Both", "Neither"], required: true, category: "lifestyle" },
              { id: 17, question: "Are you affectionate and clingy?", type: "select", options: ["Very affectionate", "Moderately affectionate", "Not very affectionate", "It depends"], required: true, category: "personality" },
              { id: 18, question: "When in a committed relationship are you submissive to your man/woman or are you more liberal and independent?", type: "select", options: ["Submissive", "Liberal/Independent", "Balanced", "It depends on the situation"], required: true, category: "relationship" },
              { id: 19, question: "Do you think of yourself as a Traditional Valued or Modern Valued person?", type: "select", options: ["Traditional Valued", "Modern Valued", "Both", "Neither"], required: true, category: "values" },
              { id: 20, question: "Do you smoke?", type: "select", options: ["Yes, regularly", "Occasionally", "No, never", "Trying to quit"], required: true, category: "lifestyle" },
              { id: 21, question: "Do you drink?", type: "select", options: ["Yes, regularly", "Socially", "Occasionally", "No, never"], required: true, category: "lifestyle" },
              { id: 22, question: "Do you like going out sometimes to party?", type: "select", options: ["Love it", "Sometimes", "Rarely", "Never"], required: true, category: "lifestyle" },
              { id: 23, question: "Do you like staying home sometimes relaxing and watching a movie?", type: "select", options: ["Love it", "Often", "Sometimes", "Rarely"], required: true, category: "lifestyle" },
              { id: 24, question: "Do you like hanging out on the beach?", type: "select", options: ["Love it", "Like it", "It's okay", "Don't like it"], required: true, category: "lifestyle" },
              { id: 25, question: "Are you adventurous and outgoing?", type: "select", options: ["Very adventurous", "Somewhat adventurous", "Not very adventurous", "Prefer routine"], required: true, category: "personality" },
              { id: 26, question: "Are you shy?", type: "select", options: ["Very shy", "Somewhat shy", "Not shy", "Depends on the situation"], required: true, category: "personality" },
              { id: 27, question: "Do you consider yourself Introvert or extrovert or ambivert?", type: "select", options: ["Introvert", "Extrovert", "Ambivert"], required: true, category: "personality" },
              { id: 28, question: "Do you like Dogs or cats?", type: "select", options: ["Dogs", "Cats", "Both", "Neither"], required: true, category: "lifestyle" },
              { id: 29, question: "Do you like to work out and exercise?", type: "select", options: ["Love it", "Like it", "It's okay", "Don't like it"], required: true, category: "lifestyle" },
              { id: 30, question: "Do you like to travel?", type: "select", options: ["Love it", "Like it", "It's okay", "Don't like it"], required: true, category: "lifestyle" },
              { id: 31, question: "Do you like to clean house?", type: "select", options: ["Love it", "Don't mind it", "It's okay", "Don't like it"], required: true, category: "lifestyle" },
              { id: 32, question: "Do you like to cook?", type: "select", options: ["Love it", "Like it", "It's okay", "Don't like it"], required: true, category: "lifestyle" },
              { id: 33, question: "Do you dress to impress or comfy?", type: "select", options: ["Always dress to impress", "Usually dress to impress", "Usually comfy", "Always comfy"], required: true, category: "lifestyle" },
              { id: 34, question: "What do you consider good table manners?", type: "textarea", required: true, category: "values" },
              { id: 35, question: "How do you feel about plastic surgery like breast implants?", type: "textarea", required: true, category: "values" },
              { id: 36, question: "How do you feel about PDA (Public Display of Affection)?", type: "select", options: ["Love it", "Like it", "It's okay", "Don't like it"], required: true, category: "relationship" },
              { id: 37, question: "How important is sex to you when in a relationship?", type: "select", options: ["Very important", "Important", "Somewhat important", "Not very important"], required: true, category: "relationship" },
              { id: 38, question: "How big of a part is Social Media in your life?", type: "textarea", required: true, category: "lifestyle" },
              { id: 39, question: "Describe what your best friends would say about you?", type: "textarea", required: true, category: "personality" },
              { id: 40, question: "When in a committed relationship how many times a week do you want to have sex?", type: "select", options: ["Daily", "4-6 times", "2-3 times", "Once a week", "Less than once a week"], required: true, category: "relationship" },
              { id: 41, question: "What is the most important thing in a relationship?", type: "textarea", required: true, category: "values" },
              { id: 42, question: "If there is an age gap in your relationship, how do you feel about taking care of someone when they get really old?", type: "textarea", required: true, category: "relationship" },
              { id: 43, question: "How do you feel about someone being much younger than you in a relationship?", type: "textarea", required: true, category: "relationship" },
              { id: 44, question: "How long has it been since you've had sex?", type: "select", options: ["Less than a month", "1-6 months", "6-12 months", "1-2 years", "More than 2 years", "Never"], required: true, category: "relationship" },
              { id: 45, question: "What is your biggest pet peeve? (Something that really bothers you)", type: "textarea", required: true, category: "personality" },
              { id: 46, question: "Would you rather marry for money or love?", type: "select", options: ["Love", "Money", "Both equally important", "Depends on circumstances"], required: true, category: "values" },
              { id: 47, question: "If your Boyfriend/Girlfriend or husband/wife wanted you to lose weight exercise and work out to get a fit body, what would you tell him/her?", type: "textarea", required: true, category: "relationship" },
              { id: 48, question: "Are you a religious person?", type: "select", options: ["Yes", "No", "Spiritual but not religious"], required: true, category: "values" },
              { id: 49, question: "What is your religion?", type: "text", required: true, category: "values" },
              { id: 50, question: "If you fell in love and got married and you are financially secure no matter where you live. Would you choose to live in the Philippines or the US? Or what other country?", type: "textarea", required: true, category: "preferences" },
              { id: 51, question: "What are you looking for? Date, Marriage, Just for fun, Something else?", type: "select", options: ["Date to marry", "Just for fun", "Something in between", "Not sure yet"], required: true, category: "relationship" },
              { id: 52, question: "Do you expect an allowance from your Boyfriend/Girlfriend? Or are you willing to give an allowance to your Boyfriend/Girlfriend?", type: "textarea", required: true, category: "relationship" },
              { id: 53, question: "What things are most important to you in a man/woman?", type: "textarea", required: true, category: "preferences" },
              { id: 54, question: "What physically do you want in a man/woman? (Tall, Fit, Handsome, Chubby, Hair, Bald, Eye color, Etc.)", type: "textarea", required: true, category: "preferences" },
              { id: 55, question: "What is your opinion of facial hair on a man?", type: "select", options: ["Love it", "Like it", "Don't mind it", "Don't like it", "Hate it"], required: true, category: "preferences" },
              { id: 56, question: "What is your opinion on tattoos on a man/woman?", type: "select", options: ["Love them", "Like them", "Don't mind them", "Don't like them", "Hate them"], required: true, category: "preferences" },
              { id: 57, question: "Are you family oriented?", type: "select", options: ["Yes", "No", "Somewhat"], required: true, category: "family" },
              { id: 58, question: "Do you have a large or small family?", type: "select", options: ["Large", "Small", "Average"], required: true, category: "family" },
              { id: 59, question: "Ever married before?", type: "select", options: ["Yes", "No"], required: true, category: "relationship" },
              { id: 60, question: "What is the longest relationship you've had?", type: "textarea", required: true, category: "relationship" },
              { id: 61, question: "Ever Dated a foreigner?", type: "select", options: ["Yes, many times", "Yes, a few times", "Yes, once", "No, never"], required: true, category: "relationship" },
              { id: 62, question: "Do you live alone or with someone?", type: "textarea", required: true, category: "basic" },
              { id: 63, question: "Do you do drugs? If so what kind?", type: "textarea", required: true, category: "lifestyle" },
              { id: 64, question: "Do you have the financial ability and time off work to visit your Special Someone in their country?", type: "select", options: ["Yes, definitely", "Yes, if needed", "Maybe", "Probably not", "No"], required: true, category: "preferences" },
              { id: 65, question: "How would you best describe your personality?", type: "textarea", required: true, category: "personality" },
              { id: 66, question: "What is the most important thing in life?", type: "textarea", required: true, category: "values" }
            ]
          },
          women: {
            introText: `This is a questionnaire to assist me in finding a true love match for you or more specifically whatever you are looking for. 
Please answer these honestly. I want to know the real you 😊
Also, it is ok to give a complete explanation and not just one word answers. Take your time and be thorough. 
I cannot express enough how important it is to just be honest. There are no right or wrong answers. This will allow me to know you better for the best match for you. 😊`,
            questions: [
              { id: 1, question: "What is your full name?", type: "text", required: true, category: "basic" },
              { id: 2, question: "Age? Birthdate? Height? Weight?", type: "text", required: true, category: "basic" },
              { id: 3, question: "Are you Male or Female?", type: "select", options: ["Male", "Female"], required: true, category: "basic" },
              { id: 4, question: "What is your status? Single? Married? Divorced? Separated?", type: "select", options: ["Single", "Married", "Divorced", "Separated", "It's complicated"], required: true, category: "basic" },
              { id: 5, question: "What is your sexual orientation? Straight? Bisexual? Gay?", type: "select", options: ["Straight", "Bisexual", "Gay", "Other"], required: true, category: "basic" },
              { id: 6, question: "How would you describe your body type?", type: "textarea", required: true, category: "basic" },
              { id: 7, question: "Where do you live? What Country? What State? What City? What Province?", type: "textarea", required: true, category: "basic" },
              { id: 8, question: "How well do you speak English?", type: "select", options: ["Fluent", "Good", "Basic", "Learning"], required: true, category: "basic" },
              { id: 9, question: "What do you do for work?", type: "textarea", required: true, category: "basic" },
              { id: 10, question: "What is your annual income?", type: "text", required: true, category: "basic" },
              { id: 11, question: "What education level did you complete?", type: "select", options: ["High School", "Some College", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Doctorate", "Other"], required: true, category: "basic" },
              { id: 12, question: "Do you have children? If so, what are their ages?", type: "textarea", required: true, category: "family" },
              { id: 13, question: "Do you want more children?", type: "select", options: ["Yes", "No", "Maybe", "Undecided"], required: true, category: "family" },
              { id: 14, question: "If your Man/Woman does not want to have any newborn children with you is that a deal breaker?", type: "select", options: ["Yes, deal breaker", "No, not a deal breaker", "Depends on circumstances"], required: true, category: "family" },
              { id: 15, question: "What is your preferred age range for your man/woman?", type: "text", required: true, category: "preferences" },
              { id: 16, question: "Do you consider yourself a province woman/man or city woman/man?", type: "select", options: ["Province", "City", "Both", "Neither"], required: true, category: "lifestyle" },
              { id: 17, question: "Are you affectionate and clingy?", type: "select", options: ["Very affectionate", "Moderately affectionate", "Not very affectionate", "It depends"], required: true, category: "personality" },
              { id: 18, question: "When in a committed relationship are you submissive to your man/woman or are you more liberal and independent?", type: "select", options: ["Submissive", "Liberal/Independent", "Balanced", "It depends on the situation"], required: true, category: "relationship" },
              { id: 19, question: "Do you think of yourself as a Traditional Valued or Modern Valued person?", type: "select", options: ["Traditional Valued", "Modern Valued", "Both", "Neither"], required: true, category: "values" },
              { id: 20, question: "Do you smoke?", type: "select", options: ["Yes, regularly", "Occasionally", "No, never", "Trying to quit"], required: true, category: "lifestyle" },
              { id: 21, question: "Do you drink?", type: "select", options: ["Yes, regularly", "Socially", "Occasionally", "No, never"], required: true, category: "lifestyle" },
              { id: 22, question: "Do you like going out sometimes to party?", type: "select", options: ["Love it", "Sometimes", "Rarely", "Never"], required: true, category: "lifestyle" },
              { id: 23, question: "Do you like staying home sometimes relaxing and watching a movie?", type: "select", options: ["Love it", "Often", "Sometimes", "Rarely"], required: true, category: "lifestyle" },
              { id: 24, question: "Do you like hanging out on the beach?", type: "select", options: ["Love it", "Like it", "It's okay", "Don't like it"], required: true, category: "lifestyle" },
              { id: 25, question: "Are you adventurous and outgoing?", type: "select", options: ["Very adventurous", "Somewhat adventurous", "Not very adventurous", "Prefer routine"], required: true, category: "personality" },
              { id: 26, question: "Are you shy?", type: "select", options: ["Very shy", "Somewhat shy", "Not shy", "Depends on the situation"], required: true, category: "personality" },
              { id: 27, question: "Do you consider yourself Introvert or extrovert or ambivert?", type: "select", options: ["Introvert", "Extrovert", "Ambivert"], required: true, category: "personality" },
              { id: 28, question: "Do you like Dogs or cats?", type: "select", options: ["Dogs", "Cats", "Both", "Neither"], required: true, category: "lifestyle" },
              { id: 29, question: "Do you like to work out and exercise?", type: "select", options: ["Love it", "Like it", "It's okay", "Don't like it"], required: true, category: "lifestyle" },
              { id: 30, question: "Do you like to travel?", type: "select", options: ["Love it", "Like it", "It's okay", "Don't like it"], required: true, category: "lifestyle" },
              { id: 31, question: "Do you like to clean house?", type: "select", options: ["Love it", "Don't mind it", "It's okay", "Don't like it"], required: true, category: "lifestyle" },
              { id: 32, question: "Do you like to cook?", type: "select", options: ["Love it", "Like it", "It's okay", "Don't like it"], required: true, category: "lifestyle" },
              { id: 33, question: "Do you dress to impress or comfy?", type: "select", options: ["Always dress to impress", "Usually dress to impress", "Usually comfy", "Always comfy"], required: true, category: "lifestyle" },
              { id: 34, question: "What do you consider good table manners?", type: "textarea", required: true, category: "values" },
              { id: 35, question: "How do you feel about plastic surgery like breast implants?", type: "textarea", required: true, category: "values" },
              { id: 36, question: "How do you feel about PDA (Public Display of Affection)?", type: "select", options: ["Love it", "Like it", "It's okay", "Don't like it"], required: true, category: "relationship" },
              { id: 37, question: "How important is sex to you when in a relationship?", type: "select", options: ["Very important", "Important", "Somewhat important", "Not very important"], required: true, category: "relationship" },
              { id: 38, question: "How big of a part is Social Media in your life?", type: "textarea", required: true, category: "lifestyle" },
              { id: 39, question: "Describe what your best friends would say about you?", type: "textarea", required: true, category: "personality" },
              { id: 40, question: "When in a committed relationship how many times a week do you want to have sex?", type: "select", options: ["Daily", "4-6 times", "2-3 times", "Once a week", "Less than once a week"], required: true, category: "relationship" },
              { id: 41, question: "What is the most important thing in a relationship?", type: "textarea", required: true, category: "values" },
              { id: 42, question: "If there is an age gap in your relationship, how do you feel about taking care of someone when they get really old?", type: "textarea", required: true, category: "relationship" },
              { id: 43, question: "How do you feel about someone being much younger than you in a relationship?", type: "textarea", required: true, category: "relationship" },
              { id: 44, question: "How long has it been since you've had sex?", type: "select", options: ["Less than a month", "1-6 months", "6-12 months", "1-2 years", "More than 2 years", "Never"], required: true, category: "relationship" },
              { id: 45, question: "What is your biggest pet peeve? (Something that really bothers you)", type: "textarea", required: true, category: "personality" },
              { id: 46, question: "Would you rather marry for money or love?", type: "select", options: ["Love", "Money", "Both equally important", "Depends on circumstances"], required: true, category: "values" },
              { id: 47, question: "If your Boyfriend/Girlfriend or husband/wife wanted you to lose weight exercise and work out to get a fit body, what would you tell him/her?", type: "textarea", required: true, category: "relationship" },
              { id: 48, question: "Are you a religious person?", type: "select", options: ["Yes", "No", "Spiritual but not religious"], required: true, category: "values" },
              { id: 49, question: "What is your religion?", type: "text", required: true, category: "values" },
              { id: 50, question: "If you fell in love and got married and you are financially secure no matter where you live. Would you choose to live in the Philippines or the US? Or what other country?", type: "textarea", required: true, category: "preferences" },
              { id: 51, question: "What are you looking for? Date, Marriage, Just for fun, Something else?", type: "select", options: ["Date to marry", "Just for fun", "Something in between", "Not sure yet"], required: true, category: "relationship" },
              { id: 52, question: "Do you expect an allowance from your Boyfriend/Girlfriend? Or are you willing to give an allowance to your Boyfriend/Girlfriend?", type: "textarea", required: true, category: "relationship" },
              { id: 53, question: "What things are most important to you in a man/woman?", type: "textarea", required: true, category: "preferences" },
              { id: 54, question: "What physically do you want in a man/woman? (Tall, Fit, Handsome, Chubby, Hair, Bald, Eye color, Etc.)", type: "textarea", required: true, category: "preferences" },
              { id: 55, question: "What is your opinion of facial hair on a man?", type: "select", options: ["Love it", "Like it", "Don't mind it", "Don't like it", "Hate it"], required: true, category: "preferences" },
              { id: 56, question: "What is your opinion on tattoos on a man/woman?", type: "select", options: ["Love them", "Like them", "Don't mind them", "Don't like them", "Hate them"], required: true, category: "preferences" },
              { id: 57, question: "Are you family oriented?", type: "select", options: ["Yes", "No", "Somewhat"], required: true, category: "family" },
              { id: 58, question: "Do you have a large or small family?", type: "select", options: ["Large", "Small", "Average"], required: true, category: "family" },
              { id: 59, question: "Ever married before?", type: "select", options: ["Yes", "No"], required: true, category: "relationship" },
              { id: 60, question: "What is the longest relationship you've had?", type: "textarea", required: true, category: "relationship" },
              { id: 61, question: "Ever Dated a foreigner?", type: "select", options: ["Yes, many times", "Yes, a few times", "Yes, once", "No, never"], required: true, category: "relationship" },
              { id: 62, question: "Do you live alone or with someone?", type: "textarea", required: true, category: "basic" },
              { id: 63, question: "Do you do drugs? If so what kind?", type: "textarea", required: true, category: "lifestyle" },
              { id: 64, question: "Do you have the financial ability and time off work to visit your Special Someone in their country?", type: "select", options: ["Yes, definitely", "Yes, if needed", "Maybe", "Probably not", "No"], required: true, category: "preferences" },
              { id: 65, question: "How would you best describe your personality?", type: "textarea", required: true, category: "personality" },
              { id: 66, question: "What is the most important thing in life?", type: "textarea", required: true, category: "values" }
            ]
          }
        }
      };
      
      // Save the complete settings immediately
      localStorage.setItem('adminSettings', JSON.stringify(completeSettings));
      console.log('🔄 FORCE RESET: Admin settings with 10% threshold:', completeSettings.aiMatching);
      
      return completeSettings;
    }
    
    // Fallback for non-browser environments
    return {
      siteName: 'RajunCajun Elite Connections',
      siteTagline: 'Where Elite Singles Connect',
      ...mockAdminSettings
    };
  });
  
  // Update admin settings and persist changes
  const handleSettingsChange = (newSettings: any) => {
    console.log('💾 Saving updated settings:', newSettings);
    setAdminSettings(newSettings);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminSettings', JSON.stringify(newSettings));
      console.log('✅ Settings successfully saved to localStorage');
    }
  };

  // Check for demo mode and signup demo in URL immediately
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const isDemoMode = urlParams.get('demo') === 'member';
  const isSignupDemo = urlParams.get('signup') === 'demo';
  
  const [demoMode, setDemoMode] = useState(isDemoMode);
  const [signupDemo, setSignupDemo] = useState(isSignupDemo);
  
  // Set initial state based on URL parameters
  const getInitialState = (): AppState => {
    if (isSignupDemo) {
      return 'invite';
    }
    return 'login';
  };
  
  const [initialState] = useState(getInitialState);

  // Simulate URL routing
  React.useEffect(() => {
    const path = window.location.pathname;
    const urlParams = new URLSearchParams(window.location.search);
    
    // If signup demo, go directly to invite signup
    if (urlParams.get('signup') === 'demo') {
      setInviteCode('DEMO-SIGNUP-2024');
      setCurrentState('invite');
      return;
    }
    
    // Check for demo mode
    if (urlParams.get('demo') === 'member') {
      setDemoMode(true);
      setCurrentState('login');
      return;
    }
    
    if (path.startsWith('/profile/')) {
      const profileLink = path.replace('/profile/', '');
      setSelectedProfileLink(profileLink);
      setCurrentState('profile');
    } else if (path.startsWith('/invite/')) {
      const code = path.replace('/invite/', '');
      setInviteCode(code);
      setCurrentState('invite');
    } else if (path === '/' || path === '/admin') {
      setCurrentState('login');
    } else {
      setCurrentState('login');
    }
  }, []);
  
  // Override currentState if we detected signup demo initially
  React.useEffect(() => {
    if (initialState === 'invite' && inviteCode === '') {
      setInviteCode('DEMO-SIGNUP-2024');
      setCurrentState('invite');
    }
  }, [initialState, inviteCode]);

  const handleLogin = (password: string) => {
    // Demo mode - simulate member login
    if (demoMode) {
      // In demo mode, any password works
      setIsAuthenticated(true);
      setCurrentState('admin'); // Will show member interface due to demoMode
      setLoginError('');
      return;
    }
    
    // In a real app, this would be a secure authentication system
    // For now, using a simple password check
    const adminPassword = 'RajunCajun@007'; // Change this to your secure password
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setCurrentState('admin');
      setLoginError('');
      window.history.pushState({}, '', '/admin');
    } else {
      setLoginError('Invalid password. Please try again.');
    }
  };

  const handleViewProfile = (profileLink: string) => {
    setSelectedProfileLink(profileLink);
    setCurrentState('profile');
    // In a real app, this would update the URL
    window.history.pushState({}, '', `/profile/${profileLink}`);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
    
    // If we're currently viewing this profile, update the URL if the profile link changed
    if (selectedProfileLink === updatedUser.profileLink || 
        users.find(u => u.profileLink === selectedProfileLink)?.id === updatedUser.id) {
      setSelectedProfileLink(updatedUser.profileLink);
      window.history.pushState({}, '', `/profile/${updatedUser.profileLink}`);
    }
  };

  const handleMessageUser = (targetUserId: number) => {
    setMessagingUsers({ currentUserId: 1, targetUserId }); // Admin is user ID 1
    setCurrentState('messaging');
  };

  const handleBackToAdmin = () => {
    setCurrentState(isAuthenticated ? 'admin' : 'login');
    setSelectedProfileLink('');
    setMessagingUsers(null);
    window.history.pushState({}, '', '/');
  };

  const handleSignupComplete = () => {
    setCurrentState('success');
    // Ensure we don't redirect to admin login after signup
    window.history.pushState({}, '', '/signup-complete');
  };

  const renderContent = () => {
    switch (currentState) {
      case 'login':
        return <AdminLogin onLogin={handleLogin} error={loginError} demoMode={demoMode} adminSettings={adminSettings} />;
        
      case 'admin':
        if (!isAuthenticated) {
          return <AdminLogin onLogin={handleLogin} error={loginError} demoMode={demoMode} adminSettings={adminSettings} />;
        }
        
        // Demo mode shows member interface
        if (demoMode) {
          return <MemberDashboard adminSettings={adminSettings} />;
        }
        
        return (
          <AdminDashboard 
            onViewProfile={handleViewProfile} 
            onMessageUser={handleMessageUser}
            adminSettings={adminSettings}
            onSettingsChange={handleSettingsChange}
            onLogout={() => {
              setIsAuthenticated(false);
              setCurrentState('login');
              setDemoMode(false);
              window.history.pushState({}, '', '/');
            }}
          />
        );
      
      case 'profile':
        const user = users.find(u => u.profileLink === selectedProfileLink);
        if (!user) {
          return (
            <div className="flex items-center justify-center min-h-screen px-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-coral-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-coral-500" size={32} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
                <p className="text-gray-600 mb-6">This profile link is invalid or has been removed.</p>
                <button
                  onClick={handleBackToAdmin}
                  className="bg-gradient-to-r from-coral-500 to-rose-500 text-white px-6 py-3 rounded-full font-medium"
                >
                  Go to Admin Dashboard
                </button>
              </div>
            </div>
          );
        }
        return (
          <ProfileView 
            user={user} 
            onBack={handleBackToAdmin} 
            isAdmin={!demoMode}
            onMessage={() => handleMessageUser(user.id)}
            onUpdateUser={handleUpdateUser}
          />
        );
      
      case 'invite':
        return <InviteSignup inviteCode={inviteCode} onComplete={handleSignupComplete} adminSettings={adminSettings} />;
      
      case 'messaging':
        if (!messagingUsers) {
          if (demoMode) {
            return <MemberDashboard adminSettings={adminSettings} />;
          }
          return <AdminDashboard onViewProfile={handleViewProfile} onMessageUser={handleMessageUser} adminSettings={adminSettings} onSettingsChange={handleSettingsChange} onLogout={() => {
            setIsAuthenticated(false);
            setCurrentState('login');
            setDemoMode(false);
            window.history.pushState({}, '', '/');
          }} />;
        }
        return (
          <MessagingInterface
            currentUserId={messagingUsers.currentUserId}
            targetUserId={messagingUsers.targetUserId}
            onBack={handleBackToAdmin}
            isAdmin={!demoMode}
          />
        );
      
      case 'success':
        return (
          <div className="flex items-center justify-center min-h-screen px-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-green-500" size={32} fill="currentColor" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Created Successfully!</h2>
              <p className="text-gray-600 mb-6">
                Your profile has been created and is under review. You'll receive your unique profile link via email once approved by our admin team.
              </p>
              <div className="bg-coral-50 border border-coral-200 rounded-2xl p-4 mb-6">
                <h3 className="font-semibold text-coral-800 mb-2">What happens next?</h3>
                <ul className="text-sm text-coral-700 space-y-1 text-left">
                  <li>• Your profile will be reviewed within 24-48 hours</li>
                  <li>• ID verification will be processed</li>
                  <li>• You'll receive your private profile link via email</li>
                  <li>• Only people with your link can view your profile</li>
                </ul>
              </div>
              <button
                onClick={() => {
                  // Close the window or redirect to a neutral page
                  window.close();
                  // If window.close() doesn't work (some browsers block it), redirect to a thank you page
                  setTimeout(() => {
                    window.location.href = 'about:blank';
                  }, 100);
                }}
                className="bg-gradient-to-r from-coral-500 to-rose-500 text-white px-6 py-3 rounded-full font-medium"
              >
                Complete Registration
              </button>
              <p className="text-xs text-gray-500 mt-4">
                You can safely close this window. Check your email for updates on your profile status.
              </p>
            </div>
          </div>
        );
      
      default:
        return <AdminLogin onLogin={handleLogin} error={loginError} demoMode={demoMode} adminSettings={adminSettings} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50">
      <div className={`mx-auto bg-white min-h-screen shadow-xl ${
        currentState === 'messaging' ? 'max-w-2xl' : 'max-w-md'
      }`}>
        {renderContent()}
      </div>
    </div>
  );
}

interface AdminLoginProps {
  onLogin: (password: string) => void;
  error: string;
  demoMode?: boolean;
  adminSettings?: any;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, error, demoMode = false, adminSettings }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(password);
  };

  const siteName = adminSettings?.siteName || 'RajunCajun Elite Connections';
  return (
    <div className="flex items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-coral-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {demoMode ? 'Member Demo Mode' : 'Admin Access'}
          </h2>
          <p className="text-gray-600">
            {demoMode 
              ? 'Enter any password to experience the member interface' 
              : `Enter your password to access ${siteName}`
            }
          </p>
          {demoMode && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-700">
                🎭 <strong>Demo Mode:</strong> You're testing the member experience
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {demoMode ? 'Demo Password (any text)' : 'Admin Password'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
              placeholder={demoMode ? "Enter any password" : "Enter admin password"}
              required
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-coral-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-shadow"
          >
            {demoMode ? 'Enter Member Demo' : 'Access Dashboard'}
          </button>
        </form>

        {/* Demo Links - Always Visible */}
        <div className="mt-6 space-y-3">
          <div className="text-center">
            <a
              href="?demo=member"
              className="text-blue-500 hover:text-blue-600 text-sm font-medium underline block"
            >
              🎭 Want to test the member experience?
            </a>
          </div>
          <div className="text-center">
            <a
              href="?signup=demo"
              className="text-purple-500 hover:text-purple-600 text-sm font-medium underline block"
            >
              📝 Want to test the member signup process?
            </a>
          </div>
        </div>
        
        <p className="text-xs text-gray-500 text-center mt-4">
          {demoMode 
            ? 'Demo mode - experience what members see'
            : 'Only authorized administrators can access this area'
          }
        </p>
      </div>
    </div>
  );
};

export default App;