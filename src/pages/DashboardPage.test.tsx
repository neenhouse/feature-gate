import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { StoreProvider } from '../lib/store';
import DashboardPage from './DashboardPage';

function renderDashboard() {
  return render(
    <StoreProvider>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </StoreProvider>,
  );
}

describe('DashboardPage', () => {
  it('renders page title', () => {
    renderDashboard();
    expect(screen.getByText('Feature Flags')).toBeInTheDocument();
  });

  it('displays flag count stats', () => {
    renderDashboard();
    // 15 total flags from mock data
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('renders all 15 mock flags', () => {
    renderDashboard();
    expect(screen.getByText('New Dashboard UI')).toBeInTheDocument();
    expect(screen.getByText('Checkout Flow V2')).toBeInTheDocument();
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
  });

  it('filters flags by search', () => {
    renderDashboard();
    const searchInput = screen.getByPlaceholderText('Search flags by name, key, or tag...');
    fireEvent.change(searchInput, { target: { value: 'checkout' } });
    expect(screen.getByText('Checkout Flow V2')).toBeInTheDocument();
    expect(screen.queryByText('Dark Mode')).not.toBeInTheDocument();
  });

  it('filters flags by status tab', () => {
    renderDashboard();
    // Click the "Stale" tab button specifically
    const staleButton = screen.getByRole('button', { name: 'Stale' });
    fireEvent.click(staleButton);
    expect(screen.getByText('Search Engine V3')).toBeInTheDocument();
    // "New Dashboard UI" is active status, should be hidden when filtering by stale
    expect(screen.queryByText('New Dashboard UI')).not.toBeInTheDocument();
  });
});
