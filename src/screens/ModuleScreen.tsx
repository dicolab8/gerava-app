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
import { AppIcon, HeaderBackButton } from '../components/NavigationElements';
import { usePreferences } from '../contexts/PreferencesContext';
import { api, normalizeApiList } from '../services/api';
import { UserModule } from '../types';
import { colors, spacing, borderRadius } from '../theme';

type ModuleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Module'>;

export default function ModuleScreen() {
  const navigation = useNavigation<ModuleScreenNavigationProp>();
  const { preferences, updatePreferences } = usePreferences();
  const [modules, setModules] = useState<UserModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | string | null>(preferences.selectedModuleId);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  useEffect(() => {
    setSelectedModuleId(preferences.selectedModuleId);
  }, [preferences.selectedModuleId]);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/avaliacoes/modulos');
      const moduleList = normalizeApiList<any>(data);
      setModules(moduleList.map((m: any) => ({
        id: m.id,
        nome: m.nome,
        periodo: m.periodo,
      })));
    } catch (error) {
      console.error('Erro ao buscar modulos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    const selectedModule = modules.find((module) => String(module.id) === String(selectedModuleId));
    await updatePreferences({
      selectedModuleId,
      selectedModuleName: selectedModule?.nome || null,
    });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.detailHeaderTitle}>Meu Modulo / Periodo</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Selecione o modulo ao qual voce pertence. Isso filtra automaticamente as avaliacoes relevantes na tela inicial.
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando modulos...</Text>
          </View>
        ) : (
          <View style={styles.moduleList}>
            {modules.map((module) => (
              <TouchableOpacity
                key={module.id}
                style={[
                  styles.moduleItem,
                  selectedModuleId === module.id && styles.moduleItemSelected,
                ]}
                onPress={() => setSelectedModuleId(module.id)}
              >
                <View style={[
                  styles.moduleNum,
                  selectedModuleId === module.id && styles.moduleNumSelected,
                ]}>
                  <Text style={styles.moduleNumText}>
                    {module.nome.includes('Internato') ? 'INT' : module.id}
                  </Text>
                </View>
                <View style={styles.moduleText}>
                  <Text style={styles.moduleName}>{module.nome}</Text>
                  {module.periodo && <Text style={styles.modulePeriod}>{module.periodo}</Text>}
                </View>
                {selectedModuleId === module.id && (
                  <AppIcon name="check" color={colors.primaryLight} size={22} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirmar selecao</Text>
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
  moduleList: {
    paddingHorizontal: spacing.md,
  },
  moduleItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moduleItemSelected: {
    borderColor: colors.primaryLight,
    backgroundColor: '#EFF6FF',
  },
  moduleNum: {
    width: 38,
    height: 38,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleNumSelected: {
    backgroundColor: colors.primaryLight,
  },
  moduleNumText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  moduleText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  moduleName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  modulePeriod: {
    fontSize: 12,
    color: colors.text3,
    marginTop: 2,
  },
  buttonContainer: {
    padding: spacing.md,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.white,
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.text3,
    fontSize: 14,
  },
});
