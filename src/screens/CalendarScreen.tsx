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
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { AppIcon, BottomNav, ChevronIcon } from '../components/NavigationElements';
import { usePreferences } from '../contexts/PreferencesContext';
import { api, normalizeApiList } from '../services/api';
import { Evaluation } from '../types';
import { colors, spacing, borderRadius, lightColors } from '../theme';

type CalendarScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Calendar'>;

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  hasEvent: boolean;
  isToday: boolean;
}

export default function CalendarScreen() {
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const { preferences, appColors, fontScale } = usePreferences();
  const styles = useMemo(() => createStyles(appColors, fontScale), [appColors, fontScale]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<{ day: number; month: number; year: number } | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvaluations();
  }, [currentMonth, currentYear]);

  const fetchEvaluations = async () => {
    try {
      setIsLoading(true);
      // Podemos filtrar por mês/ano se a API suportar, 
      // ou baixar todas e filtrar no front.
      const data = await api.get('/avaliacoes');
      setEvaluations(normalizeApiList<Evaluation>(data));
    } catch (error) {
      console.error('Erro ao buscar avaliações para o calendário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dayNames = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getMonthReference = (month: number, year: number, offset: number) => {
    const date = new Date(year, month + offset, 1);
    return {
      month: date.getMonth(),
      year: date.getFullYear(),
    };
  };

  const getEventsForDate = (day: number, month: number, year: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return evaluations.filter(e => {
      // Garantir compatibilidade de formato de data (YYYY-MM-DD)
      const evalDate = e.data.split('T')[0];
      const moduleName = String(e.modulo_nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const selectedModuleName = String(preferences.selectedModuleName || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const matchesModule =
        !preferences.selectedModuleId ||
        String(e.modulo_id) === String(preferences.selectedModuleId) ||
        (!!selectedModuleName && moduleName === selectedModuleName);
      const matchesProfessor =
        preferences.filters.professorId === 'all' ||
        String((e as any).professor_id) === preferences.filters.professorId ||
        String(e.professor_nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() ===
          String(preferences.filters.professorName || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const matchesLab =
        preferences.filters.labId === 'all' ||
        e.laboratorios?.some((lab) => String(lab.id) === preferences.filters.labId);

      return evalDate === dateStr && matchesModule && matchesProfessor && matchesLab;
    });
  };

  // ... (generateCalendarDays remains same but uses getEventsForDate)

  const generateCalendarDays = (): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);
    const prevMonth = getMonthReference(currentMonth, currentYear, -1);
    const nextMonth = getMonthReference(currentMonth, currentYear, 1);
    
    const days: CalendarDay[] = [];
    const today = new Date();
    const isToday = (day: number, month: number, year: number) => {
      return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    };

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push({
        date: day,
        month: prevMonth.month,
        year: prevMonth.year,
        isCurrentMonth: false,
        hasEvent: getEventsForDate(day, prevMonth.month, prevMonth.year).length > 0,
        isToday: isToday(day, prevMonth.month, prevMonth.year),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        hasEvent: getEventsForDate(i, currentMonth, currentYear).length > 0,
        isToday: isToday(i, currentMonth, currentYear),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        month: nextMonth.month,
        year: nextMonth.year,
        isCurrentMonth: false,
        hasEvent: getEventsForDate(i, nextMonth.month, nextMonth.year).length > 0,
        isToday: isToday(i, nextMonth.month, nextMonth.year),
      });
    }

    return days;
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDate(null);
  };

  const handleDateSelect = (day: CalendarDay) => {
    setSelectedDate({ day: day.date, month: day.month, year: day.year });
  };

  const calendarDays = generateCalendarDays();
  const today = new Date();
  const isViewingCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  const defaultSelectedDate = isViewingCurrentMonth
    ? { day: today.getDate(), month: today.getMonth(), year: today.getFullYear() }
    : { day: 1, month: currentMonth, year: currentYear };
  const selectedDateObj = selectedDate || defaultSelectedDate;
  const selectedEvents = getEventsForDate(selectedDateObj.day, selectedDateObj.month, selectedDateObj.year);
  const selectedDateString = `${selectedDateObj.day} de ${monthNames[selectedDateObj.month]}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Calendário</Text>
          <Text style={styles.headerSubtitle}>{monthNames[currentMonth]} {currentYear}</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon}>
          <AppIcon name="calendar" color={appColors.white} size={22} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.calNav}>
            <ChevronIcon color={appColors.text} size={14} />
          </TouchableOpacity>
          <Text style={styles.calMonth}>{monthNames[currentMonth]} {currentYear}</Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.calNav}>
            <ChevronIcon direction="right" color={appColors.text} size={14} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={appColors.primary} />
            <Text style={styles.loadingText}>Carregando calendário...</Text>
          </View>
        ) : (
          <View style={styles.calGrid}>
            {dayNames.map((day, index) => (
              <Text key={index} style={styles.calDayName}>{day}</Text>
            ))}
            {calendarDays.map((day, index) => {
              const isActive =
                selectedDateObj.day === day.date &&
                selectedDateObj.month === day.month &&
                selectedDateObj.year === day.year;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.calDay}
                  onPress={() => handleDateSelect(day)}
                  activeOpacity={0.72}
                >
                  <View
                    style={[
                      styles.calDayBox,
                      isActive && styles.calDayActive,
                    ]}
                  >
                    <Text style={[
                      styles.calDayText,
                      !day.isCurrentMonth && styles.calDayOtherMonth,
                      isActive && styles.calDayTextActive,
                    ]}>
                      {day.date}
                    </Text>
                    {day.hasEvent && (
                      <View
                        style={[
                          styles.calDayDot,
                          isActive && styles.calDayDotActive,
                        ]}
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>{selectedDateString} · {selectedEvents.length} avaliação{selectedEvents.length !== 1 ? 'ões' : ''}</Text>
        </View>

        <View style={styles.eventsList}>
          {selectedEvents.length > 0 ? (
            selectedEvents.map((event) => (
              <TouchableOpacity
                key={event.id.toString()}
                style={styles.eventItem}
                onPress={() => navigation.navigate('Details', { evaluationId: event.id.toString() })}
              >
                <Text style={styles.eventTitle}>{event.disciplina_nome}</Text>
                <Text style={styles.eventSub}>
                  {event.horario_ini.substring(0, 5)} · {event.professor_nome} · {event.modulo_nome}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyEvents}>
              <Text style={styles.emptyEventsTitle}>Nenhuma avaliação neste dia</Text>
              <Text style={styles.emptyEventsText}>Selecione uma data com ponto para ver os detalhes.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNav active="Calendar" />
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof lightColors, fontScale: number) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'System',
    fontSize: 22 * fontScale,
    fontWeight: '500',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 12 * fontScale,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
  },
  headerIcon: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
  },
  calNav: {
    width: 32,
    height: 32,
    backgroundColor: colors.surface2,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calMonth: {
    fontSize: 16 * fontScale,
    fontWeight: 'bold',
    color: colors.text,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  calDayName: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 10 * fontScale,
    fontWeight: 'bold',
    color: colors.text3,
    paddingVertical: spacing.xs,
    textTransform: 'uppercase',
  },
  calDay: {
    width: '14.28%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calDayBox: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: borderRadius.sm,
  },
  calDayActive: {
    backgroundColor: colors.primary,
  },
  calDayText: {
    fontSize: 12 * fontScale,
    fontWeight: '500',
    color: colors.text2,
  },
  calDayTextActive: {
    color: colors.white,
    fontWeight: 'bold',
  },
  calDayOtherMonth: {
    color: colors.text3,
  },
  calDayDot: {
    position: 'absolute',
    bottom: 3,
    width: 4,
    height: 4,
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  calDayDotActive: {
    backgroundColor: colors.white,
  },
  eventsHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  eventsTitle: {
    fontSize: 11 * fontScale,
    fontWeight: 'bold',
    color: colors.text3,
    textTransform: 'uppercase',
  },
  eventsList: {
    paddingHorizontal: spacing.md,
    paddingBottom: 88,
  },
  eventItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: colors.primaryLight,
  },
  eventItemGreen: {
    borderLeftColor: colors.success,
  },
  eventTitle: {
    fontSize: 13 * fontScale,
    fontWeight: 'bold',
    color: colors.text,
  },
  eventSub: {
    fontSize: 11 * fontScale,
    color: colors.text3,
    marginTop: 2,
  },
  emptyEvents: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
  },
  emptyEventsTitle: {
    fontSize: 13 * fontScale,
    fontWeight: 'bold',
    color: colors.text,
  },
  emptyEventsText: {
    fontSize: 11 * fontScale,
    color: colors.text3,
    marginTop: 4,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: spacing.sm,
    color: colors.text3,
    fontSize: 14 * fontScale,
  },
});

