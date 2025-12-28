import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Gift, Building2, Globe, Mail } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingProgress from '../../../components/OnboardingProgress';
import { TextInputField, BackButton, ChipSelection } from '../../../components/onboarding';

const { width } = Dimensions.get('window');

const ORG_TYPES = [
    { value: 'foundation', label: 'Foundation' },
    { value: 'nonprofit', label: 'Non-Profit' },
    { value: 'hospital', label: 'Hospital' },
    { value: 'research', label: 'Research Institute' },
    { value: 'corporate', label: 'Corporate Sponsor' },
];

export default function OrganizationInfoScreen() {
    const [orgName, setOrgName] = useState('');
    const [orgType, setOrgType] = useState<string[]>(['foundation']);
    const [mission, setMission] = useState('');
    const [website, setWebsite] = useState('');

    const handleContinue = () => {
        if (isValid) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            router.push('/charity-onboarding/funding-goals');
        }
    };

    const isValid = orgName.trim().length >= 1 && mission.trim().length >= 1;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <LinearGradient
                colors={['#ffffff', '#f8fafc', '#ffffff']}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.header}>
                        <BackButton label="" />
                        <OnboardingProgress currentStep={1} totalSteps={4} variant="light" />
                        <View style={styles.headerSpacer} />
                    </View>

                    <ScrollView
                        className="flex-1"
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.title}>
                            Organization{'\n'}
                            <Text style={styles.titleAccent}>Identity</Text>
                        </Text>

                        <Text style={styles.subtitle}>
                            Tell us about your organization and its mission to support the community.
                        </Text>

                        <View style={styles.inputSection}>
                            <TextInputField
                                label="Organization Name"
                                value={orgName}
                                onChange={setOrgName}
                                placeholder="e.g. Hope for Sickle Cell"
                                autoCapitalize="words"
                            />

                            <View style={styles.spacing} />

                            <ChipSelection
                                label="Organization Type"
                                options={ORG_TYPES}
                                selectedValues={orgType}
                                onChange={setOrgType}
                                color="#374151"
                                maxSelections={1}
                            />

                            <View style={styles.spacing} />

                            <TextInputField
                                label="Mission Statement"
                                value={mission}
                                onChange={setMission}
                                placeholder="What is your primary objective?"
                                multiline
                                numberOfLines={3}
                                maxLength={200}
                            />

                            <View style={styles.spacing} />

                            <TextInputField
                                label="Website (Optional)"
                                value={website}
                                onChange={setWebsite}
                                placeholder="https://yourorganization.org"
                                autoCapitalize="none"
                                keyboardType="url"
                            />
                        </View>
                    </ScrollView>

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
        color: '#374151',
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
    spacing: {
        height: 24,
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    primaryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#374151',
        paddingVertical: 16,
        borderRadius: 16,
        shadowColor: '#374151',
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
});
