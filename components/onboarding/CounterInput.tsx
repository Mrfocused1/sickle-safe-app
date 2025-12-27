import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

interface CounterInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  color?: string;
}

export default function CounterInput({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  unit = '',
  color = '#EF4444',
}: CounterInputProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleIncrement = () => {
    if (value < max) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scale.value = withSpring(1.1, { damping: 10 }, () => {
        scale.value = withSpring(1);
      });
      onChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > min) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      scale.value = withSpring(1.1, { damping: 10 }, () => {
        scale.value = withSpring(1);
      });
      onChange(value - 1);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.counterContainer}>
        <Pressable
          onPress={handleDecrement}
          style={[
            styles.button,
            { backgroundColor: value <= min ? '#F3F4F6' : `${color}15` },
          ]}
          disabled={value <= min}
        >
          <Minus size={24} color={value <= min ? '#D1D5DB' : color} />
        </Pressable>

        <Animated.View style={[styles.valueContainer, animatedStyle]}>
          <Text style={[styles.value, { color }]}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </Animated.View>

        <Pressable
          onPress={handleIncrement}
          style={[
            styles.button,
            { backgroundColor: value >= max ? '#F3F4F6' : `${color}15` },
          ]}
          disabled={value >= max}
        >
          <Plus size={24} color={value >= max ? '#D1D5DB' : color} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueContainer: {
    alignItems: 'center',
    minWidth: 100,
  },
  value: {
    fontSize: 48,
    fontWeight: '900',
  },
  unit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 4,
  },
});
