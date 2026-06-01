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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { api } from '../services/api';
import { colors, spacing, borderRadius } from '../theme';

type FiltersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Filters'>;

interface FilterOption {
  id: string;
  label: string;
}

const periodOptions: FilterOption[] = [
  { id: 'all', label: 'Todas as datas' },
  { id: 'week', label: 'Esta semana' },
  { id: 'month', label: 'Este mês' },
  { id: 'custom', label: 'Intervalo personalizado' },
];

export default function FiltersScreen() {
  const navigation = useNavigation<FiltersScreenNavigationProp>();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedProfessor, setSelectedProfessor] = useState('all');
  const [selectedLab, setSelectedLab] = useState('all');

  const [professorOptions, setProfessorOptions] = useState<FilterOption[]>([{ id: 'all', label: 'Todos os professores' }]);
  const [labOptions, setLabOptions] = useState<FilterOption[]>([{ id: 'all', label: 'Todos os laboratórios' }]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      setIsLoading(true);
      // Estas rotas são protegidas. 
      // Se não houver token, elas podem falhar.
      const [profs, labs] = await Promise.all([
        api.get('/avaliacoes/professores'),
        api.get('/avaliacoes/all-laboratorios'),
      ]);

      if (Array.isArray(profs)) {
        setProfessorOptions([{ id: 'all', label: 'Todos os professores' }, ...profs.map((p: any) => ({
          id: p.id.toString(),
          label: p.nome,
        }))]);
      }

      if (Array.isArray(labs)) {
        setLabOptions([{ id: 'all', label: 'Todos os laboratórios' }, ...labs.map((l: any) => ({
          id: l.id.toString(),
          label: l.nome,
        }))]);
      }
    } catch (error) {
      console.error('Erro ao buscar opções de filtro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    navigation.goBack();
  };

  const handleClear = () => {
    setSelectedPeriod('all');
    setSelectedProfessor('all');
    setSelectedLab('all');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Filtros Avançados</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.spacer} />

        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupTitle}>📅 Período</Text>
          {periodOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOption,
                selectedPeriod === option.id && styles.filterOptionSelected,
              ]}
              onPress={() => setSelectedPeriod(option.id)}
            >
              <View style={styles.radioCircle}>
                {selectedPeriod === option.id && <View style={styles.radioDot} />}
              </View>
              <Text style={[
                styles.filterOptionLabel,
                selectedPeriod === option.id && styles.filterOptionLabelSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupTitle}>👨‍🏫 Professor</Text>
          {professorOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOption,
                selectedProfessor === option.id && styles.filterOptionSelected,
              ]}
              onPress={() => setSelectedProfessor(option.id)}
            >
              <View style={styles.radioCircle}>
                {selectedProfessor === option.id && <View style={styles.radioDot} />}
              </View>
              <Text style={[
                styles.filterOptionLabel,
                selectedProfessor === option.id && styles.filterOptionLabelSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.filterGroup}>
          <Text style={styles.filterGroupTitle}>🔬 Laboratório</Text>
          {labOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOption,
                selectedLab === option.id && styles.filterOptionSelected,
              ]}
              onPress={() => setSelectedLab(option.id)}
            >
              <View style={styles.radioCircle}>
                {selectedLab === option.id && <View style={styles.radioDot} />}
              </View>
              <Text style={[
                styles.filterOptionLabel,
                selectedLab === option.id && styles.filterOptionLabelSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Limpar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Aplicar filtros</Text>
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
  filterGroup: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  filterGroupTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    //gap: spacing.sm,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  filterOptionSelected: {
    borderColor: colors.primaryLight,
    backgroundColor: '#EFF6FF',
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryLight,
  },
  filterOptionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text2,
  },
  filterOptionLabelSelected: {
    color: colors.primaryLight,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    //gap: spacing.sm,
    padding: spacing.md,
  },
  clearButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text2,
  },
  applyButton: {
    flex: 2,
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
});