import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Bell, Check } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { BackButton, ChipSelection } from '../../../components/onboarding';

const alertOptions = [
  { value: 'crisis', label: 'Crisis Alerts' },
  { value: 'medication', label: 'Medication' },
  { value: 'hydration', label: 'Hydration' },
  { value: 'appointments', label: 'Appointments' },
  { value: 'checkups', label: 'Daily Check-ins' },
  { value: 'mood', label: 'Mood Changes' },
];

const availabilityOptions = [
  { value: '24-7', label: '24/7 Available' },
  { value: 'daytime', label: 'Daytime Only' },
  { value: 'emergencies', label: 'Emergencies Only' },
  { value: 'scheduled', label: 'Scheduled Times' },
];

export default function AlertPreferencesScreen() {
  const [alerts, setAlerts] = useState<string[]>(['crisis']);
  const [availability, setAvailability] = useState<string[]>([]);

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(helper)');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#ffffff' }]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 3 of 3</Text>
          </View>
          <Pressable onPress={() => router.replace('/(helper)')}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '100%' }]} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Bell size={32} color="#10B981" />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Customize your{'\n'}
            <Text style={styles.titleAccent}>notifications</Text>
          </Text>

          <Text style={styles.subtitle}>
            Choose what alerts you want to receive to stay informed about your loved one's health.
          </Text>

          {/* Alert Preferences */}
          <View style={styles.inputSection}>
            <ChipSelection
              label="What would you like to be notified about?"
              options={alertOptions}
              selectedValues={alerts}
              onChange={setAlerts}
              color="#10B981"
              maxSelections={6}
            />
          </View>

          {/* Availability */}
          <View style={styles.inputSection}>
            <ChipSelection
              label="When are you available?"
              options={availabilityOptions}
              selectedValues={availability}
              onChange={setAvailability}
              color="#10B981"
              maxSelections={2}
            />
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Helper Profile</Text>
            <View style={styles.summaryRow}>
              <Check size={18} color="#10B981" />
              <Text style={styles.summaryText}>Relationship recorded</Text>
            </View>
            <View style={styles.summaryRow}>
              <Check size={18} color="#10B981" />
              <Text style={styles.summaryText}>{alerts.length} alert types selected</Text>
            </View>
            <View style={styles.summaryRow}>
              <Check size={18} color="#10B981" />
              <Text style={styles.summaryText}>Ready to support your loved ones</Text>
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
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
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
    backgroundColor: '#10B981',
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
    backgroundColor: '#ECFDF5',
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
    color: '#10B981',
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
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#10B981',
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
