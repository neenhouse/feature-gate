import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { FeatureFlag, Experiment, AuditEntry } from './types';
import { mockFlags, mockExperiments, mockAuditLog } from './mock-data';

interface StoreState {
  flags: FeatureFlag[];
  experiments: Experiment[];
  auditLog: AuditEntry[];
  // Actions
  updateFlag: (id: string, updates: Partial<FeatureFlag>) => void;
  addFlag: (flag: FeatureFlag) => void;
  killFlag: (id: string) => void;
  restoreFlag: (id: string) => void;
  addAuditEntry: (entry: AuditEntry) => void;
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<FeatureFlag[]>(mockFlags);
  const [experiments] = useState<Experiment[]>(mockExperiments);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(mockAuditLog);

  const updateFlag = useCallback((id: string, updates: Partial<FeatureFlag>) => {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f)),
    );
  }, []);

  const addFlag = useCallback((flag: FeatureFlag) => {
    setFlags((prev) => [flag, ...prev]);
  }, []);

  const killFlag = useCallback((id: string) => {
    setFlags((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              killSwitchActive: true,
              enabled: false,
              lastKilledAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              environments: {
                development: { ...f.environments.development, enabled: false },
                staging: { ...f.environments.staging, enabled: false },
                production: { ...f.environments.production, enabled: false },
              },
            }
          : f,
      ),
    );
  }, []);

  const restoreFlag = useCallback((id: string) => {
    setFlags((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              killSwitchActive: false,
              enabled: true,
              updatedAt: new Date().toISOString(),
            }
          : f,
      ),
    );
  }, []);

  const addAuditEntry = useCallback((entry: AuditEntry) => {
    setAuditLog((prev) => [entry, ...prev]);
  }, []);

  return (
    <StoreContext.Provider
      value={{ flags, experiments, auditLog, updateFlag, addFlag, killFlag, restoreFlag, addAuditEntry }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
