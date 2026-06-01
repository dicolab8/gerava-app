import React, { useState } from 'react';
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

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Configurações</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.spacer} />

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Aparência</Text>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('Theme')}>
            <View style={[styles.settingsIcon, { backgroundColor: '#6366F1' }]}>
              <Text style={styles.settingsIconText}>🎨</Text>
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Tema do aplicativo</Text>
              <Text style={styles.settingsRowSub}>Claro (padrão)</Text>
            </View>
            <Text style={styles.settingsArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Perfil Acadêmico</Text>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('Module')}>
            <View style={[styles.settingsIcon, { backgroundColor: colors.primaryLight }]}>
              <Text style={styles.settingsIconText}>📚</Text>
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Módulo / Período</Text>
              <Text style={styles.settingsRowSub}>Não configurado</Text>
            </View>
            <Text style={styles.settingsArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('Filters')}>
            <View style={[styles.settingsIcon, { backgroundColor: colors.success }]}>
              <Text style={styles.settingsIconText}>🔍</Text>
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Filtros avançados</Text>
              <Text style={styles.settingsRowSub}>Professor, data, laboratório</Text>
            </View>
            <Text style={styles.settingsArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Notificações</Text>
          <View style={styles.settingsRow}>
            <View style={[styles.settingsIcon, { backgroundColor: colors.accent }]}>
              <Text style={styles.settingsIconText}>🔔</Text>
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Alertas de avaliação</Text>
              <Text style={styles.settingsRowSub}>Lembrete 24h antes</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, !notificationsEnabled && styles.toggleOff]}
              onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Suporte</Text>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('Feedback')}>
            <View style={[styles.settingsIcon, { backgroundColor: '#EC4899' }]}>
              <Text style={styles.settingsIconText}>💬</Text>
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Feedback</Text>
              <Text style={styles.settingsRowSub}>Sugestões e reclamações</Text>
            </View>
            <Text style={styles.settingsArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsRow} onPress={() => navigation.navigate('About')}>
            <View style={[styles.settingsIcon, { backgroundColor: colors.text3 }]}>
              <Text style={styles.settingsIconText}>ℹ️</Text>
            </View>
            <View style={styles.settingsRowText}>
              <Text style={styles.settingsRowLabel}>Sobre o GERAVA</Text>
              <Text style={styles.settingsRowSub}>Versão 2.1.0</Text>
            </View>
            <Text style={styles.settingsArrow}>›</Text>
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
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 20,
    color: colors.white,
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
    marginRight: spacing.sm,
  },
  settingsIconText: {
    fontSize: 18,
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
  settingsArrow: {
    fontSize: 18,
    color: colors.text3,
  },
  toggle: {
    width: 44,
    height: 24,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    position: 'relative',
  },
  toggleOff: {
    backgroundColor: colors.border,
  },
});