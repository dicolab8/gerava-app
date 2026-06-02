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
import { AppIcon, ChevronIcon, HeaderBackButton } from '../components/NavigationElements';
import { usePreferences } from '../contexts/PreferencesContext';
import { colors, spacing, borderRadius } from '../theme';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const { preferences, updatePreferences } = usePreferences();

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
      preferences.filters.period !== 'all' ? 'período' : null,
      preferences.filters.professorId !== 'all' ? 'professor' : null,
      preferences.filters.labId !== 'all' ? 'laboratório' : null,
    ].filter(Boolean);

    return activeFilters.length > 0
      ? `${activeFilters.length} filtro${activeFilters.length !== 1 ? 's' : ''} ativo${activeFilters.length !== 1 ? 's' : ''}`
      : 'Professor, data, laboratório';
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.detailHeaderTitle}>Configurações</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.spacer} />

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('Theme')}>
            <View style={[styles.settingsIcon, { backgroundColor: '#6366F1' }]}>
              <AppIcon name="palette" color={colors.white} size={21} />
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Tema do aplicativo</Text>
              <Text style={styles.settingsRowSub}>{getThemeLabel()} · fonte {getFontLabel()}</Text>
            </View>
            <ChevronIcon direction="right" color={colors.text3} size={14} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Perfil Acadêmico</Text>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('Module')}>
            <View style={[styles.settingsIcon, { backgroundColor: colors.primaryLight }]}>
              <AppIcon name="book" color={colors.white} size={21} />
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Módulo / Período</Text>
              <Text style={styles.settingsRowSub}>{preferences.selectedModuleName || 'Não configurado'}</Text>
            </View>
            <ChevronIcon direction="right" color={colors.text3} size={14} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('Filters')}>
            <View style={[styles.settingsIcon, { backgroundColor: colors.success }]}>
              <AppIcon name="search" color={colors.white} size={21} />
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Filtros avançados</Text>
              <Text style={styles.settingsRowSub}>{getFiltersLabel()}</Text>
            </View>
            <ChevronIcon direction="right" color={colors.text3} size={14} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <View style={styles.settingsRow}>
            <View style={[styles.settingsIcon, { backgroundColor: colors.accent }]}>
              <AppIcon name="bell" color={colors.white} size={21} />
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Alertas de avaliação</Text>
              <Text style={styles.settingsRowSub}>Lembrete 24h antes</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, !preferences.notificationsEnabled && styles.toggleOff]}
              onPress={() => updatePreferences({ notificationsEnabled: !preferences.notificationsEnabled })}
            >
              <View
                style={[
                  styles.toggleKnob,
                  !preferences.notificationsEnabled && styles.toggleKnobOff,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('Feedback')}>
            <View style={[styles.settingsIcon, { backgroundColor: '#EC4899' }]}>
              <AppIcon name="chat" color={colors.white} size={21} />
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Feedback</Text>
              <Text style={styles.settingsRowSub}>Sugestões e reclamações</Text>
            </View>
            <ChevronIcon direction="right" color={colors.text3} size={14} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('About')}>
            <View style={[styles.settingsIcon, { backgroundColor: colors.text3 }]}>
              <AppIcon name="info" color={colors.white} size={21} />
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Sobre o GERAVA</Text>
              <Text style={styles.settingsRowSub}>Versão 2.1.0</Text>
            </View>
            <ChevronIcon direction="right" color={colors.text3} size={14} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    //gap: spacing.md,
  },
  detailHeaderTitle: {
    marginLeft: spacing.sm,
    fontSize: 17,
    fontWeight: 'bold',
    color: colors.white,
  },
  spacer: {
    height: spacing.sm,
  },
  settingsSection: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text3,
    textTransform: 'uppercase',
    backgroundColor: colors.surface2,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    //gap: spacing.md,
  },
  settingsIcon: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsRowText: {
    flex: 1,
  },
  settingsRowLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  settingsRowSub: {
    fontSize: 12,
    color: colors.text3,
    marginTop: 1,
  },
  toggle: {
    width: 44,
    height: 24,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  toggleOff: {
    backgroundColor: colors.border,
  },
  toggleKnob: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.white,
    alignSelf: 'flex-end',
  },
  toggleKnobOff: {
    alignSelf: 'flex-start',
  },
});
