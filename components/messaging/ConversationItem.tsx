import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ConversationListItem, formatMessageTime } from '../../types/messaging';

interface ConversationItemProps {
  item: ConversationListItem;
  onPress: () => void;
  onDelete?: () => void;
  onPin?: () => void;
  onMute?: () => void;
}

export default function ConversationItem({
  item,
  onPress,
}: ConversationItemProps) {

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.container}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {item.displayAvatar ? (
          <Image source={{ uri: item.displayAvatar }} style={styles.avatar} />
        ) : (
          <View
            style={[
              styles.avatar,
              {
                backgroundColor: item.type === 'group' ? '#f3e8ff' : '#f0f9ff',
              },
            ]}
          >
            {item.type === 'group' ? (
              <MaterialIcons name="groups" size={22} color="#8b5cf6" />
            ) : (
              <Text style={styles.avatarText}>
                {item.displayName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
        )}
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>

      {/* Content */}
      <View style={styles.textContainer}>
        <View style={styles.topRow}>
          <View style={styles.nameContainer}>
            {item.isPinned && (
              <MaterialIcons
                name="push-pin"
                size={14}
                color="#8b5cf6"
                style={styles.pinIcon}
              />
            )}
            <Text
              style={[
                styles.name,
                item.unreadCount > 0 && styles.nameUnread,
              ]}
              numberOfLines={1}
            >
              {item.displayName}
            </Text>
          </View>
          <Text style={styles.time}>
            {formatMessageTime(item.lastMessageTime)}
          </Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.previewContainer}>
            {item.isMuted && (
              <MaterialIcons
                name="notifications-off"
                size={14}
                color="#9ca3af"
                style={styles.muteIcon}
              />
            )}
            {item.type === 'group' && item.lastMessageSenderName && (
              <Text style={styles.senderName}>
                {item.lastMessageSenderName}:{' '}
              </Text>
            )}
            <Text
              style={[
                styles.preview,
                item.unreadCount > 0 && styles.previewUnread,
              ]}
              numberOfLines={1}
            >
              {item.lastMessagePreview}
            </Text>
          </View>

          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.unreadCount > 99 ? '99+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>

      <MaterialIcons name="chevron-right" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3b82f6',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  pinIcon: {
    marginRight: 4,
    transform: [{ rotate: '45deg' }],
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
  },
  nameUnread: {
    fontWeight: '800',
    color: '#0f172a',
  },
  time: {
    fontSize: 12,
    color: '#9ca3af',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  previewContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  muteIcon: {
    marginRight: 4,
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  preview: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  previewUnread: {
    fontWeight: '600',
    color: '#374151',
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
  },
});
