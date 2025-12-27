import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

interface SliderInputProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  unit?: string;
  step?: number;
  color?: string;
  labels?: { min: string; max: string };
}

const TRACK_WIDTH = 280;
const THUMB_SIZE = 32;

export default function SliderInput({
  label,
  min,
  max,
  value,
  onChange,
  unit = '',
  step = 1,
  color = '#EF4444',
  labels,
}: SliderInputProps) {
  const progress = useSharedValue((value - min) / (max - min));
  const startX = useSharedValue(0);
  const lastValue = useSharedValue(value);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startX.value = progress.value * TRACK_WIDTH;
    })
    .onUpdate((event) => {
      const newX = Math.max(0, Math.min(TRACK_WIDTH, startX.value + event.translationX));
      const newProgress = newX / TRACK_WIDTH;
      const rawValue = min + newProgress * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));

      if (clampedValue !== lastValue.value) {
        runOnJS(triggerHaptic)();
        lastValue.value = clampedValue;
      }

      progress.value = (clampedValue - min) / (max - min);
      runOnJS(onChange)(clampedValue);
    })
    .onEnd(() => {
      progress.value = withSpring(progress.value);
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * TRACK_WIDTH }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: progress.value * TRACK_WIDTH + THUMB_SIZE / 2,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={[styles.value, { color }]}>
          {value}{unit}
        </Text>
      </View>

      <View style={styles.sliderContainer}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { backgroundColor: color }, fillStyle]} />
        </View>

        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.thumbContainer, thumbStyle]}>
            <View style={[styles.thumb, { backgroundColor: color }]}>
              <View style={styles.thumbInner} />
            </View>
          </Animated.View>
        </GestureDetector>
      </View>

      {labels && (
        <View style={styles.labelsRow}>
          <Text style={styles.rangeLabel}>{labels.min}</Text>
          <Text style={styles.rangeLabel}>{labels.max}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  value: {
    fontSize: 24,
    fontWeight: '900',
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: THUMB_SIZE / 2,
  },
  track: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  thumbContainer: {
    position: 'absolute',
    left: 0,
    top: 4,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  thumbInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  rangeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});
