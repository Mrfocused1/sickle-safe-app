import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { HandHeart, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BackButton, ChipSelection, SliderInput } from '../../../components/onboarding';

const interestOptions = [
  { value: 'events', label: 'Events', emoji: '🎉' },
  { value: 'advocacy', label: 'Advocacy', emoji: '📢' },
  { value: 'education', label: 'Education', emoji: '📚' },
  { value: 'fundraising', label: 'Fundraising', emoji: '💰' },
  { value: 'support', label: 'Support Groups', emoji: '🤝' },
  { value: 'blood-drives', label: 'Blood Drives', emoji: '🩸' },
];

const skillOptions = [
  { value: 'medical', label: 'Medical', emoji: '⚕️' },
  { value: 'teaching', label: 'Teaching', emoji: '👩‍🏫' },
  { value: 'marketing', label: 'Marketing', emoji: '📣' },
  { value: 'admin', label: 'Admin', emoji: '📋' },
  { value: 'tech', label: 'Tech', emoji: '💻' },
  { value: 'creative', label: 'Creative', emoji: '🎨' },
];

export default function VolunteerOnboardingScreen() {
  const [interests, setInterests] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [hoursPerMonth, setHoursPerMonth] = useState(4);
  const [showToast, setShowToast] = useState(false);

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setShowToast(true);

    setTimeout(() => {
      router.replace('/(volunteer)');
    }, 1800);
  };

  const getCommitmentLabel = (hours: number) => {
    if (hours <= 2) return 'Light involvement';
    if (hours <= 5) return 'Regular contributor';
    if (hours <= 10) return 'Active volunteer';
    return 'Community champion';
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={['#ffffff', '#EFF6FF', '#ffffff']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Volunteer Setup</Text>
          </View>
          <Pressable onPress={() => router.replace('/(volunteer)')}>
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
            <HandHeart size={32} color="#3B82F6" />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            How would you like{'\n'}
            <Text style={styles.titleAccent}>to help?</Text>
          </Text>

          <Text style={styles.subtitle}>
            Tell us about your interests and availability so we can match you with the right opportunities.
          </Text>

          {/* Interest Areas */}
          <View style={styles.inputSection}>
            <ChipSelection
              label="What areas interest you?"
              options={interestOptions}
              selectedValues={interests}
              onChange={setInterests}
              color="#3B82F6"
              maxSelections={4}
            />
          </View>

          {/* Skills */}
          <View style={styles.inputSection}>
            <ChipSelection
              label="What skills can you contribute?"
              options={skillOptions}
              selectedValues={skills}
              onChange={setSkills}
              color="#3B82F6"
              maxSelections={3}
            />
          </View>

          {/* Time Commitment */}
          <View style={styles.inputSection}>
            <SliderInput
              label="Hours you can volunteer per month"
              min={1}
              max={20}
              value={hoursPerMonth}
              onChange={setHoursPerMonth}
              color="#3B82F6"
              labels={{ min: '1 hr', max: '20 hrs' }}
            />
            <View style={styles.commitmentBadge}>
              <Text style={styles.commitmentText}>{getCommitmentLabel(hoursPerMonth)}</Text>
            </View>
          </View>

          {/* Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Your Volunteer Profile</Text>
            <View style={styles.summaryRow}>
              <Check size={18} color="#3B82F6" />
              <Text style={styles.summaryText}>{interests.length} interest areas selected</Text>
            </View>
            <View style={styles.summaryRow}>
              <Check size={18} color="#3B82F6" />
              <Text style={styles.summaryText}>{skills.length} skills to contribute</Text>
            </View>
            <View style={styles.summaryRow}>
              <Check size={18} color="#3B82F6" />
              <Text style={styles.summaryText}>{hoursPerMonth} hours/month commitment</Text>
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
        <View style={styles.toast}>
          <View style={styles.toastIcon}>
            <Check size={20} color="#ffffff" />
          </View>
          <View style={styles.toastText}>
            <Text style={styles.toastTitle}>Welcome, Volunteer!</Text>
            <Text style={styles.toastSubtitle}>Thank you for joining the community</Text>
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
    backgroundColor: '#EFF6FF',
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
    paddingTop: 32,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
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
    marginBottom: 32,
  },
  commitmentBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  commitmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E40AF',
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
  toast: {
    position: 'absolute',
    top: 80,
    left: 24,
    right: 24,
    backgroundColor: '#EFF6FF',
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
  },
  toastIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  toastText: {
    flex: 1,
  },
  toastTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  toastSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
});
