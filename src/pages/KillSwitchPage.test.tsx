import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { StoreProvider } from '../lib/store';
import KillSwitchPage from './KillSwitchPage';

function renderKillSwitch() {
  return render(
    <StoreProvider>
      <MemoryRouter>
        <KillSwitchPage />
      </MemoryRouter>
    </StoreProvider>,
  );
}

describe('KillSwitchPage', () => {
  it('renders page title', () => {
    renderKillSwitch();
    expect(screen.getByText('Kill Switch')).toBeInTheDocument();
  });

  it('renders kill buttons for active flags', () => {
    renderKillSwitch();
    const killButtons = screen.getAllByText('Kill');
    expect(killButtons.length).toBeGreaterThan(0);
  });

  it('shows confirmation modal on kill click', () => {
    renderKillSwitch();
    const killButtons = screen.getAllByText('Kill');
    fireEvent.click(killButtons[0]);
    expect(screen.getByText('Activate Kill Switch')).toBeInTheDocument();
    expect(screen.getByText('Confirm Kill')).toBeInTheDocument();
  });

  it('can cancel the kill confirmation', () => {
    renderKillSwitch();
    const killButtons = screen.getAllByText('Kill');
    fireEvent.click(killButtons[0]);
    expect(screen.getByText('Activate Kill Switch')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(screen.queryByText('Activate Kill Switch')).not.toBeInTheDocument();
  });
});
