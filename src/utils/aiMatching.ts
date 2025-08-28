import type { User, QuestionnaireResponse } from '../types/User';

export interface MatchScore {
  userId: number;
  compatibilityScore: number;
  breakdown: {
    lifestyle: number;
    values: number;
    personality: number;
    physicalPreferences: number;
    relationshipGoals: number;
  };
  matchReasons: string[];
  concerns: string[];
  detailedComparisons: QuestionComparison[];
  detailedComparisons: QuestionComparison[];
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

export interface AIMatchSuggestion {
  user1: User;
  user2: User;
  score: MatchScore;
  confidence: 'high' | 'medium' | 'low';
  suggestedIntroduction: string;
}

// Category mappings for questionnaire responses
const CATEGORY_MAPPINGS = {
  lifestyle: [
    'Do you smoke?', 'Do you drink?', 'Do you like going out sometimes to party?',
    'Do you like staying home sometimes relaxing and watching a movie?',
    'Do you like hanging out on the beach?', 'Do you like to work out and exercise?',
    'Do you like to travel?', 'Do you like to clean house?', 'Do you like to cook?',
    'Do you dress to impress or comfy?', 'Dogs or cats?'
  ],
  values: [
    'What do you consider good table manners?', 'How do you feel about plastic surgery like breast implants?',
    'Would you rather marry for money or love?', 'Are you a religious person? What is your religion?',
    'What is the most important thing in a relationship?'
  ],
  personality: [
    'Are you affectionate and clingy?', 'Are you adventurous and outgoing?',
    'Are you shy?', 'Introvert or extrovert or ambivert?',
    'What is your biggest pet peeve?'
  ],
  physicalPreferences: [
    'What physically do you want in a woman?', 'What physically do you want in a man?',
    'What is your opinion of makeup on a woman?', 'What is your opinion on tattoos on a woman?',
    'What is your opinion of facial hair on a man?', 'What is your opinion on tattoos on a man?'
  ],
  relationshipGoals: [
    'Are you looking for date to marry or just for fun or something in between?',
    'Do you want more children?', 'How important is sex to you when in a relationship?',
    'When in a committed relationship how many times a week do you want to have sex?'
  ]
};

/**
 * Calculate compatibility score between two users based on questionnaire responses
 */
export const calculateCompatibilityScore = (
  user1: User, 
  user2: User, 
  weightings: any,
  adminSettings?: any
): MatchScore => {
  console.log('🔍 Calculating compatibility between:', user1.name, 'and', user2.name);
  console.log('User1 questionnaire length:', user1.questionnaire?.length || 0);
  console.log('User2 questionnaire length:', user2.questionnaire?.length || 0);
  console.log('User1 gender:', user1.gender, 'User2 gender:', user2.gender);
  console.log('Weightings:', weightings);
  
  if (!user1.questionnaire || !user2.questionnaire) {
    console.log('❌ Missing questionnaire data');
    return {
      userId: user2.id,
      compatibilityScore: 0,
      breakdown: {
        lifestyle: 0,
        values: 0,
        personality: 0,
        physicalPreferences: 0,
        relationshipGoals: 0
      },
      matchReasons: [],
      concerns: ['Incomplete questionnaire data'],
      detailedComparisons: []
    };
  }

  // Get questionnaire questions from admin settings if available
  let allQuestions: any[] = [];
  if (adminSettings?.questionnaire) {
    // Use the appropriate questionnaire based on user1's gender
    const questionnaireKey = user1.gender === 'male' ? 'men' : 'women';
    allQuestions = adminSettings.questionnaire[questionnaireKey]?.questions || [];
    console.log('📋 Available questions:', allQuestions.length);
  }

  // Generate detailed comparisons for each question
  const detailedComparisons: QuestionComparison[] = [];
  
  if (allQuestions.length > 0) {
    allQuestions.forEach(question => {
      const response1 = user1.questionnaire?.find(r => r.questionId === question.id);
      const response2 = user2.questionnaire?.find(r => r.questionId === question.id);
      
      let status: 'match' | 'partial' | 'mismatch' | 'not_applicable' = 'not_applicable';
      let score = 0;
      
      if (response1 && response2) {
        score = compareResponses(response1.answer, response2.answer, question.question);
        
        if (score >= 80) {
          status = 'match';
        } else if (score >= 60) {
          status = 'partial';
        } else {
          status = 'mismatch';
        }
      }
      
      detailedComparisons.push({
        questionId: question.id,
        question: question.question,
        user1Answer: response1?.answer || 'No answer provided',
        user2Answer: response2?.answer || 'No answer provided',
        status,
        category: question.category || 'general',
        score
      });
    });
  }
  // Calculate breakdown scores from detailed comparisons or fallback to old method
  console.log('📊 Generated', detailedComparisons.length, 'detailed comparisons');
  
  let breakdown;
  if (detailedComparisons.length > 0) {
    breakdown = calculateBreakdownFromComparisons(detailedComparisons);
  } else {
    // Fallback to old category-based calculation
    breakdown = {
      lifestyle: calculateCategoryScore(user1.questionnaire, user2.questionnaire, 'lifestyle'),
      values: calculateCategoryScore(user1.questionnaire, user2.questionnaire, 'values'),
      personality: calculateCategoryScore(user1.questionnaire, user2.questionnaire, 'personality'),
      physicalPreferences: calculateCategoryScore(user1.questionnaire, user2.questionnaire, 'physicalPreferences'),
      relationshipGoals: calculateCategoryScore(user1.questionnaire, user2.questionnaire, 'relationshipGoals')
    };
  }

  console.log('📈 Breakdown scores:', breakdown);
  // Calculate weighted overall score
  const compatibilityScore = Math.round(
    (breakdown.lifestyle * weightings.lifestyle +
     breakdown.values * weightings.values +
     breakdown.personality * weightings.personality +
     breakdown.physicalPreferences * weightings.physicalPreferences +
     breakdown.relationshipGoals * weightings.relationshipGoals) / 100
  );

  console.log('🎯 Final compatibility score:', compatibilityScore);
  const { matchReasons, concerns } = generateMatchInsights(user1, user2, breakdown);

  return {
    userId: user2.id,
    compatibilityScore,
    breakdown,
    matchReasons,
    concerns,
    detailedComparisons
  };
};

/**
 * Calculate score for a specific category
 */
const calculateCategoryScore = (
  responses1: QuestionnaireResponse[],
  responses2: QuestionnaireResponse[],
  category: keyof typeof CATEGORY_MAPPINGS
): number => {
  const categoryQuestions = CATEGORY_MAPPINGS[category];
  let totalScore = 0;
  let questionCount = 0;

  categoryQuestions.forEach(questionText => {
    const response1 = responses1.find(r => r.question.includes(questionText.split('?')[0]));
    const response2 = responses2.find(r => r.question.includes(questionText.split('?')[0]));

    if (response1 && response2) {
      const score = compareResponses(response1.answer, response2.answer, questionText);
      totalScore += score;
      questionCount++;
    }
  });

  return questionCount > 0 ? Math.round(totalScore / questionCount) : 50;
};

/**
 * Compare two responses and return compatibility score (0-100)
 */
const compareResponses = (answer1: string | string[], answer2: string | string[], question: string): number => {
  const a1 = Array.isArray(answer1) ? answer1.join(' ').toLowerCase() : answer1.toLowerCase();
  const a2 = Array.isArray(answer2) ? answer2.join(' ').toLowerCase() : answer2.toLowerCase();

  // Age preference matching
  if (question.includes('preferred age range')) {
    return calculateAgeCompatibility(a1, a2);
  }

  // Lifestyle compatibility
  if (question.includes('smoke') || question.includes('drink')) {
    return calculateLifestyleCompatibility(a1, a2);
  }

  // Relationship goals
  if (question.includes('looking for')) {
    return calculateGoalCompatibility(a1, a2);
  }

  // Children preferences
  if (question.includes('children')) {
    return calculateChildrenCompatibility(a1, a2);
  }

  // General text similarity
  return calculateTextSimilarity(a1, a2);
};

const calculateAgeCompatibility = (range1: string, range2: string): number => {
  // Extract age ranges and calculate overlap
  const extractAges = (text: string) => {
    const numbers = text.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      return [parseInt(numbers[0]), parseInt(numbers[1])];
    }
    return [25, 35]; // default
  };

