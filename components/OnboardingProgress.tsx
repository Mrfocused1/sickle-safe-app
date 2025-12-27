import React from 'react';
import { View, StyleSheet } from 'react-native';

interface OnboardingProgressProps {
  currentStep: 1 | 2 | 3;
  variant?: 'light' | 'dark'; // dark for video backgrounds, light for white backgrounds
}

export default function OnboardingProgress({ currentStep, variant = 'light' }: OnboardingProgressProps) {
  const inactiveColor = variant === 'dark' ? 'rgba(255, 255, 255, 0.4)' : '#D1D5DB';
  const activeColor = '#EF4444';

  return (
    <View style={styles.container}>
      <View style={[
        styles.dot,
        currentStep === 1 ? styles.dotActive : null,
        { backgroundColor: currentStep === 1 ? activeColor : inactiveColor }
      ]} />
      <View style={[
        styles.dot,
        currentStep === 2 ? styles.dotActive : null,
        { backgroundColor: currentStep === 2 ? activeColor : inactiveColor }
      ]} />
      <View style={[
        styles.dot,
        currentStep === 3 ? styles.dotActive : null,
        { backgroundColor: currentStep === 3 ? activeColor : inactiveColor }
      ]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotActive: {
    width: 32,
  },
});
