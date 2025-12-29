import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  FlatList,
  TextInput,
  Animated,
  Dimensions,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import {
  Conversation,
  ConversationListItem,
  CurrentUser,
} from '../../types/messaging';
import { messagingStorage } from '../../services/messagingStorage';
import ConversationItem from './ConversationItem';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ConversationListSheetProps {
  visible: boolean;
  onClose: () => void;
  filterType?: 'all' | 'direct' | 'group';
  currentUser: CurrentUser;
  onNewDM?: () => void;
  onNewGroup?: () => void;
  onOpenChat?: (conversation: Conversation) => void;
}

export default function ConversationListSheet({
  visible,
  onClose,
  filterType = 'all',
  currentUser,
  onNewDM,
  onNewGroup,
  onOpenChat,
}: ConversationListSheetProps) {
  const insets = useSafeAreaInsets();
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<ConversationListItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      loadConversations();

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
  }, [visible]);

  useEffect(() => {
    filterConversations();
  }, [searchQuery, conversations, filterType]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      // Initialize mock data if needed
      await messagingStorage.initializeWithMockData();

      const items = await messagingStorage.getConversationListItems(currentUser.id);
      setConversations(items);
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
    setIsLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadConversations();
    setIsRefreshing(false);
  };

  const filterConversations = () => {
    let filtered = conversations;

    // Filter by type
    if (filterType === 'direct') {
      filtered = filtered.filter(c => c.type === 'direct');
    } else if (filterType === 'group') {
      filtered = filtered.filter(c => c.type === 'group');
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        c =>
          c.displayName.toLowerCase().includes(query) ||
          c.lastMessagePreview.toLowerCase().includes(query)
      );
    }

    setFilteredConversations(filtered);
  };

  const handleConversationPress = async (item: ConversationListItem) => {
    const conversation = await messagingStorage.getConversation(item.id);
    if (conversation && onOpenChat) {
      onClose();
      setTimeout(() => {
        onOpenChat(conversation);
      }, 300);
    }
  };

  const handleDelete = async (id: string) => {
    await messagingStorage.deleteConversation(id);
    setConversations(prev => prev.filter(c => c.id !== id));
  };

  const handlePin = async (id: string, isPinned: boolean) => {
    await messagingStorage.pinConversation(id, !isPinned);
    loadConversations();
  };

  const handleMute = async (id: string, isMuted: boolean) => {
    await messagingStorage.muteConversation(id, !isMuted);
    loadConversations();
  };

  const handleNewDM = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    setTimeout(() => {
      onNewDM?.();
    }, 300);
  };

  const handleNewGroup = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
    setTimeout(() => {
      onNewGroup?.();
    }, 300);
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  const renderConversation = ({ item }: { item: ConversationListItem }) => (
    <ConversationItem
      item={item}
      onPress={() => handleConversationPress(item)}
      onDelete={() => handleDelete(item.id)}
      onPin={() => handlePin(item.id, item.isPinned || false)}
      onMute={() => handleMute(item.id, item.isMuted || false)}
    />
  );

  const getTitle = () => {
    switch (filterType) {
      case 'direct':
        return 'Direct Messages';
      case 'group':
        return 'Group Chats';
      default:
        return 'Messages';
    }
  };

  if (!visible) return null;

  return (
    <>
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
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="#6b7280" />
            </Pressable>

            <Text style={styles.title}>{getTitle()}</Text>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleNewDM}
                style={styles.headerButton}
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="person-add" size={22} color="#3b82f6" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleNewGroup}
                style={[styles.headerButton, styles.headerButtonGroup]}
                activeOpacity={0.6}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialIcons name="group-add" size={22} color="#8b5cf6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={20} color="#9ca3af" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search conversations..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <MaterialIcons name="close" size={20} color="#9ca3af" />
              </Pressable>
            )}
          </View>

          {/* Conversations List */}
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          ) : filteredConversations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons
                name={searchQuery ? 'search-off' : 'chat-bubble-outline'}
                size={64}
                color="#d1d5db"
              />
              <Text style={styles.emptyTitle}>
                {searchQuery ? 'No results found' : 'No conversations yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start a new conversation to get started'}
              </Text>
              {!searchQuery && (
                <View style={styles.emptyActions}>
                  <Pressable onPress={handleNewDM} style={styles.emptyButton}>
                    <MaterialIcons name="person-add" size={20} color="#fff" />
                    <Text style={styles.emptyButtonText}>New Message</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleNewGroup}
                    style={[styles.emptyButton, styles.emptyButtonSecondary]}
                  >
                    <MaterialIcons name="group-add" size={20} color="#8b5cf6" />
                    <Text style={styles.emptyButtonTextSecondary}>New Group</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ) : (
            <FlatList
              data={filteredConversations}
              renderItem={renderConversation}
              keyExtractor={(item) => item.id}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: insets.bottom + 20 },
              ]}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor="#3b82f6"
                />
              }
            />
          )}
        </Animated.View>
      </Modal>

    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 4,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
  },
  headerButtonGroup: {
    backgroundColor: '#f3e8ff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1f2937',
    marginLeft: 8,
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
  emptyActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  emptyButtonSecondary: {
    backgroundColor: '#f3e8ff',
  },
  emptyButtonTextSecondary: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  listContent: {
    paddingTop: 8,
  },
});