  const [min1, max1] = extractAges(range1);
  const [min2, max2] = extractAges(range2);

  const overlap = Math.max(0, Math.min(max1, max2) - Math.max(min1, min2));
  const totalRange = Math.max(max1, max2) - Math.min(min1, min2);

  return Math.round((overlap / totalRange) * 100);
};

const calculateLifestyleCompatibility = (answer1: string, answer2: string): number => {
  const lifestyleKeywords = {
    never: ['never', 'no', 'don\'t'],
    occasionally: ['occasionally', 'sometimes', 'rarely'],
    regularly: ['regularly', 'often', 'yes', 'daily']
  };

  const getLifestyleLevel = (text: string) => {
    if (lifestyleKeywords.never.some(word => text.includes(word))) return 0;
    if (lifestyleKeywords.occasionally.some(word => text.includes(word))) return 1;
    if (lifestyleKeywords.regularly.some(word => text.includes(word))) return 2;
    return 1; // default
  };

  const level1 = getLifestyleLevel(answer1);
  const level2 = getLifestyleLevel(answer2);
  const difference = Math.abs(level1 - level2);

  return Math.round((1 - difference / 2) * 100);
};

const calculateGoalCompatibility = (goal1: string, goal2: string): number => {
  const goalKeywords = {
    marriage: ['marriage', 'marry', 'serious', 'committed', 'long-term'],
    casual: ['fun', 'casual', 'dating', 'explore'],
    open: ['between', 'open', 'see', 'depends']
  };

  const getGoalType = (text: string) => {
    if (goalKeywords.marriage.some(word => text.includes(word))) return 'marriage';
    if (goalKeywords.casual.some(word => text.includes(word))) return 'casual';
    return 'open';
  };

  const type1 = getGoalType(goal1);
  const type2 = getGoalType(goal2);

  if (type1 === type2) return 95;
  if ((type1 === 'open' || type2 === 'open')) return 70;
  return 30; // marriage vs casual
};

