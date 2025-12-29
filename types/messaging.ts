// ====================
// CORE TYPES
// ====================

export type MessageType = 'text' | 'image' | 'voice' | 'file';
export type ConversationType = 'direct' | 'group';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type ParticipantRole = 'overcomer' | 'helper' | 'volunteer' | 'hematologist' | 'nurse' | 'caregiver';

// ====================
// ID GENERATORS
// ====================

export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateConversationId = (): string => {
  return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const generateAttachmentId = (): string => {
  return `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// ====================
// PARTICIPANT
// ====================

export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  role: ParticipantRole;
  isOnline?: boolean;
  lastSeen?: string; // ISO timestamp
}

// ====================
// MEDIA ATTACHMENT
// ====================

export interface MediaAttachment {
  id: string;
  type: 'image' | 'voice' | 'file';
  uri: string;           // Local file URI
  mimeType: string;
  fileName?: string;
  fileSize?: number;     // bytes
  duration?: number;     // seconds (for voice)
  thumbnailUri?: string; // for images/videos
  width?: number;        // for images
  height?: number;       // for images
}

// ====================
// MESSAGE
// ====================

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;       // text content or caption for media
  attachments?: MediaAttachment[];
  status: MessageStatus;
  createdAt: string;     // ISO timestamp
  updatedAt: string;     // ISO timestamp
  replyTo?: {
    messageId: string;
    content: string;
    senderName: string;
  };
  isDeleted?: boolean;
  reactions?: Record<string, string[]>; // emoji -> userIds
}

// ====================
// CONVERSATION
// ====================

export interface Conversation {
  id: string;
  type: ConversationType;
  participants: Participant[];
  name?: string;         // Group name (null for DMs)
  avatar?: string;       // Group avatar
  description?: string;  // Group description
  createdBy: string;     // userId
  createdAt: string;
  updatedAt: string;
  lastMessage?: Message;
  unreadCount: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
}

// ====================
// CONVERSATION LIST ITEM (optimized for list rendering)
// ====================

export interface ConversationListItem {
  id: string;
  type: ConversationType;
  displayName: string;
  displayAvatar?: string;
  lastMessagePreview: string;
  lastMessageTime: string;
  lastMessageSenderName?: string;
  unreadCount: number;
  isOnline?: boolean;    // For DMs only
  isPinned?: boolean;
  isMuted?: boolean;
}

// ====================
// CURRENT USER CONTEXT
// ====================

export interface CurrentUser {
  id: string;
  name: string;
  avatar?: string;
  role: ParticipantRole;
}

// ====================
// HELPER FUNCTIONS
// ====================

export const getOtherParticipant = (
  conversation: Conversation,
  currentUserId: string
): Participant | undefined => {
  if (conversation.type !== 'direct') return undefined;
  return conversation.participants.find(p => p.id !== currentUserId);
};

export const getConversationDisplayName = (
  conversation: Conversation,
  currentUserId: string
): string => {
  if (conversation.type === 'group') {
    return conversation.name || 'Group';
  }
  const other = getOtherParticipant(conversation, currentUserId);
  return other?.name || 'Unknown';
};

export const getConversationAvatar = (
  conversation: Conversation,
  currentUserId: string
): string | undefined => {
  if (conversation.type === 'group') {
    return conversation.avatar;
  }
  const other = getOtherParticipant(conversation, currentUserId);
  return other?.avatar;
};

export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    // Today - show time
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
};

export const formatMessagePreview = (message: Message | undefined): string => {
  if (!message) return 'No messages yet';
  if (message.isDeleted) return 'Message deleted';

  switch (message.type) {
    case 'image':
      return message.content || '📷 Photo';
    case 'voice':
      return '🎤 Voice message';
    case 'file':
      return `📎 ${message.attachments?.[0]?.fileName || 'File'}`;
    default:
      return message.content;
  }
};

export const getRoleColor = (role: ParticipantRole): string => {
  switch (role) {
    case 'overcomer':
      return '#ef4444'; // red
    case 'helper':
    case 'caregiver':
      return '#8b5cf6'; // purple
    case 'hematologist':
      return '#3b82f6'; // blue
    case 'nurse':
      return '#10b981'; // green
    case 'volunteer':
      return '#f59e0b'; // amber
    default:
      return '#6b7280'; // gray
  }
};

export const getRoleLabel = (role: ParticipantRole): string => {
  switch (role) {
    case 'overcomer':
      return 'Overcomer';
    case 'helper':
      return 'Helper';
    case 'caregiver':
      return 'Caregiver';
    case 'hematologist':
      return 'Hematologist';
    case 'nurse':
      return 'Nurse';
    case 'volunteer':
      return 'Volunteer';
    default:
      return role;
  }
};
