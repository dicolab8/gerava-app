import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { api } from '../services/api';
import { Evaluation } from '../types';
import { colors, typography, spacing, borderRadius } from '../theme';

type DetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

export default function DetailScreen() {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const route = useRoute();
  const { evaluationId } = route.params as { evaluationId: string };
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvaluationDetails();
  }, [evaluationId]);

  const fetchEvaluationDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Nota: Esta rota é protegida no backend. 
      // Se falhar por 401, precisaremos do token.
      const data = await api.get(`/avaliacoes/${evaluationId}`);
      setEvaluation(data.avaliacao || data);
    } catch (err) {
      setError('Erro ao carregar detalhes.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando detalhes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !evaluation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ {error || 'Avaliação não encontrada.'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
            <Text style={styles.retryButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Detalhes da Avaliação</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.detailBody}>
          <View style={styles.titleRow}>
            <Text style={styles.detailTitle}>{evaluation.disciplina_nome}</Text>
            <View style={[styles.tag, styles.tagBlue]}>
              <Text style={styles.tagText}>{evaluation.modulo_nome}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text>📋</Text>
              </View>
              <View>
                <Text style={styles.infoLabel}>Módulo</Text>
                <Text style={styles.infoValue}>{evaluation.modulo_nome} · ID {evaluation.modulo_id}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text>👤</Text>
              </View>
              <View>
                <Text style={styles.infoLabel}>Professor</Text>
                <Text style={styles.infoValue}>{evaluation.professor_nome}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text>📅</Text>
              </View>
              <View>
                <Text style={styles.infoLabel}>Data</Text>
                <Text style={styles.infoValue}>
                  {new Date(evaluation.data).toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoIcon}>
                <Text>⏰</Text>
              </View>
              <View>
                <Text style={styles.infoLabel}>Horário</Text>
                <Text style={styles.infoValue}>{evaluation.horario_ini.substring(0, 5)} – {evaluation.horario_fim.substring(0, 5)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoBoxTitle}>🔬 Laboratórios</Text>
            {evaluation.laboratorios.map((lab, index) => (
              <View key={index} style={styles.infoBoxItem}>
                <View style={styles.dot} />
                <Text style={styles.infoBoxText}>{lab.nome}</Text>
              </View>
            ))}
          </View>

          {evaluation.observacoes && (
            <View style={styles.infoBox}>
              <Text style={styles.infoBoxTitle}>📋 Observações</Text>
              <Text style={styles.observationsText}>{evaluation.observacoes}</Text>
            </View>
          )}

          <TouchableOpacity style={styles.favoriteButton}>
            <Text style={styles.favoriteIcon}>⭐</Text>
            <Text style={styles.favoriteText}>Salvar nos Favoritos</Text>
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
    fontSize: 17,
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
    //gap: spacing.sm,
    marginBottom: spacing.md,
  },
  detailTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 26,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 20,
  },
  tagBlue: {
    backgroundColor: '#DBEAFE',
  },
  tagGreen: {
    backgroundColor: '#D1FAE5',
  },
  tagOrange: {
    backgroundColor: colors.accentSoft,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    //shadowColor: '#000',
    //shadowOffset: { width: 0, height: 2 },
    //shadowOpacity: 0.05,
    //shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    //: spacing.sm,
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
  infoLabel: {
    fontSize: 11,
    color: colors.text3,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
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
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  infoBoxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    //gap: spacing.xs,
    paddingVertical: 2,
  },
  dot: {
    width: 6,
    height: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: 3,
  },
  infoBoxText: {
    fontSize: 13,
    color: colors.text2,
  },
  observationsText: {
    fontSize: 12,
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
    //gap: spacing.sm,
    marginTop: spacing.sm,
  },
  favoriteIcon: {
    fontSize: 18,
    color: colors.white,
  },
  favoriteText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
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
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.md,
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
    fontSize: 14,
  },
});