const calculateChildrenCompatibility = (answer1: string, answer2: string): number => {
  const childrenKeywords = {
    yes: ['yes', 'want', 'would like'],
    no: ['no', 'don\'t want', 'enough'],
    maybe: ['maybe', 'unsure', 'depends', 'undecided']
  };

  const getChildrenPreference = (text: string) => {
    if (childrenKeywords.yes.some(word => text.includes(word))) return 'yes';
    if (childrenKeywords.no.some(word => text.includes(word))) return 'no';
    return 'maybe';
  };

  const pref1 = getChildrenPreference(answer1);
  const pref2 = getChildrenPreference(answer2);

  if (pref1 === pref2) return 90;
  if (pref1 === 'maybe' || pref2 === 'maybe') return 65;
  return 20; // yes vs no
};

const calculateTextSimilarity = (text1: string, text2: string): number => {
  // Simple keyword matching for compatibility
  const words1 = text1.split(/\s+/).filter(word => word.length > 3);
  const words2 = text2.split(/\s+/).filter(word => word.length > 3);
  
  const commonWords = words1.filter(word => words2.includes(word));
  const totalWords = new Set([...words1, ...words2]).size;
  
  if (totalWords === 0) return 50;
  return Math.round((commonWords.length / totalWords) * 100);
};

/**
 * Calculate category breakdown scores from detailed comparisons
 */
