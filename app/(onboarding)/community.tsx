import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { User } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
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
      <StatusBar style="light" />

      <ImageBackground
        source={require('../../assets/images/role_selection_bg.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            {/* Header with Back Button */}
            <View style={styles.header}>
              <BackButton color="#FFF" />
              <View style={styles.progressContainer}>
                <View style={styles.dot} />
                <View style={[styles.dot, styles.activeDot]} />
                <View style={styles.dot} />
              </View>
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
                  variant="aura"
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

              <View style={styles.homeIndicator} />
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
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
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeDot: {
    width: 16,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFF',
    lineHeight: 40,
    letterSpacing: -1,
    marginBottom: 12,
  },
  titleAccent: {
    color: '#EF4444',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#D1D5DB',
    lineHeight: 22,
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 24,
  },
  previewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    borderRadius: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  previewAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  previewLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EF4444',
    paddingVertical: 18,
    borderRadius: 100,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonDisabled: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
    shadowOpacity: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 1,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1D5DB',
  },
  skipLink: {
    color: '#FFF',
    fontWeight: '800',
  },
  homeIndicator: {
    width: 120,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginTop: 10,
  },
});
