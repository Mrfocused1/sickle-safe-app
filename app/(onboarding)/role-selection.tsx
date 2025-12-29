import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, ImageBackground, Dimensions, StyleSheet, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Check } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

import { BackButton } from '../../components/onboarding';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

type Role = 'overcomer' | 'helper' | 'volunteer' | 'charity';

interface RoleData {
  id: Role;
  title: string;
  subtitle: string;
  description: string;
}

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<Role>('overcomer');

  const roles: RoleData[] = [
    {
      id: 'overcomer',
      title: 'The Overcomer',
      subtitle: 'Patient / Self-Manager',
      description: 'Track pain crises, hydration, and manage your health journey with personalized insights.',
    },
    {
      id: 'helper',
      title: 'The Helper',
      subtitle: 'Guardian or Carer',
      description: 'Monitor loved ones, receive alerts, and coordinate care with shared health logs.',
    },
    {
      id: 'volunteer',
      title: 'The Volunteer',
      subtitle: 'Community Supporter',
      description: 'Connect with patients and support community events, contributing to a stronger network of care.',
    },
    {
      id: 'charity',
      title: 'The Charity',
      subtitle: 'Organization / Foundation',
      description: 'Support the community through funding, awareness, and centralized resource management.',
    },
  ];

  const handleContinue = () => {
    if (selectedRole === 'overcomer') {
      router.push('/overcomer/productivity');
    } else if (selectedRole === 'helper') {
      router.push('/helper/real-time-alerts');
    } else if (selectedRole === 'volunteer') {
      router.push('/volunteer/advocacy');
    } else {
      router.push('/charity-onboarding/organization-info');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ImageBackground
        source={require('../../assets/images/role_selection_bg.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <BackButton color="#111827" />
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>Step 1 of 4</Text>
            </View>
            <Pressable onPress={() => router.push('/(overcomer)')}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '25%' }]} />
            </View>
          </View>

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Title Section */}
            <View style={styles.titleSection}>
              <Text style={styles.title}>Step Into Your{'\n'}New Role</Text>
              <Text style={styles.subtitle}>Select how you'll be participating in the community.</Text>
            </View>

            {/* Selection List */}
            <View style={styles.listContainer}>
              {roles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  isSelected={selectedRole === role.id}
                  onSelect={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    setSelectedRole(role.id);
                  }}
                />
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable style={styles.continueButton} onPress={handleContinue}>
              <Text style={styles.continueText}>CONTINUE</Text>
            </Pressable>
            <Pressable style={styles.loginLink}>
              <Text style={styles.loginText}>LOG IN</Text>
            </Pressable>
            <View style={styles.homeIndicator} />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

function RoleCard({ role, isSelected, onSelect }: { role: RoleData; isSelected: boolean; onSelect: () => void }) {
  return (
    <Pressable
      onPress={onSelect}
      style={[
        styles.card,
        isSelected && styles.cardActive
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.textContainer}>
          <Text style={[styles.cardTitle, isSelected && styles.activeText]}>{role.title}</Text>
          <Text style={styles.cardSubtitle}>{role.subtitle}</Text>
        </View>
        <View style={[styles.indicator, isSelected && styles.indicatorActive]}>
          {isSelected && <Check size={14} color="#FFF" strokeWidth={3} />}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.92)',
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
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.15)',
  },
  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4B5563',
    paddingHorizontal: 8,
  },
  progressContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  progressTrack: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EF4444',
    borderRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 38,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4B5563',
    lineHeight: 24,
  },
  listContainer: {
    gap: 12,
  },
  gridContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderColor: '#EF4444',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  textContainer: {
    flex: 1,
    paddingRight: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  activeText: {
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    gap: 16,
    alignItems: 'center',
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#EF4444',
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  loginLink: {
    padding: 8,
  },
  loginText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  homeIndicator: {
    width: 120,
    height: 5,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 3,
    marginTop: 10,
  },
});
