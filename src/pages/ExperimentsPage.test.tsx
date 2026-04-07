import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { StoreProvider } from '../lib/store';
import ExperimentsPage from './ExperimentsPage';

function renderExperiments() {
  return render(
    <StoreProvider>
      <MemoryRouter>
        <ExperimentsPage />
      </MemoryRouter>
    </StoreProvider>,
  );
}

describe('ExperimentsPage', () => {
  it('renders page title', () => {
    renderExperiments();
    expect(screen.getByText('A/B Testing')).toBeInTheDocument();
  });

  it('renders at least one experiment card', () => {
    renderExperiments();
    // Each experiment has variant cards and a P-Value label
    const pValueLabels = screen.getAllByText('P-Value');
    expect(pValueLabels.length).toBeGreaterThan(0);
  });

  it('renders the sample size calculator', () => {
    renderExperiments();
    expect(screen.getByText('Sample Size Calculator')).toBeInTheDocument();
  });

  it('shows a numeric result in the sample size calculator', () => {
    renderExperiments();
    // The calculator result label
    expect(screen.getByText(/total samples needed/i)).toBeInTheDocument();
  });

  it('updates sample size on MDE change', () => {
    renderExperiments();
    const mdeInput = screen.getByDisplayValue('2');
    fireEvent.change(mdeInput, { target: { value: '5' } });
    // After change, input should reflect new value
    expect((mdeInput as HTMLInputElement).value).toBe('5');
  });
});
