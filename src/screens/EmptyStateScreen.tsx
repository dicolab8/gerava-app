import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { AppIcon, IconButton } from '../components/NavigationElements';
import { colors, spacing, borderRadius } from '../theme';

type EmptyStateScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmptyState'>;

const chips = ['Todas', 'Esta semana', 'Módulo 10'];

export default function EmptyStateScreen() {
  const navigation = useNavigation<EmptyStateScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('cirurgia cardíaca');
  const [selectedChip, setSelectedChip] = useState('Todas');

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedChip('Todas');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Consulta GERAVA</Text>
          <Text style={styles.headerSubtitle}>Avaliações agendadas</Text>
        </View>
        <View style={styles.headerIcons}>
          <IconButton name="mail" accessibilityLabel="Mensagens" style={styles.headerIcon} />
          <IconButton name="settings" accessibilityLabel="Configurações" style={styles.headerIcon} />
        </View>
      </View>

      <View style={styles.searchWrap}>
        <View style={[styles.searchBar, styles.searchBarActive]}>
          <AppIcon name="search" color={colors.accent} size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="cirurgia cardíaca"
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.accent}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipsContainer}
        contentContainerStyle={styles.chipsContent}
      >
        {chips.map((chip) => (
          <TouchableOpacity
            key={chip}
            style={[styles.chip, selectedChip === chip && styles.chipActive]}
            onPress={() => setSelectedChip(chip)}
          >
            <Text style={[styles.chipText, selectedChip === chip && styles.chipTextActive]}>
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.emptyState}>
        <View style={styles.emptyIcon}>
          <AppIcon name="search" color={colors.primaryLight} size={38} />
        </View>
        <Text style={styles.emptyTitle}>Nenhuma avaliação encontrada</Text>
        <Text style={styles.emptySub}>
          Não há avaliações para <Text style={styles.emptySubBold}>"{searchQuery}"</Text> no seu módulo.
          {'\n\n'}Tente buscar por outros termos ou remova os filtros ativos.
        </Text>
        <TouchableOpacity style={styles.clearButton} onPress={handleClearFilters}>
          <Text style={styles.clearButtonText}>Limpar filtros</Text>
        </TouchableOpacity>
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
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '500',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  headerIcons: {
    flexDirection: 'row',
    //gap: 12,
  },
  headerIcon: {
    marginLeft: 12,
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
    //gap: 10,
  },
  searchBarActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 10,
  },
  chipsContainer: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  chipsContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    //gap: 8,
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    backgroundColor: colors.surface2,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  emptySub: {
    fontSize: 13,
    color: colors.text3,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  emptySubBold: {
    fontWeight: 'bold',
    color: colors.text2,
  },
  clearButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.white,
  },
});
