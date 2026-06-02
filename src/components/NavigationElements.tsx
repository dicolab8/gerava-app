import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { colors, spacing, borderRadius } from '../theme';

type BottomNavRoute = 'Home' | 'Calendar' | 'Favorites' | 'About';
type NavIconName = 'home' | 'calendar' | 'favorite' | 'info';
export type AppIconName =
  | NavIconName
  | 'mail'
  | 'settings'
  | 'search'
  | 'user'
  | 'clock'
  | 'lab'
  | 'note'
  | 'phone'
  | 'refresh'
  | 'school'
  | 'privacy'
  | 'palette'
  | 'book'
  | 'bell'
  | 'chat'
  | 'warning'
  | 'check'
  | 'bug'
  | 'idea'
  | 'complaint'
  | 'praise'
  | 'send'
  | 'close';

const tabs: { route: BottomNavRoute; label: string; icon: NavIconName }[] = [
  { route: 'Home', label: 'Início', icon: 'home' },
  { route: 'Calendar', label: 'Calendário', icon: 'calendar' },
  { route: 'Favorites', label: 'Favoritos', icon: 'favorite' },
  { route: 'About', label: 'Sobre', icon: 'info' },
];

export function ChevronIcon({
  direction = 'left',
  color = colors.white,
  size = 18,
}: {
  direction?: 'left' | 'right' | 'down';
  color?: string;
  size?: number;
}) {
  const parentRotation =
    direction === 'right' ? '180deg' : direction === 'down' ? '-90deg' : '0deg';

  return (
    <View
      style={[
        styles.chevron,
        {
          width: size,
          height: size,
          transform: [{ rotate: parentRotation }],
        },
      ]}
    >
      <View
        style={[
          styles.chevronLine,
          {
            width: size * 0.56,
            backgroundColor: color,
            top: size * 0.36,
            left: size * 0.22,
            transform: [{ rotate: '-45deg' }],
          },
        ]}
      />
      <View
        style={[
          styles.chevronLine,
          {
            width: size * 0.56,
            backgroundColor: color,
            top: size * 0.62,
            left: size * 0.22,
            transform: [{ rotate: '45deg' }],
          },
        ]}
      />
    </View>
  );
}

export function HeaderBackButton({
  onPress,
  style,
}: {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel="Voltar"
      onPress={onPress}
      style={[styles.headerBackButton, style]}
    >
      <ChevronIcon />
    </TouchableOpacity>
  );
}

