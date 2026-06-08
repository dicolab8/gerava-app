import React, { useMemo, useState } from 'react';
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
import { Message } from '../types';
import { spacing, borderRadius, lightColors } from '../theme';
import { usePreferences } from '../contexts/PreferencesContext';

type MessagesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Messages'>;

export default function MessagesScreen() {
  const { appColors, fontScale } = usePreferences();
  const styles = useMemo(() => createStyles(appColors, fontScale), [appColors, fontScale]);
  const navigation = useNavigation<MessagesScreenNavigationProp>();
  const [msgs, setMsgs] = useState(messages);

  const unreadMessages = msgs.filter((message) => !message.isRead);
  const readMessages = msgs.filter((message) => message.isRead);
  const unreadCount = unreadMessages.length;

  const markAllAsRead = () => {
    setMsgs((prev) => prev.map((msg) => ({ ...msg, isRead: true })));
  };

  const markAsRead = (messageId: string) => {
    setMsgs((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, isRead: true } : msg))
    );
  };

  const getIconForType = (type: Message['type']) => {
    switch (type) {
      case 'warning':
        return { icon: 'warning' as AppIconName, bg: appColors.danger };
      case 'success':
        return { icon: 'check' as AppIconName, bg: appColors.success };
      case 'info':
        return { icon: 'bell' as AppIconName, bg: appColors.accent };
      default:
        return { icon: 'mail' as AppIconName, bg: appColors.text3 };
    }
  };

  const renderMessage = (msg: Message) => {
    const { icon, bg } = getIconForType(msg.type);

    return (
      <TouchableOpacity
        key={msg.id}
        style={[styles.msgItem, !msg.isRead && styles.msgUnreadBg]}
        activeOpacity={0.72}
        onPress={() => markAsRead(msg.id)}
      >
        <View style={[styles.msgIcon, { backgroundColor: bg }]}>
          <AppIcon name={icon} color={appColors.white} size={21} />
        </View>
        <View style={styles.msgContent}>
          <View style={styles.msgTitleRow}>
            <Text style={styles.msgTitle} numberOfLines={2}>
              {msg.title}
            </Text>
            {!msg.isRead && <View style={styles.msgUnread} />}
          </View>
          <Text style={styles.msgBody}>{msg.body}</Text>
          <Text style={styles.msgTime}>{msg.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.detailHeader}>
        <HeaderBackButton onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.detailHeaderTitle}>Mensagens</Text>
          <Text style={styles.detailHeaderSub}>Alertas e avisos recentes</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <AppIcon name="mail" color={appColors.white} size={22} />
          </View>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>
              {unreadCount > 0
                ? `${unreadCount} mensagem${unreadCount !== 1 ? 's' : ''} nao lida${unreadCount !== 1 ? 's' : ''}`
                : 'Tudo em dia'}
            </Text>
            <Text style={styles.summarySub}>
              {unreadCount > 0
                ? 'Toque em uma mensagem para marca-la como lida.'
                : 'Nao ha novas mensagens no momento.'}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.markAllButton, unreadCount === 0 && styles.markAllButtonDisabled]}
            onPress={markAllAsRead}
            disabled={unreadCount === 0}
          >
            <Text
              style={[
                styles.markAllText,
                unreadCount === 0 && styles.markAllTextDisabled,
              ]}
            >
              Marcar
            </Text>
          </TouchableOpacity>
        </View>

        {unreadMessages.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>Novas</Text>
            {unreadMessages.map(renderMessage)}
          </>
        )}

        <Text style={styles.sectionHeader}>Anteriores</Text>
        {readMessages.length > 0 ? (
          readMessages.map(renderMessage)
        ) : (
          <View style={styles.emptyCard}>
            <AppIcon name="check" color={appColors.success} size={24} />
            <Text style={styles.emptyText}>Nenhuma mensagem anterior.</Text>
          </View>
        )}
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
  headerText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  detailHeaderTitle: {
    fontSize: 18 * fontScale,
    fontWeight: 'bold',
    color: colors.white,
  },
  detailHeaderSub: {
    marginTop: 2,
    fontSize: 12 * fontScale,
    color: 'rgba(255,255,255,0.72)',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  summaryText: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  summaryTitle: {
    fontSize: 15 * fontScale,
    fontWeight: '700',
    color: colors.text,
  },
  summarySub: {
    marginTop: 3,
    fontSize: 12 * fontScale,
    lineHeight: 18 * fontScale,
    color: colors.text2,
  },
  markAllButton: {
    minWidth: 68,
    minHeight: 34,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  markAllButtonDisabled: {
    backgroundColor: colors.surface2,
  },
  markAllText: {
    fontSize: 12 * fontScale,
    color: colors.white,
    fontWeight: '700',
  },
  markAllTextDisabled: {
    color: colors.text3,
  },
  sectionHeader: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    fontSize: 11 * fontScale,
    fontWeight: 'bold',
    color: colors.text3,
    textTransform: 'uppercase',
  },
  msgItem: {
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  msgUnreadBg: {
    backgroundColor: colors.surface2,
    borderColor: colors.primaryLight,
  },
  msgIcon: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  msgContent: {
    flex: 1,
  },
  msgTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  msgTitle: {
    flex: 1,
    fontSize: 14 * fontScale,
    lineHeight: 19 * fontScale,
    fontWeight: 'bold',
    color: colors.text,
    paddingRight: spacing.sm,
  },
  msgBody: {
    fontSize: 12 * fontScale,
    color: colors.text2,
    marginTop: 3,
    lineHeight: 18 * fontScale,
  },
  msgTime: {
    fontSize: 10 * fontScale,
    color: colors.text3,
    marginTop: spacing.xs,
  },
  msgUnread: {
    width: 8,
    height: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
    marginTop: 5,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    marginTop: spacing.sm,
    fontSize: 12 * fontScale,
    color: colors.text3,
    textAlign: 'center',
  },
});
