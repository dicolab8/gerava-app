import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
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
import { colors, spacing, borderRadius } from '../theme';

type SearchScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Search'>;

export default function SearchScreen() {
  const navigation = useNavigation<SearchScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const performSearch = async (text: string) => {
    if (!text.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const data = await api.get(`/avaliacoes?search=${encodeURIComponent(text)}`);
      setSearchResults(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error('Erro na busca:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // Para simplificar, chamamos a busca a cada alteração
    // Idealmente usaríamos um debounce aqui
    performSearch(text);
  };

  const highlightText = (text: string, search: string) => {
    if (!search) return <Text>{text}</Text>;
    const parts = text.split(new RegExp(`(${search})`, 'gi'));
    return (
      <Text>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() ? (
            <Text key={i} style={styles.highlight}>{part}</Text>
          ) : (
            <Text key={i}>{part}</Text>
          )
        )}
      </Text>
    );
  };

  const renderResult = ({ item }: { item: Evaluation }) => (
    <TouchableOpacity
      style={[styles.card, styles.cardHighlighted]}
      onPress={() => navigation.navigate('Details', { evaluationId: item.id.toString() })}
    >
      <View style={styles.cardRow}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {highlightText(item.disciplina_nome, searchQuery)}
        </Text>
        <View style={[styles.tag, styles.tagOrange]}>
          <Text style={styles.tagText}>{item.modulo_nome}</Text>
        </View>
      </View>
      <View style={styles.cardMeta}>
        <Text style={styles.metaText}>👨‍🏫 {item.professor_nome}</Text>
        <Text style={styles.metaText}>📅 {new Date(item.data).toLocaleDateString('pt-BR')}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.appHeader}>
        <Text style={styles.appHeaderTitle}>Buscar</Text>
        <TouchableOpacity style={styles.headerIcon}>
          <Text style={styles.headerIconText}>→</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchWrap, styles.searchActive]}>
        <View style={[styles.searchBar, styles.searchBarActive]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="endócrino"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={colors.primaryLight}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderResult}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          isLoading ? (
            <View style={styles.loadingInfo}>
               <ActivityIndicator color={colors.primary} />
               <Text style={styles.loadingText}>Buscando...</Text>
            </View>
          ) : searchResults.length > 0 ? (
            <View style={styles.resultInfo}>
              <Text style={styles.resultInfoText}>
                {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} para <Text style={styles.resultInfoStrong}>"{searchQuery}"</Text>
              </Text>
            </View>
          ) : searchQuery ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
              <Text style={styles.emptySub}>Tente buscar por outro termo</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View style={styles.recentSearches}>
            <Text style={styles.recentTitle}>Pesquisas recentes</Text>
            <View style={styles.recentChips}>
              {['internato', 'barroso', 'módulo 8'].map((term) => (
                <TouchableOpacity key={term} style={styles.recentChip} onPress={() => handleSearch(term)}>
                  <Text style={styles.recentChipText}>{term}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  appHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appHeaderTitle: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '500',
    color: colors.white,
  },
  headerIcon: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    fontSize: 18,
    color: colors.white,
  },
  searchWrap: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchActive: {
    backgroundColor: colors.surface,
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
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: colors.primaryLight,
  },
  searchIcon: {
    fontSize: 18,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.primary,
  },
  clearIcon: {
    fontSize: 16,
    color: colors.text3,
  },
  listContent: {
    paddingBottom: 20,
  },
  resultInfo: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  resultInfoText: {
    fontSize: 12,
    color: colors.text3,
  },
  resultInfoStrong: {
    color: colors.text,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.05,
    //shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHighlighted: {
    borderLeftWidth: 3,
    borderLeftColor: colors.primaryLight,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    //gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.text,
    lineHeight: 20,
  },
  highlight: {
    backgroundColor: '#DBEAFE',
    color: colors.primaryLight,
    borderRadius: 3,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 20,
  },
  tagOrange: {
    backgroundColor: colors.accentSoft,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#92400E',
  },
  cardMeta: {
    marginTop: spacing.xs,
    //gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.text2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
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
  },
  recentSearches: {
    padding: spacing.md,
    alignItems: 'center',
  },
  recentTitle: {
    fontSize: 12,
    color: colors.text3,
    marginBottom: spacing.sm,
  },
  recentChips: {
    flexDirection: 'row',
    //gap: spacing.sm,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  recentChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  recentChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text2,
  },
  loadingInfo: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.text3,
    fontSize: 14,
  },
});