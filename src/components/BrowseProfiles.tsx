import React, { useState, useEffect } from 'react';
import { Heart, X, MapPin, Briefcase, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { filterProfilesByGender } from '../utils/profileFilters';
import type { User } from '../types/User';

interface BrowseProfilesProps {
  currentUser: User;
}

const BrowseProfiles: React.FC<BrowseProfilesProps> = ({ currentUser }) => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [profiles, setProfiles] = useState(
    filterProfilesByGender(
      mockUsers.filter(u => u.id !== currentUser.id),
      currentUser.gender
    )
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const currentProfile = profiles[currentProfileIndex];

  const handleSwipe = (direction: 'like' | 'pass') => {
    if (isAnimating || !currentProfile) return;
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setCurrentProfileIndex(prev => prev + 1);
      setCurrentPhotoIndex(0);
      setIsAnimating(false);
    }, 300);
  };

  const nextPhoto = () => {
    if (currentProfile && currentPhotoIndex < currentProfile.photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    }
  };

  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  if (!currentProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-coral-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-coral-500" size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No more profiles</h2>
          <p className="text-gray-600 mb-6">Check back later for new matches!</p>
          <button
            onClick={() => {
              setCurrentProfileIndex(0);
              setProfiles(
                filterProfilesByGender(
                  mockUsers.filter(u => u.id !== currentUser.id),
                  currentUser.gender
                )
              );
            }}
            className="bg-gradient-to-r from-coral-500 to-rose-500 text-white px-6 py-3 rounded-full font-medium"
          >
            Reset Profiles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="relative">
        {/* Profile Card */}
        <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}>
          {/* Photo Section */}
          <div className="relative h-96 overflow-hidden">
            <img
              src={currentProfile.photos[currentPhotoIndex]}
              alt={`${currentProfile.name} photo ${currentPhotoIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Photo Navigation */}
            {currentProfile.photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-40 transition-opacity"
                  disabled={currentPhotoIndex === 0}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-20 text-white p-2 rounded-full hover:bg-opacity-40 transition-opacity"
                  disabled={currentPhotoIndex === currentProfile.photos.length - 1}
                >
                  <ChevronRight size={20} />
                </button>
                
                {/* Photo Indicators */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {currentProfile.photos.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        index === currentPhotoIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Premium Badge */}
            {currentProfile.isPremium && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-gold-400 to-yellow-400 text-white px-3 py-1 rounded-full flex items-center">
                <Star size={12} className="mr-1" fill="currentColor" />
                <span className="text-xs font-semibold">Premium</span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {currentProfile.name}, {currentProfile.age}
                </h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin size={16} className="mr-1" />
                  <span className="text-sm">{currentProfile.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-4">
              <Briefcase size={16} className="mr-2" />
              <span className="text-sm">{currentProfile.job}</span>
            </div>

            <p className="text-gray-700 mb-4 leading-relaxed">{currentProfile.bio}</p>

            {/* Interests */}
            <div className="flex flex-wrap gap-2 mb-6">
              {currentProfile.interests.slice(0, 4).map((interest, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-coral-50 to-rose-50 text-coral-600 px-3 py-1 rounded-full text-sm font-medium border border-coral-100"
                >
                  {interest}
                </span>
              ))}
              {currentProfile.interests.length > 4 && (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  +{currentProfile.interests.length - 4} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-8 mt-6">
          <button
            onClick={() => handleSwipe('pass')}
            className="w-14 h-14 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center hover:border-gray-300 hover:scale-110 transition-all duration-200 shadow-lg"
            disabled={isAnimating}
          >
            <X className="text-gray-500" size={24} />
          </button>
          <button
            onClick={() => handleSwipe('like')}
            className="w-16 h-16 bg-gradient-to-r from-coral-500 to-rose-500 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200 shadow-lg"
            disabled={isAnimating}
          >
            <Heart className="text-white" size={28} fill="currentColor" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="text-center mt-4">
          <span className="text-gray-500 text-sm">
            {currentProfileIndex + 1} of {profiles.length} profiles
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrowseProfiles;