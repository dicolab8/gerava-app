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
import { colors, spacing, borderRadius } from '../theme';

type AboutScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'About'>;

export default function AboutScreen() {
  const navigation = useNavigation<AboutScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>G</Text>
          </View>
          <Text style={styles.appName}>GERAVA</Text>
          <Text style={styles.version}>Gerenciamento de Avaliações · v2.1.0</Text>
          
          <View style={styles.stats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>148</Text>
              <Text style={styles.statLabel}>Avaliações</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Módulos</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>31</Text>
              <Text style={styles.statLabel}>Professores</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.descriptionBox}>
            <Text style={styles.description}>
              O GERAVA é o sistema oficial de consulta de avaliações acadêmicas, permitindo que os alunos acompanhem datas, horários e laboratórios das provas.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Informações do sistema</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📱</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Versão do aplicativo</Text>
              <Text style={styles.infoValue}>2.1.0 (build 84)</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🔄</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Última atualização</Text>
              <Text style={styles.infoValue}>10 de março de 2025</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🏫</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Instituição</Text>
              <Text style={styles.infoValue}>UNIFOA – Campus Olezio Galotti</Text>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>✉️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Contato / suporte</Text>
              <Text style={styles.infoValue}>gerava@unifoa.edu.br</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.infoRow}>
            <Text style={styles.infoIcon}>⚖️</Text>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Política de privacidade</Text>
              <Text style={[styles.infoValue, styles.link]}>Ver documento →</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Feito com 🎓 para estudantes de medicina</Text>
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
            <Text style={[styles.bottomNavIcon, index === 3 && styles.bottomNavIconActive]}>
              {icon}
            </Text>
            <Text style={[styles.bottomNavLabel, index === 3 && styles.bottomNavLabelActive]}>
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
    backgroundColor: colors.surface,
  },
  hero: {
    backgroundColor: colors.primary,
    padding: spacing.xl,
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontFamily: 'System',
    fontSize: 26,
    fontWeight: '600',
    color: colors.white,
  },
  appName: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '600',
    color: colors.white,
  },
  version: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: spacing.xs,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    //gap: spacing.xl,
    marginTop: spacing.lg,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  content: {
    padding: spacing.lg,
  },
  descriptionBox: {
    backgroundColor: colors.surface2,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  description: {
    fontSize: 12,
    color: colors.text2,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text3,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    //gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.text2,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginTop: 1,
  },
  link: {
    color: colors.primaryLight,
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: colors.text3,
    padding: spacing.md,
    marginBottom: 60,
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