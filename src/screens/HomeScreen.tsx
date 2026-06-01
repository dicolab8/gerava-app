import React, { useState, useEffect } from 'react';
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
import { api } from '../services/api';
import { Evaluation } from '../types';
import { colors, typography, spacing, borderRadius } from '../theme';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const chips = ['Todas', 'Esta semana', 'Módulo 6', 'Módulo 8', 'Internato'];

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
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
      setEvaluations(Array.isArray(data) ? data : data.avaliacoes || []);
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
        <Text style={styles.metaText}>👩‍🏫 {item.professor_nome}</Text>
        <Text style={styles.metaText}>
          📅 {new Date(item.data).toLocaleDateString('pt-BR')} · {item.horario_ini.substring(0, 5)}
        </Text>
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
          <TouchableOpacity
            style={[styles.headerIcon, styles.iconSpacing]}
            onPress={() => navigation.navigate('Messages')}
          >
            <Text style={styles.iconText}>📧</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.iconText}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SEARCH */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar avaliação..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.text3}
          />
        </View>
      </View>

      {/* CHIPS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsContainer}
        contentContainerStyle={styles.chipsContent}
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

      {/* LIST */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando avaliações...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchEvaluations}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={evaluations}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEvaluation}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onRefresh={fetchEvaluations}
          refreshing={isLoading}
          ListHeaderComponent={() => (
            <Text style={styles.sectionHeader}>Março 2025</Text>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhuma avaliação encontrada.</Text>
            </View>
          )}
        />
      )}

      {/* BOTTOM NAV */}
      <View style={styles.bottomNav}>
        {['🏠', '📅', '⭐', 'ℹ️'].map((icon, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bottomNavItem}
            onPress={() => {
              if (index === 0) navigation.navigate('Home');
              if (index === 1) navigation.navigate('Calendar');
              if (index === 2) navigation.navigate('Favorites');
              if (index === 3) navigation.navigate('About');
            }}
          >
            <Text
              style={[
                styles.bottomNavIcon,
                index === 0 && styles.bottomNavIconActive,
              ]}
            >
              {icon}
            </Text>

            <Text
              style={[
                styles.bottomNavLabel,
                index === 0 && styles.bottomNavLabelActive,
              ]}
            >
              {['Início', 'Calendário', 'Favoritos', 'Sobre'][index]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 22,
    color: colors.white,
  },

  headerSubtitle: {
    fontSize: 12,
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
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  iconText: {
    fontSize: 18,
  },

  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    backgroundColor: colors.accent,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.text,
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

  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: typography.regular,
    color: colors.text,
  },

  chipsContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  chipsContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  chipSpacing: {
    marginRight: 8,
  },

  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  chipText: {
    fontSize: 12,
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
    fontSize: 11,
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
    fontSize: 15,
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
    fontSize: 10,
    fontWeight: '600',
    color: '#1D4ED8',
  },

  cardMeta: {
    marginTop: spacing.xs,
  },

  metaText: {
    fontSize: 12,
    color: colors.text2,
    marginBottom: 4,
  },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },

  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
  },

  bottomNavIcon: {
    fontSize: 22,
    color: colors.text3,
  },

  bottomNavIconActive: {
    color: colors.primaryLight,
  },

  bottomNavLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.text3,
    marginTop: 3,
  },

  bottomNavLabelActive: {
    color: colors.primaryLight,
    fontWeight: 'bold',
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
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.md,
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
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl * 2,
  },
  emptyText: {
    color: colors.text3,
    fontSize: 14,
  },
});