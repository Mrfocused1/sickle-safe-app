import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Target, PieChart, Users, TrendingUp } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingProgress from '../../../components/OnboardingProgress';
import { BackButton, SliderInput, ChipSelection } from '../../../components/onboarding';

const { width } = Dimensions.get('window');

const FOCUS_AREAS = [
    { value: 'research', label: 'Medical Research' },
    { value: 'support', label: 'Patient Support' },
    { value: 'awareness', label: 'Awareness' },
    { value: 'education', label: 'Education' },
    { value: 'emergency', label: 'Emergency Fund' },
];

export default function FundingGoalsScreen() {
    const [annualGoal, setAnnualGoal] = useState(100000);
    const [focusArea, setFocusArea] = useState<string[]>(['research']);
    const [beneficiaryCount, setBeneficiaryCount] = useState(500);

    const handleContinue = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/charity-onboarding/impact-areas');
    };

    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        return `$${(value / 1000).toFixed(0)}K`;
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <LinearGradient
                colors={['#ffffff', '#f8fafc', '#ffffff']}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <BackButton label="" />
                    <OnboardingProgress currentStep={2} totalSteps={4} variant="light" />
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>
                        Funding{'\n'}
                        <Text style={styles.titleAccent}>Objectives</Text>
                    </Text>

                    <Text style={styles.subtitle}>
                        Define your financial targets and how you plan to allocate resources.
                    </Text>

                    {/* Annual Goal Slider */}
                    <View style={styles.inputSection}>
                        <SliderInput
                            label="Annual Funding Goal"
                            min={10000}
                            max={10000000}
                            step={10000}
                            value={annualGoal}
                            onChange={setAnnualGoal}
                            color="#D97706"
                            labels={{ min: '$10K', max: '$10M+' }}
                        />
                        <View style={styles.goalDisplay}>
                            <Text style={styles.goalValue}>{formatCurrency(annualGoal)}</Text>
                            <Text style={styles.goalLabel}>Target for next 12 months</Text>
                        </View>
                    </View>

                    <View style={styles.spacing} />

                    {/* Focus Area Selection */}
                    <ChipSelection
                        label="Primary Focus Area"
                        options={FOCUS_AREAS}
                        selectedValues={focusArea}
                        onChange={setFocusArea}
                        color="#D97706"
                        maxSelections={1}
                    />

                    <View style={styles.spacing} />

                    {/* Beneficiary Target */}
                    <View style={styles.inputSection}>
                        <SliderInput
                            label="Target Beneficiaries"
                            min={10}
                            max={10000}
                            step={10}
                            value={beneficiaryCount}
                            onChange={setBeneficiaryCount}
                            color="#D97706"
                            labels={{ min: '10', max: '10K+' }}
                        />
                        <View style={styles.beneficiaryDisplay}>
                            <View className="flex-row items-center">
                                <Users size={20} color="#D97706" className="mr-2" />
                                <Text style={styles.beneficiaryValue}>{beneficiaryCount.toLocaleString()} people</Text>
                            </View>
                            <Text style={styles.beneficiaryLabel}>Estimated count of individuals to help</Text>
                        </View>
                    </View>

                    {/* Allocation Preview Card */}
                    <View style={styles.allocationCard}>
                        <View className="flex-row items-center mb-4">
                            <PieChart size={20} color="#D97706" className="mr-2" />
                            <Text style={styles.allocationTitle}>Resource Allocation Preview</Text>
                        </View>
                        <Text style={styles.allocationText}>
                            Based on your selection, approximately <Text style={styles.bold}>80%</Text> of funds will be prioritized for <Text style={styles.bold}>{FOCUS_AREAS.find(a => a.value === focusArea[0])?.label}</Text>.
                        </Text>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarFull, { width: '80%', backgroundColor: '#D97706' }]} />
                            <View style={[styles.progressBarFull, { width: '20%', backgroundColor: '#e2e8f0' }]} />
                        </View>
                    </View>
                </ScrollView>

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
    headerSpacer: {
        width: 48,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 24,
    },
    iconContainer: {
        display: 'none',
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
        color: '#D97706',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#6B7280',
        lineHeight: 24,
        marginBottom: 32,
    },
    inputSection: {
        marginBottom: 16,
    },
    goalDisplay: {
        alignItems: 'center',
        marginTop: -8,
    },
    goalValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#111827',
    },
    goalLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    beneficiaryDisplay: {
        alignItems: 'center',
        marginTop: -8,
    },
    beneficiaryValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
    },
    beneficiaryLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    spacing: {
        height: 24,
    },
    allocationCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        padding: 24,
        marginTop: 32,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    allocationTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },
    allocationText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 16,
    },
    bold: {
        fontWeight: '800',
        color: '#111827',
    },
    progressBarContainer: {
        height: 12,
        backgroundColor: '#F3F4F6',
        borderRadius: 6,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    progressBarFull: {
        height: '100%',
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    primaryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#D97706',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#D97706',
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
