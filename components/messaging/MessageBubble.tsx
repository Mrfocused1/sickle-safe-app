import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Message, formatMessageTime, getRoleColor } from '../../types/messaging';
import VoicePlayer from './VoicePlayer';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = SCREEN_WIDTH * 0.75;

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showSenderName?: boolean; // For group chats
  onLongPress?: (message: Message) => void;
  onImagePress?: (uri: string) => void;
  onReplyPress?: (message: Message) => void;
}

export default function MessageBubble({
  message,
  isOwnMessage,
  showSenderName = false,
  onLongPress,
  onImagePress,
  onReplyPress,
}: MessageBubbleProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleLongPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onLongPress?.(message);
  };

  const renderReplyPreview = () => {
    if (!message.replyTo) return null;

    return (
      <Pressable
        style={[
          styles.replyPreview,
          isOwnMessage ? styles.replyPreviewOwn : styles.replyPreviewOther,
        ]}
        onPress={() => onReplyPress?.(message)}
      >
        <View style={styles.replyBar} />
        <View style={styles.replyContent}>
          <Text style={styles.replyName} numberOfLines={1}>
            {message.replyTo.senderName}
          </Text>
          <Text style={styles.replyText} numberOfLines={1}>
            {message.replyTo.content}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderTextContent = () => {
    if (message.isDeleted) {
      return (
        <View style={styles.deletedContainer}>
          <MaterialIcons name="block" size={14} color="#9ca3af" />
          <Text style={styles.deletedText}>This message was deleted</Text>
        </View>
      );
    }

    return (
      <Text
        style={[
          styles.messageText,
          isOwnMessage ? styles.messageTextOwn : styles.messageTextOther,
        ]}
      >
        {message.content}
      </Text>
    );
  };

  const renderImageContent = () => {
    const images = message.attachments?.filter(a => a.type === 'image') || [];
    if (images.length === 0) return null;

    return (
      <View style={styles.imagesContainer}>
        {images.map((image, index) => (
          <Pressable
            key={image.id}
            onPress={() => onImagePress?.(image.uri)}
            style={styles.imageWrapper}
          >
            <Image
              source={{ uri: image.uri }}
              style={[
                styles.messageImage,
                {
                  width: image.width ? Math.min(image.width, MAX_BUBBLE_WIDTH - 16) : MAX_BUBBLE_WIDTH - 16,
                  aspectRatio: image.width && image.height ? image.width / image.height : 1,
                },
              ]}
              resizeMode="cover"
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <View style={styles.imagePlaceholder}>
                <MaterialIcons name="image" size={32} color="#d1d5db" />
              </View>
            )}
          </Pressable>
        ))}
        {message.content && (
          <Text
            style={[
              styles.imageCaption,
              isOwnMessage ? styles.imageCaptionOwn : styles.imageCaptionOther,
            ]}
          >
            {message.content}
          </Text>
        )}
      </View>
    );
  };

  const renderVoiceContent = () => {
    const voice = message.attachments?.find(a => a.type === 'voice');
    if (!voice) return null;

    return (
      <VoicePlayer
        uri={voice.uri}
        duration={voice.duration || 0}
        isOwnMessage={isOwnMessage}
      />
    );
  };

  const renderFileContent = () => {
    const files = message.attachments?.filter(a => a.type === 'file') || [];
    if (files.length === 0) return null;

    return (
      <View style={styles.filesContainer}>
        {files.map(file => (
          <Pressable key={file.id} style={styles.fileItem}>
            <View
              style={[
                styles.fileIcon,
                isOwnMessage ? styles.fileIconOwn : styles.fileIconOther,
              ]}
            >
              <MaterialIcons
                name="insert-drive-file"
                size={20}
                color={isOwnMessage ? '#fff' : '#3b82f6'}
              />
            </View>
            <View style={styles.fileInfo}>
              <Text
                style={[
                  styles.fileName,
                  isOwnMessage ? styles.fileNameOwn : styles.fileNameOther,
                ]}
                numberOfLines={1}
              >
                {file.fileName || 'File'}
              </Text>
              {file.fileSize && (
                <Text
                  style={[
                    styles.fileSize,
                    isOwnMessage ? styles.fileSizeOwn : styles.fileSizeOther,
                  ]}
                >
                  {formatFileSize(file.fileSize)}
                </Text>
              )}
            </View>
          </Pressable>
        ))}
      </View>
    );
  };

  const renderReactions = () => {
    if (!message.reactions || Object.keys(message.reactions).length === 0) return null;

    return (
      <View style={styles.reactionsContainer}>
        {Object.entries(message.reactions).map(([emoji, userIds]) => (
          <View key={emoji} style={styles.reactionBadge}>
            <Text style={styles.reactionEmoji}>{emoji}</Text>
            {userIds.length > 1 && (
              <Text style={styles.reactionCount}>{userIds.length}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return renderImageContent();
      case 'voice':
        return renderVoiceContent();
      case 'file':
        return renderFileContent();
      default:
        return renderTextContent();
    }
  };

  const renderStatus = () => {
    if (!isOwnMessage) return null;

    let iconName: keyof typeof MaterialIcons.glyphMap = 'check';
    let iconColor = '#9ca3af';

    switch (message.status) {
      case 'sending':
        iconName = 'schedule';
        break;
      case 'sent':
        iconName = 'check';
        break;
      case 'delivered':
        iconName = 'done-all';
        break;
      case 'read':
        iconName = 'done-all';
        iconColor = '#3b82f6';
        break;
      case 'failed':
        iconName = 'error-outline';
        iconColor = '#ef4444';
        break;
    }

    return (
      <MaterialIcons
        name={iconName}
        size={14}
        color={iconColor}
        style={styles.statusIcon}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.containerOwn : styles.containerOther,
      ]}
    >
      {showSenderName && !isOwnMessage && (
        <Text style={styles.senderName}>{message.senderName}</Text>
      )}

      <Pressable
        onLongPress={handleLongPress}
        style={[
          styles.bubble,
          isOwnMessage ? styles.bubbleOwn : styles.bubbleOther,
          message.type === 'image' && styles.bubbleImage,
        ]}
      >
        {renderReplyPreview()}
        {renderContent()}

        <View style={styles.footer}>
          <Text
            style={[
              styles.timestamp,
              isOwnMessage ? styles.timestampOwn : styles.timestampOther,
            ]}
          >
            {formatMessageTime(message.createdAt)}
          </Text>
          {renderStatus()}
        </View>
      </Pressable>

      {renderReactions()}
    </View>
  );
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: MAX_BUBBLE_WIDTH,
  },
  containerOwn: {
    alignSelf: 'flex-end',
  },
  containerOther: {
    alignSelf: 'flex-start',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 4,
    marginLeft: 12,
  },
  bubble: {
    padding: 12,
    borderRadius: 20,
    minWidth: 80,
  },
  bubbleOwn: {
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 6,
  },
  bubbleOther: {
    backgroundColor: '#f1f5f9',
    borderBottomLeftRadius: 6,
  },
  bubbleImage: {
    padding: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  messageTextOwn: {
    color: '#fff',
  },
  messageTextOther: {
    color: '#1f2937',
  },
  deletedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deletedText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#9ca3af',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
    gap: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  timestampOwn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timestampOther: {
    color: '#9ca3af',
  },
  statusIcon: {
    marginLeft: 2,
  },
  // Reply preview
  replyPreview: {
    flexDirection: 'row',
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
  },
  replyPreviewOwn: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  replyPreviewOther: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  replyBar: {
    width: 3,
    borderRadius: 2,
    backgroundColor: '#8b5cf6',
    marginRight: 8,
  },
  replyContent: {
    flex: 1,
  },
  replyName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8b5cf6',
    marginBottom: 2,
  },
  replyText: {
    fontSize: 13,
    color: '#6b7280',
  },
  // Images
  imagesContainer: {
    gap: 4,
  },
  imageWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  messageImage: {
    borderRadius: 16,
    maxHeight: 300,
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  imageCaption: {
    fontSize: 14,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  imageCaptionOwn: {
    color: '#fff',
  },
  imageCaptionOther: {
    color: '#1f2937',
  },
  // Files
  filesContainer: {
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIconOwn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  fileIconOther: {
    backgroundColor: '#dbeafe',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
  },
  fileNameOwn: {
    color: '#fff',
  },
  fileNameOther: {
    color: '#1f2937',
  },
  fileSize: {
    fontSize: 12,
    marginTop: 2,
  },
  fileSizeOwn: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  fileSizeOther: {
    color: '#6b7280',
  },
  // Reactions
  reactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginHorizontal: 8,
    gap: 4,
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionCount: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 2,
  },
});
