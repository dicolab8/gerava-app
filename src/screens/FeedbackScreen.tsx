import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { AppIcon, AppIconName, ChevronIcon, HeaderBackButton } from '../components/NavigationElements';
import { colors, spacing, borderRadius, lightColors } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';

type FeedbackScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Feedback'>;

type FeedbackType = 'bug' | 'suggestion' | 'complaint' | 'praise';

export default function FeedbackScreen() {
  const { appColors, fontScale } = usePreferences();
  const styles = useMemo(() => createStyles(appColors, fontScale), [appColors, fontScale]);
  const navigation = useNavigation<FeedbackScreenNavigationProp>();
  const [selectedType, setSelectedType] = useState<FeedbackType>('bug');
  const [selectedEvaluation, setSelectedEvaluation] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState(4);

  const handleSubmit = () => {
    navigation.navigate('Success');
  };

  const feedbackTypes = [
    { id: 'bug', label: 'Bug / Erro', icon: 'bug' as AppIconName },
    { id: 'suggestion', label: 'Sugestão', icon: 'idea' as AppIconName },
    { id: 'complaint', label: 'Reclamação', icon: 'complaint' as AppIconName },
    { id: 'praise', label: 'Elogio', icon: 'praise' as AppIconName },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.detailHeaderTitle}>Enviar Feedback</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.feedbackBody}>
          <Text style={styles.feedbackLabel}>Tipo de feedback</Text>
          <View style={styles.typeGrid}>
            {feedbackTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeBtn,
                  selectedType === type.id && styles.typeBtnActive,
                ]}
                onPress={() => setSelectedType(type.id as FeedbackType)}
              >
                <AppIcon
                  name={type.icon}
                  color={selectedType === type.id ? colors.primaryLight : colors.text3}
                  size={20}
                />
                <Text style={[
                  styles.typeBtnText,
                  selectedType === type.id && styles.typeBtnTextActive,
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.feedbackLabel}>
            Avaliação relacionada <Text style={styles.optionalText}>(opcional)</Text>
          </Text>
          <View style={styles.selectWrapper}>
            <TouchableOpacity style={styles.selectInput}>
              <Text style={styles.selectText}>
                {selectedEvaluation || 'Selecione uma avaliação...'}
              </Text>
              <ChevronIcon direction="down" color={colors.text3} size={14} />
            </TouchableOpacity>
          </View>

          <Text style={styles.feedbackLabel}>Descreva o problema</Text>
          <TextInput
            style={styles.feedbackTextarea}
            placeholder="Ex: A data da avaliação de Sistema Endócrino está incorreta no app..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            textAlignVertical="top"
          />

          <Text style={styles.feedbackLabel}>Sua avaliação do app</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <View style={styles.star}>
                  <AppIcon
                    name="favorite"
                    color={star <= rating ? colors.accent : colors.border}
                    size={28}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <AppIcon name="send" color={colors.white} size={19} />
            <Text style={styles.submitButtonText}>Enviar feedback</Text>
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
    //gap: spacing.md,
  },
  detailHeaderTitle: {
    marginLeft: spacing.sm,
    fontSize: 17 * fontScale,
    fontWeight: 'bold',
    color: colors.white,
  },
  feedbackBody: {
    padding: spacing.lg,
  },
  feedbackLabel: {
    fontSize: 12 * fontScale,
    fontWeight: '600',
    color: colors.text2,
    marginBottom: spacing.xs,
  },
  optionalText: {
    color: colors.text3,
    fontWeight: '400',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    //gap: spacing.xs,
    marginBottom: spacing.md,
  },
  typeBtn: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 74,
  },
  typeBtnActive: {
    borderColor: colors.primaryLight,
    backgroundColor: '#EFF6FF',
  },
  typeBtnText: {
    fontSize: 12 * fontScale,
    fontWeight: '600',
    color: colors.text2,
    marginTop: spacing.xs,
  },
  typeBtnTextActive: {
    color: colors.primaryLight,
  },
  selectWrapper: {
    marginBottom: spacing.md,
  },
  selectInput: {
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 13 * fontScale,
    color: colors.text,
  },
  feedbackTextarea: {
    backgroundColor: colors.surface2,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 13 * fontScale,
    color: colors.text,
    height: 120,
    marginBottom: spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    //gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  star: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  submitButtonText: {
    fontSize: 14 * fontScale,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: spacing.sm,
  },
});

