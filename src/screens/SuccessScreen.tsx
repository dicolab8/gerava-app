import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { AppIcon, HeaderBackButton } from '../components/NavigationElements';
import { colors, spacing, borderRadius, lightColors } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';

type SuccessScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Success'>;

export default function SuccessScreen() {
  const { appColors, fontScale } = usePreferences();
  const styles = useMemo(() => createStyles(appColors, fontScale), [appColors, fontScale]);
  const navigation = useNavigation<SuccessScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.detailHeaderTitle}>Enviar Feedback</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalIcon}>
              <AppIcon name="check" color={colors.white} size={38} />
            </View>
            <Text style={styles.modalTitle}>Feedback enviado!</Text>
            <Text style={styles.modalSub}>
              Obrigado pela sua contribuição. Sua mensagem foi recebida e será analisada pela equipe do GERAVA.
            </Text>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.backButtonText}>Voltar ao início</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    //gap: spacing.md,
  },
  detailHeaderTitle: {
    marginLeft: spacing.sm,
    fontSize: 17 * fontScale,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    flex: 1,
    position: 'relative',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.xl,
    alignItems: 'center',
  },
  modalIcon: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: 18 * fontScale,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  modalSub: {
    fontSize: 13 * fontScale,
    color: colors.text3,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  backButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 14 * fontScale,
    fontWeight: 'bold',
    color: colors.white,
  },
});

