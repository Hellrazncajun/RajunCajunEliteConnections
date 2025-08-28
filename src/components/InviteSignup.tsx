import React, { useState } from 'react';
import { Heart, Upload, Plus, X, CreditCard, FileText } from 'lucide-react';
import { mockAdminSettings } from '../data/mockData';
import { getVideoEmbedDetails, getPlatformDisplayName } from '../utils/videoEmbed';
import type { QuestionnaireResponse } from '../types/User';

interface InviteSignupProps {
  inviteCode: string;
  onComplete: () => void;
  adminSettings?: any;
}

const InviteSignup: React.FC<InviteSignupProps> = ({ 
  inviteCode, 
  onComplete,
  adminSettings = mockAdminSettings
}) => {

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '' as 'male' | 'female',
    location: '',
    job: '',
    bio: '',
    interests: [] as string[],
    photos: [] as string[],
    idVerification: null as File | null,
    profileVideo: undefined as { platform: 'youtube' | 'tiktok'; videoId: string; embedUrl: string; url: string; title: string; description?: string } | undefined
  });
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);

  const totalSteps = 3; // Basic Info, Questionnaire, Review

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
  };

  const handleQuestionnaireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(currentStep + 1);
  };

  const handleResponseChange = (questionId: number, question: string, answer: string | string[]) => {
    setResponses(prev => {
      const existing = prev.find(r => r.questionId === questionId);
      if (existing) {
        return prev.map(r => r.questionId === questionId ? { ...r, answer } : r);
      }
      return [...prev, { questionId, question, answer }];
    });
  };

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest]
      }));
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleFinalSubmit = () => {
    // In a real app, this would save the profile to the backend
    console.log('Profile created:', { ...formData, responses, inviteCode });
    // Ensure we stay on success page and don't redirect to admin
    onComplete();
  };

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, idVerification: file }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-50 px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-coral-500 to-rose-500 p-3 rounded-full">
              <Heart className="text-white" size={32} fill="currentColor" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome to {adminSettings.siteName}</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-coral-500 to-rose-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <form onSubmit={handleBasicInfoSubmit} className="space-y-6">
            {/* Free Profile Creation Notice */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">✨ Create Your Profile for FREE</h3>
              <p className="text-sm text-green-700">
                Profile creation is completely free! After your profile is approved by our admin team, 
                you'll be able to choose from our membership options to unlock full access to the platform.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as 'male' | 'female' }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    required
                    min="18"
                    max="100"
                    value={formData.age}
                    onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                  <input
                    type="text"
                    required
                    value={formData.job}
                    onChange={(e) => setFormData(prev => ({ ...prev, job: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Photo Upload Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photos <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {formData.photos.map((photo, index) => (
                      <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                        <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            photos: prev.photos.filter((_, i) => i !== index)
                          }))}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                    {Array.from({ length: Math.max(0, 6 - formData.photos.length) }).map((_, index) => (
                      <div key={`empty-${index}`} className="aspect-square border-2 border-dashed border-gray-300 rounded-xl">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // In a real app, you'd upload to a server and get back a URL
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                const imageUrl = event.target?.result as string;
                                setFormData(prev => ({
                                  ...prev,
                                  photos: [...prev.photos, imageUrl]
                                }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                          id={`photo-upload-${index}`}
                        />
                        <label
                          htmlFor={`photo-upload-${index}`}
                          className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:border-coral-400 transition-colors"
                        >
                          <Upload className="text-gray-400 mb-1" size={20} />
                          <span className="text-xs text-gray-500 text-center px-2">Add Photo</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mb-4">
                    Upload 1-6 photos. First photo will be your main profile picture.
                    {formData.photos.length === 0 && <span className="text-red-500 ml-1">At least 1 photo required.</span>}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Introduction Video (Optional) - can also be added later</label>
                  <input
                    type="url"
                    value={formData.profileVideo?.url || ''}
                    onChange={(e) => {
                      const url = e.target.value;
                      if (!url.trim()) {
                        setFormData(prev => ({
                          ...prev,
                          profileVideo: undefined
                        }));
                        return;
                      }

                      const videoDetails = getVideoEmbedDetails(url);
                      if (videoDetails.isValid) {
                        setFormData(prev => ({
                          ...prev,
                          profileVideo: {
                            platform: videoDetails.platform as 'youtube' | 'tiktok',
                            videoId: videoDetails.videoId,
                            embedUrl: videoDetails.embedUrl,
                            url: url,
                            title: prev.profileVideo?.title || 'My Introduction Video',
                            description: prev.profileVideo?.description || ''
                          }
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          profileVideo: {
                            platform: 'youtube',
                            videoId: '',
                            embedUrl: '',
                            url: url,
                            title: prev.profileVideo?.title || 'My Introduction Video',
                            description: prev.profileVideo?.description || ''
                          }
                        }));
                      }
                    }}
                    placeholder="Paste YouTube or TikTok video URL here"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                  />
                  <div className="mt-2 space-y-1">
                    {formData.profileVideo?.url && (
                      <div className="flex items-center text-xs">
                        {getVideoEmbedDetails(formData.profileVideo.url).isValid ? (
                          <span className="text-green-600">
                            ✓ Valid {getPlatformDisplayName(getVideoEmbedDetails(formData.profileVideo.url).platform)} video detected
                          </span>
                        ) : (
                          <span className="text-red-600">
                            ⚠️ Invalid video URL. Please check the link.
                          </span>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Supports YouTube and TikTok videos. Just paste the video URL from your browser.
                    </p>
                  </div>
                  
                  {formData.profileVideo?.url && getVideoEmbedDetails(formData.profileVideo.url).isValid && (
                    <div className="mt-3">
                      <div className="mb-3">
                        <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg bg-gray-100">
                          <iframe
                            width="100%"
                            height="100%"
                            src={formData.profileVideo.embedUrl}
                            title="Video Preview"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 text-center">
                          {getPlatformDisplayName(getVideoEmbedDetails(formData.profileVideo.url).platform)} Video Preview
                        </p>
                      </div>
                      <input
                        type="text"
                        value={formData.profileVideo?.title || ''}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          profileVideo: {
                            ...prev.profileVideo!,
                            title: e.target.value
                          }
                        }))}
                        placeholder="Video title"
                        className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500"
                      />
                      <div className="mt-3">
                        <textarea
                          value={formData.profileVideo?.description || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            profileVideo: {
                              ...prev.profileVideo!,
                              description: e.target.value
                            }
                          }))}
                          rows={3}
                          placeholder="Video description (optional)"
                          className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-coral-500 resize-none"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Verification <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-coral-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleIdUpload}
                      className="hidden"
                      id="id-upload"
                      required
                    />
                    <label htmlFor="id-upload" className="cursor-pointer">
                      <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                      <p className="text-sm text-gray-600">
                        {formData.idVerification ? formData.idVerification.name : 'Upload a photo of your ID'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Required for verification (Admin only)
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={formData.photos.length === 0}
              className="w-full bg-gradient-to-r from-coral-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Questionnaire
            </button>
          </form>
        )}

        {/* Step 2: Questionnaire */}
        {currentStep === 2 && (
          <form onSubmit={handleQuestionnaireSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                About You - {formData.gender === 'male' ? "Men's" : "Women's"} Questionnaire
              </h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
                <FileText className="text-blue-500 mx-auto mb-3" size={32} />
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Questionnaire Coming Soon</h3>
                <p className="text-blue-700">
                  The questionnaire system is being rebuilt. For now, you can skip this step.
                </p>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-coral-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-shadow"
            >
              Continue
            </button>
          </form>
        )}

        {/* Final Step: Review */}
        {currentStep === totalSteps && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Review Your Profile</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800">{formData.name}, {formData.age}</h3>
                  <p className="text-sm text-gray-600">📧 {formData.email}</p>
                  <p className="text-sm text-gray-600">{formData.location}</p>
                  <p className="text-sm text-gray-600">{formData.job}</p>
                  <p className="text-sm text-gray-600 capitalize">Gender: {formData.gender}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Bio</h4>
                  <p className="text-sm text-gray-700">{formData.bio}</p>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Questionnaire Responses</h4>
                  <p className="text-sm text-gray-600">
                    Questionnaire system will be available soon
                  </p>
                </div>

                {formData.idVerification && (
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">ID Verification</h4>
                    <p className="text-sm text-gray-600">✓ ID document uploaded</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-coral-50 border border-coral-200 rounded-2xl p-4">
              <h3 className="font-semibold text-coral-800 mb-2">Privacy Notice</h3>
              <p className="text-sm text-coral-700">
                Your profile will be completely private and only accessible via a unique link. 
                After admin approval, you'll be able to choose your membership tier and unlock full platform access.
              </p>
            </div>

            <button
              onClick={handleFinalSubmit}
              className="w-full bg-gradient-to-r from-coral-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-shadow"
            >
              Create Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteSignup;