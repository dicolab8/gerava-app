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
import { AppIcon, ChevronIcon, HeaderBackButton } from '../components/NavigationElements';
import { usePreferences } from '../contexts/PreferencesContext';
import { spacing, borderRadius, lightColors } from '../theme';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

type SettingsRowProps = {
  icon: React.ComponentProps<typeof AppIcon>['name'];
  iconColor: string;
  label: string;
  subLabel: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
};

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { preferences, updatePreferences, appColors, fontScale } = usePreferences();
  const styles = useMemo(() => createStyles(appColors, fontScale), [appColors, fontScale]);

  const getThemeLabel = () => {
    switch (preferences.themeId) {
      case 'dark':
        return 'Escuro';
      case 'system':
        return 'Sistema';
      case 'highContrast':
        return 'Alto contraste';
      case 'blueSoft':
        return 'Azul suave';
      case 'green':
        return 'Verde';
      default:
        return 'Claro';
    }
  };

  const getFiltersLabel = () => {
    const activeFilters = [
      preferences.filters.period !== 'all' ? 'periodo' : null,
      preferences.filters.professorId !== 'all' ? 'professor' : null,
      preferences.filters.labId !== 'all' ? 'laboratorio' : null,
    ].filter(Boolean);

    return activeFilters.length > 0
      ? `${activeFilters.length} filtro${activeFilters.length !== 1 ? 's' : ''} ativo${activeFilters.length !== 1 ? 's' : ''}`
      : 'Professor, data, laboratorio';
  };

  const getFontLabel = () => {
    switch (preferences.fontSize) {
      case 'small':
        return 'pequena';
      case 'large':
        return 'grande';
      default:
        return 'normal';
    }
  };

  const SettingsRow = ({
    icon,
    iconColor,
    label,
    subLabel,
    onPress,
    trailing,
  }: SettingsRowProps) => (
    <TouchableOpacity
      style={styles.settingsRow}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.72}
    >
      <View style={[styles.settingsIcon, { backgroundColor: `${iconColor}22` }]}>
        <AppIcon name={icon} color={iconColor} size={21} />
      </View>
      <View style={styles.settingsRowText}>
        <Text style={styles.settingsRowLabel}>{label}</Text>
        <Text style={styles.settingsRowSub}>{subLabel}</Text>
      </View>
      {trailing || <ChevronIcon direction="right" color={appColors.text3} size={14} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.detailHeaderTitle}>Configuracoes</Text>
          <Text style={styles.detailHeaderSub}>Preferencias e acessibilidade</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <AppIcon name="settings" color={appColors.white} size={22} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>Seu app, do seu jeito</Text>
            <Text style={styles.summarySub}>
              Tema {getThemeLabel().toLowerCase()}, fonte {getFontLabel()} e filtros salvos no aparelho.
            </Text>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Aparencia</Text>
          <SettingsRow
            icon="palette"
            iconColor="#6366F1"
            label="Tema e fonte"
            subLabel={`${getThemeLabel()} · fonte ${getFontLabel()}`}
            onPress={() => navigation.navigate('Theme')}
          />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Perfil academico</Text>
          <SettingsRow
            icon="book"
            iconColor={appColors.primaryLight}
            label="Modulo / Periodo"
            subLabel={preferences.selectedModuleName || 'Nao configurado'}
            onPress={() => navigation.navigate('Module')}
          />
          <View style={styles.rowDivider} />
          <SettingsRow
            icon="search"
            iconColor={appColors.success}
            label="Filtros avancados"
            subLabel={getFiltersLabel()}
            onPress={() => navigation.navigate('Filters')}
          />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Notificacoes</Text>
          <SettingsRow
            icon="bell"
            iconColor={appColors.accent}
            label="Alertas de avaliacao"
            subLabel={preferences.notificationsEnabled ? 'Lembrete 24h antes' : 'Alertas desativados'}
            trailing={
              <TouchableOpacity
                accessibilityRole="switch"
                accessibilityState={{ checked: preferences.notificationsEnabled }}
                style={[
                  styles.toggle,
                  !preferences.notificationsEnabled && styles.toggleOff,
                ]}
                onPress={() => updatePreferences({ notificationsEnabled: !preferences.notificationsEnabled })}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    !preferences.notificationsEnabled && styles.toggleKnobOff,
                  ]}
                />
              </TouchableOpacity>
            }
          />
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          <SettingsRow
            icon="chat"
            iconColor="#EC4899"
            label="Feedback"
            subLabel="Sugestoes e reclamacoes"
            onPress={() => navigation.navigate('Feedback')}
          />
          <View style={styles.rowDivider} />
          <SettingsRow
            icon="info"
            iconColor={appColors.text3}
            label="Sobre o GERAVA"
            subLabel="Versao 2.1.0"
            onPress={() => navigation.navigate('About')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof lightColors, fontScale: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  detailHeader: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  detailHeaderTitle: {
    fontSize: 18 * fontScale,
    fontWeight: 'bold',
    color: colors.white,
  },
  detailHeaderSub: {
    marginTop: 2,
    fontSize: 12 * fontScale,
    color: 'rgba(255,255,255,0.72)',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  summaryText: {
    flex: 1,
  },
  summaryTitle: {
    fontSize: 15 * fontScale,
    fontWeight: '700',
    color: colors.text,
  },
  summarySub: {
    marginTop: 3,
    fontSize: 12 * fontScale,
    lineHeight: 18 * fontScale,
    color: colors.text2,
  },
  settingsSection: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    fontSize: 11 * fontScale,
    fontWeight: 'bold',
    color: colors.text3,
    textTransform: 'uppercase',
    backgroundColor: colors.surface2,
  },
  settingsRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: spacing.md + 44 + spacing.md,
  },
  settingsIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  settingsRowText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  settingsRowLabel: {
    fontSize: 14 * fontScale,
    fontWeight: '700',
    color: colors.text,
  },
  settingsRowSub: {
    fontSize: 12 * fontScale,
    color: colors.text3,
    marginTop: 3,
    lineHeight: 17 * fontScale,
  },
  toggle: {
    width: 48,
    height: 28,
    backgroundColor: colors.primaryLight,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOff: {
    backgroundColor: colors.border,
  },
  toggleKnob: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
    alignSelf: 'flex-end',
  },
  toggleKnobOff: {
    alignSelf: 'flex-start',
  },
});
