import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Evaluation } from '../types';
import {
  blueSoftColors,
  darkColors,
  greenColors,
  highContrastColors,
  lightColors,
} from '../theme';

export type FontSizePreference = 'small' | 'normal' | 'large';
export type ThemePreference = 'light' | 'dark' | 'system' | 'highContrast' | 'blueSoft' | 'green';

export interface AppPreferences {
  themeId: ThemePreference;
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
  appColors: typeof lightColors;
  fontScale: number;
  favorites: Evaluation[];
  updatePreferences: (updates: Partial<AppPreferences>) => Promise<void>;
  updateFilters: (updates: Partial<AppPreferences['filters']>) => Promise<void>;
  resetFilters: () => Promise<void>;
  isFavorite: (evaluationId: string | number) => boolean;
  toggleFavorite: (evaluation: Evaluation) => Promise<void>;
}

const STORAGE_KEY = '@gerava/preferences';
const FAVORITES_STORAGE_KEY = '@gerava/favorites';

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

const normalizeFavorite = (evaluation: Evaluation): Evaluation => ({
  id: evaluation.id,
  disciplina_nome: evaluation.disciplina_nome || 'Avaliacao sem nome',
  modulo_nome: evaluation.modulo_nome || 'Modulo nao informado',
  modulo_id: evaluation.modulo_id ?? '',
  professor_nome: evaluation.professor_nome || 'Professor nao informado',
  data: evaluation.data || '',
  horario_ini: evaluation.horario_ini || '',
  horario_fim: evaluation.horario_fim || '',
  laboratorios: Array.isArray(evaluation.laboratorios)
    ? evaluation.laboratorios.map((lab) => ({
        id: lab.id,
        nome: lab.nome || 'Laboratorio nao informado',
      }))
    : [],
  observacoes: evaluation.observacoes,
  isFavorite: true,
  situacao_nome: evaluation.situacao_nome,
  tipo_nome: evaluation.tipo_nome,
});

const sanitizeFavorites = (value: unknown): Evaluation[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is Evaluation =>
        !!item &&
        typeof item === 'object' &&
        'id' in item &&
        (item as Evaluation).id !== undefined &&
        (item as Evaluation).id !== null
    )
    .map(normalizeFavorite);
};

const getFontScale = (fontSize: FontSizePreference) => {
  switch (fontSize) {
    case 'small':
      return 0.94;
    case 'large':
      return 1.14;
    default:
      return 1;
  }
};

const getThemeColors = (
  themeId: ThemePreference,
  systemScheme: 'light' | 'dark' | null | undefined
) => {
  switch (themeId) {
    case 'dark':
      return darkColors;
    case 'system':
      return systemScheme === 'dark' ? darkColors : lightColors;
    case 'highContrast':
      return highContrastColors;
    case 'blueSoft':
      return blueSoftColors;
    case 'green':
      return greenColors;
    default:
      return lightColors;
  }
};

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences);
  const [favorites, setFavorites] = useState<Evaluation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadStoredData = async () => {
      try {
        const [storedPreferences, storedFavorites] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(FAVORITES_STORAGE_KEY),
        ]);

        if (storedPreferences) {
          const parsed = JSON.parse(storedPreferences) as Partial<AppPreferences>;
          setPreferences({
            ...defaultPreferences,
            ...parsed,
            themeId: (parsed.themeId as ThemePreference) || defaultPreferences.themeId,
            filters: {
              ...defaultFilters,
              ...parsed.filters,
            },
          });
        }

        if (storedFavorites) {
          const parsedFavorites = JSON.parse(storedFavorites);
          setFavorites(sanitizeFavorites(parsedFavorites));
        }
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadStoredData();
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

  const isFavorite = (evaluationId: string | number) =>
    favorites.some((favorite) => String(favorite?.id) === String(evaluationId));

  const toggleFavorite = async (evaluation: Evaluation) => {
    try {
      const favoriteEvaluation = normalizeFavorite(evaluation);

      if (favoriteEvaluation.id === undefined || favoriteEvaluation.id === null) {
        throw new Error('Avaliacao sem id nao pode ser favoritada.');
      }

      const nextFavorites = isFavorite(favoriteEvaluation.id)
        ? favorites.filter((favorite) => String(favorite.id) !== String(favoriteEvaluation.id))
        : [favoriteEvaluation, ...favorites.filter((favorite) => String(favorite.id) !== String(favoriteEvaluation.id))];

      setFavorites(nextFavorites);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites));
    } catch (error) {
      console.error('Erro ao salvar favorito:', error);
    }
  };

  const appColors = useMemo(
    () => getThemeColors(preferences.themeId, systemScheme),
    [preferences.themeId, systemScheme]
  );

  const fontScale = useMemo(
    () => getFontScale(preferences.fontSize),
    [preferences.fontSize]
  );

  const value = useMemo(
    () => ({
      preferences,
      isLoaded,
      appColors,
      fontScale,
      favorites,
      updatePreferences,
      updateFilters,
      resetFilters,
      isFavorite,
      toggleFavorite,
    }),
    [preferences, isLoaded, appColors, fontScale, favorites]
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
