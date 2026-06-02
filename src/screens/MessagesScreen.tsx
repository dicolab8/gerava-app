import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { AppIcon, AppIconName, HeaderBackButton } from '../components/NavigationElements';
import { messages } from '../constants/data';
import { colors, spacing, borderRadius } from '../theme';

type MessagesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Messages'>;

export default function MessagesScreen() {
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const [msgs, setMsgs] = useState(messages);

  const markAllAsRead = () => {
    setMsgs(prev => prev.map(msg => ({ ...msg, isRead: true })));
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'warning':
        return { icon: 'warning' as AppIconName, bg: colors.danger };
      case 'success':
        return { icon: 'check' as AppIconName, bg: colors.success };
      case 'info':
        return { icon: 'bell' as AppIconName, bg: colors.accent };
      default:
        return { icon: 'mail' as AppIconName, bg: colors.text3 };
    }
  };

  const unreadCount = msgs.filter(m => !m.isRead).length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <Text style={styles.detailHeaderTitle}>Mensagens</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.notifBadge}>
            <View style={styles.notifDot} />
            <Text style={styles.notifBadgeText}>{unreadCount} não lidas</Text>
          </View>
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>Marcar todas</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionHeader}>Novas</Text>
        {msgs.filter(m => !m.isRead).map((msg) => {
          const { icon, bg } = getIconForType(msg.type);
          return (
            <View key={msg.id} style={[styles.msgItem, styles.msgUnreadBg]}>
              <View style={[styles.msgIcon, { backgroundColor: bg }]}>
                <AppIcon name={icon} color={colors.white} size={21} />
              </View>
              <View style={styles.msgContent}>
                <Text style={styles.msgTitle}>{msg.title}</Text>
                <Text style={styles.msgBody}>{msg.body}</Text>
                <Text style={styles.msgTime}>{msg.time}</Text>
              </View>
              <View style={styles.msgUnread} />
            </View>
          );
        })}

        <Text style={styles.sectionHeader}>Anteriores</Text>
        {msgs.filter(m => m.isRead).map((msg) => {
          const { icon, bg } = getIconForType(msg.type);
          return (
            <View key={msg.id} style={styles.msgItem}>
              <View style={[styles.msgIcon, { backgroundColor: bg }]}>
                <AppIcon name={icon} color={colors.white} size={21} />
              </View>
              <View style={styles.msgContent}>
                <Text style={styles.msgTitle}>{msg.title}</Text>
                <Text style={styles.msgBody}>{msg.body}</Text>
                <Text style={styles.msgTime}>{msg.time}</Text>
              </View>
            </View>
          );
        })}
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
  detailHeaderTitle: {
<<<<<<< Updated upstream
    marginLeft: spacing.sm,
    fontSize: 17,
=======
    marginLeft: spacing.sm,
    fontSize: 17,
>>>>>>> Stashed changes
    fontWeight: 'bold',
    color: colors.white,
  },
  headerRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifBadge: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  notifDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginRight: 5,
  },
  notifBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
  },
  markAllText: {
    fontSize: 12,
    color: colors.primaryLight,
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.text3,
    textTransform: 'uppercase',
  },
  msgItem: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    //gap: spacing.sm,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  msgUnreadBg: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  msgIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
<<<<<<< Updated upstream
=======
    marginRight: spacing.sm,
>>>>>>> Stashed changes
  },
  msgContent: {
    flex: 1,
  },
  msgTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text,
  },
  msgBody: {
    fontSize: 12,
    color: colors.text2,
    marginTop: 2,
    lineHeight: 18,
  },
  msgTime: {
    fontSize: 10,
    color: colors.text3,
    marginTop: 4,
  },
  msgUnread: {
    width: 8,
    height: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    marginTop: 4,
  },
});
