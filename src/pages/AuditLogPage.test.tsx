import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { StoreProvider } from '../lib/store';
import AuditLogPage from './AuditLogPage';

function renderAuditLog() {
  return render(
    <StoreProvider>
      <MemoryRouter>
        <AuditLogPage />
      </MemoryRouter>
    </StoreProvider>,
  );
}

describe('AuditLogPage', () => {
  it('renders page title', () => {
    renderAuditLog();
    expect(screen.getByText('Audit Log')).toBeInTheDocument();
  });

  it('displays audit entries', () => {
    renderAuditLog();
    expect(screen.getByText(/Changed production rollout from 40% to 45%/)).toBeInTheDocument();
  });

  it('filters by search', () => {
    renderAuditLog();
    const searchInput = screen.getByPlaceholderText('Search by resource, description, or actor...');
    fireEvent.change(searchInput, { target: { value: 'Stripe' } });
    const stripeEntries = screen.getAllByText(/Stripe Payment V3/);
    expect(stripeEntries.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText('New Dashboard UI')).not.toBeInTheDocument();
  });

  it('filters by action type', () => {
    renderAuditLog();
    const select = screen.getByDisplayValue('All Actions');
    fireEvent.change(select, { target: { value: 'killed' } });
    expect(screen.getByText(/Emergency kill switch activated/)).toBeInTheDocument();
  });

  it('expands entry to show details', () => {
    renderAuditLog();
    const entry = screen.getByText(/Changed production rollout from 40% to 45%/);
    fireEvent.click(entry);
    expect(screen.getByText('IP Address')).toBeInTheDocument();
  });
});
