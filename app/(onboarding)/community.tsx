import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingProgress from '../../components/OnboardingProgress';
import { TextInputField, BackButton } from '../../components/onboarding';

const { width, height } = Dimensions.get('window');

export default function CommunityScreen() {
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (name.trim().length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // TODO: Save name to user profile/context
      router.push('/(onboarding)/role-selection');
    }
  };

  const isValid = name.trim().length >= 2;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#ffffff', '#fef2f2', '#fff7ed', '#ffffff']}
        locations={[0, 0.3, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <BackButton label="" />
            <OnboardingProgress currentStep={2} variant="light" />
            <View style={styles.headerSpacer} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Let's get to know you</Text>
            </View>

            {/* Title */}
            <Text style={styles.title}>
              What should we{'\n'}
              <Text style={styles.titleAccent}>call you?</Text>
            </Text>

            <Text style={styles.subtitle}>
              This is how you'll appear to others in the Sickle Safe community.
            </Text>

            {/* Name Input */}
            <View style={styles.inputSection}>
              <TextInputField
                label="Your name or nickname"
                value={name}
                onChange={setName}
                placeholder="Enter your name"
                maxLength={30}
                autoCapitalize="words"
              />
            </View>

            {name.trim().length > 0 && (
              <View style={styles.previewCard}>
                <View style={styles.previewAvatar}>
                  <User size={24} color="#fff" />
                </View>
                <View>
                  <Text style={styles.previewName}>{name.trim()}</Text>
                  <Text style={styles.previewLabel}>Sickle Safe Advocate</Text>
                </View>
              </View>
            )}
          </View>

          {/* Bottom CTA */}
          <View style={styles.bottomSection}>
            <Pressable
              onPress={handleContinue}
              disabled={!isValid}
              style={[
                styles.primaryButton,
                !isValid && styles.primaryButtonDisabled,
              ]}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>

            <Pressable style={styles.skipButton}>
              <Text style={styles.skipText}>
                Already have an account? <Text style={styles.skipLink}>Log in</Text>
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
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
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerSpacer: {
    width: 80,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 38,
    letterSpacing: -1,
    marginBottom: 12,
  },
  titleAccent: {
    color: '#EF4444',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 24,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 20,
    gap: 16,
  },
  previewAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewInitial: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
  },
  previewName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 2,
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
  primaryButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  skipLink: {
    color: '#111827',
    fontWeight: '800',
    textDecorationLine: 'underline',
  },
});
