import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Check } from 'lucide-react-native';

import * as Haptics from 'expo-haptics';
import { BackButton, CounterInput } from '../../../components/onboarding';

export default function HydrationGoalScreen() {
  const [hydrationGoal, setHydrationGoal] = useState(8);
  const [showToast, setShowToast] = useState(false);

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowToast(true);

    // Navigate after toast displays
    setTimeout(() => {
      router.replace('/(overcomer)');
    }, 1800);
  };

  const getHydrationTip = (glasses: number) => {
    if (glasses <= 4) return 'Consider increasing your water intake for better hydration.';
    if (glasses <= 6) return 'Good start! Staying hydrated helps prevent crises.';
    if (glasses <= 8) return 'Great goal! This is the recommended daily intake.';
    if (glasses <= 10) return 'Excellent! Extra hydration is beneficial for SCD.';
    return 'Amazing commitment to hydration!';
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />



      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 4 of 4</Text>
          </View>
          <Pressable onPress={() => router.replace('/(overcomer)')}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '100%', backgroundColor: '#EF4444' }]} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >


          {/* Title */}
          <Text style={styles.title}>
            Set your daily{'\n'}
            <Text style={styles.titleAccent}>hydration goal</Text>
          </Text>

          <Text style={styles.subtitle}>
            Staying hydrated is crucial for managing sickle cell disease. We'll remind you throughout the day.
          </Text>

          {/* Counter Input */}
          <View style={styles.inputSection}>
            <CounterInput
              label="Glasses of water per day"
              value={hydrationGoal}
              onChange={setHydrationGoal}
              min={4}
              max={16}
              unit="glasses"
              color="#3B82F6"
            />
          </View>

          {/* Tip Card */}
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>{getHydrationTip(hydrationGoal)}</Text>
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Profile Summary</Text>
            <View style={styles.summaryRow}>
              <Check size={18} color="#10B981" />
              <Text style={styles.summaryText}>Sickle Cell type recorded</Text>
            </View>
            <View style={styles.summaryRow}>
              <Check size={18} color="#10B981" />
              <Text style={styles.summaryText}>Crisis triggers identified</Text>
            </View>
            <View style={styles.summaryRow}>
              <Check size={18} color="#10B981" />
              <Text style={styles.summaryText}>Hydration goal: {hydrationGoal} glasses/day</Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomSection}>
          <Pressable
            onPress={handleFinish}
            style={styles.primaryButton}
          >
            <Text style={styles.buttonText}>Enter Dashboard</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Completion Toast */}
      {showToast && (
        <View style={{
          position: 'absolute',
          top: 80,
          left: 24,
          right: 24,
          backgroundColor: '#FEE2E2',
          padding: 20,
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.15,
          shadowRadius: 24,
          elevation: 10,
          zIndex: 9999,
        }}>
          <View style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#EF4444',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
          }}>
            <Check size={20} color="#ffffff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
              Profile Complete!
            </Text>
            <Text style={{ fontSize: 13, fontWeight: '500', color: '#6B7280', marginTop: 2 }}>
              Welcome to your health journey
            </Text>
          </View>
        </View>
      )}
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
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3B82F6',
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
    backgroundColor: '#3B82F6',
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
    backgroundColor: '#DBEAFE',
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
    color: '#3B82F6',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 24,
  },
  tipCard: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  tipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
    lineHeight: 20,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: '#F9FAFB',
    padding: 20,
    borderRadius: 20,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#3B82F6',
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
