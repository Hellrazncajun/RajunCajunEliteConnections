import React, { useState, useEffect } from 'react';
import { Brain, Heart, Users, TrendingUp, Settings, RefreshCw, Send, Eye, X, Zap } from 'lucide-react';
import { generateMatchSuggestions, getAllMatchSuggestions } from '../utils/aiMatching';
import type { User, AIMatchSuggestion } from '../types/User';

interface AIMatchingDashboardProps {
  users: User[];
  adminSettings: any;
  onSettingsChange: (settings: any) => void;
  onViewProfile: (profileLink: string) => void;
  onMessageUser: (userId: number) => void;
}

const AIMatchingDashboard: React.FC<AIMatchingDashboardProps> = ({
  users,
  adminSettings,
  onSettingsChange,
  onViewProfile,
  onMessageUser
}) => {
  const [matchSuggestions, setMatchSuggestions] = useState<AIMatchSuggestion[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<AIMatchSuggestion | null>(null);

  const generateMatches = async () => {
    setIsGenerating(true);
    
    console.log('🔄 Starting match generation...');
    console.log('Users available:', users.length);
    console.log('Admin settings aiMatching:', adminSettings.aiMatching);
    console.log('Compatibility threshold being used:', adminSettings.aiMatching?.compatibilityThreshold);
    
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const suggestions = getAllMatchSuggestions(users, adminSettings, adminSettings);
    console.log('✨ Match generation complete. Suggestions:', suggestions.length);
    setMatchSuggestions(suggestions);
    setIsGenerating(false);
  };

  const generateUserMatches = async (user: User) => {
    setIsGenerating(true);
    setSelectedUser(user);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const suggestions = generateMatchSuggestions(user, users, adminSettings, adminSettings);
    setMatchSuggestions(suggestions);
    setIsGenerating(false);
  };

  useEffect(() => {
    if (adminSettings.aiMatching.autoSuggestMatches) {
      generateMatches();
    }
  }, []);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Brain className="text-purple-500 mr-3" size={28} />
          <div>
            <h2 className="text-xl font-semibold text-gray-800">AI Matching System</h2>
            <p className="text-gray-600">Intelligent compatibility analysis</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            <Settings size={16} className="mr-2" />
            Settings
          </button>
          <button
            onClick={generateMatches}
            disabled={isGenerating}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-md transition-shadow disabled:opacity-50"
          >
            {isGenerating ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <Zap size={16} className="mr-2" />
            )}
            {isGenerating ? 'Analyzing...' : 'Generate All Matches'}
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-4 rounded-2xl border border-purple-100">
          <Brain className="text-purple-500 mb-2" size={24} />
          <h3 className="font-semibold text-purple-800 mb-1">AI Status</h3>
          <p className="text-sm text-purple-700">
            {adminSettings.aiMatching.enabled ? 'Active' : 'Disabled'}
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
          <TrendingUp className="text-green-500 mb-2" size={24} />
          <h3 className="font-semibold text-green-800 mb-1">High Matches</h3>
          <p className="text-2xl font-bold text-green-900">
            {matchSuggestions.filter(s => s.confidence === 'high').length}
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-2xl border border-yellow-100">
          <Users className="text-yellow-500 mb-2" size={24} />
          <h3 className="font-semibold text-yellow-800 mb-1">Total Suggestions</h3>
          <p className="text-2xl font-bold text-yellow-900">{matchSuggestions.length}</p>
        </div>
        <div className="bg-gradient-to-br from-coral-50 to-rose-50 p-4 rounded-2xl border border-coral-100">
          <Heart className="text-coral-500 mb-2" size={24} />
          <h3 className="font-semibold text-coral-800 mb-1">Avg Score</h3>
          <p className="text-2xl font-bold text-coral-900">
            {matchSuggestions.length > 0 
              ? Math.round(matchSuggestions.reduce((sum, s) => sum + s.score.compatibilityScore, 0) / matchSuggestions.length)
              : 0}%
          </p>
        </div>
      </div>

      {/* User Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Generate Matches for Specific Member</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {users.filter(u => u.questionnaire && u.questionnaire.length > 0).map(user => (
            <button
              key={user.id}
              onClick={() => generateUserMatches(user)}
              className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left"
            >
              <img
                src={user.photos[0]}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover mr-3"
              />
              <div>
                <h4 className="font-medium text-gray-800">{user.name}</h4>
                <p className="text-sm text-gray-600">{user.age}, {user.gender}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isGenerating && (
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="text-purple-500 animate-pulse" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Analyzing Compatibility...</h3>
          <p className="text-gray-600">
            {selectedUser 
              ? `Finding matches for ${selectedUser.name}...`
              : 'Processing questionnaire responses and generating match suggestions...'
            }
          </p>
        </div>
      )}

      {/* Match Suggestions */}
      {!isGenerating && matchSuggestions.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedUser ? `Matches for ${selectedUser.name}` : 'All AI Match Suggestions'}
              </h3>
              <p className="text-sm text-gray-600">
                {matchSuggestions.length} high-quality matches found
              </p>
            </div>
            {selectedUser && (
              <button
                onClick={() => {
                  setSelectedUser(null);
                  generateMatches();
                }}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                View All Matches
              </button>
            )}
          </div>
          
          <div className="divide-y divide-gray-200">
            {matchSuggestions.map((suggestion, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* User Photos */}
                    <div className="flex items-center space-x-2">
                      <img
                        src={suggestion.user1.photos[0]}
                        alt={suggestion.user1.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <Heart className="text-coral-500" size={16} fill="currentColor" />
                      <img
                        src={suggestion.user2.photos[0]}
                        alt={suggestion.user2.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </div>

                    {/* Match Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-800">
                          {suggestion.user1.name} & {suggestion.user2.name}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                          {suggestion.confidence} confidence
                        </span>
                        <span className={`text-lg font-bold ${getScoreColor(suggestion.score.compatibilityScore)}`}>
                          {suggestion.score.compatibilityScore}%
                        </span>
                      </div>

                      <div className="text-sm text-gray-600 mb-2">
                        {suggestion.user1.age} & {suggestion.user2.age} years old • {suggestion.user1.location}
                      </div>

                      {/* Top Match Reasons */}
                      {suggestion.score.matchReasons.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm text-green-700 font-medium">
                            ✓ {suggestion.score.matchReasons[0]}
                          </p>
                          {suggestion.score.matchReasons.length > 1 && (
                            <p className="text-xs text-green-600">
                              +{suggestion.score.matchReasons.length - 1} more compatibility factors
                            </p>
                          )}
                        </div>
                      )}

                      {/* Concerns */}
                      {suggestion.score.concerns.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm text-yellow-700">
                            ⚠️ {suggestion.score.concerns[0]}
                          </p>
                        </div>
                      )}

                      {/* Compatibility Breakdown */}
                      <div className="flex space-x-4 text-xs">
                        <span className="text-gray-600">
                          Values: <span className="font-medium">{suggestion.score.breakdown.values}%</span>
                        </span>
                        <span className="text-gray-600">
                          Goals: <span className="font-medium">{suggestion.score.breakdown.relationshipGoals}%</span>
                        </span>
                        <span className="text-gray-600">
                          Lifestyle: <span className="font-medium">{suggestion.score.breakdown.lifestyle}%</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedSuggestion(suggestion)}
                      className="p-2 text-purple-500 hover:bg-purple-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => onViewProfile(suggestion.user1.profileLink)}
                      className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Profile 1"
                    >
                      <Users size={16} />
                    </button>
                    <button
                      onClick={() => onViewProfile(suggestion.user2.profileLink)}
                      className="p-2 text-coral-500 hover:bg-coral-50 rounded-lg transition-colors"
                      title="View Profile 2"
                    >
                      <Users size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Matches State */}
      {!isGenerating && matchSuggestions.length === 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="text-purple-500" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Matches Found</h3>
          <p className="text-gray-600 mb-4">
            {selectedUser 
              ? `No compatible matches found for ${selectedUser.name} above the ${adminSettings.aiMatching.compatibilityThreshold}% threshold.`
              : `No matches found above the ${adminSettings.aiMatching.compatibilityThreshold}% compatibility threshold.`
            }
          </p>
          <button
            onClick={() => onSettingsChange({
              ...adminSettings,
              aiMatching: { ...adminSettings.aiMatching, compatibilityThreshold: 60 }
            })}
            className="text-purple-600 hover:text-purple-800 text-sm"
          >
            Lower threshold to 60% to see more matches
          </button>
        </div>
      )}

      {/* AI Settings */}
      {showSettings && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">AI Matching Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">Enable AI Matching</span>
                  <p className="text-sm text-gray-600">Turn on/off the AI matching system</p>
                </div>
                <button
                  onClick={() => onSettingsChange({
                    ...adminSettings,
                    aiMatching: { ...adminSettings.aiMatching, enabled: !adminSettings.aiMatching.enabled }
                  })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    adminSettings.aiMatching.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    adminSettings.aiMatching.enabled ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compatibility Threshold: {adminSettings.aiMatching.compatibilityThreshold}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="95"
                  value={adminSettings.aiMatching.compatibilityThreshold}
                  onChange={(e) => onSettingsChange({
                    ...adminSettings,
                    aiMatching: { 
                      ...adminSettings.aiMatching, 
                      compatibilityThreshold: parseInt(e.target.value) 
                    }
                  })}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only suggest matches above this compatibility score
                </p>
              </div>
            </div>

            {/* Weighting Settings */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Compatibility Weightings</h4>
              {Object.entries(adminSettings.aiMatching.weightings).map(([category, weight]) => (
                <div key={category}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {category.replace(/([A-Z])/g, ' $1')}: {weight}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={weight}
                    onChange={(e) => onSettingsChange({
                      ...adminSettings,
                      aiMatching: {
                        ...adminSettings.aiMatching,
                        weightings: {
                          ...adminSettings.aiMatching.weightings,
                          [category]: parseInt(e.target.value)
                        }
                      }
                    })}
                    className="w-full"
                  />
                </div>
              ))}
              <p className="text-xs text-gray-500">
                Total: {Object.values(adminSettings.aiMatching.weightings).reduce((a: any, b: any) => a + b, 0)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Match Details Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <Brain className="text-purple-500 mr-3" size={24} />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Match Analysis</h3>
                  <p className="text-sm text-gray-600">
                    {selectedSuggestion.user1.name} & {selectedSuggestion.user2.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSuggestion(null)}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Overall Score */}
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(selectedSuggestion.score.compatibilityScore)}`}>
                  {selectedSuggestion.score.compatibilityScore}%
                </div>
                <p className="text-gray-600">Compatibility Score</p>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(selectedSuggestion.confidence)}`}>
                  {selectedSuggestion.confidence} confidence match
                </span>
              </div>

              {/* Compatibility Breakdown */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Compatibility Breakdown</h4>
                <div className="space-y-3">
                  {Object.entries(selectedSuggestion.score.breakdown).map(([category, score]) => (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {category.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span className={`text-sm font-bold ${getScoreColor(score as number)}`}>
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            (score as number) >= 80 ? 'bg-green-500' :
                            (score as number) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Match Reasons */}
              {selectedSuggestion.score.matchReasons.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Why They're Compatible</h4>
                  <div className="space-y-2">
                    {selectedSuggestion.score.matchReasons.map((reason, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <p className="text-sm text-green-700">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concerns */}
              {selectedSuggestion.score.concerns.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Potential Concerns</h4>
                  <div className="space-y-2">
                    {selectedSuggestion.score.concerns.map((concern, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                        <p className="text-sm text-yellow-700">{concern}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Introduction */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Suggested Introduction</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {selectedSuggestion.suggestedIntroduction}
                  </p>
                </div>
              </div>

              {/* Detailed Question Comparisons */}
              {selectedSuggestion.score.detailedComparisons && selectedSuggestion.score.detailedComparisons.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-4">Question-by-Question Analysis</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedSuggestion.score.detailedComparisons.map((comparison, index) => (
                      <div key={index} className={`border rounded-xl p-4 ${
                        comparison.status === 'match' ? 'border-green-200 bg-green-50' :
                        comparison.status === 'partial' ? 'border-yellow-200 bg-yellow-50' :
                        comparison.status === 'mismatch' ? 'border-red-200 bg-red-50' :
                        'border-gray-200 bg-gray-50'
                      }`}>
                        <div className="flex items-start justify-between mb-3">
                          <h5 className="font-medium text-gray-800 flex-1 pr-4">
                            Q{comparison.questionId}: {comparison.question}
                          </h5>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              comparison.status === 'match' ? 'bg-green-100 text-green-700' :
                              comparison.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                              comparison.status === 'mismatch' ? 'bg-red-100 text-red-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {comparison.status === 'match' ? '✓ Match' :
                               comparison.status === 'partial' ? '~ Partial' :
                               comparison.status === 'mismatch' ? '✗ Mismatch' :
                               'N/A'}
                            </span>
                            {comparison.status !== 'not_applicable' && (
                              <span className={`text-sm font-bold ${
                                comparison.score >= 80 ? 'text-green-600' :
                                comparison.score >= 60 ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {comparison.score}%
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="text-xs font-medium text-blue-600 mb-1">
                              {selectedSuggestion.user1.name}'s Answer:
                            </div>
                            <p className="text-sm text-gray-700">
                              {Array.isArray(comparison.user1Answer) 
                                ? comparison.user1Answer.join(', ') 
                                : comparison.user1Answer}
                            </p>
                          </div>
                          <div className="bg-white rounded-lg p-3 border">
                            <div className="text-xs font-medium text-coral-600 mb-1">
                              {selectedSuggestion.user2.name}'s Answer:
                            </div>
                            <p className="text-sm text-gray-700">
                              {Array.isArray(comparison.user2Answer) 
                                ? comparison.user2Answer.join(', ') 
                                : comparison.user2Answer}
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-xs text-gray-600">
                          Category: <span className="font-medium capitalize">{comparison.category}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Summary Stats */}
                  <div className="mt-4 bg-white rounded-xl p-4 border">
                    <h5 className="font-medium text-gray-800 mb-3">Question Analysis Summary</h5>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {selectedSuggestion.score.detailedComparisons.filter(c => c.status === 'match').length}
                        </div>
                        <div className="text-xs text-gray-600">Matches</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-yellow-600">
                          {selectedSuggestion.score.detailedComparisons.filter(c => c.status === 'partial').length}
                        </div>
                        <div className="text-xs text-gray-600">Partial</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-red-600">
                          {selectedSuggestion.score.detailedComparisons.filter(c => c.status === 'mismatch').length}
                        </div>
                        <div className="text-xs text-gray-600">Mismatches</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-gray-600">
                          {selectedSuggestion.score.detailedComparisons.filter(c => c.status === 'not_applicable').length}
                        </div>
                        <div className="text-xs text-gray-600">No Answer</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* Actions */}
              <div className="flex space-x-3">
                <button
                  onClick={() => onViewProfile(selectedSuggestion.user1.profileLink)}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                >
                  View {selectedSuggestion.user1.name}'s Profile
                </button>
                <button
                  onClick={() => onViewProfile(selectedSuggestion.user2.profileLink)}
                  className="flex-1 px-4 py-2 bg-coral-500 text-white rounded-xl hover:bg-coral-600 transition-colors"
                >
                  View {selectedSuggestion.user2.name}'s Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
        <h3 className="font-semibold text-purple-800 mb-3">🤖 How AI Matching Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
          <div>
            <h4 className="font-medium mb-2">Analysis Categories:</h4>
            <ul className="space-y-1">
              <li>• <strong>Values:</strong> Core beliefs and principles</li>
              <li>• <strong>Lifestyle:</strong> Daily habits and preferences</li>
              <li>• <strong>Personality:</strong> Social and emotional traits</li>
              <li>• <strong>Goals:</strong> Relationship intentions</li>
              <li>• <strong>Physical:</strong> Attraction preferences</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Matching Process:</h4>
            <ul className="space-y-1">
              <li>• Analyzes questionnaire responses</li>
              <li>• Calculates weighted compatibility scores</li>
              <li>• Identifies match reasons and concerns</li>
              <li>• Generates personalized introductions</li>
              <li>• Filters by confidence threshold</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMatchingDashboard;