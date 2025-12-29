import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';

interface VoicePlayerProps {
  uri: string;
  duration: number; // seconds
  isOwnMessage: boolean;
}

export default function VoicePlayer({ uri, duration, isOwnMessage }: VoicePlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    return () => {
      // Cleanup sound on unmount
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAndPlay = async () => {
    try {
      setIsLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // If already loaded, just toggle play/pause
      if (sound) {
        if (isPlaying) {
          await sound.pauseAsync();
          setIsPlaying(false);
        } else {
          await sound.playAsync();
          setIsPlaying(true);
        }
        setIsLoading(false);
        return;
      }

      // Load the sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error playing voice message:', error);
      setIsLoading(false);
    }
  };

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis / 1000);
      const progress = status.durationMillis
        ? status.positionMillis / status.durationMillis
        : 0;
      progressAnim.setValue(progress);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
        progressAnim.setValue(0);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const displayDuration = isPlaying || position > 0 ? position : duration;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={loadAndPlay}
        style={[
          styles.playButton,
          isOwnMessage ? styles.playButtonOwn : styles.playButtonOther,
        ]}
        disabled={isLoading}
      >
        <MaterialIcons
          name={isLoading ? 'hourglass-empty' : isPlaying ? 'pause' : 'play-arrow'}
          size={24}
          color={isOwnMessage ? '#3b82f6' : '#fff'}
        />
      </Pressable>

      <View style={styles.waveformContainer}>
        {/* Static waveform visualization */}
        <View style={styles.waveform}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.waveformBar,
                isOwnMessage ? styles.waveformBarOwn : styles.waveformBarOther,
                {
                  height: 8 + Math.sin(i * 0.5) * 8 + Math.random() * 4,
                },
              ]}
            />
          ))}
        </View>

        {/* Progress overlay */}
        <Animated.View
          style={[
            styles.progressOverlay,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      <Text
        style={[
          styles.duration,
          isOwnMessage ? styles.durationOwn : styles.durationOther,
        ]}
      >
        {formatTime(displayDuration)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minWidth: 180,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonOwn: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  playButtonOther: {
    backgroundColor: '#3b82f6',
  },
  waveformContainer: {
    flex: 1,
    height: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    gap: 2,
  },
  waveformBar: {
    width: 3,
    borderRadius: 2,
  },
  waveformBarOwn: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  waveformBarOther: {
    backgroundColor: '#94a3b8',
  },
  progressOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
  },
  duration: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 36,
  },
  durationOwn: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  durationOther: {
    color: '#6b7280',
  },
});
