import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import AdminDashboard from '../components/AdminDashboard';
import { mockAdminSettings } from '../data/mockData';

const mockProps = {
  onViewProfile: vi.fn(),
  onMessageUser: vi.fn(),
  adminSettings: mockAdminSettings,
  onSettingsChange: vi.fn(),
  onLogout: vi.fn()
};

describe('AdminDashboard Component', () => {
  it('renders all navigation tabs', () => {
    render(<AdminDashboard {...mockProps} />);
    
    expect(screen.getByText('Profiles')).toBeInTheDocument();
    expect(screen.getByText('Invites')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('AI Matching')).toBeInTheDocument();
    expect(screen.getByText('Questionnaires')).toBeInTheDocument();
  });

  it('shows member profiles by default', () => {
    render(<AdminDashboard {...mockProps} />);
    expect(screen.getByText('Member Profiles')).toBeInTheDocument();
    expect(screen.getByText('Total Members')).toBeInTheDocument();
  });

  it('switches to AI Matching tab', () => {
    render(<AdminDashboard {...mockProps} />);
    
    const aiMatchingTab = screen.getByText('AI Matching');
    fireEvent.click(aiMatchingTab);
    
    expect(screen.getByText('AI Matching System')).toBeInTheDocument();
    expect(screen.getByText('Intelligent compatibility analysis')).toBeInTheDocument();
  });

  it('shows AI matching statistics', () => {
    render(<AdminDashboard {...mockProps} />);
    
    const aiMatchingTab = screen.getByText('AI Matching');
    fireEvent.click(aiMatchingTab);
    
    expect(screen.getByText('AI Status')).toBeInTheDocument();
    expect(screen.getByText('High Matches')).toBeInTheDocument();
    expect(screen.getByText('Total Suggestions')).toBeInTheDocument();
  });

  it('allows toggling AI matching settings', () => {
    render(<AdminDashboard {...mockProps} />);
    
    const aiMatchingTab = screen.getByText('AI Matching');
    fireEvent.click(aiMatchingTab);
    
    // Find the Settings button within AI Matching (second occurrence)
    const settingsButtons = screen.getAllByText('Settings');
    const settingsButton = settingsButtons[1]; // Select the AI Matching settings button
    fireEvent.click(settingsButton);
    
    expect(screen.getByText('AI Matching Configuration')).toBeInTheDocument();
    expect(screen.getByText('Enable AI Matching')).toBeInTheDocument();
  });
});