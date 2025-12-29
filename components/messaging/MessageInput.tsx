import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Image,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import { MediaAttachment, generateAttachmentId, Message } from '../../types/messaging';

interface MessageInputProps {
  onSend: (content: string, attachments?: MediaAttachment[]) => void;
  onTyping?: (isTyping: boolean) => void;
  placeholder?: string;
  replyTo?: Message | null;
  onCancelReply?: () => void;
  disabled?: boolean;
}

export default function MessageInput({
  onSend,
  onTyping,
  placeholder = 'Type a message...',
  replyTo,
  onCancelReply,
  disabled = false,
}: MessageInputProps) {
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState<MediaAttachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const sendButtonScale = useRef(new Animated.Value(0)).current;
  const recordingPulse = useRef(new Animated.Value(1)).current;
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const hasContent = text.trim().length > 0 || attachments.length > 0;

  useEffect(() => {
    Animated.spring(sendButtonScale, {
      toValue: hasContent ? 1 : 0,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [hasContent]);

  useEffect(() => {
    if (isRecording) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(recordingPulse, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(recordingPulse, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [isRecording]);

  const handleTextChange = (newText: string) => {
    setText(newText);

    // Typing indicator
    if (onTyping) {
      onTyping(true);
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
      typingTimeout.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    }
  };

  const handleSend = () => {
    if (!hasContent || disabled) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSend(text.trim(), attachments.length > 0 ? attachments : undefined);
    setText('');
    setAttachments([]);
    onTyping?.(false);
  };

  const pickImage = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets) {
        const newAttachments: MediaAttachment[] = result.assets.map(asset => ({
          id: generateAttachmentId(),
          type: 'image',
          uri: asset.uri,
          mimeType: asset.mimeType || 'image/jpeg',
          width: asset.width,
          height: asset.height,
        }));
        setAttachments([...attachments, ...newAttachments]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const takePhoto = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Camera permission is required to take photos');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];
        const newAttachment: MediaAttachment = {
          id: generateAttachmentId(),
          type: 'image',
          uri: asset.uri,
          mimeType: asset.mimeType || 'image/jpeg',
          width: asset.width,
          height: asset.height,
        };
        setAttachments([...attachments, newAttachment]);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  const startRecording = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Microphone permission is required to record voice messages');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);

      // Start timer
      recordingTimer.current = setInterval(() => {
        setRecordingDuration(d => d + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording.getURI();
      if (uri && recordingDuration >= 1) {
        const voiceAttachment: MediaAttachment = {
          id: generateAttachmentId(),
          type: 'voice',
          uri,
          mimeType: 'audio/m4a',
          duration: recordingDuration,
        };
        // Send immediately
        onSend('', [voiceAttachment]);
      }

      setRecording(null);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Error stopping recording:', error);
    }
  };

  const cancelRecording = async () => {
    try {
      if (!recording) return;

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

      if (recordingTimer.current) {
        clearInterval(recordingTimer.current);
        recordingTimer.current = null;
      }

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      setRecording(null);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Error canceling recording:', error);
    }
  };

  const removeAttachment = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAttachments(attachments.filter(a => a.id !== id));
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Recording UI
  if (isRecording) {
    return (
      <View style={styles.recordingContainer}>
        <Pressable onPress={cancelRecording} style={styles.cancelButton}>
          <MaterialIcons name="close" size={24} color="#ef4444" />
        </Pressable>

        <View style={styles.recordingInfo}>
          <Animated.View
            style={[
              styles.recordingIndicator,
              { transform: [{ scale: recordingPulse }] },
            ]}
          />
          <Text style={styles.recordingDuration}>
            {formatDuration(recordingDuration)}
          </Text>
          <Text style={styles.recordingText}>Recording...</Text>
        </View>

        <Pressable onPress={stopRecording} style={styles.stopButton}>
          <MaterialIcons name="send" size={24} color="#fff" />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Reply preview */}
      {replyTo && (
        <View style={styles.replyPreview}>
          <View style={styles.replyBar} />
          <View style={styles.replyContent}>
            <Text style={styles.replyName}>{replyTo.senderName}</Text>
            <Text style={styles.replyText} numberOfLines={1}>
              {replyTo.content}
            </Text>
          </View>
          <Pressable onPress={onCancelReply} style={styles.replyClose}>
            <MaterialIcons name="close" size={20} color="#6b7280" />
          </Pressable>
        </View>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.attachmentsContainer}
          contentContainerStyle={styles.attachmentsContent}
        >
          {attachments.map(attachment => (
            <View key={attachment.id} style={styles.attachmentPreview}>
              {attachment.type === 'image' && (
                <Image
                  source={{ uri: attachment.uri }}
                  style={styles.attachmentImage}
                />
              )}
              <Pressable
                onPress={() => removeAttachment(attachment.id)}
                style={styles.removeAttachment}
              >
                <MaterialIcons name="close" size={16} color="#fff" />
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Input row */}
      <View style={styles.inputRow}>
        {/* Media buttons */}
        <View style={styles.mediaButtons}>
          <Pressable onPress={takePhoto} style={styles.mediaButton}>
            <MaterialIcons name="camera-alt" size={22} color="#6b7280" />
          </Pressable>
          <Pressable onPress={pickImage} style={styles.mediaButton}>
            <MaterialIcons name="image" size={22} color="#6b7280" />
          </Pressable>
        </View>

        {/* Text input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={handleTextChange}
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={2000}
            editable={!disabled}
          />
        </View>

        {/* Send or Mic button */}
        {hasContent ? (
          <Animated.View
            style={[
              styles.sendButton,
              {
                transform: [{ scale: sendButtonScale }],
              },
            ]}
          >
            <Pressable onPress={handleSend} disabled={disabled}>
              <MaterialIcons name="send" size={22} color="#fff" />
            </Pressable>
          </Animated.View>
        ) : (
          <Pressable
            onPressIn={startRecording}
            style={styles.micButton}
          >
            <MaterialIcons name="mic" size={24} color="#6b7280" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    gap: 8,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 4,
    paddingBottom: 8,
  },
  mediaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 120,
  },
  textInput: {
    fontSize: 16,
    color: '#1f2937',
    minHeight: 24,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  // Reply preview
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  replyBar: {
    width: 3,
    height: 32,
    borderRadius: 2,
    backgroundColor: '#8b5cf6',
    marginRight: 12,
  },
  replyContent: {
    flex: 1,
  },
  replyName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  replyText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  replyClose: {
    padding: 4,
  },
  // Attachments preview
  attachmentsContainer: {
    maxHeight: 100,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  attachmentsContent: {
    padding: 8,
    gap: 8,
  },
  attachmentPreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  attachmentImage: {
    width: '100%',
    height: '100%',
  },
  removeAttachment: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Recording UI
  recordingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fef2f2',
    borderTopWidth: 1,
    borderTopColor: '#fecaca',
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  recordingIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ef4444',
  },
  recordingDuration: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ef4444',
  },
  recordingText: {
    fontSize: 14,
    color: '#6b7280',
  },
  stopButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
