import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

// Mock window.location for URL testing
const mockLocation = {
  pathname: '/',
  search: '',
  origin: 'http://localhost:3000'
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true
});

describe('App Component', () => {
  beforeEach(() => {
    // Reset URL state
    mockLocation.pathname = '/';
    mockLocation.search = '';
  });

  it('renders login screen by default', () => {
    render(<App />);
    expect(screen.getByText('Admin Access')).toBeInTheDocument();
    expect(screen.getByText(/RajunCajun Elite Connections/i)).toBeInTheDocument();
  });

  it('shows demo mode when URL has demo=member', () => {
    mockLocation.search = '?demo=member';
    render(<App />);
    expect(screen.getByText('Member Demo Mode')).toBeInTheDocument();
    expect(screen.getByText('Enter any password to experience the member interface')).toBeInTheDocument();
  });

  it('shows signup form when URL has signup=demo', () => {
    mockLocation.search = '?signup=demo';
    render(<App />);
    expect(screen.getByText(/Welcome to RajunCajun Elite Connections/i)).toBeInTheDocument();
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
  });

  it('allows admin login with correct password', async () => {
    render(<App />);
    
    const passwordInput = screen.getByPlaceholderText('Enter admin password');
    const loginButton = screen.getByText('Access Dashboard');
    
    fireEvent.change(passwordInput, { target: { value: 'RajunCajun@007' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });
  });

  it('shows error for incorrect admin password', async () => {
    render(<App />);
    
    const passwordInput = screen.getByPlaceholderText('Enter admin password');
    const loginButton = screen.getByText('Access Dashboard');
    
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid password. Please try again.')).toBeInTheDocument();
    });
  });

  it('allows demo member login with any password', async () => {
    mockLocation.search = '?demo=member';
    render(<App />);
    
    const passwordInput = screen.getByPlaceholderText('Enter any password');
    const loginButton = screen.getByText('Enter Member Demo');
    
    fireEvent.change(passwordInput, { target: { value: 'anypassword' } });
    fireEvent.click(loginButton);
    
    await waitFor(() => {
      expect(screen.getByText('Member Demo Mode')).toBeInTheDocument();
    });
  });
});