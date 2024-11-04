import { render, screen } from '@testing-library/react';
import { Hero } from '../Hero';

describe('Hero', () => {
  it('renders main heading', () => {
    render(<Hero />);
    
    expect(screen.getByText('Secure Your Business')).toBeInTheDocument();
    expect(screen.getByText('with Full Scope MSP')).toBeInTheDocument();
  });

  it('displays call-to-action buttons', () => {
    render(<Hero />);
    
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /our services/i })).toBeInTheDocument();
  });

  it('shows feature cards', () => {
    render(<Hero />);
    
    expect(screen.getByText('Around-the-Clock Security')).toBeInTheDocument();
    expect(screen.getByText('Proactive IT Management')).toBeInTheDocument();
    expect(screen.getByText('Dedicated Experts')).toBeInTheDocument();
  });

  it('renders hero image', () => {
    render(<Hero />);
    
    const heroImage = screen.getByAltText('IT Operations Center');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', expect.stringContaining('unsplash.com'));
  });
});