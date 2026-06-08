import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppIcon, AppIconName, BottomNav, ChevronIcon } from '../components/NavigationElements';
import { colors, spacing, borderRadius, lightColors } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';

const stats = [
  { label: 'Avaliações', value: '148' },
  { label: 'Módulos', value: '12' },
  { label: 'Professores', value: '31' },
];

const infoRows: { label: string; value: string; icon: AppIconName; tone: string }[] = [
  { label: 'Versão do aplicativo', value: '2.1.0 (build 84)', icon: 'phone', tone: colors.primaryLight },
  { label: 'Última atualização', value: '10 de março de 2025', icon: 'refresh', tone: colors.info },
  { label: 'Instituição', value: 'UNIFOA - Campus Olezio Galotti', icon: 'school', tone: colors.success },
  { label: 'Contato / suporte', value: 'gerava@unifoa.edu.br', icon: 'mail', tone: colors.accent },
];

export default function AboutScreen() {
  const { appColors, fontScale } = usePreferences();
  const styles = useMemo(() => createStyles(appColors, fontScale), [appColors, fontScale]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.hero}>
          <View style={styles.logoRow}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>G</Text>
            </View>
            <View style={styles.heroText}>
              <Text style={styles.appName}>GERAVA</Text>
              <Text style={styles.version}>Gerenciamento de Avaliações</Text>
            </View>
          </View>

          <Text style={styles.heroDescription}>
            Consulta rápida e organizada para acompanhar avaliações acadêmicas,
            datas, horários, professores e laboratórios.
          </Text>

          <View style={styles.stats}>
            {stats.map((stat, index) => (
              <View
                key={stat.label}
                style={[
                  styles.statItem,
                  index === stats.length - 1 && styles.statItemLast,
                ]}
              >
                <Text style={styles.statNumber}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informações do sistema</Text>
            <View style={styles.sectionPill}>
              <Text style={styles.sectionPillText}>v2.1.0</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            {infoRows.map((row, index) => (
              <View
                key={row.label}
                style={[
                  styles.infoRow,
                  index === infoRows.length - 1 && styles.infoRowLast,
                ]}
              >
                <View style={[styles.infoIcon, { backgroundColor: `${row.tone}1A` }]}>
                  <AppIcon name={row.icon} color={row.tone} size={21} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={styles.infoValue}>{row.value}</Text>
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.privacyCard} activeOpacity={0.72}>
            <View style={styles.privacyIcon}>
              <AppIcon name="privacy" color={colors.primaryLight} size={22} />
            </View>
            <View style={styles.privacyText}>
              <Text style={styles.privacyTitle}>Política de privacidade</Text>
              <Text style={styles.privacySub}>Veja como os dados do app são tratados.</Text>
            </View>
            <ChevronIcon direction="right" color={colors.text3} size={14} />
          </TouchableOpacity>

          <View style={styles.noteCard}>
            <AppIcon name="info" color={colors.primaryLight} size={22} />
            <Text style={styles.noteText}>
              Feito para estudantes acompanharem sua rotina acadêmica com menos
              ruído e mais previsibilidade.
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav active="About" />
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof lightColors, fontScale: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingBottom: 88,
  },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 64,
    height: 64,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  logoText: {
    fontFamily: 'System',
    fontSize: 28 * fontScale,
    fontWeight: '700',
    color: colors.white,
  },
  heroText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  appName: {
    fontFamily: 'System',
    fontSize: 25 * fontScale,
    fontWeight: '700',
    color: colors.white,
  },
  version: {
    fontSize: 12 * fontScale,
    color: 'rgba(255,255,255,0.72)',
    marginTop: 2,
  },
  heroDescription: {
    fontSize: 13 * fontScale,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 20,
    marginTop: spacing.md,
  },
  stats: {
    flexDirection: 'row',
    marginTop: spacing.lg,
  },
  statItem: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  statItemLast: {
    marginRight: 0,
  },
  statNumber: {
    fontSize: 22 * fontScale,
    fontWeight: 'bold',
    color: colors.white,
  },
  statLabel: {
    fontSize: 10 * fontScale,
    color: 'rgba(255,255,255,0.76)',
    marginTop: 2,
  },
  content: {
    padding: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 11 * fontScale,
    fontWeight: 'bold',
    color: colors.text3,
    textTransform: 'uppercase',
  },
  sectionPill: {
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  sectionPillText: {
    fontSize: 10 * fontScale,
    fontWeight: '700',
    color: colors.primaryLight,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12 * fontScale,
    color: colors.text3,
  },
  infoValue: {
    fontSize: 13 * fontScale,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  privacyCard: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  privacyIcon: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  privacyText: {
    flex: 1,
  },
  privacyTitle: {
    fontSize: 13 * fontScale,
    fontWeight: '700',
    color: colors.text,
  },
  privacySub: {
    fontSize: 11 * fontScale,
    color: colors.text3,
    marginTop: 2,
  },
  noteCard: {
    marginTop: spacing.md,
    backgroundColor: '#EFF6FF',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    fontSize: 12 * fontScale,
    color: colors.text2,
    lineHeight: 19,
    marginLeft: spacing.sm,
  },
});
