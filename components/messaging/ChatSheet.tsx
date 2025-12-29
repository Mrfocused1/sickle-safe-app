import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  Message,
  Conversation,
  CurrentUser,
  MediaAttachment,
  getConversationDisplayName,
  getConversationAvatar,
  getOtherParticipant,
  getRoleColor,
} from '../../types/messaging';
import { messagingStorage } from '../../services/messagingStorage';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface ChatSheetProps {
  visible: boolean;
  onClose: () => void;
  onBack?: () => void;
  conversation: Conversation | null;
  currentUser: CurrentUser;
}

export default function ChatSheet({
  visible,
  onClose,
  onBack,
  conversation,
  currentUser,
}: ChatSheetProps) {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const menuAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (visible) {
      loadMessages();
      markAsRead();

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, conversation?.id]);

  const loadMessages = async () => {
    if (!conversation) return;
    setIsLoading(true);
    try {
      const msgs = await messagingStorage.getMessages(conversation.id);
      setMessages(msgs);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
    setIsLoading(false);
  };

  const markAsRead = async () => {
    if (!conversation) return;
    await messagingStorage.markConversationAsRead(conversation.id);
  };

  const handleSend = async (content: string, attachments?: MediaAttachment[]) => {
    if (!conversation || (!content.trim() && !attachments?.length)) return;

    try {
      const messageType = attachments?.length
        ? attachments[0].type === 'voice'
          ? 'voice'
          : attachments[0].type === 'image'
            ? 'image'
            : 'file'
        : 'text';

      const newMessage = await messagingStorage.sendMessage(
        conversation.id,
        currentUser,
        content,
        messageType,
        attachments,
        replyTo
          ? {
            messageId: replyTo.id,
            content: replyTo.content,
            senderName: replyTo.senderName,
          }
          : undefined
      );

      setMessages(prev => [...prev, newMessage]);
      setReplyTo(null);

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleLongPress = (message: Message) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // For now, just set reply
    setReplyTo(message);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  const openMenu = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowMenu(true);
    Animated.spring(menuAnim, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(menuAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setShowMenu(false));
  };

  const handleMenuAction = (action: string) => {
    closeMenu();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    switch (action) {
      case 'mute':
        setIsMuted(!isMuted);
        break;
      case 'search':
        // TODO: Implement search in conversation
        break;
      case 'clear':
        // Clear all messages
        setMessages([]);
        if (conversation) {
          messagingStorage.clearConversation(conversation.id);
        }
        break;
      case 'profile':
        // TODO: Navigate to profile
        break;
      case 'block':
        // TODO: Implement block functionality
        break;
      default:
        break;
    }
  };

  const renderMessage = useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      const isOwnMessage = item.senderId === currentUser.id;
      const showSenderName =
        conversation?.type === 'group' &&
        !isOwnMessage &&
        (index === 0 || messages[index - 1]?.senderId !== item.senderId);

      return (
        <MessageBubble
          message={item}
          isOwnMessage={isOwnMessage}
          showSenderName={showSenderName}
          onLongPress={handleLongPress}
          onImagePress={(uri) => setSelectedImage(uri)}
        />
      );
    },
    [currentUser.id, conversation?.type, messages]
  );

  const renderDateSeparator = (date: string) => (
    <View style={styles.dateSeparator}>
      <View style={styles.dateLine} />
      <Text style={styles.dateText}>{date}</Text>
      <View style={styles.dateLine} />
    </View>
  );

  const displayName = conversation
    ? getConversationDisplayName(conversation, currentUser.id)
    : '';
  const otherParticipant = conversation?.type === 'direct'
    ? getOtherParticipant(conversation, currentUser.id)
    : null;
  const participantCount = conversation?.participants.length || 0;

  if (!visible || !conversation) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      </Animated.View>

      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateY: slideAnim }],
            paddingTop: insets.top,
            paddingBottom: 0,
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleClose} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#1f2937" />
          </Pressable>

          <View style={styles.headerInfo}>
            <View style={styles.avatarContainer}>
              {conversation.type === 'group' ? (
                <View style={[styles.avatar, styles.groupAvatar]}>
                  <MaterialIcons name="groups" size={24} color="#8b5cf6" />
                </View>
              ) : otherParticipant?.avatar ? (
                <Image
                  source={{ uri: otherParticipant.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: otherParticipant
                        ? `${getRoleColor(otherParticipant.role)}20`
                        : '#f3f4f6',
                    },
                  ]}
                >
                  <Text style={styles.avatarText}>
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              {otherParticipant?.isOnline && (
                <View style={styles.onlineIndicator} />
              )}
            </View>

            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {displayName}
              </Text>
              <Text style={styles.headerSubtitle}>
                {conversation.type === 'group'
                  ? `${participantCount} members`
                  : otherParticipant?.isOnline
                    ? 'Online'
                    : 'Offline'}
              </Text>
            </View>
          </View>

          <Pressable style={styles.moreButton} onPress={openMenu}>
            <MaterialIcons name="more-vert" size={24} color="#6b7280" />
          </Pressable>
        </View>

        {/* Messages */}
        <KeyboardAvoidingView
          style={styles.content}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="chat-bubble-outline" size={64} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No messages yet</Text>
              <Text style={styles.emptySubtitle}>
                Start the conversation by sending a message
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => {
                flatListRef.current?.scrollToEnd({ animated: false });
              }}
            />
          )}

          <MessageInput
            onSend={handleSend}
            replyTo={replyTo}
            onCancelReply={() => setReplyTo(null)}
          />

          <View style={{ height: insets.bottom }} />
        </KeyboardAvoidingView>
      </Animated.View>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <Modal visible={true} transparent animationType="fade">
          <View style={styles.imageViewerContainer}>
            <Pressable
              onPress={() => setSelectedImage(null)}
              style={styles.imageViewerClose}
            >
              <MaterialIcons name="close" size={28} color="#fff" />
            </Pressable>
            <Image
              source={{ uri: selectedImage }}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
      )}

      {/* Options Menu */}
      {showMenu && (
        <Modal visible={true} transparent animationType="none">
          <Pressable style={styles.menuOverlay} onPress={closeMenu}>
            <Animated.View
              style={[
                styles.menuContainer,
                {
                  opacity: menuAnim,
                  transform: [
                    {
                      scale: menuAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                    {
                      translateY: menuAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-10, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* View Profile / Group Info */}
              <Pressable
                style={styles.menuItem}
                onPress={() => handleMenuAction('profile')}
              >
                <MaterialIcons
                  name={conversation?.type === 'group' ? 'groups' : 'person'}
                  size={22}
                  color="#374151"
                />
                <Text style={styles.menuItemText}>
                  {conversation?.type === 'group' ? 'Group Info' : 'View Profile'}
                </Text>
              </Pressable>

              {/* Search in Conversation */}
              <Pressable
                style={styles.menuItem}
                onPress={() => handleMenuAction('search')}
              >
                <MaterialIcons name="search" size={22} color="#374151" />
                <Text style={styles.menuItemText}>Search in Chat</Text>
              </Pressable>

              {/* Mute Notifications */}
              <Pressable
                style={styles.menuItem}
                onPress={() => handleMenuAction('mute')}
              >
                <MaterialIcons
                  name={isMuted ? 'notifications' : 'notifications-off'}
                  size={22}
                  color="#374151"
                />
                <Text style={styles.menuItemText}>
                  {isMuted ? 'Unmute Notifications' : 'Mute Notifications'}
                </Text>
              </Pressable>

              <View style={styles.menuDivider} />

              {/* Clear Chat */}
              <Pressable
                style={styles.menuItem}
                onPress={() => handleMenuAction('clear')}
              >
                <MaterialIcons name="delete-outline" size={22} color="#ef4444" />
                <Text style={[styles.menuItemText, { color: '#ef4444' }]}>
                  Clear Chat
                </Text>
              </Pressable>

              {/* Block (only for direct messages) */}
              {conversation?.type === 'direct' && (
                <Pressable
                  style={styles.menuItem}
                  onPress={() => handleMenuAction('block')}
                >
                  <MaterialIcons name="block" size={22} color="#ef4444" />
                  <Text style={[styles.menuItemText, { color: '#ef4444' }]}>
                    Block User
                  </Text>
                </Pressable>
              )}
            </Animated.View>
          </Pressable>
        </Modal>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#fff',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupAvatar: {
    backgroundColor: '#f3e8ff',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6b7280',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 1,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6b7280',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
  messagesList: {
    paddingVertical: 16,
  },
  dateSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
    paddingHorizontal: 24,
  },
  dateLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
    marginHorizontal: 12,
    fontWeight: '500',
  },
  // Image viewer
  imageViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageViewerClose: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  // Menu styles
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContainer: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    minWidth: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    gap: 14,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
    marginHorizontal: 14,
  },
});
