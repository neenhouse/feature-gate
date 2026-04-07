import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { StoreProvider } from './lib/store';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import './index.css';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const AppLayout = lazy(() => import('./components/ui/AppLayout'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const FlagCreatePage = lazy(() => import('./pages/FlagCreatePage'));
const FlagDetailPage = lazy(() => import('./pages/FlagDetailPage'));
const ExperimentsPage = lazy(() => import('./pages/ExperimentsPage'));
const KillSwitchPage = lazy(() => import('./pages/KillSwitchPage'));
const LifecyclePage = lazy(() => import('./pages/LifecyclePage'));
const AuditLogPage = lazy(() => import('./pages/AuditLogPage'));
const SDKPage = lazy(() => import('./pages/SDKPage'));
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);

export function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<AppLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="create" element={<FlagCreatePage />} />
                <Route path="flag/:flagId" element={<FlagDetailPage />} />
                <Route path="experiments" element={<ExperimentsPage />} />
                <Route path="killswitch" element={<KillSwitchPage />} />
                <Route path="lifecycle" element={<LifecyclePage />} />
                <Route path="audit" element={<AuditLogPage />} />
                <Route path="sdk" element={<SDKPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </StoreProvider>
    </ErrorBoundary>
  );
}

export default App;
