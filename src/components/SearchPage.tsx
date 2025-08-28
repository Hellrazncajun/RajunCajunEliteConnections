import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Briefcase, Heart, X } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { filterProfilesByGender } from '../utils/profileFilters';
import type { User } from '../types/User';

interface SearchPageProps {
  currentUser: User;
}

interface Filters {
  ageRange: [number, number];
  distance: number;
  interests: string[];
  hasPhoto: boolean;
}

const SearchPage: React.FC<SearchPageProps> = ({ currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    ageRange: [18, 50],
    distance: 50,
    interests: [],
    hasPhoto: true
  });

  const allInterests = [
    'Photography', 'Travel', 'Coffee', 'Hiking', 'Art', 'Music', 'Fitness', 
    'Cooking', 'Reading', 'Movies', 'Dancing', 'Gaming', 'Sports', 'Fashion'
  ];

  const filteredUsers = mockUsers
    .filter(user => user.id !== currentUser.id)
    .filter(user => {
      // Apply gender-based filtering first
      if (currentUser.gender === 'male' && user.gender !== 'female') return false;
      if (currentUser.gender === 'female' && user.gender !== 'male') return false;
      return true;
    })
    .filter(user => {
      if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (user.age < filters.ageRange[0] || user.age > filters.ageRange[1]) {
        return false;
      }
      if (filters.hasPhoto && user.photos.length === 0) {
        return false;
      }
      if (filters.interests.length > 0 && !filters.interests.some(interest => user.interests.includes(interest))) {
        return false;
      }
      return true;
    });

  const toggleInterest = (interest: string) => {
    setFilters(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Discover</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="p-2 text-coral-500 hover:text-coral-600 transition-colors"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name..."
          className="w-full pl-10 pr-4 py-3 bg-gray-100 border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-coral-500"
        />
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filters</h3>
          
          {/* Age Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Range: {filters.ageRange[0]} - {filters.ageRange[1]}
            </label>
            <div className="flex space-x-4">
              <input
                type="range"
                min="18"
                max="70"
                value={filters.ageRange[0]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  ageRange: [parseInt(e.target.value), prev.ageRange[1]]
                }))}
                className="flex-1"
              />
              <input
                type="range"
                min="18"
                max="70"
                value={filters.ageRange[1]}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  ageRange: [prev.ageRange[0], parseInt(e.target.value)]
                }))}
                className="flex-1"
              />
            </div>
          </div>

          {/* Distance */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance: {filters.distance} miles
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={filters.distance}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                distance: parseInt(e.target.value)
              }))}
              className="w-full"
            />
          </div>

          {/* Interests */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Interests</label>
            <div className="flex flex-wrap gap-2">
              {allInterests.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filters.interests.includes(interest)
                      ? 'bg-coral-100 text-coral-600 border-coral-200'
                      : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Has Photo */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Only show profiles with photos</span>
            <button
              onClick={() => setFilters(prev => ({ ...prev, hasPhoto: !prev.hasPhoto }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                filters.hasPhoto ? 'bg-coral-500' : 'bg-gray-300'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                filters.hasPhoto ? 'translate-x-7' : 'translate-x-1'
              }`} />
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm">
          {filteredUsers.length} profiles found
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative aspect-square">
              <img
                src={user.photos[0]}
                alt={user.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 flex space-x-1">
                <button className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
                  <X className="text-gray-600" size={16} />
                </button>
                <button className="w-8 h-8 bg-coral-500 rounded-full flex items-center justify-center">
                  <Heart className="text-white" size={16} fill="currentColor" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <h3 className="font-semibold text-gray-800 mb-1">
                {user.name}, {user.age}
              </h3>
              <div className="flex items-center text-gray-600 text-xs mb-1">
                <MapPin size={12} className="mr-1" />
                <span className="truncate">{user.location}</span>
              </div>
              <div className="flex items-center text-gray-600 text-xs mb-2">
                <Briefcase size={12} className="mr-1" />
                <span className="truncate">{user.job}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {user.interests.slice(0, 2).map((interest, index) => (
                  <span
                    key={index}
                    className="bg-coral-50 text-coral-600 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
                {user.interests.length > 2 && (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    +{user.interests.length - 2}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-coral-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="text-coral-500" size={24} />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No profiles found</h3>
          <p className="text-gray-600">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;