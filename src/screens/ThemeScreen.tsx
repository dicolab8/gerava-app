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
import { AppIcon, HeaderBackButton } from '../components/NavigationElements';
import { FontSizePreference, usePreferences } from '../contexts/PreferencesContext';
import { colors, spacing, borderRadius } from '../theme';

type ThemeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Theme'>;

interface ThemeOption {
  id: string;
  name: string;
  previewColors: string[];
}

const themes: ThemeOption[] = [
  { id: 'light', name: 'Claro', previewColors: ['#1A3A5C', '#E2E6EC', '#E2E6EC'] },
  { id: 'dark', name: 'Escuro', previewColors: ['#3B82F6', '#1E293B', '#1E293B'] },
  { id: 'system', name: 'Sistema', previewColors: ['#1A3A5C', '#E2E6EC', '#E2E6EC'] },
  { id: 'highContrast', name: 'Alto contraste', previewColors: ['#000000', '#000000', '#F59E0B'] },
  { id: 'blueSoft', name: 'Azul suave', previewColors: ['#2563A8', '#BFDBFE', '#DBEAFE'] },
  { id: 'green', name: 'Verde', previewColors: ['#065F46', '#A7F3D0', '#D1FAE5'] },
];

export default function ThemeScreen() {
  const navigation = useNavigation<ThemeScreenNavigationProp>();
  const { preferences, updatePreferences } = usePreferences();

  const getFontSizeValue = () => {
    switch (preferences.fontSize) {
      case 'small': return 'Pequena';
      case 'normal': return 'Normal';
      case 'large': return 'Grande';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.detailHeaderTitle}>Tema do Aplicativo</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Escolha a aparência preferida. A mudança é aplicada imediatamente em todo o app.
        </Text>

        <View style={styles.themeGrid}>
          {themes.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[styles.themeCard, preferences.themeId === theme.id && styles.themeCardSelected]}
              onPress={() => updatePreferences({ themeId: theme.id })}
            >
              <View style={[styles.themePreview, { backgroundColor: theme.id === 'dark' ? '#0F172A' : '#F7F8FA' }]}>
                <View style={[styles.themeBar, { backgroundColor: theme.previewColors[0], width: '80%' }]} />
                <View style={[styles.themeBar, { backgroundColor: theme.previewColors[1], width: '60%' }]} />
                <View style={[styles.themeBar, { backgroundColor: theme.previewColors[2], width: '70%' }]} />
                {preferences.themeId === theme.id && (
                  <View style={styles.checkCircle}>
                    <AppIcon name="check" color={colors.white} size={14} />
                  </View>
                )}
              </View>
              <Text style={styles.themeLabel}>{theme.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.fontSizeCard}>
          <View style={styles.fontSizeRow}>
            <View>
              <Text style={styles.fontSizeLabel}>Tamanho da fonte</Text>
              <Text style={styles.fontSizeValue}>{getFontSizeValue()}</Text>
            </View>
            <View style={styles.fontSizeControls}>
              <TouchableOpacity
                style={[styles.fontSizeBtn, preferences.fontSize === 'small' && styles.fontSizeBtnActive]}
                onPress={() => updatePreferences({ fontSize: 'small' as FontSizePreference })}
              >
                <Text style={[styles.fontSizeBtnText, preferences.fontSize === 'small' && styles.fontSizeBtnTextActive]}>A</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fontSizeBtn, styles.fontSizeBtnPrimary, preferences.fontSize === 'normal' && styles.fontSizeBtnActive]}
                onPress={() => updatePreferences({ fontSize: 'normal' as FontSizePreference })}
              >
                <Text style={[styles.fontSizeBtnText, styles.fontSizeBtnTextPrimary, preferences.fontSize === 'normal' && styles.fontSizeBtnTextActive]}>A</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fontSizeBtn, preferences.fontSize === 'large' && styles.fontSizeBtnActive]}
                onPress={() => updatePreferences({ fontSize: 'large' as FontSizePreference })}
              >
                <Text style={[styles.fontSizeBtnText, preferences.fontSize === 'large' && styles.fontSizeBtnTextActive]}>A</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  description: {
    padding: spacing.md,
    fontSize: 13,
    color: colors.text2,
    lineHeight: 20,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: spacing.md,
    //gap: spacing.sm,
  },
  themeCard: {
    width: '31%',
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    borderWidth: 2.5,
    borderColor: 'transparent',
  },
  themeCardSelected: {
    borderColor: colors.primaryLight,
  },
  themePreview: {
    height: 90,
    padding: spacing.xs,
    //gap: 4,
  },
  themeBar: {
    height: 8,
    borderRadius: 4,
  },
  checkCircle: {
    width: 20,
    height: 20,
    backgroundColor: colors.primaryLight,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xs,
    alignSelf: 'center',
  },
  themeLabel: {
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '600',
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  fontSizeCard: {
    margin: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fontSizeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fontSizeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  fontSizeValue: {
    fontSize: 11,
    color: colors.text3,
    marginTop: 2,
  },
  fontSizeControls: {
    flexDirection: 'row',
    //gap: spacing.xs,
    alignItems: 'center',
  },
  fontSizeBtn: {
    width: 28,
    height: 28,
    backgroundColor: colors.surface2,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeBtnPrimary: {
    width: 34,
    height: 34,
    backgroundColor: colors.primary,
  },
  fontSizeBtnActive: {
    borderWidth: 2,
    borderColor: colors.primaryLight,
  },
  fontSizeBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  fontSizeBtnTextPrimary: {
    fontSize: 18,
    color: colors.white,
  },
  fontSizeBtnTextActive: {
    color: colors.primaryLight,
  },
});
