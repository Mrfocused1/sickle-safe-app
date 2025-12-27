import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Check, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

interface ToastProps {
  visible: boolean;
  message: string;
  subtitle?: string;
  duration?: number;
  onComplete?: () => void;
  variant?: 'success' | 'celebration';
}

export default function Toast({
  visible,
  message,
  subtitle,
  duration = 2000,
  onComplete,
  variant = 'success',
}: ToastProps) {
  console.log('Toast component rendered, visible:', visible);

  // Start visible for debugging
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    console.log('Toast useEffect, visible:', visible);
    if (visible) {
      // Animate in
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      });
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 200,
      });
      iconScale.value = withDelay(
        200,
        withSpring(1, {
          damping: 10,
          stiffness: 300,
        })
      );

      // Animate out after duration
      const triggerComplete = () => {
        if (onComplete) {
          onComplete();
        }
      };

      translateY.value = withDelay(
        duration,
        withSequence(
          withTiming(-20, { duration: 100 }),
          withTiming(-100, { duration: 300 })
        )
      );
      opacity.value = withDelay(duration, withTiming(0, { duration: 300 }));
      scale.value = withDelay(
        duration,
        withTiming(0.8, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(triggerComplete)();
          }
        })
      );
    } else {
      translateY.value = -100;
      opacity.value = 0;
      scale.value = 0.8;
      iconScale.value = 0;
    }
  }, [visible, duration, onComplete]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  console.log('Toast about to render, visible:', visible);
  // if (!visible) return null; // Temporarily disabled for debugging

  const colors = variant === 'celebration'
    ? { bg: '#FEF3C7', accent: '#F59E0B', iconBg: '#F59E0B' }
    : { bg: '#ECFDF5', accent: '#10B981', iconBg: '#10B981' };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={[styles.toast, { backgroundColor: colors.bg }]}>
        <Animated.View style={[styles.iconContainer, { backgroundColor: colors.iconBg }, iconStyle]}>
          {variant === 'celebration' ? (
            <Sparkles size={20} color="#ffffff" />
          ) : (
            <Check size={20} color="#ffffff" />
          )}
        </Animated.View>
        <View style={styles.textContainer}>
          <Text style={[styles.message, { color: '#111827' }]}>{message}</Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: '#6B7280' }]}>{subtitle}</Text>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 24,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: width - 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
});
