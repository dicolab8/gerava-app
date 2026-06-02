import React from 'react';
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
import { api } from '../services/api';
import { Evaluation } from '../types';
import { colors, spacing, borderRadius } from '../theme';

type FavoritesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Favorites'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  // Por enquanto, favoritos estão vazios até implementarmos persistência local (ex: AsyncStorage)
  const favorites: Evaluation[] = [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Favoritos</Text>
          <Text style={styles.headerSubtitle}>Avaliações salvas</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>{favorites.length} salvas</Text>
        
        {favorites.map((fav) => (
          <TouchableOpacity
            key={fav.id.toString()}
            style={styles.favCard}
            onPress={() => navigation.navigate('Details', { evaluationId: fav.id.toString() })}
          >
            <View style={styles.favIcon}>
              <AppIcon name="note" color={colors.accent} size={21} />
            </View>
            <View style={styles.favText}>
              <Text style={styles.favTitle}>{fav.disciplina_nome}</Text>
              <Text style={styles.favSub}>
                {new Date(fav.data).toLocaleDateString('pt-BR')} · {fav.modulo_nome} · {fav.professor_nome}
              </Text>
            </View>
            <AppIcon name="favorite" color={colors.accent} size={22} />
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <AppIcon name="favorite" color={colors.accent} size={24} />
          <Text style={styles.infoText}>
            Toque no marcador de favorito em qualquer avaliação para salvá-la aqui.
          </Text>
        </View>
      </ScrollView>

      <BottomNav active="Favorites" />
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
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    fontSize: 11,
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
    //gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  favIcon: {
    width: 40,
    height: 40,
    backgroundColor: colors.accentSoft,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favText: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  favTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
  },
  favSub: {
    fontSize: 11,
    color: colors.text3,
    marginTop: 2,
  },
  infoBox: {
    backgroundColor: colors.surface2,
    margin: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: colors.text3,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: spacing.sm,
  },
});
