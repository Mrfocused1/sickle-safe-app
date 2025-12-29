import { Participant, Conversation, Message, generateConversationId, generateMessageId } from '../types/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ====================
// MOCK CONTACTS
// ====================

export const MOCK_CONTACTS: Participant[] = [
  {
    id: 'user_sarah',
    name: 'Dr. Sarah Johnson',
    role: 'hematologist',
    isOnline: true,
    avatar: undefined,
  },
  {
    id: 'user_marcus',
    name: 'Marcus Williams',
    role: 'caregiver',
    isOnline: true,
    avatar: undefined,
  },
  {
    id: 'user_linda',
    name: 'Linda Chen',
    role: 'overcomer',
    isOnline: false,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
  },
  {
    id: 'user_joy',
    name: 'Nurse Joy Martinez',
    role: 'nurse',
    isOnline: true,
    avatar: undefined,
  },
  {
    id: 'user_david',
    name: 'David Thompson',
    role: 'volunteer',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 min ago
  },
  {
    id: 'user_emily',
    name: 'Emily Rodriguez',
    role: 'overcomer',
    isOnline: true,
    avatar: undefined,
  },
  {
    id: 'user_james',
    name: 'James Wilson',
    role: 'helper',
    isOnline: false,
    lastSeen: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'user_michelle',
    name: 'Michelle Brown',
    role: 'caregiver',
    isOnline: true,
    avatar: undefined,
  },
];

// ====================
// CURRENT USER
// ====================

export const CURRENT_USER: Participant = {
  id: 'current_user',
  name: 'You',
  role: 'overcomer',
  isOnline: true,
};

// ====================
// MOCK CONVERSATIONS
// ====================

