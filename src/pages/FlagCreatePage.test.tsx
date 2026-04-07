import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { StoreProvider } from '../lib/store';
import FlagCreatePage from './FlagCreatePage';

function renderFlagCreate() {
  return render(
    <StoreProvider>
      <MemoryRouter>
        <FlagCreatePage />
      </MemoryRouter>
    </StoreProvider>,
  );
}

describe('FlagCreatePage', () => {
  it('renders page title', () => {
    renderFlagCreate();
    expect(screen.getByRole('heading', { name: 'Create Flag', level: 1 })).toBeInTheDocument();
  });

  it('renders the basic information section', () => {
    renderFlagCreate();
    expect(screen.getByText('Basic Information')).toBeInTheDocument();
    expect(screen.getByLabelText('Flag Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Flag Key *')).toBeInTheDocument();
  });

  it('renders environment configuration section', () => {
    renderFlagCreate();
    expect(screen.getByText('Environment Configuration')).toBeInTheDocument();
    expect(screen.getByText('development')).toBeInTheDocument();
    expect(screen.getByText('staging')).toBeInTheDocument();
    expect(screen.getByText('production')).toBeInTheDocument();
  });

  it('auto-generates flag key from name input', () => {
    renderFlagCreate();
    const nameInput = screen.getByLabelText('Flag Name *');
    fireEvent.change(nameInput, { target: { value: 'My New Feature' } });
    const keyInput = screen.getByLabelText('Flag Key *') as HTMLInputElement;
    expect(keyInput.value).toBe('my-new-feature');
  });

  it('shows validation errors when submitted empty', () => {
    renderFlagCreate();
    const submitButton = screen.getByRole('button', { name: 'Create Flag' });
    fireEvent.click(submitButton);
    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('renders targeting rules section with add rule button', () => {
    renderFlagCreate();
    expect(screen.getByText('Targeting Rules')).toBeInTheDocument();
    expect(screen.getByText('+ Add Rule')).toBeInTheDocument();
  });

  it('adds a targeting rule when Add Rule is clicked', () => {
    renderFlagCreate();
    fireEvent.click(screen.getByText('+ Add Rule'));
    expect(screen.getByText('Remove')).toBeInTheDocument();
  });
});
