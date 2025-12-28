import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, ImageBackground, Dimensions, StyleSheet, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Check } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

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
      <StatusBar style="light" />

      <ImageBackground
        source={require('../../assets/images/role_selection_bg.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.progressContainer}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={[styles.dot, styles.activeDot]} />
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

            {/* Selection Grid */}
            <View style={styles.gridContainer}>
              {/* Column 1 */}
              <View style={styles.column}>
                <RoleCard
                  role={roles[0]}
                  isSelected={selectedRole === 'overcomer'}
                  onSelect={() => setSelectedRole('overcomer')}
                />

                {/* Charity Card */}
                <RoleCard
                  role={roles[3]}
                  isSelected={selectedRole === 'charity'}
                  onSelect={() => setSelectedRole('charity')}
                />
              </View>

              {/* Column 2 */}
              <View style={styles.column}>
                {/* Helper Card */}
                <RoleCard
                  role={roles[1]}
                  isSelected={selectedRole === 'helper'}
                  onSelect={() => setSelectedRole('helper')}
                />

                {/* Volunteer Card */}
                <RoleCard
                  role={roles[2]}
                  isSelected={selectedRole === 'volunteer'}
                  onSelect={() => setSelectedRole('volunteer')}
                />
              </View>
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
      {isSelected && (
        <View style={styles.checkIcon}>
          <Check size={12} color="#EF4444" strokeWidth={3} />
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{role.title}</Text>
        <Text style={styles.cardSubtitle}>{role.subtitle}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 60,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 20,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: -1,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#D1D5DB',
    textAlign: 'center',
    fontWeight: '500',
    paddingHorizontal: 20,
    lineHeight: 22,
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
    height: 180,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: 20,
    justifyContent: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  cardActive: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderColor: '#EF4444',
    borderWidth: 2,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  checkIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    gap: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 22,
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
  homeIndicator: {
    width: 120,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginTop: 10,
  },
});