const calculateBreakdownFromComparisons = (comparisons: QuestionComparison[]) => {
  const categories = {
    lifestyle: [] as number[],
    values: [] as number[],
    personality: [] as number[],
    physicalPreferences: [] as number[],
    relationshipGoals: [] as number[],
    basic: [] as number[],
    family: [] as number[],
    preferences: [] as number[],
    relationship: [] as number[]
  };

  // Group scores by category
  comparisons.forEach(comparison => {
    if (comparison.status !== 'not_applicable') {
      const category = comparison.category.toLowerCase();
      if (categories[category as keyof typeof categories]) {
        categories[category as keyof typeof categories].push(comparison.score);
      } else {
        // Default to lifestyle for unknown categories
        categories.lifestyle.push(comparison.score);
      }
    }
  });

  // Calculate average scores for each main category
  const calculateAverage = (scores: number[]) => {
    if (scores.length === 0) return 50; // Default neutral score
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  return {
    lifestyle: calculateAverage([...categories.lifestyle, ...categories.basic]),
    values: calculateAverage(categories.values),
    personality: calculateAverage(categories.personality),
    physicalPreferences: calculateAverage([...categories.physicalPreferences, ...categories.preferences]),
    relationshipGoals: calculateAverage([...categories.relationshipGoals, ...categories.relationship, ...categories.family])
  };
};

/**
 * Generate match insights and concerns
 */
const generateMatchInsights = (user1: User, user2: User, breakdown: any) => {
  const matchReasons: string[] = [];
  const concerns: string[] = [];

  // High compatibility areas
  if (breakdown.values >= 80) {
    matchReasons.push('Strong alignment on core values and life principles');
  }
  if (breakdown.relationshipGoals >= 85) {
    matchReasons.push('Similar relationship goals and expectations');
  }
  if (breakdown.personality >= 80) {
    matchReasons.push('Compatible personality types and social preferences');
  }
  if (breakdown.lifestyle >= 75) {
    matchReasons.push('Similar lifestyle choices and daily habits');
  }

  // Age compatibility
  const ageDifference = Math.abs(user1.age - user2.age);
  if (ageDifference <= 5) {
    matchReasons.push('Close in age with similar life stages');
  } else if (ageDifference > 15) {
    concerns.push(`Significant age gap (${ageDifference} years) may affect compatibility`);
  }

  // Location compatibility
  if (user1.location === user2.location) {
    matchReasons.push('Same location - easy to meet in person');
  }

  // Concerns for low scores
  if (breakdown.values < 60) {
    concerns.push('Different core values may lead to conflicts');
  }
  if (breakdown.relationshipGoals < 50) {
    concerns.push('Misaligned relationship expectations');
  }
  if (breakdown.lifestyle < 50) {
    concerns.push('Very different lifestyle preferences');
  }

  return { matchReasons, concerns };
};

/**
 * Generate AI match suggestions for a user
 */
export const generateMatchSuggestions = (
  targetUser: User,
  allUsers: User[],
  settings: any,
  adminSettings?: any
): AIMatchSuggestion[] => {
  console.log('🚀 Generating matches for:', targetUser.name);
  console.log('AI Matching enabled:', settings.aiMatching.enabled);
  console.log('Compatibility threshold:', settings.aiMatching.compatibilityThreshold);
  console.log('Full settings object:', settings);
  
  if (!settings.aiMatching.enabled) return [];

  // Filter by gender (men see women, women see men)
  const potentialMatches = allUsers.filter(user => {
    if (user.id === targetUser.id) return false;
    if (targetUser.gender === 'male' && user.gender !== 'female') return false;
    if (targetUser.gender === 'female' && user.gender !== 'male') return false;
    return true;
  });

  console.log('👥 Potential matches found:', potentialMatches.length);
  potentialMatches.forEach(user => console.log('  -', user.name, user.gender));
  const matchScores = potentialMatches.map(user => 
    calculateCompatibilityScore(targetUser, user, settings.aiMatching.weightings, adminSettings)
  );

  console.log('📊 Match scores calculated:', matchScores.length);
  matchScores.forEach(score => {
    const user = potentialMatches.find(u => u.id === score.userId);
    console.log(`  - ${user?.name}: ${score.compatibilityScore}%`);
  });
  // Filter by threshold and sort by score
  const qualifiedMatches = matchScores
    .filter(score => score.compatibilityScore >= settings.aiMatching.compatibilityThreshold)
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);

  console.log('✅ Qualified matches (above threshold):', qualifiedMatches.length);
  return qualifiedMatches.map(score => {
    const matchedUser = potentialMatches.find(u => u.id === score.userId)!;
    
    return {
      user1: targetUser,
      user2: matchedUser,
      score,
      confidence: getConfidenceLevel(score.compatibilityScore),
      suggestedIntroduction: generateIntroduction(targetUser, matchedUser, score)
    };
  });
};

const getConfidenceLevel = (score: number): 'high' | 'medium' | 'low' => {
  if (score >= 85) return 'high';
  if (score >= 70) return 'medium';
  return 'low';
};

const generateIntroduction = (user1: User, user2: User, score: MatchScore): string => {
  const commonInterests = user1.interests.filter(interest => 
    user2.interests.includes(interest)
  );

  let intro = `Hi ${user1.name}! I'd like to introduce you to ${user2.name}, a ${user2.age}-year-old ${user2.job} from ${user2.location}.`;

  if (commonInterests.length > 0) {
    intro += ` You both share interests in ${commonInterests.slice(0, 2).join(' and ')}.`;
  }

  if (score.matchReasons.length > 0) {
    intro += ` Based on your questionnaire responses, you have ${score.matchReasons[0].toLowerCase()}.`;
  }

  intro += ` Your compatibility score is ${score.compatibilityScore}% - I think you two could be a great match!`;

  return intro;
};

/**
 * Get all potential matches for all users
 */
export const getAllMatchSuggestions = (
  allUsers: User[],
  settings: any,
  adminSettings?: any
): AIMatchSuggestion[] => {
  console.log('🌟 Getting all match suggestions for', allUsers.length, 'users');
  
  const allSuggestions: AIMatchSuggestion[] = [];

  allUsers.forEach(user => {
    const suggestions = generateMatchSuggestions(user, allUsers, settings, adminSettings);
    allSuggestions.push(...suggestions);
  });

  console.log('📋 Total suggestions generated:', allSuggestions.length);
  // Remove duplicates (A->B and B->A)
  const uniqueSuggestions = allSuggestions.filter((suggestion, index, array) => {
    return !array.slice(0, index).some(existing => 
      (existing.user1.id === suggestion.user2.id && existing.user2.id === suggestion.user1.id)
    );
  });

  console.log('🎯 Unique suggestions after deduplication:', uniqueSuggestions.length);
  return uniqueSuggestions.sort((a, b) => b.score.compatibilityScore - a.score.compatibilityScore);
};