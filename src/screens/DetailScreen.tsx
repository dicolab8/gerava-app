import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { AppIcon, HeaderBackButton } from '../components/NavigationElements';
import { usePreferences } from '../contexts/PreferencesContext';
import { api } from '../services/api';
import { Evaluation } from '../types';
import { colors, spacing, borderRadius, lightColors } from '../theme';

type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;
type DetailScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const fallbackText = 'Nao informado';

const getText = (value?: string | number | null) => {
  const text = String(value ?? '').trim();
  return text || fallbackText;
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return fallbackText;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return fallbackText;
  }

  return date.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatTime = (value?: string | null) => {
  if (!value) {
    return fallbackText;
  }

  return value.slice(0, 5);
};

const getEvaluationFromResponse = (response: any): Evaluation | null => {
  if (response?.avaliacao && typeof response.avaliacao === 'object') {
    return response.avaliacao;
  }

  if (response?.data && typeof response.data === 'object') {
    return response.data;
  }

  if (response && typeof response === 'object') {
    return response;
  }

  return null;
};

export default function DetailScreen() {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const route = useRoute<DetailScreenRouteProp>();
  const evaluationId = route.params?.evaluationId;
  const { appColors, fontScale, isFavorite, toggleFavorite } = usePreferences();
  const styles = useMemo(() => createStyles(appColors, fontScale), [appColors, fontScale]);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvaluationDetails();
  }, [evaluationId]);

  const fetchEvaluationDetails = async () => {
    if (!evaluationId) {
      setError('Avaliacao nao encontrada.');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await api.get(`/avaliacoes/${evaluationId}`);
      const evaluationDetails = getEvaluationFromResponse(data);

      if (!evaluationDetails?.id) {
        throw new Error('Resposta de avaliacao invalida.');
      }

      setEvaluation(evaluationDetails);
    } catch (err) {
      setError('Erro ao carregar detalhes.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!evaluation || isFavoriteLoading) {
      return;
    }

    try {
      setIsFavoriteLoading(true);
      await toggleFavorite(evaluation);
    } finally {
      setIsFavoriteLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={appColors.primary} />
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !evaluation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <AppIcon name="warning" color={appColors.danger} size={30} />
          </View>
          <Text style={styles.errorText}>{error || 'Avaliacao nao encontrada.'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const labs = Array.isArray(evaluation.laboratorios) ? evaluation.laboratorios : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.detailHeaderTitle}>Detalhes da Avaliacao</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.detailBody}>
          <View style={styles.titleRow}>
            <Text style={styles.detailTitle}>{getText(evaluation.disciplina_nome)}</Text>
            <View style={[styles.tag, styles.tagBlue]}>
              <Text style={styles.tagText}>{getText(evaluation.modulo_nome)}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <AppIcon name="note" color={appColors.primaryLight} size={20} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Modulo</Text>
                <Text style={styles.infoValue}>
                  {getText(evaluation.modulo_nome)} - ID {getText(evaluation.modulo_id)}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <AppIcon name="user" color={appColors.primaryLight} size={20} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Professor</Text>
                <Text style={styles.infoValue}>{getText(evaluation.professor_nome)}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <AppIcon name="calendar" color={appColors.primaryLight} size={20} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Data</Text>
                <Text style={styles.infoValue}>{formatDate(evaluation.data)}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <AppIcon name="clock" color={appColors.primaryLight} size={20} />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoLabel}>Horario</Text>
                <Text style={styles.infoValue}>
                  {formatTime(evaluation.horario_ini)} - {formatTime(evaluation.horario_fim)}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoBoxHeader}>
              <AppIcon name="lab" color={appColors.primaryLight} size={18} />
              <Text style={styles.infoBoxTitle}>Laboratorios</Text>
            </View>
            {labs.length > 0 ? (
              labs.map((lab, index) => (
                <View key={`${lab.id ?? index}`} style={styles.infoBoxItem}>
                  <View style={styles.dot} />
                  <Text style={styles.infoBoxText}>{getText(lab.nome)}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.infoBoxText}>{fallbackText}</Text>
            )}
          </View>

          {evaluation.observacoes && (
            <View style={styles.infoBox}>
              <View style={styles.infoBoxHeader}>
                <AppIcon name="note" color={appColors.primaryLight} size={18} />
                <Text style={styles.infoBoxTitle}>Observacoes</Text>
              </View>
              <Text style={styles.observationsText}>{evaluation.observacoes}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.favoriteButton,
              isFavorite(evaluation.id) && styles.favoriteButtonSaved,
              isFavoriteLoading && styles.favoriteButtonDisabled,
            ]}
            onPress={handleToggleFavorite}
            disabled={isFavoriteLoading}
          >
            <AppIcon name="favorite" color={appColors.white} size={20} />
            <Text style={styles.favoriteText}>
              {isFavorite(evaluation.id) ? 'Remover dos Favoritos' : 'Salvar nos Favoritos'}
            </Text>
          </TouchableOpacity>
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
  detailHeaderTitle: {
    marginLeft: spacing.sm,
    fontSize: 17 * fontScale,
    fontWeight: 'bold',
    color: colors.white,
  },
  detailBody: {
    padding: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  detailTitle: {
    flex: 1,
    fontSize: 20 * fontScale,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 26,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 20,
    marginLeft: spacing.sm,
  },
  tagBlue: {
    backgroundColor: '#DBEAFE',
  },
  tagText: {
    fontSize: 10 * fontScale,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoIcon: {
    width: 32,
    height: 32,
    backgroundColor: colors.surface2,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  infoLabel: {
    fontSize: 11 * fontScale,
    color: colors.text3,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14 * fontScale,
    color: colors.text,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: colors.surface2,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  infoBoxTitle: {
    fontSize: 12 * fontScale,
    fontWeight: 'bold',
    color: colors.text,
    textTransform: 'uppercase',
    marginLeft: spacing.xs,
  },
  infoBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  infoBoxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 3,
  },
  infoBoxText: {
    fontSize: 13 * fontScale,
    color: colors.text2,
    marginLeft: spacing.xs,
  },
  observationsText: {
    fontSize: 12 * fontScale,
    color: colors.text2,
    lineHeight: 19,
  },
  favoriteButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  favoriteButtonSaved: {
    backgroundColor: colors.accent,
  },
  favoriteButtonDisabled: {
    opacity: 0.72,
  },
  favoriteText: {
    fontSize: 14 * fontScale,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.text2,
    fontSize: 14 * fontScale,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14 * fontScale,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  errorIcon: {
    width: 54,
    height: 54,
    borderRadius: borderRadius.lg,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14 * fontScale,
  },
});
