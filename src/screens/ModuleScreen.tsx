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
import { UserModule } from '../types';
import { colors, spacing, borderRadius } from '../theme';

type ModuleScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Module'>;

export default function ModuleScreen() {
  const navigation = useNavigation<ModuleScreenNavigationProp>();
  const [modules, setModules] = useState<UserModule[]>([]);
  const [selectedModuleId, setSelectedModuleId] = useState<number | string>(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      const data = await api.get('/avaliacoes/modulos');
      if (Array.isArray(data)) {
        setModules(data.map((m: any) => ({
          id: m.id,
          nome: m.nome,
        })));
      }
    } catch (error) {
      console.error('Erro ao buscar módulos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Meu Módulo / Período</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Selecione o módulo ao qual você pertence. Isso filtra automaticamente as avaliações relevantes na tela inicial.
        </Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando módulos...</Text>
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
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Confirmar seleção</Text>
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
    //gap: spacing.md,
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
  checkIcon: {
    fontSize: 20,
    color: colors.primaryLight,
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