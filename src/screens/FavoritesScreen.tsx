import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { AppIcon, BottomNav } from '../components/NavigationElements';
import { usePreferences } from '../contexts/PreferencesContext';
import { spacing, borderRadius, lightColors } from '../theme';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

const formatDate = (value?: string) => {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString('pt-BR')
    : 'Data nao informada';
};

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favorites, toggleFavorite, appColors, fontScale } = usePreferences();
  const styles = useMemo(() => createStyles(appColors, fontScale), [appColors, fontScale]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Favoritos</Text>
          <Text style={styles.headerSubtitle}>Avaliacoes salvas</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>{favorites.length} salvas</Text>

        {favorites.map((fav) => (
          <TouchableOpacity
            key={fav.id.toString()}
            style={styles.favCard}
            onPress={() => navigation.navigate('Details', { evaluationId: fav.id.toString() })}
            activeOpacity={0.72}
          >
            <View style={styles.favIcon}>
              <AppIcon name="note" color={appColors.accent} size={21} />
            </View>
            <View style={styles.favText}>
              <Text style={styles.favTitle} numberOfLines={2}>{fav.disciplina_nome}</Text>
              <Text style={styles.favSub} numberOfLines={2}>
                {formatDate(fav.data)} · {fav.modulo_nome} · {fav.professor_nome}
              </Text>
            </View>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Remover favorito"
              style={styles.removeButton}
              onPress={() => toggleFavorite(fav)}
            >
              <AppIcon name="favorite" color={appColors.accent} size={22} />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        {favorites.length === 0 && (
          <View style={styles.infoBox}>
            <AppIcon name="favorite" color={appColors.accent} size={26} />
            <Text style={styles.infoText}>
              Toque no marcador de favorito em qualquer avaliacao para salva-la aqui.
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNav active="Favorites" />
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
  },
  headerTitle: {
    fontFamily: 'System',
    fontSize: 22 * fontScale,
    fontWeight: '600',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 12 * fontScale,
    color: 'rgba(255,255,255,0.70)',
    marginTop: 2,
  },
  scrollContent: {
    paddingBottom: 88,
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
  favCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  favIcon: {
    width: 42,
    height: 42,
    backgroundColor: colors.accentSoft,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  favText: {
    flex: 1,
  },
  favTitle: {
    fontSize: 13 * fontScale,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 18 * fontScale,
  },
  favSub: {
    fontSize: 11 * fontScale,
    color: colors.text3,
    lineHeight: 16 * fontScale,
    marginTop: 2,
  },
  removeButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  infoBox: {
    backgroundColor: colors.surface,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    fontSize: 12 * fontScale,
    color: colors.text3,
    textAlign: 'center',
    lineHeight: 19 * fontScale,
    marginTop: spacing.sm,
  },
});
