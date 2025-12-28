import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BackButton, MultiSelection, CounterInput, TextInputField } from '../../../components/onboarding';
import { Plus } from 'lucide-react-native';

const initialRelationshipOptions = [
  {
    value: 'parent',
    label: 'Parent / Guardian',
    description: 'Caring for a child with SCD',
  },
  {
    value: 'spouse',
    label: 'Spouse / Partner',
    description: 'Supporting your significant other',
  },
  {
    value: 'sibling',
    label: 'Sibling / Family Member',
    description: 'Brother, sister, or extended family',
  },
  {
    value: 'friend',
    label: 'Friend',
    description: 'Supporting someone you care about',
  },
  {
    value: 'professional',
    label: 'Professional Caregiver',
    description: 'Nurse, aide, or healthcare worker',
  },
];

export default function RelationshipScreen() {
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([]);
  const [customRelationships, setCustomRelationships] = useState<{ value: string; label: string; description: string }[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRelationship, setNewRelationship] = useState('');
  const [lovedOnesCount, setLovedOnesCount] = useState(1);

  const relationshipOptions = [...initialRelationshipOptions, ...customRelationships];

  const handleAddRelationship = () => {
    if (newRelationship.trim()) {
      const value = newRelationship.toLowerCase().replace(/\s+/g, '-');
      const newOption = {
        value,
        label: newRelationship.trim(),
        description: 'Custom relationship type',
      };
      setCustomRelationships([...customRelationships, newOption]);
      setSelectedRelationships([...selectedRelationships, value]);
      setNewRelationship('');
      setIsAdding(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleContinue = () => {
    if (selectedRelationships.length > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      router.push({
        pathname: '/(onboarding)/helper/caring-for',
        params: { count: lovedOnesCount.toString() }
      });
    }
  };

  const isValid = selectedRelationships.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <LinearGradient
        colors={['#ffffff', '#ECFDF5', '#ffffff']}
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
          <Pressable onPress={() => router.replace('/(helper)')}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '33.3%' }]} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Users size={32} color="#10B981" />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Tell us about{'\n'}
            <Text style={styles.titleAccent}>your role</Text>
          </Text>

          <Text style={styles.subtitle}>
            This helps us personalize your caregiver experience and provide relevant support.
          </Text>

          {/* Relationship Selection */}
          <View style={styles.inputSection}>
            <MultiSelection
              label="What's your relationship?"
              options={relationshipOptions}
              selectedValues={selectedRelationships}
              onChange={setSelectedRelationships}
              color="#10B981"
            />

            {isAdding ? (
              <View style={styles.addingContainer}>
                <TextInputField
                  label="Other Relationship"
                  value={newRelationship}
                  onChange={setNewRelationship}
                  placeholder="e.g. Grandma, Coach, etc."
                  autoFocus
                  color="#10B981"
                />
                <View style={styles.addingActions}>
                  <Pressable
                    onPress={() => setIsAdding(false)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleAddRelationship}
                    disabled={!newRelationship.trim()}
                    style={[
                      styles.addButton,
                      !newRelationship.trim() && styles.addButtonDisabled
                    ]}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                onPress={() => setIsAdding(true)}
                style={styles.addOptionButton}
              >
                <Plus size={20} color="#10B981" strokeWidth={2.5} />
                <Text style={styles.addOptionButtonText}>Add Other Option</Text>
              </Pressable>
            )}
          </View>

          {/* Number of people */}
          <View style={styles.inputSection}>
            <CounterInput
              label="How many people do you care for?"
              value={lovedOnesCount}
              onChange={setLovedOnesCount}
              min={1}
              max={10}
              unit="person"
              color="#10B981"
            />
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
    marginBottom: 24,
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
  primaryButtonDisabled: {
    backgroundColor: '#D1D5DB',
    shadowOpacity: 0,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#ECFDF5',
    borderStyle: 'dashed',
    backgroundColor: '#fff',
  },
  addOptionButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10B981',
    marginLeft: 8,
  },
  addingContainer: {
    backgroundColor: '#ECFDF5',
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
    backgroundColor: '#10B981',
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
