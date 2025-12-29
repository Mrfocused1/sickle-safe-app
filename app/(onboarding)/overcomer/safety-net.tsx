import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { BackButton, SliderInput } from '../../../components/onboarding';

export default function FrequencyScreen() {
  const [crisisFrequency, setCrisisFrequency] = useState(2);

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(onboarding)/overcomer/triggers');
  };

  const getFrequencyLabel = (value: number) => {
    if (value === 0) return 'Rarely (less than once a year)';
    if (value === 1) return '1-2 times per year';
    if (value === 2) return '3-5 times per year';
    if (value === 3) return '6-12 times per year';
    if (value === 4) return 'Monthly';
    return 'Weekly or more';
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />



      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 2 of 4</Text>
          </View>
          <Pressable onPress={() => router.replace('/(overcomer)')}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '50%', backgroundColor: '#EF4444' }]} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {/* Title */}
          <Text style={styles.title}>
            Tell us about your{'\n'}
            <Text style={styles.titleAccent}>pain crises</Text>
          </Text>

          <Text style={styles.subtitle}>
            Understanding your patterns helps us provide better alerts and recommendations.
          </Text>

          {/* Crisis Frequency Slider */}
          <View style={styles.inputSection}>
            <SliderInput
              label="How often do you experience pain crises?"
              min={0}
              max={5}
              value={crisisFrequency}
              onChange={setCrisisFrequency}
              color="#EF4444"
              labels={{ min: 'Rarely', max: 'Frequently' }}
            />
            <View style={styles.frequencyBadge}>
              <Text style={styles.frequencyText}>{getFrequencyLabel(crisisFrequency)}</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomSection}>
          <Pressable
            onPress={handleContinue}
            style={styles.primaryButton}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  stepIndicator: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#9CA3AF',
    paddingHorizontal: 8,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 2,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 38,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  titleAccent: {
    color: '#EF4444',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 32,
  },
  frequencyBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  frequencyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#991B1B',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
});
