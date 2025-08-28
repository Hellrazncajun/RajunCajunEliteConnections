import type { User } from '../types/User';

/**
 * Filter profiles based on gender preferences
 * Men can only see women's profiles, women can only see men's profiles
 */
export const filterProfilesByGender = (profiles: User[], currentUserGender: 'male' | 'female'): User[] => {
  if (currentUserGender === 'male') {
    return profiles.filter(profile => profile.gender === 'female');
  } else if (currentUserGender === 'female') {
    return profiles.filter(profile => profile.gender === 'male');
  }
  return [];
};

/**
 * Check if a user can view another user's profile based on gender rules
 */
export const canViewProfile = (viewerGender: 'male' | 'female', profileGender: 'male' | 'female'): boolean => {
  if (viewerGender === 'male' && profileGender === 'female') return true;
  if (viewerGender === 'female' && profileGender === 'male') return true;
  return false;
};