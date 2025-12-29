import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Message,
  Conversation,
  ConversationListItem,
  Participant,
  MediaAttachment,
  CurrentUser,
  generateMessageId,
  generateConversationId,
  formatMessagePreview,
  formatMessageTime,
  getOtherParticipant,
  MessageType,
} from '../types/messaging';

// Storage keys following existing @sickle_safe_ prefix pattern
const STORAGE_KEYS = {
  CONVERSATIONS: '@sickle_safe_conversations',
  MESSAGES_PREFIX: '@sickle_safe_messages_', // + conversationId
  CURRENT_USER: '@sickle_safe_messaging_current_user',
  CONTACTS: '@sickle_safe_messaging_contacts',
  DRAFT_PREFIX: '@sickle_safe_draft_', // + conversationId
};

export const messagingStorage = {
  // ====================
  // CURRENT USER
  // ====================
  async getCurrentUser(): Promise<CurrentUser | null> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (data) {
        return JSON.parse(data);
      }
      // Return default user for prototype
      const defaultUser: CurrentUser = {
        id: 'current_user',
        name: 'You',
        role: 'overcomer',
      };
      await this.setCurrentUser(defaultUser);
      return defaultUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  async setCurrentUser(user: CurrentUser): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error setting current user:', error);
    }
  },

  // ====================
  // CONVERSATIONS
  // ====================
  async getAllConversations(): Promise<Conversation[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      if (!data) return [];
      const conversations: Conversation[] = JSON.parse(data);
      // Sort by last message time (most recent first), pinned at top
      return conversations.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        const timeA = a.lastMessage?.createdAt || a.updatedAt;
        const timeB = b.lastMessage?.createdAt || b.updatedAt;
        return new Date(timeB).getTime() - new Date(timeA).getTime();
      });
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  },

  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const conversations = await this.getAllConversations();
      return conversations.find(c => c.id === conversationId) || null;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  },

  async saveConversation(conversation: Conversation): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      const index = conversations.findIndex(c => c.id === conversation.id);
      if (index >= 0) {
        conversations[index] = { ...conversation, updatedAt: new Date().toISOString() };
      } else {
        conversations.push(conversation);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw error;
    }
  },

  async createDirectConversation(
    currentUser: CurrentUser,
    participant: Participant
  ): Promise<Conversation> {
    // Check if DM already exists with this participant
    const conversations = await this.getAllConversations();
    const existing = conversations.find(
      c => c.type === 'direct' &&
        c.participants.some(p => p.id === participant.id) &&
        c.participants.some(p => p.id === currentUser.id)
    );
    if (existing) return existing;

    const now = new Date().toISOString();
    const conversation: Conversation = {
      id: generateConversationId(),
      type: 'direct',
      participants: [
        { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: currentUser.role },
        participant
      ],
      createdBy: currentUser.id,
      createdAt: now,
      updatedAt: now,
      unreadCount: 0,
    };

    await this.saveConversation(conversation);
    return conversation;
  },

  async createGroupConversation(
    currentUser: CurrentUser,
    participants: Participant[],
    name: string,
    avatar?: string,
    description?: string
  ): Promise<Conversation> {
    const now = new Date().toISOString();
    const allParticipants: Participant[] = [
      { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar, role: currentUser.role },
      ...participants.filter(p => p.id !== currentUser.id) // Avoid duplicates
    ];

    const conversation: Conversation = {
      id: generateConversationId(),
      type: 'group',
      participants: allParticipants,
      name,
      avatar,
      description,
      createdBy: currentUser.id,
      createdAt: now,
      updatedAt: now,
      unreadCount: 0,
    };

    await this.saveConversation(conversation);
    return conversation;
  },

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      const conversations = await this.getAllConversations();
      const filtered = conversations.filter(c => c.id !== conversationId);
      await AsyncStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(filtered));
      // Also delete messages
      await AsyncStorage.removeItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`);
      await AsyncStorage.removeItem(`${STORAGE_KEYS.DRAFT_PREFIX}${conversationId}`);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  },

  async pinConversation(conversationId: string, isPinned: boolean): Promise<void> {
    const conversation = await this.getConversation(conversationId);
    if (conversation) {
      conversation.isPinned = isPinned;
      await this.saveConversation(conversation);
    }
  },

  async muteConversation(conversationId: string, isMuted: boolean): Promise<void> {
    const conversation = await this.getConversation(conversationId);
    if (conversation) {
      conversation.isMuted = isMuted;
      await this.saveConversation(conversation);
    }
  },

  async archiveConversation(conversationId: string, isArchived: boolean): Promise<void> {
    const conversation = await this.getConversation(conversationId);
    if (conversation) {
      conversation.isArchived = isArchived;
      await this.saveConversation(conversation);
    }
  },

  // ====================
  // MESSAGES
  // ====================
  async getMessages(conversationId: string, limit = 50, offset = 0): Promise<Message[]> {
    try {
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`;
      const data = await AsyncStorage.getItem(key);
      if (!data) return [];
      const messages: Message[] = JSON.parse(data);
      // Sort by time (newest first for pagination)
      const sorted = messages.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      return sorted.slice(offset, offset + limit).reverse(); // Return oldest-first for display
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  },

  async sendMessage(
    conversationId: string,
    sender: CurrentUser,
    content: string,
    type: MessageType = 'text',
    attachments?: MediaAttachment[],
    replyTo?: { messageId: string; content: string; senderName: string }
  ): Promise<Message> {
    const now = new Date().toISOString();
    const message: Message = {
      id: generateMessageId(),
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      type,
      content,
      attachments,
      status: 'sent',
      createdAt: now,
      updatedAt: now,
      replyTo,
    };

    // Save message
    const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`;
    const data = await AsyncStorage.getItem(key);
    const messages: Message[] = data ? JSON.parse(data) : [];
    messages.push(message);
    await AsyncStorage.setItem(key, JSON.stringify(messages));

    // Update conversation's last message
    const conversation = await this.getConversation(conversationId);
    if (conversation) {
      conversation.lastMessage = message;
      conversation.updatedAt = now;
      await this.saveConversation(conversation);
    }

    // Clear draft
    await this.clearDraft(conversationId);

    return message;
  },

  async deleteMessage(conversationId: string, messageId: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`;
      const data = await AsyncStorage.getItem(key);
      if (!data) return;
      const messages: Message[] = JSON.parse(data);
      const index = messages.findIndex(m => m.id === messageId);
      if (index >= 0) {
        messages[index].isDeleted = true;
        messages[index].content = 'This message was deleted';
        messages[index].attachments = undefined;
        messages[index].updatedAt = new Date().toISOString();
        await AsyncStorage.setItem(key, JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  async clearConversation(conversationId: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`;
      await AsyncStorage.setItem(key, JSON.stringify([]));

      // Also clear last message from conversation
      const conversation = await this.getConversation(conversationId);
      if (conversation) {
        conversation.lastMessage = undefined;
        conversation.updatedAt = new Date().toISOString();
        await this.saveConversation(conversation);
      }
    } catch (error) {
      console.error('Error clearing conversation:', error);
      throw error;
    }
  },

  async addReaction(
    conversationId: string,
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`;
      const data = await AsyncStorage.getItem(key);
      if (!data) return;
      const messages: Message[] = JSON.parse(data);
      const message = messages.find(m => m.id === messageId);
      if (message) {
        if (!message.reactions) message.reactions = {};
        if (!message.reactions[emoji]) message.reactions[emoji] = [];
        if (!message.reactions[emoji].includes(userId)) {
          message.reactions[emoji].push(userId);
        }
        await AsyncStorage.setItem(key, JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  },

  async removeReaction(
    conversationId: string,
    messageId: string,
    userId: string,
    emoji: string
  ): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${conversationId}`;
      const data = await AsyncStorage.getItem(key);
      if (!data) return;
      const messages: Message[] = JSON.parse(data);
      const message = messages.find(m => m.id === messageId);
      if (message && message.reactions && message.reactions[emoji]) {
        message.reactions[emoji] = message.reactions[emoji].filter(id => id !== userId);
        if (message.reactions[emoji].length === 0) {
          delete message.reactions[emoji];
        }
        await AsyncStorage.setItem(key, JSON.stringify(messages));
      }
    } catch (error) {
      console.error('Error removing reaction:', error);
    }
  },

  // ====================
  // UNREAD MANAGEMENT
  // ====================
  async markConversationAsRead(conversationId: string): Promise<void> {
    const conversation = await this.getConversation(conversationId);
    if (conversation && conversation.unreadCount > 0) {
      conversation.unreadCount = 0;
      await this.saveConversation(conversation);
    }
  },

  async incrementUnreadCount(conversationId: string): Promise<void> {
    const conversation = await this.getConversation(conversationId);
    if (conversation) {
      conversation.unreadCount += 1;
      await this.saveConversation(conversation);
    }
  },

  async getTotalUnreadCount(): Promise<number> {
    const conversations = await this.getAllConversations();
    return conversations
      .filter(c => !c.isArchived && !c.isMuted)
      .reduce((sum, c) => sum + c.unreadCount, 0);
  },

  async getDirectMessagesUnreadCount(): Promise<number> {
    const conversations = await this.getAllConversations();
    return conversations
      .filter(c => c.type === 'direct' && !c.isArchived && !c.isMuted)
      .reduce((sum, c) => sum + c.unreadCount, 0);
  },

  async getGroupMessagesUnreadCount(): Promise<number> {
    const conversations = await this.getAllConversations();
    return conversations
      .filter(c => c.type === 'group' && !c.isArchived && !c.isMuted)
      .reduce((sum, c) => sum + c.unreadCount, 0);
  },

  // ====================
  // DRAFTS
  // ====================
  async saveDraft(conversationId: string, content: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.DRAFT_PREFIX}${conversationId}`;
      if (content.trim()) {
        await AsyncStorage.setItem(key, content);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  },

  async getDraft(conversationId: string): Promise<string> {
    try {
      const key = `${STORAGE_KEYS.DRAFT_PREFIX}${conversationId}`;
      return await AsyncStorage.getItem(key) || '';
    } catch (error) {
      console.error('Error getting draft:', error);
      return '';
    }
  },

  async clearDraft(conversationId: string): Promise<void> {
    try {
      const key = `${STORAGE_KEYS.DRAFT_PREFIX}${conversationId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  },

  // ====================
  // CONTACTS (for new conversation)
  // ====================
  async getContacts(): Promise<Participant[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CONTACTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting contacts:', error);
      return [];
    }
  },

  async saveContacts(contacts: Participant[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
    } catch (error) {
      console.error('Error saving contacts:', error);
    }
  },

  async addContact(contact: Participant): Promise<void> {
    const contacts = await this.getContacts();
    if (!contacts.find(c => c.id === contact.id)) {
      contacts.push(contact);
      await this.saveContacts(contacts);
    }
  },

  async removeContact(contactId: string): Promise<void> {
    const contacts = await this.getContacts();
    const filtered = contacts.filter(c => c.id !== contactId);
    await this.saveContacts(filtered);
  },

  // ====================
  // CONVERSATION LIST HELPERS
  // ====================
  async getConversationListItems(currentUserId: string): Promise<ConversationListItem[]> {
    const conversations = await this.getAllConversations();
    return conversations
      .filter(c => !c.isArchived)
      .map(c => {
        const isDirect = c.type === 'direct';
        const otherParticipant = isDirect
          ? c.participants.find(p => p.id !== currentUserId)
          : null;

        return {
          id: c.id,
          type: c.type,
          displayName: isDirect ? (otherParticipant?.name || 'Unknown') : (c.name || 'Group'),
          displayAvatar: isDirect ? otherParticipant?.avatar : c.avatar,
          lastMessagePreview: formatMessagePreview(c.lastMessage),
          lastMessageTime: c.lastMessage?.createdAt || c.createdAt,
          lastMessageSenderName: c.lastMessage?.senderName,
          unreadCount: c.unreadCount,
          isOnline: isDirect ? otherParticipant?.isOnline : undefined,
          isPinned: c.isPinned,
          isMuted: c.isMuted,
        };
      });
  },

  async getDirectConversationListItems(currentUserId: string): Promise<ConversationListItem[]> {
    const items = await this.getConversationListItems(currentUserId);
    return items.filter(i => i.type === 'direct');
  },

  async getGroupConversationListItems(currentUserId: string): Promise<ConversationListItem[]> {
    const items = await this.getConversationListItems(currentUserId);
    return items.filter(i => i.type === 'group');
  },

  // ====================
  // SEARCH
  // ====================
  async searchConversations(
    query: string,
    currentUserId: string
  ): Promise<ConversationListItem[]> {
    const items = await this.getConversationListItems(currentUserId);
    const lowerQuery = query.toLowerCase();
    return items.filter(item =>
      item.displayName.toLowerCase().includes(lowerQuery) ||
      item.lastMessagePreview.toLowerCase().includes(lowerQuery)
    );
  },

  async searchMessages(
    conversationId: string,
    query: string
  ): Promise<Message[]> {
    const messages = await this.getMessages(conversationId, 1000);
    const lowerQuery = query.toLowerCase();
    return messages.filter(m =>
      !m.isDeleted && m.content.toLowerCase().includes(lowerQuery)
    );
  },

  // ====================
  // CLEAR ALL (for testing/reset)
  // ====================
  async clearAllMessaging(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const messagingKeys = keys.filter(k =>
        k.startsWith('@sickle_safe_conversations') ||
        k.startsWith('@sickle_safe_messages_') ||
        k.startsWith('@sickle_safe_draft_') ||
        k.startsWith('@sickle_safe_messaging_')
      );
      await AsyncStorage.multiRemove(messagingKeys);
    } catch (error) {
      console.error('Error clearing messaging data:', error);
    }
  },

  // ====================
  // INITIALIZATION (seed data for prototype)
  // ====================
  async initializeWithMockData(): Promise<void> {
    const contacts = await this.getContacts();
    if (contacts.length > 0) return; // Already initialized

    // Import and save mock data
    const { MOCK_CONTACTS, initializeMockConversations } = await import('../data/mockMessagingData');
    await this.saveContacts(MOCK_CONTACTS);
    await initializeMockConversations();
  },
};
