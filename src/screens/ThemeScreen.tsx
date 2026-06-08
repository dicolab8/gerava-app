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
import { AppIcon, HeaderBackButton } from '../components/NavigationElements';
import { FontSizePreference, ThemePreference, usePreferences } from '../contexts/PreferencesContext';
import { spacing, borderRadius, lightColors } from '../theme';

type ThemeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Theme'>;

interface ThemeOption {
  id: ThemePreference;
  name: string;
  previewColors: string[];
}

const themes: ThemeOption[] = [
  { id: 'light', name: 'Claro', previewColors: ['#1A3A5C', '#FFFFFF', '#F0F2F5'] },
  { id: 'dark', name: 'Escuro', previewColors: ['#0F172A', '#111827', '#1F2937'] },
  { id: 'system', name: 'Sistema', previewColors: ['#1A3A5C', '#0F172A', '#E2E6EC'] },
  { id: 'highContrast', name: 'Alto contraste', previewColors: ['#000000', '#FFFFFF', '#FBBF24'] },
  { id: 'blueSoft', name: 'Azul suave', previewColors: ['#2563EB', '#DBEAFE', '#EFF6FF'] },
  { id: 'green', name: 'Verde', previewColors: ['#059669', '#DCFCE7', '#F0FDF4'] },
];

const fontOptions: { id: FontSizePreference; label: string; sampleSize: number }[] = [
  { id: 'small', label: 'Pequena', sampleSize: 14 },
  { id: 'normal', label: 'Normal', sampleSize: 17 },
  { id: 'large', label: 'Grande', sampleSize: 21 },
];

export default function ThemeScreen() {
  const navigation = useNavigation<ThemeScreenNavigationProp>();
  const { preferences, updatePreferences, appColors, fontScale } = usePreferences();
  const styles = useMemo(() => createStyles(appColors, fontScale), [appColors, fontScale]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.detailHeaderTitle}>Tema do Aplicativo</Text>
          <Text style={styles.detailHeaderSub}>Cores e acessibilidade</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.description}>
          As mudancas sao aplicadas imediatamente e ficam salvas no aparelho.
        </Text>

        <Text style={styles.sectionTitle}>Tema</Text>
        <View style={styles.themeGrid}>
          {themes.map((theme) => {
            const isSelected = preferences.themeId === theme.id;

            return (
              <TouchableOpacity
                key={theme.id}
                style={[styles.themeCard, isSelected && styles.themeCardSelected]}
                onPress={() => updatePreferences({ themeId: theme.id })}
                activeOpacity={0.72}
              >
                <View style={[styles.themePreview, { backgroundColor: theme.previewColors[1] }]}>
                  <View style={[styles.themeTopBar, { backgroundColor: theme.previewColors[0] }]} />
                  <View style={[styles.themeLine, { backgroundColor: theme.previewColors[2], width: '72%' }]} />
                  <View style={[styles.themeLine, { backgroundColor: theme.previewColors[2], width: '52%' }]} />
                  {isSelected && (
                    <View style={styles.checkCircle}>
                      <AppIcon name="check" color={appColors.white} size={14} />
                    </View>
                  )}
                </View>
                <Text style={styles.themeLabel}>{theme.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Tamanho da fonte</Text>
        <View style={styles.fontSizeCard}>
          {fontOptions.map((option) => {
            const isSelected = preferences.fontSize === option.id;

            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.fontOption, isSelected && styles.fontOptionSelected]}
                onPress={() => updatePreferences({ fontSize: option.id })}
                activeOpacity={0.72}
              >
                <Text
                  style={[
                    styles.fontOptionSample,
                    { fontSize: option.sampleSize },
                    isSelected && styles.fontOptionSampleSelected,
                  ]}
                >
                  A
                </Text>
                <Text style={[styles.fontOptionLabel, isSelected && styles.fontOptionLabelSelected]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
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
  description: {
    fontSize: 13 * fontScale,
    color: colors.text2,
    lineHeight: 20 * fontScale,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 11 * fontScale,
    fontWeight: 'bold',
    color: colors.text3,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
    marginBottom: spacing.lg,
  },
  themeCard: {
    width: '50%',
    paddingHorizontal: spacing.xs,
    marginBottom: spacing.sm,
  },
  themeCardSelected: {},
  themePreview: {
    minHeight: 92,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  themeTopBar: {
    height: 22,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  themeLine: {
    height: 9,
    borderRadius: 6,
    marginBottom: spacing.xs,
  },
  checkCircle: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeLabel: {
    textAlign: 'center',
    fontSize: 12 * fontScale,
    fontWeight: '700',
    paddingVertical: spacing.xs,
    color: colors.text,
  },
  fontSizeCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fontOption: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  fontOptionSelected: {
    borderColor: colors.primaryLight,
    backgroundColor: colors.surface2,
  },
  fontOptionSample: {
    width: 36,
    fontWeight: '800',
    color: colors.text2,
  },
  fontOptionSampleSelected: {
    color: colors.primaryLight,
  },
  fontOptionLabel: {
    flex: 1,
    fontSize: 14 * fontScale,
    fontWeight: '700',
    color: colors.text,
  },
  fontOptionLabelSelected: {
    color: colors.primaryLight,
  },
});
