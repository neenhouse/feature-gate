import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import LandingPage from './LandingPage';

describe('LandingPage', () => {
  it('renders the hero tagline', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Ship features fearlessly.')).toBeInTheDocument();
  });

  it('renders all 7 feature cards', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Flag Creation + Targeting')).toBeInTheDocument();
    expect(screen.getByText('Gradual Rollouts')).toBeInTheDocument();
    expect(screen.getByText('A/B Testing + Stats')).toBeInTheDocument();
    expect(screen.getByText('Kill Switch')).toBeInTheDocument();
    expect(screen.getByText('Flag Lifecycle')).toBeInTheDocument();
    expect(screen.getByText('Audit Log')).toBeInTheDocument();
    expect(screen.getByText('SDK Generator')).toBeInTheDocument();
  });

  it('renders the CTA section', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Ready to ship with confidence?')).toBeInTheDocument();
  });

  it('renders dashboard link in hero', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>,
    );
    const dashLinks = screen.getAllByText('Open Dashboard');
    expect(dashLinks.length).toBeGreaterThanOrEqual(1);
    expect(dashLinks[0].closest('a')).toHaveAttribute('href', '/dashboard');
  });
});
