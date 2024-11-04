import { render, screen } from '@testing-library/react';
import { Services } from '../Services';

describe('Services', () => {
  it('renders all service categories', () => {
    render(<Services />);
    
    expect(screen.getByText('Managed IT Services')).toBeInTheDocument();
    expect(screen.getByText('Security Services')).toBeInTheDocument();
    expect(screen.getByText('Incident Response & Digital Forensics')).toBeInTheDocument();
    expect(screen.getByText('Development & Operations')).toBeInTheDocument();
  });

  it('displays service descriptions', () => {
    render(<Services />);
    
    expect(screen.getByText(/24\/7 Monitoring & Management/i)).toBeInTheDocument();
    expect(screen.getByText(/Help Desk Support/i)).toBeInTheDocument();
    expect(screen.getByText(/Backup & Disaster Recovery/i)).toBeInTheDocument();
  });

  it('renders all service icons', () => {
    render(<Services />);
    
    const icons = screen.getAllByRole('img', { hidden: true });
    expect(icons.length).toBeGreaterThan(0);
  });
});