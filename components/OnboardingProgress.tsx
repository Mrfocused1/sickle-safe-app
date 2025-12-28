import React from 'react';
import { View, StyleSheet } from 'react-native';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps?: number;
  variant?: 'light' | 'dark'; // dark for video backgrounds, light for white backgrounds
}

export default function OnboardingProgress({
  currentStep,
  totalSteps = 3,
  variant = 'light'
}: OnboardingProgressProps) {
  const inactiveColor = variant === 'dark' ? 'rgba(255, 255, 255, 0.4)' : '#D1D5DB';
  const activeColor = '#EF4444';

  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {steps.map((step) => (
        <View
          key={step}
          style={[
            styles.dot,
            currentStep === step ? styles.dotActive : null,
            { backgroundColor: currentStep === step ? activeColor : inactiveColor }
          ]}
        />
      ))}
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
