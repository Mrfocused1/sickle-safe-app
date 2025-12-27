import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BackButton, MultiSelection, TextInputField } from '../../../components/onboarding';
import { Plus, X } from 'lucide-react-native';

const initialSickleTypes = [
  {
    value: 'hbss',
    label: 'HbSS (Sickle Cell Anemia)',
    description: 'Most common and typically most severe form',
  },
  {
    value: 'hbsc',
    label: 'HbSC Disease',
    description: 'Generally milder symptoms than HbSS',
  },
  {
    value: 'hbs-beta-plus',
    label: 'HbS Beta+ Thalassemia',
    description: 'Mild to moderate severity',
  },
  {
    value: 'hbs-beta-zero',
    label: 'HbS Beta0 Thalassemia',
    description: 'Similar severity to HbSS',
  },
];

export default function SickleTypeScreen() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [customTypes, setCustomTypes] = useState<{ value: string; label: string; description: string }[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTypeName, setNewTypeName] = useState('');

  const sickleTypes = [...initialSickleTypes, ...customTypes];

  const handleAddType = () => {
    if (newTypeName.trim()) {
      const value = newTypeName.toLowerCase().replace(/\s+/g, '-');
      const newOption = {
        value,
        label: newTypeName.trim(),
        description: 'Custom sickle cell type',
      };
      setCustomTypes([...customTypes, newOption]);
      setSelectedTypes([...selectedTypes, value]);
      setNewTypeName('');
      setIsAdding(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleContinue = () => {
    if (selectedTypes.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // TODO: Save to profile
      router.push('/(onboarding)/overcomer/safety-net');
    }
  };

  const isValid = selectedTypes.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={['#ffffff', '#fef2f2', '#ffffff']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <BackButton />
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>Step 1 of 3</Text>
          </View>
          <Pressable onPress={() => router.push('/(overcomer)')}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '33%' }]} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Heart size={32} color="#EF4444" />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            What type of{'\n'}
            <Text style={styles.titleAccent}>Sickle Cell</Text> do you have?
          </Text>

          <Text style={styles.subtitle}>
            This helps us personalize your health tracking and provide relevant information.
          </Text>

          {/* Multi Selection */}
          <View style={styles.inputSection}>
            <MultiSelection
              label=""
              options={sickleTypes}
              selectedValues={selectedTypes}
              onChange={setSelectedTypes}
              color="#EF4444"
            />

            {isAdding ? (
              <View style={styles.addingContainer}>
                <TextInputField
                  label="Other Type"
                  value={newTypeName}
                  onChange={setNewTypeName}
                  placeholder="e.g. HbS/Hereditary Persistence"
                  autoFocus
                />
                <View style={styles.addingActions}>
                  <Pressable
                    onPress={() => setIsAdding(false)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleAddType}
                    disabled={!newTypeName.trim()}
                    style={[
                      styles.addButton,
                      !newTypeName.trim() && styles.addButtonDisabled
                    ]}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => setIsAdding(true)}
                style={styles.addTypeButton}
              >
                <Plus size={20} color="#EF4444" strokeWidth={2.5} />
                <Text style={styles.addTypeButtonText}>Add Other Type</Text>
              </Pressable>
            )}
          </View>
        </ScrollView>

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
    backgroundColor: '#FEF2F2',
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
    paddingTop: 32,
    paddingBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#FEF2F2',
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
    marginBottom: 24,
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
  addTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FEF2F2',
    borderStyle: 'dashed',
    backgroundColor: '#fff',
  },
  addTypeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
    marginLeft: 8,
  },
  addingContainer: {
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  addingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  addButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
});
