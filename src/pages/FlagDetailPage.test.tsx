import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { StoreProvider } from '../lib/store';
import FlagDetailPage from './FlagDetailPage';

function renderFlagDetail(flagId = 'flag-001') {
  return render(
    <StoreProvider>
      <MemoryRouter initialEntries={[`/dashboard/flag/${flagId}`]}>
        <Routes>
          <Route path="/dashboard/flag/:flagId" element={<FlagDetailPage />} />
        </Routes>
      </MemoryRouter>
    </StoreProvider>,
  );
}

describe('FlagDetailPage', () => {
  it('renders flag name for a known flag', () => {
    renderFlagDetail('flag-001');
    expect(screen.getByRole('heading', { name: 'New Dashboard UI', level: 1 })).toBeInTheDocument();
  });

  it('renders the flag key', () => {
    renderFlagDetail('flag-001');
    expect(screen.getByText('new-dashboard-ui')).toBeInTheDocument();
  });

  it('renders environment tabs', () => {
    renderFlagDetail('flag-001');
    const devButtons = screen.getAllByText('development');
    expect(devButtons.length).toBeGreaterThanOrEqual(1);
    const stagingButtons = screen.getAllByText('staging');
    expect(stagingButtons.length).toBeGreaterThanOrEqual(1);
    const prodButtons = screen.getAllByText('production');
    expect(prodButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders the rollout control card', () => {
    renderFlagDetail('flag-001');
    expect(screen.getByText('Gradual Rollout')).toBeInTheDocument();
  });

  it('renders statistics sidebar', () => {
    renderFlagDetail('flag-001');
    expect(screen.getByText('Statistics')).toBeInTheDocument();
    expect(screen.getByText('Total Evaluations')).toBeInTheDocument();
  });

  it('shows not-found state for unknown flag', () => {
    renderFlagDetail('flag-nonexistent');
    expect(screen.getByText('Flag not found')).toBeInTheDocument();
  });

  it('renders breadcrumb navigation back to flags', () => {
    renderFlagDetail('flag-001');
    expect(screen.getByText('Flags')).toBeInTheDocument();
  });
});
