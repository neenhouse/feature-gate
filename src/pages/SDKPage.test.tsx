import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { StoreProvider } from '../lib/store';
import SDKPage from './SDKPage';

function renderSDKPage() {
  return render(
    <StoreProvider>
      <MemoryRouter>
        <SDKPage />
      </MemoryRouter>
    </StoreProvider>,
  );
}

describe('SDKPage', () => {
  it('renders page title', () => {
    renderSDKPage();
    expect(screen.getByText('SDK Code Generator')).toBeInTheDocument();
  });

  it('renders all 6 language tabs', () => {
    renderSDKPage();
    const tabs = screen.getAllByRole('button').filter(
      (btn) => btn.classList.contains('sdk-lang-tab'),
    );
    expect(tabs).toHaveLength(6);
  });

  it('switches language when tab is clicked', () => {
    renderSDKPage();
    const pythonTab = screen.getAllByText('Python')[0];
    fireEvent.click(pythonTab);
    // Should show pip install command in the install section
    const pipElements = screen.getAllByText(/pip install featuregate/);
    expect(pipElements.length).toBeGreaterThanOrEqual(1);
  });

  it('shows installation command', () => {
    renderSDKPage();
    // Install code and generated code both contain npm install
    const npmElements = screen.getAllByText(/npm install @featuregate\/sdk/);
    expect(npmElements.length).toBeGreaterThanOrEqual(1);
  });

  it('shows generated code with flag key', () => {
    renderSDKPage();
    const codeBlocks = screen.getAllByText(/new-dashboard-ui/);
    expect(codeBlocks.length).toBeGreaterThanOrEqual(1);
  });
});
