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
import { Evaluation } from '../types';
import { colors, spacing, borderRadius } from '../theme';

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
      setEvaluations(Array.isArray(data) ? data : data.avaliacoes || []);
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

  const getEventsForDate = (day: number, month: number, year: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return evaluations.filter(e => {
      // Garantir compatibilidade de formato de data (YYYY-MM-DD)
      const evalDate = e.data.split('T')[0];
      return evalDate === dateStr;
    });
  };

  // ... (generateCalendarDays remains same but uses getEventsForDate)

  const generateCalendarDays = (): CalendarDay[] => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const daysInPrevMonth = getDaysInMonth(currentMonth - 1, currentYear);
    
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
        month: currentMonth - 1,
        year: currentYear,
        isCurrentMonth: false,
        hasEvent: getEventsForDate(day, currentMonth - 1, currentYear).length > 0,
        isToday: isToday(day, currentMonth - 1, currentYear),
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
        month: currentMonth + 1,
        year: currentYear,
        isCurrentMonth: false,
        hasEvent: getEventsForDate(i, currentMonth + 1, currentYear).length > 0,
        isToday: isToday(i, currentMonth + 1, currentYear),
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
  const todayObj = { day: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear() };
  const selectedDateObj = selectedDate || todayObj;
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
          <Text style={styles.headerIconText}>📅</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={handlePrevMonth} style={styles.calNav}>
            <Text style={styles.calNavText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.calMonth}>{monthNames[currentMonth]} {currentYear}</Text>
          <TouchableOpacity onPress={handleNextMonth} style={styles.calNav}>
            <Text style={styles.calNavText}>›</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Carregando calendário...</Text>
          </View>
        ) : (
          <View style={styles.calGrid}>
            {dayNames.map((day, index) => (
              <Text key={index} style={styles.calDayName}>{day}</Text>
            ))}
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calDay,
                  day.isToday && styles.calDayToday,
                  selectedDate?.day === day.date && 
                  selectedDate?.month === day.month && 
                  selectedDate?.year === day.year && styles.calDaySelected,
                ]}
                onPress={() => handleDateSelect(day)}
              >
                <Text style={[
                  styles.calDayText,
                  !day.isCurrentMonth && styles.calDayOtherMonth,
                  day.isToday && styles.calDayTextToday,
                ]}>
                  {day.date}
                </Text>
                {day.hasEvent && <View style={styles.calDayDot} />}
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.eventsHeader}>
          <Text style={styles.eventsTitle}>{selectedDateString} · {selectedEvents.length} avaliação{selectedEvents.length !== 1 ? 'ões' : ''}</Text>
        </View>

        <View style={styles.eventsList}>
          {selectedEvents.map((event) => (
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
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        {['🏠', '📅', '⭐', 'ℹ️'].map((icon, index) => (
          <TouchableOpacity
            key={index}
            style={styles.bottomNavItem}
            onPress={() => {
              if (index === 0) navigation.navigate('Home');
              if (index === 1) navigation.navigate('Calendar');
              if (index === 2) navigation.navigate('Favorites');
              if (index === 3) navigation.navigate('About');
            }}
          >
            <Text style={[styles.bottomNavIcon, index === 1 && styles.bottomNavIconActive]}>
              {icon}
            </Text>
            <Text style={[styles.bottomNavLabel, index === 1 && styles.bottomNavLabelActive]}>
              {['Início', 'Calendário', 'Favoritos', 'Sobre'][index]}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
    fontSize: 22,
    fontWeight: '500',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 12,
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
  headerIconText: {
    fontSize: 18,
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
  calNavText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
  },
  calMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
  },
  calDayName: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.text3,
    paddingVertical: spacing.xs,
    textTransform: 'uppercase',
  },
  calDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  calDayToday: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  calDaySelected: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.sm,
  },
  calDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text2,
  },
  calDayTextToday: {
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
  eventsHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  eventsTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text3,
    textTransform: 'uppercase',
  },
  eventsList: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
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
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
  },
  eventSub: {
    fontSize: 11,
    color: colors.text3,
    marginTop: 2,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: 'center',
    //gap: 3,
  },
  bottomNavIcon: {
    fontSize: 22,
    color: colors.text3,
  },
  bottomNavIconActive: {
    color: colors.primaryLight,
  },
  bottomNavLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.text3,
  },
  bottomNavLabelActive: {
    color: colors.primaryLight,
    fontWeight: 'bold',
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