import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BackButton, ChipSelection } from '../../../components/onboarding';

const triggerOptions = [
    { value: 'cold', label: 'Cold Weather', icon: 'ac-unit' },
    { value: 'dehydration', label: 'Dehydration', icon: 'water-drop' },
    { value: 'stress', label: 'Stress', icon: 'psychology' },
    { value: 'infection', label: 'Infections', icon: 'coronavirus' },
    { value: 'exercise', label: 'Intense Exercise', icon: 'fitness-center' },
    { value: 'altitude', label: 'High Altitude', icon: 'landscape' },
    { value: 'sleep', label: 'Poor Sleep', icon: 'bedtime' },
    { value: 'alcohol', label: 'Alcohol', icon: 'local-bar' },
];

export default function TriggersScreen() {
    const [triggers, setTriggers] = useState<string[]>([]);

    const handleContinue = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // TODO: Save to profile
        router.push('/(onboarding)/overcomer/red-alert');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <LinearGradient
                colors={['#ffffff', '#FEF2F2', '#ffffff']}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <BackButton />
                    <View style={styles.stepIndicator}>
                        <Text style={styles.stepText}>Step 3 of 4</Text>
                    </View>
                    <Pressable onPress={() => router.replace('/(overcomer)')}>
                        <Text style={styles.skipText}>Skip</Text>
                    </Pressable>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: '75%' }]} />
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <AlertCircle size={32} color="#EF4444" />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>
                        Identify your{'\n'}
                        <Text style={styles.titleAccent}>crisis triggers</Text>
                    </Text>

                    <Text style={styles.subtitle}>
                        Knowing what sparks your pain helps us send timely reminders and preventative tips.
                    </Text>

                    {/* Triggers Selection */}
                    <View style={styles.inputSection}>
                        <ChipSelection
                            label="What typically triggers your crises?"
                            options={triggerOptions}
                            selectedValues={triggers}
                            onChange={setTriggers}
                            color="#EF4444"
                            maxSelections={5}
                        />
                    </View>
                </ScrollView>

                {/* Bottom CTA */}
                <View style={styles.bottomSection}>
                    <Pressable
                        onPress={handleContinue}
                        style={styles.primaryButton}
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
        backgroundColor: '#FEE2E2',
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
        backgroundColor: '#FEE2E2',
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
    buttonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
    },
});