const generateMockConversations = (): Conversation[] => {
  const now = new Date();

  // Direct message with Dr. Sarah
  const conv1Id = 'conv_sarah';
  const conv1: Conversation = {
    id: conv1Id,
    type: 'direct',
    participants: [CURRENT_USER, MOCK_CONTACTS[0]], // Dr. Sarah
    createdBy: 'current_user',
    createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    lastMessage: {
      id: generateMessageId(),
      conversationId: conv1Id,
      senderId: 'user_sarah',
      senderName: 'Dr. Sarah Johnson',
      type: 'text',
      content: 'Your latest blood work looks good! Keep up with your hydration.',
      status: 'read',
      createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    },
    unreadCount: 1,
  };

  // Direct message with Marcus (Caregiver)
  const conv2Id = 'conv_marcus';
  const conv2: Conversation = {
    id: conv2Id,
    type: 'direct',
    participants: [CURRENT_USER, MOCK_CONTACTS[1]], // Marcus
    createdBy: 'user_marcus',
    createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    lastMessage: {
      id: generateMessageId(),
      conversationId: conv2Id,
      senderId: 'current_user',
      senderName: 'You',
      type: 'text',
      content: 'Thanks for picking up my meds!',
      status: 'sent',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 0,
  };

  // Group: Care Circle
  const conv3Id = 'conv_care_circle';
  const conv3: Conversation = {
    id: conv3Id,
    type: 'group',
    participants: [CURRENT_USER, MOCK_CONTACTS[0], MOCK_CONTACTS[1], MOCK_CONTACTS[3]], // You, Dr. Sarah, Marcus, Nurse Joy
    name: 'My Care Circle',
    description: 'Stay connected with your care team',
    createdBy: 'current_user',
    createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    lastMessage: {
      id: generateMessageId(),
      conversationId: conv3Id,
      senderId: 'user_joy',
      senderName: 'Nurse Joy Martinez',
      type: 'text',
      content: 'Reminder: Appointment tomorrow at 10 AM',
      status: 'delivered',
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 2,
    isPinned: true,
  };

  // Group: Sickle Cell Warriors
  const conv4Id = 'conv_warriors';
  const conv4: Conversation = {
    id: conv4Id,
    type: 'group',
    participants: [CURRENT_USER, MOCK_CONTACTS[2], MOCK_CONTACTS[5]], // You, Linda, Emily
    name: 'Sickle Cell Warriors',
    description: 'Support group for overcomers',
    createdBy: 'user_linda',
    createdAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    lastMessage: {
      id: generateMessageId(),
      conversationId: conv4Id,
      senderId: 'user_emily',
      senderName: 'Emily Rodriguez',
      type: 'text',
      content: 'Has anyone tried the new pain management technique?',
      status: 'delivered',
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 3,
  };

  // Direct message with Nurse Joy
  const conv5Id = 'conv_joy';
  const conv5: Conversation = {
    id: conv5Id,
    type: 'direct',
    participants: [CURRENT_USER, MOCK_CONTACTS[3]], // Nurse Joy
    createdBy: 'user_joy',
    createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    lastMessage: {
      id: generateMessageId(),
      conversationId: conv5Id,
      senderId: 'user_joy',
      senderName: 'Nurse Joy Martinez',
      type: 'text',
      content: 'Don\'t forget to log your water intake today!',
      status: 'read',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
    },
    unreadCount: 0,
  };

  return [conv1, conv2, conv3, conv4, conv5];
};

// ====================
// MOCK MESSAGES FOR CONVERSATIONS
// ====================

const generateMockMessages = (): Record<string, Message[]> => {
  const now = new Date();

  // Messages for Dr. Sarah conversation
  const sarahMessages: Message[] = [
    {
      id: generateMessageId(),
      conversationId: 'conv_sarah',
      senderId: 'user_sarah',
      senderName: 'Dr. Sarah Johnson',
      type: 'text',
      content: 'Hi! How are you feeling today?',
      status: 'read',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateMessageId(),
      conversationId: 'conv_sarah',
      senderId: 'current_user',
      senderName: 'You',
      type: 'text',
      content: 'I\'m doing okay, had some mild pain this morning but it\'s better now.',
      status: 'read',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
    },
    {
      id: generateMessageId(),
      conversationId: 'conv_sarah',
      senderId: 'user_sarah',
      senderName: 'Dr. Sarah Johnson',
      type: 'text',
      content: 'I\'m glad it\'s improving. Remember to stay hydrated and rest when needed.',
      status: 'read',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000 + 20 * 60 * 1000).toISOString(),
    },
    {
      id: generateMessageId(),
      conversationId: 'conv_sarah',
      senderId: 'user_sarah',
      senderName: 'Dr. Sarah Johnson',
      type: 'text',
      content: 'Your latest blood work looks good! Keep up with your hydration.',
      status: 'read',
      createdAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    },
  ];

  // Messages for Marcus conversation
  const marcusMessages: Message[] = [
    {
      id: generateMessageId(),
      conversationId: 'conv_marcus',
      senderId: 'user_marcus',
      senderName: 'Marcus Williams',
      type: 'text',
      content: 'Hey! I\'m heading to the pharmacy, need anything?',
      status: 'read',
      createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateMessageId(),
      conversationId: 'conv_marcus',
      senderId: 'current_user',
      senderName: 'You',
      type: 'text',
      content: 'Yes! Can you pick up my hydroxyurea prescription?',
      status: 'read',
      createdAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateMessageId(),
      conversationId: 'conv_marcus',
      senderId: 'user_marcus',
      senderName: 'Marcus Williams',
      type: 'text',
      content: 'Of course! I\'ll drop it off in about an hour.',
      status: 'read',
      createdAt: new Date(now.getTime() - 2.3 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2.3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateMessageId(),
      conversationId: 'conv_marcus',
      senderId: 'current_user',
      senderName: 'You',
      type: 'text',
      content: 'Thanks for picking up my meds!',
      status: 'sent',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ];

  // Messages for Care Circle group
  const careCircleMessages: Message[] = [
    {
      id: generateMessageId(),
      conversationId: 'conv_care_circle',
      senderId: 'user_sarah',
      senderName: 'Dr. Sarah Johnson',
      type: 'text',
      content: 'Team, let\'s schedule a care plan review meeting this week.',
      status: 'read',
      createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateMessageId(),
      conversationId: 'conv_care_circle',
      senderId: 'user_marcus',
      senderName: 'Marcus Williams',
      type: 'text',
      content: 'Thursday works for me!',
      status: 'read',
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateMessageId(),
      conversationId: 'conv_care_circle',
      senderId: 'current_user',
      senderName: 'You',
      type: 'text',
      content: 'Thursday afternoon would be great for me too.',
      status: 'read',
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateMessageId(),
      conversationId: 'conv_care_circle',
      senderId: 'user_joy',
      senderName: 'Nurse Joy Martinez',
      type: 'text',
      content: 'Perfect! I\'ll set it up for 2 PM.',
      status: 'delivered',
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: generateMessageId(),
      conversationId: 'conv_care_circle',
      senderId: 'user_joy',
      senderName: 'Nurse Joy Martinez',
      type: 'text',
      content: 'Reminder: Appointment tomorrow at 10 AM',
      status: 'delivered',
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    },
  ];

  return {
    'conv_sarah': sarahMessages,
    'conv_marcus': marcusMessages,
    'conv_care_circle': careCircleMessages,
  };
};

// ====================
// INITIALIZATION FUNCTION
// ====================

export const initializeMockConversations = async (): Promise<void> => {
  try {
    const existingData = await AsyncStorage.getItem('@sickle_safe_conversations');
    if (existingData) {
      // Already has data, don't overwrite
      return;
    }

    const conversations = generateMockConversations();
    const messages = generateMockMessages();

    // Save conversations
    await AsyncStorage.setItem('@sickle_safe_conversations', JSON.stringify(conversations));

    // Save messages for each conversation
    for (const [convId, msgs] of Object.entries(messages)) {
      await AsyncStorage.setItem(`@sickle_safe_messages_${convId}`, JSON.stringify(msgs));
    }

    // Save current user
    await AsyncStorage.setItem('@sickle_safe_messaging_current_user', JSON.stringify({
      id: 'current_user',
      name: 'You',
      role: 'overcomer',
    }));

    console.log('Mock messaging data initialized successfully');
  } catch (error) {
    console.error('Error initializing mock messaging data:', error);
  }
};

// ====================
// RESET FUNCTION (for testing)
// ====================

export const resetMockMessagingData = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const messagingKeys = keys.filter(k =>
      k.startsWith('@sickle_safe_conversations') ||
      k.startsWith('@sickle_safe_messages_') ||
      k.startsWith('@sickle_safe_draft_') ||
      k.startsWith('@sickle_safe_messaging_')
    );
    await AsyncStorage.multiRemove(messagingKeys);

    // Re-initialize with fresh data
    await initializeMockConversations();
    console.log('Mock messaging data reset successfully');
  } catch (error) {
    console.error('Error resetting mock messaging data:', error);
  }
};
