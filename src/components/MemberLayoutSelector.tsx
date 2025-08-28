import React from 'react';
import { Grid, List, Car as Card, Columns } from 'lucide-react';

interface MemberLayoutSelectorProps {
  currentLayout: 'card' | 'list' | 'grid' | 'sidebar';
  onLayoutChange: (layout: 'card' | 'list' | 'grid' | 'sidebar') => void;
}

const MemberLayoutSelector: React.FC<MemberLayoutSelectorProps> = ({ 
  currentLayout, 
  onLayoutChange 
}) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">View Options</h3>
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => onLayoutChange('card')}
          className={`flex flex-col items-center py-2 px-2 rounded-lg font-medium transition-colors ${
            currentLayout === 'card'
              ? 'bg-coral-100 text-coral-600 border border-coral-200'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <Card size={16} className="mb-1" />
          <span className="text-xs">Cards</span>
        </button>
        <button
          onClick={() => onLayoutChange('list')}
          className={`flex flex-col items-center py-2 px-2 rounded-lg font-medium transition-colors ${
            currentLayout === 'list'
              ? 'bg-coral-100 text-coral-600 border border-coral-200'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <List size={16} className="mb-1" />
          <span className="text-xs">List</span>
        </button>
        <button
          onClick={() => onLayoutChange('grid')}
          className={`flex flex-col items-center py-2 px-2 rounded-lg font-medium transition-colors ${
            currentLayout === 'grid'
              ? 'bg-coral-100 text-coral-600 border border-coral-200'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <Grid size={16} className="mb-1" />
          <span className="text-xs">Grid</span>
        </button>
        <button
          onClick={() => onLayoutChange('sidebar')}
          className={`flex flex-col items-center py-2 px-2 rounded-lg font-medium transition-colors ${
            currentLayout === 'sidebar'
              ? 'bg-coral-100 text-coral-600 border border-coral-200'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
        >
          <Columns size={16} className="mb-1" />
          <span className="text-xs">Desktop</span>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Choose how you want to view profiles
      </p>
    </div>
  );
};

export default MemberLayoutSelector;