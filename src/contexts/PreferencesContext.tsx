import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type FontSizePreference = 'small' | 'normal' | 'large';

export interface AppPreferences {
  themeId: string;
  fontSize: FontSizePreference;
  notificationsEnabled: boolean;
  selectedModuleId: string | number | null;
  selectedModuleName: string | null;
  filters: {
    period: string;
    professorId: string;
    professorName: string | null;
    labId: string;
    labName: string | null;
  };
}

interface PreferencesContextValue {
  preferences: AppPreferences;
  isLoaded: boolean;
  updatePreferences: (updates: Partial<AppPreferences>) => Promise<void>;
  updateFilters: (updates: Partial<AppPreferences['filters']>) => Promise<void>;
  resetFilters: () => Promise<void>;
}

const STORAGE_KEY = '@gerava/preferences';

const defaultFilters: AppPreferences['filters'] = {
  period: 'all',
  professorId: 'all',
  professorName: null,
  labId: 'all',
  labName: null,
};

const defaultPreferences: AppPreferences = {
  themeId: 'light',
  fontSize: 'normal',
  notificationsEnabled: true,
  selectedModuleId: null,
  selectedModuleName: null,
  filters: defaultFilters,
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as Partial<AppPreferences>;
          setPreferences({
            ...defaultPreferences,
            ...parsed,
            filters: {
              ...defaultFilters,
              ...parsed.filters,
            },
          });
        }
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadPreferences();
  }, []);

  const persist = async (nextPreferences: AppPreferences) => {
    setPreferences(nextPreferences);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
  };

  const updatePreferences = async (updates: Partial<AppPreferences>) => {
    await persist({
      ...preferences,
      ...updates,
      filters: updates.filters
        ? { ...preferences.filters, ...updates.filters }
        : preferences.filters,
    });
  };

  const updateFilters = async (updates: Partial<AppPreferences['filters']>) => {
    await updatePreferences({
      filters: {
        ...preferences.filters,
        ...updates,
      },
    });
  };

  const resetFilters = async () => {
    await updatePreferences({ filters: defaultFilters });
  };

  const value = useMemo(
    () => ({
      preferences,
      isLoaded,
      updatePreferences,
      updateFilters,
      resetFilters,
    }),
    [preferences, isLoaded]
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);

  if (!context) {
    throw new Error('usePreferences precisa ser usado dentro de PreferencesProvider');
  }

  return context;
}
