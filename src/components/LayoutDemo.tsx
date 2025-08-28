import React, { useState } from 'react';
import { Heart, Users, Settings, ArrowLeft, Grid, List, Car as Card, Columns } from 'lucide-react';

interface LayoutDemoProps {
  onBack: () => void;
}

const LayoutDemo: React.FC<LayoutDemoProps> = ({ onBack }) => {
  const [selectedLayout, setSelectedLayout] = useState<'card' | 'list' | 'grid' | 'sidebar'>('card');

  const mockProfiles = [
    { id: 1, name: 'Sarah', age: 26, location: 'New York', photo: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg' },
    { id: 2, name: 'Alex', age: 28, location: 'Brooklyn', photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg' },
    { id: 3, name: 'Marcus', age: 31, location: 'Manhattan', photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg' },
  ];

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Layout Options</h1>
        <div></div>
      </div>

      {/* Layout Selector */}
      <div className="grid grid-cols-4 gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
        <button
          onClick={() => setSelectedLayout('card')}
          className={`flex flex-col items-center py-3 px-2 rounded-lg font-medium transition-colors ${
            selectedLayout === 'card'
              ? 'bg-white text-coral-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Card size={16} className="mb-1" />
          <span className="text-xs">Card</span>
        </button>
        <button
          onClick={() => setSelectedLayout('list')}
          className={`flex flex-col items-center py-3 px-2 rounded-lg font-medium transition-colors ${
            selectedLayout === 'list'
              ? 'bg-white text-coral-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <List size={16} className="mb-1" />
          <span className="text-xs">List</span>
        </button>
        <button
          onClick={() => setSelectedLayout('grid')}
          className={`flex flex-col items-center py-3 px-2 rounded-lg font-medium transition-colors ${
            selectedLayout === 'grid'
              ? 'bg-white text-coral-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Grid size={16} className="mb-1" />
          <span className="text-xs">Grid</span>
        </button>
        <button
          onClick={() => setSelectedLayout('sidebar')}
          className={`flex flex-col items-center py-3 px-2 rounded-lg font-medium transition-colors ${
            selectedLayout === 'sidebar'
              ? 'bg-white text-coral-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          <Columns size={16} className="mb-1" />
          <span className="text-xs">Sidebar</span>
        </button>
      </div>

      {/* Layout Preview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {selectedLayout === 'card' && 'Card Layout - Modern & Visual'}
          {selectedLayout === 'list' && 'List Layout - Clean & Compact'}
          {selectedLayout === 'grid' && 'Grid Layout - Gallery Style'}
          {selectedLayout === 'sidebar' && 'Sidebar Layout - Desktop Focused'}
        </h3>

        {/* Card Layout */}
        {selectedLayout === 'card' && (
          <div className="space-y-4">
            {mockProfiles.map(profile => (
              <div key={profile.id} className="bg-gradient-to-r from-coral-50 to-rose-50 rounded-2xl overflow-hidden border border-coral-100">
                <div className="flex">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {profile.name}, {profile.age}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{profile.location}</p>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-coral-500 text-white rounded-full text-sm">
                        View Profile
                      </button>
                      <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List Layout */}
        {selectedLayout === 'list' && (
          <div className="space-y-2">
            {mockProfiles.map(profile => (
              <div key={profile.id} className="flex items-center p-3 hover:bg-gray-50 rounded-xl border border-gray-100">
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">
                    {profile.name}, {profile.age}
                  </h4>
                  <p className="text-sm text-gray-600">{profile.location}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-coral-500 hover:bg-coral-50 rounded-lg">
                    <Heart size={16} />
                  </button>
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg">
                    <Users size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid Layout */}
        {selectedLayout === 'grid' && (
          <div className="grid grid-cols-2 gap-4">
            {mockProfiles.map(profile => (
              <div key={profile.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="aspect-square">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {profile.name}, {profile.age}
                  </h4>
                  <p className="text-xs text-gray-600">{profile.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sidebar Layout */}
        {selectedLayout === 'sidebar' && (
          <div className="flex space-x-6">
            {/* Sidebar */}
            <div className="w-1/3 bg-gray-50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-800 mb-3">Filters</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Age Range</label>
                  <div className="flex space-x-2 mt-1">
                    <input type="number" placeholder="18" className="w-16 p-1 border rounded text-sm" />
                    <span className="text-gray-400">-</span>
                    <input type="number" placeholder="35" className="w-16 p-1 border rounded text-sm" />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Location</label>
                  <select className="w-full p-2 border rounded text-sm mt-1">
                    <option>All Locations</option>
                    <option>New York</option>
                    <option>Brooklyn</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 space-y-3">
              {mockProfiles.map(profile => (
                <div key={profile.id} className="flex items-center p-4 bg-white rounded-xl border border-gray-100">
                  <img
                    src={profile.photo}
                    alt={profile.name}
                    className="w-16 h-16 rounded-xl object-cover mr-4"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {profile.name}, {profile.age}
                    </h4>
                    <p className="text-sm text-gray-600">{profile.location}</p>
                  </div>
                  <button className="px-4 py-2 bg-coral-500 text-white rounded-lg text-sm">
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Layout Description */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
        <h4 className="font-semibold text-blue-800 mb-2">
          {selectedLayout === 'card' && 'Card Layout Features:'}
          {selectedLayout === 'list' && 'List Layout Features:'}
          {selectedLayout === 'grid' && 'Grid Layout Features:'}
          {selectedLayout === 'sidebar' && 'Sidebar Layout Features:'}
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          {selectedLayout === 'card' && (
            <>
              <li>• Large profile photos for visual impact</li>
              <li>• Easy-to-read information layout</li>
              <li>• Action buttons prominently displayed</li>
              <li>• Works great on mobile and desktop</li>
              <li>• Modern, dating app feel</li>
            </>
          )}
          {selectedLayout === 'list' && (
            <>
              <li>• Compact design shows more profiles</li>
              <li>• Quick scanning of member information</li>
              <li>• Minimal visual clutter</li>
              <li>• Fast loading and scrolling</li>
              <li>• Professional, business-like appearance</li>
            </>
          )}
          {selectedLayout === 'grid' && (
            <>
              <li>• Photo-focused gallery style</li>
              <li>• Instagram-like visual appeal</li>
              <li>• Great for showcasing attractive profiles</li>
              <li>• Responsive grid adapts to screen size</li>
              <li>• Emphasizes visual first impressions</li>
            </>
          )}
          {selectedLayout === 'sidebar' && (
            <>
              <li>• Advanced filtering options always visible</li>
              <li>• Desktop-optimized experience</li>
              <li>• Efficient use of wide screens</li>
              <li>• Professional admin interface feel</li>
              <li>• Great for detailed member management</li>
            </>
          )}
        </ul>
      </div>

      {/* Apply Button */}
      <div className="mt-6">
        <button
          onClick={() => {
            // In a real implementation, this would apply the layout
            alert(`${selectedLayout.charAt(0).toUpperCase() + selectedLayout.slice(1)} layout would be applied to your admin dashboard!`);
          }}
          className="w-full bg-gradient-to-r from-coral-500 to-rose-500 text-white py-3 rounded-xl font-semibold hover:shadow-md transition-shadow"
        >
          Apply {selectedLayout.charAt(0).toUpperCase() + selectedLayout.slice(1)} Layout
        </button>
      </div>
    </div>
  );
};

export default LayoutDemo;