export function IconButton({
  name,
  onPress,
  badge,
  accessibilityLabel,
  style,
}: {
  name: AppIconName;
  onPress?: () => void;
  badge?: string | number;
  accessibilityLabel: string;
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[styles.headerIconButton, style]}
      activeOpacity={0.72}
    >
      <AppIcon name={name} color={colors.white} size={22} />
      {badge !== undefined && (
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeText}>{badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

export function AppIcon({
  name,
  color = colors.primary,
  size = 24,
}: {
  name: AppIconName;
  color?: string;
  size?: number;
}) {
  const stroke = Math.max(2, size * 0.09);
  const thin = Math.max(1.5, size * 0.07);

  if (name === 'home' || name === 'calendar' || name === 'favorite' || name === 'info') {
    return <BottomNavGlyph name={name} active={false} color={color} />;
  }

  if (name === 'mail' || name === 'send') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.mailBody, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.mailFlapLeft, { backgroundColor: color, height: thin }]} />
        <View style={[styles.mailFlapRight, { backgroundColor: color, height: thin }]} />
      </View>
    );
  }

  if (name === 'settings') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.gearRing, { borderColor: color, borderWidth: stroke }]} />
        {[0, 1, 2, 3].map((index) => (
          <View
            key={index}
            style={[
              styles.gearTooth,
              {
                backgroundColor: color,
                transform: [{ rotate: `${index * 45}deg` }],
              },
            ]}
          />
        ))}
      </View>
    );
  }

  if (name === 'search') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.searchCircle, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.searchHandle, { backgroundColor: color, height: stroke }]} />
      </View>
    );
  }

  if (name === 'user') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.userHead, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.userBody, { borderColor: color, borderWidth: stroke }]} />
      </View>
    );
  }

  if (name === 'clock') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.clockCircle, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.clockHandHour, { backgroundColor: color }]} />
        <View style={[styles.clockHandMinute, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === 'lab') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.labTube, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.labLiquid, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === 'note' || name === 'book') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.noteSheet, { borderColor: color, borderWidth: stroke }]}>
          <View style={[styles.noteLine, { backgroundColor: color }]} />
          <View style={[styles.noteLine, { backgroundColor: color, width: '48%' }]} />
        </View>
      </View>
    );
  }

  if (name === 'phone') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.phoneBody, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.phoneDot, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === 'refresh') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.refreshArc, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.refreshHead, { borderLeftColor: color }]} />
      </View>
    );
  }

  if (name === 'school') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.schoolRoof, { borderBottomColor: color }]} />
        <View style={[styles.schoolBody, { borderColor: color, borderWidth: stroke }]} />
      </View>
    );
  }

  if (name === 'privacy') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.privacyPlate, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.privacyStem, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === 'palette') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.paletteShape, { borderColor: color, borderWidth: stroke }]}>
          <View style={[styles.paletteDot, { backgroundColor: color }]} />
          <View style={[styles.paletteDot, { backgroundColor: color }]} />
        </View>
      </View>
    );
  }

  if (name === 'bell') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.bellBody, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.bellClapper, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === 'chat') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.chatBubble, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.chatTail, { borderTopColor: color }]} />
      </View>
    );
  }

  if (name === 'warning') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.warningTriangle, { borderBottomColor: color }]} />
        <View style={[styles.warningStem, { backgroundColor: colors.white }]} />
      </View>
    );
  }

  if (name === 'check' || name === 'praise') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.checkShort, { backgroundColor: color }]} />
        <View style={[styles.checkLong, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === 'bug' || name === 'complaint') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.bugBody, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.bugLine, { backgroundColor: color }]} />
      </View>
    );
  }

  if (name === 'idea') {
    return (
      <View style={[styles.iconCanvas, { width: size, height: size }]}>
        <View style={[styles.ideaBulb, { borderColor: color, borderWidth: stroke }]} />
        <View style={[styles.ideaBase, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View style={[styles.iconCanvas, { width: size, height: size }]}>
      <View style={[styles.closeLine, { backgroundColor: color }]} />
      <View style={[styles.closeLine, { backgroundColor: color, transform: [{ rotate: '-45deg' }] }]} />
    </View>
  );
}

export function BottomNav({ active }: { active: BottomNavRoute }) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.bottomNav}>
      {tabs.map((tab) => {
        const isActive = active === tab.route;

        return (
          <TouchableOpacity
            key={tab.route}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            style={[styles.bottomNavItem, isActive && styles.bottomNavItemActive]}
            onPress={() => navigation.navigate(tab.route)}
          >
            <View
              style={[
                styles.navIconShell,
                isActive && styles.navIconShellActive,
              ]}
            >
              <BottomNavGlyph name={tab.icon} active={isActive} />
            </View>
            <Text
              style={[
                styles.bottomNavLabel,
                isActive && styles.bottomNavLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function BottomNavGlyph({
  name,
  active,
  color,
}: {
  name: NavIconName;
  active: boolean;
  color?: string;
}) {
  const ink = color || (active ? colors.primary : colors.text3);
  const fill = active ? colors.primaryLight : ink;

  if (name === 'home') {
    return (
      <View style={styles.glyphBox}>
        <View style={[styles.homeRoofLeft, { backgroundColor: ink }]} />
        <View style={[styles.homeRoofRight, { backgroundColor: ink }]} />
        <View style={[styles.homeBody, { borderColor: ink }]}>
          <View style={[styles.homeDoor, { backgroundColor: fill }]} />
        </View>
      </View>
    );
  }

  if (name === 'calendar') {
    return (
      <View style={styles.glyphBox}>
        <View style={[styles.calendarBody, { borderColor: ink }]}>
          <View style={[styles.calendarTopLine, { backgroundColor: ink }]} />
          <View style={[styles.calendarDot, { backgroundColor: fill }]} />
          <View style={[styles.calendarDot, { backgroundColor: fill }]} />
          <View style={[styles.calendarDot, { backgroundColor: fill }]} />
          <View style={[styles.calendarDot, { backgroundColor: fill }]} />
        </View>
        <View style={[styles.calendarRingLeft, { backgroundColor: ink }]} />
        <View style={[styles.calendarRingRight, { backgroundColor: ink }]} />
      </View>
    );
  }

  if (name === 'favorite') {
    return (
      <Text style={[styles.favoriteGlyph, { color: ink }]}>
        ★
      </Text>
    );
  }

  return (
    <View style={[styles.infoCircle, { borderColor: ink }]}>
      <View style={[styles.infoDot, { backgroundColor: ink }]} />
      <View style={[styles.infoStem, { backgroundColor: ink }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  chevron: {
    position: 'relative',
  },
  chevronLine: {
    position: 'absolute',
    height: 2.4,
    borderRadius: 2,
  },
  headerBackButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconButton: {
    width: 38,
    height: 38,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  iconBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    backgroundColor: colors.accent,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.text,
  },
  iconCanvas: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mailBody: {
    width: '82%',
    height: '58%',
    borderRadius: 5,
  },
  mailFlapLeft: {
    position: 'absolute',
    width: '38%',
    top: '48%',
    left: '22%',
    borderRadius: 2,
    transform: [{ rotate: '35deg' }],
  },
  mailFlapRight: {
    position: 'absolute',
    width: '38%',
    top: '48%',
    right: '22%',
    borderRadius: 2,
    transform: [{ rotate: '-35deg' }],
  },
  gearRing: {
    width: '48%',
    height: '48%',
    borderRadius: 999,
  },
  gearTooth: {
    position: 'absolute',
    width: '12%',
    height: '86%',
    borderRadius: 999,
  },
  searchCircle: {
    position: 'absolute',
    width: '58%',
    height: '58%',
    top: '12%',
    left: '12%',
    borderRadius: 999,
  },
  searchHandle: {
    position: 'absolute',
    width: '36%',
    bottom: '18%',
    right: '10%',
    borderRadius: 999,
    transform: [{ rotate: '45deg' }],
  },
  userHead: {
    width: '38%',
    height: '38%',
    borderRadius: 999,
    marginBottom: 2,
  },
  userBody: {
    width: '66%',
    height: '34%',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomWidth: 0,
  },
  clockCircle: {
    width: '74%',
    height: '74%',
    borderRadius: 999,
  },
  clockHandHour: {
    position: 'absolute',
    width: 2,
    height: '24%',
    top: '27%',
    borderRadius: 999,
  },
  clockHandMinute: {
    position: 'absolute',
    width: '26%',
    height: 2,
    right: '27%',
    top: '48%',
    borderRadius: 999,
  },
  labTube: {
    width: '36%',
    height: '72%',
    borderTopWidth: 0,
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
    transform: [{ rotate: '-12deg' }],
  },
  labLiquid: {
    position: 'absolute',
    width: '30%',
    height: '18%',
    bottom: '22%',
    borderRadius: 999,
    transform: [{ rotate: '-12deg' }],
  },
  noteSheet: {
    width: '68%',
    height: '76%',
    borderRadius: 5,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  noteLine: {
    width: '70%',
    height: 2,
    borderRadius: 999,
    marginVertical: 2,
  },
  phoneBody: {
    width: '48%',
    height: '78%',
    borderRadius: 6,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 3,
  },
  phoneDot: {
    position: 'absolute',
    bottom: '16%',
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  refreshArc: {
    width: '70%',
    height: '70%',
    borderRadius: 999,
    borderLeftColor: 'transparent',
  },
  refreshHead: {
    position: 'absolute',
    right: '16%',
    top: '14%',
    width: 0,
    height: 0,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderLeftWidth: 7,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  schoolRoof: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 9,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 1,
  },
  schoolBody: {
    width: '68%',
    height: '40%',
    borderRadius: 3,
  },
  privacyPlate: {
    width: '68%',
    height: '44%',
    borderRadius: 999,
    transform: [{ rotate: '-5deg' }],
  },
  privacyStem: {
    width: 3,
    height: '42%',
    borderRadius: 999,
    marginTop: -1,
  },
  paletteShape: {
    width: '74%',
    height: '64%',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paletteDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  bellBody: {
    width: '58%',
    height: '58%',
    borderTopLeftRadius: 999,
    borderTopRightRadius: 999,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomWidth: 0,
  },
  bellClapper: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: -1,
  },
  chatBubble: {
    width: '72%',
    height: '56%',
    borderRadius: 7,
  },
  chatTail: {
    position: 'absolute',
    bottom: '18%',
    right: '26%',
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 0,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
  },
  warningTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 18,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  warningStem: {
    position: 'absolute',
    width: 2,
    height: 8,
    borderRadius: 999,
    top: '38%',
  },
  checkShort: {
    position: 'absolute',
    width: '28%',
    height: 3,
    borderRadius: 999,
    left: '20%',
    top: '54%',
    transform: [{ rotate: '45deg' }],
  },
  checkLong: {
    position: 'absolute',
    width: '50%',
    height: 3,
    borderRadius: 999,
    right: '12%',
    top: '47%',
    transform: [{ rotate: '-45deg' }],
  },
  bugBody: {
    width: '54%',
    height: '62%',
    borderRadius: 999,
  },
  bugLine: {
    position: 'absolute',
    width: '64%',
    height: 2,
    borderRadius: 999,
  },
  ideaBulb: {
    width: '58%',
    height: '58%',
    borderRadius: 999,
  },
  ideaBase: {
    width: '34%',
    height: 4,
    borderRadius: 999,
    marginTop: 2,
  },
  closeLine: {
    position: 'absolute',
    width: '68%',
    height: 3,
    borderRadius: 999,
    transform: [{ rotate: '45deg' }],
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
  bottomNavItem: {
    flex: 1,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
  },
  bottomNavItemActive: {
    backgroundColor: '#EFF6FF',
  },
  navIconShell: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  navIconShellActive: {
    backgroundColor: colors.white,
  },
  bottomNavLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.text3,
    marginTop: 2,
  },
  bottomNavLabelActive: {
    color: colors.primaryLight,
    fontWeight: 'bold',
  },
  glyphBox: {
    width: 26,
    height: 26,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeRoofLeft: {
    position: 'absolute',
    top: 7,
    left: 7,
    width: 10,
    height: 2.4,
    borderRadius: 2,
    transform: [{ rotate: '-35deg' }],
  },
  homeRoofRight: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 10,
    height: 2.4,
    borderRadius: 2,
    transform: [{ rotate: '35deg' }],
  },
  homeBody: {
    position: 'absolute',
    top: 12,
    width: 16,
    height: 13,
    borderWidth: 2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  homeDoor: {
    width: 4,
    height: 7,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  calendarBody: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
    paddingTop: 7,
  },
  calendarTopLine: {
    position: 'absolute',
    top: 5,
    left: 2,
    right: 2,
    height: 2,
    borderRadius: 2,
  },
  calendarRingLeft: {
    position: 'absolute',
    top: 2,
    left: 8,
    width: 2,
    height: 6,
    borderRadius: 2,
  },
  calendarRingRight: {
    position: 'absolute',
    top: 2,
    right: 8,
    width: 2,
    height: 6,
    borderRadius: 2,
  },
  calendarDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    margin: 1.2,
  },
  favoriteGlyph: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
  },
  infoCircle: {
    width: 21,
    height: 21,
    borderWidth: 2,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginBottom: 2,
  },
  infoStem: {
    width: 3,
    height: 8,
    borderRadius: 2,
  },
});
