import { describe, it, expect } from 'vitest';
import { calculateCompatibilityScore, generateMatchSuggestions } from '../utils/aiMatching';
import { mockUsers, mockAdminSettings } from '../data/mockData';

describe('AI Matching System', () => {
  const user1 = mockUsers[0]; // Alex (male)
  const user2 = mockUsers[1]; // Sarah (female)

  it('calculates compatibility score between users', () => {
    const score = calculateCompatibilityScore(user1, user2, mockAdminSettings.aiMatching.weightings);
    
    expect(score.userId).toBe(user2.id);
    expect(score.compatibilityScore).toBeGreaterThanOrEqual(0);
    expect(score.compatibilityScore).toBeLessThanOrEqual(100);
    expect(score.breakdown).toHaveProperty('lifestyle');
    expect(score.breakdown).toHaveProperty('values');
    expect(score.breakdown).toHaveProperty('personality');
  });

  it('generates match suggestions for a user', () => {
    const suggestions = generateMatchSuggestions(user1, mockUsers, mockAdminSettings);
    
    // Should only suggest opposite gender matches
    suggestions.forEach(suggestion => {
      expect(suggestion.user1.gender).not.toBe(suggestion.user2.gender);
    });
  });

  it('filters matches by compatibility threshold', () => {
    const highThresholdSettings = {
      ...mockAdminSettings,
      aiMatching: {
        ...mockAdminSettings.aiMatching,
        compatibilityThreshold: 90
      }
    };
    
    const suggestions = generateMatchSuggestions(user1, mockUsers, highThresholdSettings);
    
    suggestions.forEach(suggestion => {
      expect(suggestion.score.compatibilityScore).toBeGreaterThanOrEqual(90);
    });
  });

  it('respects gender-based filtering', () => {
    const maleUser = mockUsers.find(u => u.gender === 'male')!;
    const suggestions = generateMatchSuggestions(maleUser, mockUsers, mockAdminSettings);
    
    // Male should only get female suggestions
    suggestions.forEach(suggestion => {
      expect(suggestion.user2.gender).toBe('female');
    });
  });

  it('generates meaningful match reasons', () => {
    const score = calculateCompatibilityScore(user1, user2, mockAdminSettings.aiMatching.weightings);
    
    expect(Array.isArray(score.matchReasons)).toBe(true);
    expect(Array.isArray(score.concerns)).toBe(true);
  });
});