import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X, Users, User } from 'lucide-react';
import type { Question } from '../types/User';
import { mockAdminSettings } from '../data/mockData';

interface QuestionnaireManagerProps {
  adminSettings: any;
  onSettingsChange: (settings: any) => void;
}

const QuestionnaireManager: React.FC<QuestionnaireManagerProps> = ({ adminSettings = mockAdminSettings, onSettingsChange }) => {
  const [activeGender, setActiveGender] = useState<'men' | 'women'>('men');

  // Get current data based on active gender
  const currentIntroText = adminSettings.questionnaire[activeGender].introText;
  const currentQuestions = adminSettings.questionnaire[activeGender].questions;

  const [editingIntro, setEditingIntro] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<number | null>(null);
  const [tempIntro, setTempIntro] = useState(currentIntroText);
  const [tempQuestion, setTempQuestion] = useState<Question | null>(null);
  const [newOption, setNewOption] = useState('');

  // Reset temp states when switching genders to prevent stale data
  React.useEffect(() => {
    setEditingIntro(false);
    setEditingQuestion(null);
    setTempQuestion(null);
    setTempIntro(currentIntroText);
    setNewOption('');
  }, [activeGender, currentIntroText]);

  const handleSaveIntro = () => {
    onSettingsChange({
      ...adminSettings,
      questionnaire: {
        ...adminSettings.questionnaire,
        [activeGender]: {
          ...adminSettings.questionnaire[activeGender],
          introText: tempIntro
        }
      }
    });
    setEditingIntro(false);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question.id);
    setTempQuestion({ ...question });
  };

  const handleSaveQuestion = () => {
    if (tempQuestion) {
      const updatedQuestions = currentQuestions.map(q => q.id === tempQuestion.id ? tempQuestion : q);
      onSettingsChange({
        ...adminSettings,
        questionnaire: {
          ...adminSettings.questionnaire,
          [activeGender]: {
            ...adminSettings.questionnaire[activeGender],
            questions: updatedQuestions
          }
        }
      });
      setEditingQuestion(null);
      setTempQuestion(null);
    }
  };

  const handleDeleteQuestion = (id: number) => {
    const updatedQuestions = currentQuestions.filter(q => q.id !== id);
    onSettingsChange({
      ...adminSettings,
      questionnaire: {
        ...adminSettings.questionnaire,
        [activeGender]: {
          ...adminSettings.questionnaire[activeGender],
          questions: updatedQuestions
        }
      }
    });
  };

  const handleAddQuestion = () => {
    const newId = Math.max(...currentQuestions.map(q => q.id)) + 1;
    const newQuestion = {
      id: newId,
      question: "New Question?",
      type: "text" as const,
      required: true,
      category: "basic"
    };
    const updatedQuestions = [...currentQuestions, newQuestion];
    onSettingsChange({
      ...adminSettings,
      questionnaire: {
        ...adminSettings.questionnaire,
        [activeGender]: {
          ...adminSettings.questionnaire[activeGender],
          questions: updatedQuestions
        }
      }
    });
  };

  const handleAddOption = () => {
    if (newOption.trim() && tempQuestion) {
      const updatedQuestion = {
        ...tempQuestion,
        options: [...(tempQuestion.options || []), newOption.trim()]
      };
      setTempQuestion(updatedQuestion);
      
      // Immediately save to admin settings
      const updatedQuestions = currentQuestions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q);
      onSettingsChange({
        ...adminSettings,
        questionnaire: {
          ...adminSettings.questionnaire,
          [activeGender]: {
            ...adminSettings.questionnaire[activeGender],
            questions: updatedQuestions
          }
        }
      });
      
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    if (tempQuestion) {
      const updatedQuestion = {
        ...tempQuestion,
        options: tempQuestion.options?.filter((_, i) => i !== index)
      };
      setTempQuestion(updatedQuestion);
      
      // Immediately save to admin settings
      const updatedQuestions = currentQuestions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q);
      onSettingsChange({
        ...adminSettings,
        questionnaire: {
          ...adminSettings.questionnaire,
          [activeGender]: {
            ...adminSettings.questionnaire[activeGender],
            questions: updatedQuestions
          }
        }
      });
    }
  };

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">Questionnaire Manager</h2>
          <p className="text-sm text-gray-600 hidden sm:block">Manage questionnaires for men and women</p>
        </div>
        <div className="flex-shrink-0 ml-2">
          <button
            onClick={handleAddQuestion}
            className="flex items-center px-2 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            <Plus size={14} className="sm:mr-2" />
            <span className="hidden sm:inline">Add Question</span>
          </button>
        </div>
      </div>

      {/* Gender Selector */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Select Questionnaire</h3>
        <div className="grid grid-cols-2 gap-2 sm:gap-4">
          <button
            onClick={() => setActiveGender('men')}
            className={`w-full flex flex-col sm:flex-row items-center justify-center px-2 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors text-xs sm:text-base ${
              activeGender === 'men'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User size={16} className="sm:mr-2 mb-1 sm:mb-0" />
            <span className="text-center">Men's</span>
            <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 bg-white bg-opacity-20 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs">
              {adminSettings.questionnaire.men.questions.length} questions
            </span>
          </button>
          <button
            onClick={() => setActiveGender('women')}
            className={`w-full flex flex-col sm:flex-row items-center justify-center px-2 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors text-xs sm:text-base ${
              activeGender === 'women'
                ? 'bg-pink-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Users size={16} className="sm:mr-2 mb-1 sm:mb-0" />
            <span className="text-center">Women's</span>
            <span className="ml-0 sm:ml-2 mt-1 sm:mt-0 bg-white bg-opacity-20 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs">
              {adminSettings.questionnaire.women.questions.length} questions
            </span>
          </button>
        </div>
      </div>

      {/* Current Questionnaire Header */}
      <div className={`rounded-xl p-3 sm:p-4 ${
        activeGender === 'men' 
          ? 'bg-blue-50 border border-blue-200' 
          : 'bg-pink-50 border border-pink-200'
      }`}>
        <h3 className={`text-sm sm:text-base font-semibold mb-2 ${
          activeGender === 'men' ? 'text-blue-800' : 'text-pink-800'
        }`}>
          Editing: {activeGender === 'men' ? "Men's" : "Women's"} Questionnaire
        </h3>
        <p className={`text-sm ${
          activeGender === 'men' ? 'text-blue-700' : 'text-pink-700'
        } hidden sm:block`}>
          Shown to {activeGender === 'men' ? 'male' : 'female'} members during signup.
        </p>
      </div>

      {/* Introduction Text */}
      <div className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
            Intro ({activeGender === 'men' ? "Men's" : "Women's"})
          </h3>
          {!editingIntro && (
            <button
              onClick={() => {
                setEditingIntro(true);
                setTempIntro(currentIntroText);
              }}
              className="flex items-center px-2 sm:px-3 py-1 text-blue-500 hover:text-blue-700 transition-colors text-sm flex-shrink-0"
            >
              <Edit3 size={14} className="sm:mr-1" />
              <span className="hidden sm:inline">Edit</span>
            </button>
          )}
        </div>

        {editingIntro ? (
          <div className="space-y-3 sm:space-y-4">
            <textarea
              value={tempIntro}
              onChange={(e) => setTempIntro(e.target.value)}
              rows={4}
              className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
            />
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={handleSaveIntro}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
              >
                <Save size={14} className="mr-2" />
                Save
              </button>
              <button
                onClick={() => {
                  setEditingIntro(false);
                  setTempIntro(currentIntroText);
                }}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                <X size={14} className="mr-2" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line break-words">{currentIntroText}</p>
          </div>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-3 sm:space-y-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800">
          Questions ({currentQuestions.length} total)
        </h3>
        {currentQuestions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-xl p-3 sm:p-6 shadow-sm">
            {editingQuestion === question.id && tempQuestion ? (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Question {index + 1}
                  </label>
                  <textarea
                    value={tempQuestion.question}
                    onChange={(e) => setTempQuestion({ ...tempQuestion, question: e.target.value })}
                    onBlur={() => {
                      // Save question text changes immediately
                      const updatedQuestions = currentQuestions.map(q => q.id === tempQuestion.id ? tempQuestion : q);
                      onSettingsChange({
                        ...adminSettings,
                        questionnaire: {
                          ...adminSettings.questionnaire,
                          [activeGender]: {
                            ...adminSettings.questionnaire[activeGender],
                            questions: updatedQuestions
                          }
                        }
                      });
                    }}
                    rows={2}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Answer Type</label>
                  <select
                    value={tempQuestion.type}
                    onChange={(e) => setTempQuestion({ 
                      ...tempQuestion, 
                      type: e.target.value as 'text' | 'textarea' | 'select',
                      options: e.target.value === 'select' ? (tempQuestion.options || []) : undefined
                    })}
                    onBlur={() => {
                      // Save type changes immediately
                      const updatedQuestions = currentQuestions.map(q => q.id === tempQuestion.id ? tempQuestion : q);
                      onSettingsChange({
                        ...adminSettings,
                        questionnaire: {
                          ...adminSettings.questionnaire,
                          [activeGender]: {
                            ...adminSettings.questionnaire[activeGender],
                            questions: updatedQuestions
                          }
                        }
                      });
                    }}
                    className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="text">Short Text</option>
                    <option value="textarea">Long Text</option>
                    <option value="select">Multiple Choice</option>
                  </select>
                </div>

                {tempQuestion.type === 'select' && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Options</label>
                    
                    {/* Existing Options */}
                    <div className="space-y-2 mb-3 max-h-32 overflow-y-auto">
                      {tempQuestion.options?.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg min-w-0">
                          <span className="text-sm text-gray-700 break-words flex-1 mr-2">{option}</span>
                          <button
                            onClick={() => handleRemoveOption(optionIndex)}
                            className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add New Option */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={newOption}
                        onChange={(e) => setNewOption(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                        placeholder="Add new option"
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-w-0"
                      />
                      <button
                        onClick={handleAddOption}
                        className="px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <button
                    onClick={handleSaveQuestion}
                    className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    <Save size={14} className="mr-2" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingQuestion(null);
                      setTempQuestion(null);
                      setNewOption('');
                    }}
                    className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    <X size={14} className="mr-2" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm sm:text-base font-medium text-gray-800 mb-2 break-words">
                    {index + 1}. {question.question}
                  </h4>
                  <div className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                    Type: <span className="font-medium capitalize">{question.type === 'select' ? 'Multiple Choice' : question.type === 'textarea' ? 'Long Text' : 'Short Text'}</span>
                  </div>
                  {question.options && (
                    <div className="text-xs sm:text-sm text-gray-600 break-words">
                      Options: {question.options.slice(0, 3).join(', ')}{question.options.length > 3 ? '...' : ''}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleEditQuestion(question)}
                    className="p-1.5 sm:p-2 text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="p-1.5 sm:p-2 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Save All Button */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-3 sm:p-6">
        <h3 className="text-sm sm:text-base font-semibold text-green-800 mb-2">💾 Save Questionnaire</h3>
        <p className="text-sm text-green-700 mb-3 sm:mb-4">
          All changes are automatically saved. The questionnaire is ready for members to fill out.
        </p>
        <button
          onClick={() => {
            console.log('Questionnaire saved:', { 
              introText: currentIntroText, 
              questions: currentQuestions,
              gender: activeGender 
            });
            alert('Questionnaire saved successfully!');
          }}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:shadow-md transition-shadow text-sm sm:text-base"
        >
          💾 Save All Changes
        </button>
      </div>
    </div>
  );
};

export default QuestionnaireManager;