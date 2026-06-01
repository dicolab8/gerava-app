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
              <Text style={styles.favIconText}>📋</Text>
            </View>
            <View style={styles.favText}>
              <Text style={styles.favTitle}>{fav.disciplina_nome}</Text>
              <Text style={styles.favSub}>
                {new Date(fav.data).toLocaleDateString('pt-BR')} · {fav.modulo_nome} · {fav.professor_nome}
              </Text>
            </View>
            <Text style={styles.favStar}>★</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            Toque em ★ em qualquer avaliação para adicioná-la aos favoritos.
          </Text>
        </View>
      </ScrollView>

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
            <Text style={[styles.bottomNavIcon, index === 2 && styles.bottomNavIconActive]}>
              {icon}
            </Text>
            <Text style={[styles.bottomNavLabel, index === 2 && styles.bottomNavLabelActive]}>
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
  favIconText: {
    fontSize: 20,
  },
  favText: {
    flex: 1,
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
  favStar: {
    fontSize: 18,
    color: colors.accent,
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
    //gap: 3,
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
  },
  bottomNavLabelActive: {
    color: colors.primaryLight,
    fontWeight: 'bold',
  },
});