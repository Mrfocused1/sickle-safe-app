import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { HandHeart, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BackButton, ChipSelection, SliderInput, TextInputField } from '../../../components/onboarding';

const interestOptions = [
  { value: 'events', label: 'Events' },
  { value: 'advocacy', label: 'Advocacy' },
  { value: 'education', label: 'Education' },
  { value: 'fundraising', label: 'Fundraising' },
  { value: 'support', label: 'Support Groups' },
  { value: 'blood-drives', label: 'Blood Drives' },
  { value: 'other', label: 'Other' },
];

const skillOptions = [
  { value: 'medical', label: 'Medical' },
  { value: 'teaching', label: 'Teaching' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'admin', label: 'Admin' },
  { value: 'tech', label: 'Tech' },
  { value: 'creative', label: 'Creative' },
  { value: 'other', label: 'Other' },
];

export default function VolunteerOnboardingScreen() {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState(2);

  const handleNext = () => {
    if (step < 3) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace('/(volunteer)');
  };

  const getCommitmentLabel = (hours: number) => {
    if (hours <= 1) return 'Light involvement';
    if (hours <= 3) return 'Regular contributor';
    if (hours <= 7) return 'Active volunteer';
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
          <Pressable onPress={handleBack}>
            <View style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </View>
          </Pressable>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step {step} of 3</Text>
          </View>
          <Pressable onPress={() => router.replace('/(volunteer)')}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >

          {step === 1 && (
            <>
              <Text style={styles.title}>
                What areas{'\n'}
                <Text style={styles.titleAccent}>interest you?</Text>
              </Text>
              <Text style={styles.subtitle}>
                Tell us about your interests so we can match you with the right opportunities.
              </Text>
              <View style={styles.inputSection}>
                <ChipSelection
                  label=""
                  options={interestOptions}
                  selectedValues={interests}
                  onChange={setInterests}
                  color="#3B82F6"
                  maxSelections={4}
                />
              </View>

              {interests.includes('other') && (
                <View style={styles.inputSection}>
                  <TextInputField
                    label="What other areas interest you?"
                    value={customInterest}
                    onChange={setCustomInterest}
                    placeholder="e.g. Social Media, Research..."
                    color="#3B82F6"
                    autoFocus
                  />
                </View>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <Text style={styles.title}>
                How can you{'\n'}
                <Text style={styles.titleAccent}>contribute?</Text>
              </Text>
              <Text style={styles.subtitle}>
                What skills or professional background do you bring to the community?
              </Text>
              <View style={styles.inputSection}>
                <ChipSelection
                  label=""
                  options={skillOptions}
                  selectedValues={skills}
                  onChange={setSkills}
                  color="#3B82F6"
                  maxSelections={3}
                />
              </View>

              {skills.includes('other') && (
                <View style={styles.inputSection}>
                  <TextInputField
                    label="What other skills do you have?"
                    value={customSkill}
                    onChange={setCustomSkill}
                    placeholder="e.g. Translation, Driving..."
                    color="#3B82F6"
                    autoFocus
                  />
                </View>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <Text style={styles.title}>
                Finalize your{'\n'}
                <Text style={styles.titleAccent}>commitment</Text>
              </Text>
              <Text style={styles.subtitle}>
                How much time can you realistically dedicate each week?
              </Text>
              <View style={styles.inputSection}>
                <SliderInput
                  label="Available hours per week"
                  min={1}
                  max={20}
                  value={hoursPerWeek}
                  onChange={setHoursPerWeek}
                  color="#3B82F6"
                  labels={{ min: '1 hr', max: '20 hrs' }}
                />
                <View style={styles.commitmentBadge}>
                  <Text style={styles.commitmentText}>{getCommitmentLabel(hoursPerWeek)}</Text>
                </View>
              </View>

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
                  <Text style={styles.summaryText}>{hoursPerWeek} hours/week commitment</Text>
                </View>
              </View>
            </>
          )}
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomSection}>
          <Pressable
            onPress={handleNext}
            style={styles.primaryButton}
          >
            <Text style={styles.buttonText}>{step === 3 ? 'Enter Dashboard' : 'Continue'}</Text>
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
  backButton: {
    paddingVertical: 8,
    paddingRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#9CA3AF',
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
});
