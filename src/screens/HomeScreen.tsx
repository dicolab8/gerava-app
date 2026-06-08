import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { AppIcon, BottomNav, IconButton } from '../components/NavigationElements';
import { usePreferences } from '../contexts/PreferencesContext';
import { api, normalizeApiList } from '../services/api';
import { Evaluation } from '../types';
import { colors, typography, spacing, borderRadius, lightColors } from '../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const chips = ['Todas', 'Esta semana', 'Módulo 6', 'Módulo 8', 'Internato'];

const normalizeText = (value?: string | number) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { preferences, appColors, fontScale } = usePreferences();
  const styles = useMemo(() => createStyles(appColors, fontScale), [appColors, fontScale]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChip, setSelectedChip] = useState('Todas');
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const fetchEvaluations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.get('/avaliacoes');
      // A API pode retornar o array diretamente ou dentro de um objeto (ex: { data: [...] })
      // Ajustar conforme o retorno real da API Render
      setEvaluations(normalizeApiList<Evaluation>(data));
    } catch (err) {
      setError('Não foi possível carregar as avaliações.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getTagColor = (moduleType: string) => {
    switch (moduleType) {
      case 'module':
        return styles.tagBlue;
      case 'internship':
        return styles.tagGreen;
      default:
        return styles.tagOrange;
    }
  };

  const isThisWeek = (dateValue: string) => {
    const date = new Date(dateValue);
    const today = new Date();

    if (Number.isNaN(date.getTime())) {
      return false;
    }

    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    start.setDate(today.getDate() - today.getDay());

    const end = new Date(start);
    end.setDate(start.getDate() + 7);

    return date >= start && date < end;
  };

  const visibleEvaluations = evaluations.filter((evaluation) => {
    const term = normalizeText(searchQuery.trim());
    const haystack = normalizeText([
      evaluation.disciplina_nome,
      evaluation.professor_nome,
      evaluation.modulo_nome,
    ].join(' '));
    const moduleName = normalizeText(evaluation.modulo_nome);
    const chipName = normalizeText(selectedChip);
    const selectedModuleId = preferences.selectedModuleId;
    const selectedModuleName = normalizeText(preferences.selectedModuleName || '');
    const filters = preferences.filters;

    const matchesSearch = !term || haystack.includes(term);
    const matchesConfiguredModule =
      !selectedModuleId ||
      String(evaluation.modulo_id) === String(selectedModuleId) ||
      (!!selectedModuleName && moduleName === selectedModuleName);
    const matchesPeriod =
      filters.period === 'all' ||
      (filters.period === 'week' && isThisWeek(evaluation.data)) ||
      (filters.period === 'month' &&
        new Date(evaluation.data).getMonth() === new Date().getMonth() &&
        new Date(evaluation.data).getFullYear() === new Date().getFullYear());
    const matchesProfessor =
      filters.professorId === 'all' ||
      String((evaluation as any).professor_id) === filters.professorId ||
      normalizeText(evaluation.professor_nome) === normalizeText(filters.professorName || '');
    const matchesLab =
      filters.labId === 'all' ||
      evaluation.laboratorios?.some((lab) => String(lab.id) === filters.labId);
    const matchesChip =
      chipName === 'todas' ||
      (chipName === 'esta semana' && isThisWeek(evaluation.data)) ||
      (chipName === 'modulo 6' && moduleName.includes('6')) ||
      (chipName === 'modulo 8' && moduleName.includes('8')) ||
      (chipName === 'internato' && moduleName.includes('internato'));

    return matchesSearch && matchesConfiguredModule && matchesPeriod && matchesProfessor && matchesLab && matchesChip;
  });

  const renderEvaluation = ({ item }: { item: Evaluation }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Details', { evaluationId: item.id.toString() })}
    >
      <View style={styles.cardRow}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.disciplina_nome}
        </Text>
        <View style={[styles.tag, getTagColor('module')]}>
          <Text style={styles.tagText}>{item.modulo_nome}</Text>
        </View>
      </View>

      <View style={styles.cardMeta}>
        <View style={styles.metaRow}>
          <AppIcon name="user" color={appColors.text3} size={15} />
          <Text style={styles.metaText}>{item.professor_nome}</Text>
        </View>
        <View style={styles.metaRow}>
          <AppIcon name="calendar" color={appColors.text3} size={15} />
          <Text style={styles.metaText}>
            {new Date(item.data).toLocaleDateString('pt-BR')} · {item.horario_ini.substring(0, 5)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Consulta GERAVA</Text>
          <Text style={styles.headerSubtitle}>Avaliações agendadas</Text>
        </View>

        <View style={styles.headerIcons}>
          <IconButton
            name="mail"
            badge={3}
            accessibilityLabel="Mensagens"
            style={[styles.headerIcon, styles.iconSpacing]}
            onPress={() => navigation.navigate('Messages')}
          />

          <IconButton
            name="settings"
            accessibilityLabel="Configurações"
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Settings')}
          />
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <AppIcon name="search" color={appColors.text3} size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar avaliação..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={appColors.text3}
          />
        </View>
      </View>

      {/* CHIPS */}
      <View style={styles.quickFilters}>
        <View style={styles.quickFiltersHeader}>
          <Text style={styles.quickFiltersTitle}>Filtros rápidos</Text>
          <Text style={styles.quickFiltersHint}>deslize para ver mais</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipsScroll}
          contentContainerStyle={styles.chipsContent}
          keyboardShouldPersistTaps="handled"
        >
          {chips.map((chip, index) => (
            <TouchableOpacity
              key={chip}
              style={[
                styles.chip,
                selectedChip === chip && styles.chipActive,
                index !== chips.length - 1 && styles.chipSpacing,
              ]}
              onPress={() => setSelectedChip(chip)}
              activeOpacity={0.72}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedChip === chip && styles.chipTextActive,
                ]}
              >
                {chip}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* LIST */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.primary} />
          <Text style={styles.loadingText}>Carregando avaliações...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <AppIcon name="warning" color={appColors.danger} size={30} />
          </View>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEvaluations}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={visibleEvaluations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvaluation}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchEvaluations}
          refreshing={isLoading}
          ListHeaderComponent={() => (
            <Text style={styles.sectionHeader}>
              {visibleEvaluations.length} avaliação{visibleEvaluations.length !== 1 ? 'ões' : ''}
            </Text>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma avaliação encontrada para este filtro.</Text>
            </View>
          )}
        />
      )}

      {/* BOTTOM NAV */}
      <BottomNav active="Home" />
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof lightColors, fontScale: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },

  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerTitle: {
    //fontFamily: typography.serif,
    fontSize: 22 * fontScale,
    color: colors.white,
  },

  headerSubtitle: {
    fontSize: 12 * fontScale,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },

  headerIcons: {
    flexDirection: 'row',
  },

  iconSpacing: {
    marginRight: 12,
  },

  headerIcon: {
  },

  searchWrap: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  searchBar: {
    backgroundColor: colors.surface2,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchInput: {
    flex: 1,
    fontSize: 14 * fontScale,
    fontFamily: typography.regular,
    color: colors.text,
    marginLeft: 10,
  },

  quickFilters: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingTop: spacing.sm,
  },

  quickFiltersHeader: {
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  quickFiltersTitle: {
    fontSize: 11 * fontScale,
    fontWeight: 'bold',
    color: colors.text,
    textTransform: 'uppercase',
  },

  quickFiltersHint: {
    fontSize: 10 * fontScale,
    color: colors.text3,
  },

  chipsScroll: {
    maxHeight: 46,
  },

  chipsContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },

  chipSpacing: {
    marginRight: 8,
  },

  chip: {
    paddingHorizontal: spacing.md,
    minHeight: 32,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  chipText: {
    fontSize: 12 * fontScale,
    fontWeight: '500',
    color: colors.text2,
  },

  chipTextActive: {
    color: colors.white,
  },

  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    fontSize: 11 * fontScale,
    fontWeight: 'bold',
    color: colors.text3,
    textTransform: 'uppercase',
  },

  listContent: {
    paddingBottom: 80,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  cardTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 15 * fontScale,
    color: colors.text,
    lineHeight: 20,
    marginRight: 8,
  },

  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 20,
  },

  tagBlue: {
    backgroundColor: '#DBEAFE',
  },

  tagGreen: {
    backgroundColor: '#D1FAE5',
  },

  tagOrange: {
    backgroundColor: colors.accentSoft,
  },

  tagText: {
    fontSize: 10 * fontScale,
    fontWeight: '600',
    color: '#1D4ED8',
  },

  cardMeta: {
    marginTop: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  metaText: {
    fontSize: 12 * fontScale,
    color: colors.text2,
    marginLeft: 6,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.text2,
    fontSize: 14 * fontScale,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14 * fontScale,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  errorIcon: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.lg,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14 * fontScale,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl * 2,
  },
  emptyText: {
    color: colors.text3,
    fontSize: 14 * fontScale,
  },
});
