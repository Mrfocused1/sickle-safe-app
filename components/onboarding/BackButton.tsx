import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

interface BackButtonProps {
  onPress?: () => void;
  label?: string;
  color?: string;
}

export default function BackButton({
  onPress,
  label = 'Back',
  color = '#374151',
}: BackButtonProps) {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <ChevronLeft size={24} color={color} />
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 16,
  },
  pressed: {
    opacity: 0.6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
  },
});
