import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingProgress from '../../../components/OnboardingProgress';
import { BackButton } from '../../../components/onboarding';

const { width } = Dimensions.get('window');

export default function VerificationScreen() {
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    const handleFinish = () => {
        if (agreedToTerms && agreedToPrivacy) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setIsVerifying(true);

            // Simulate verification/setup
            setTimeout(() => {
                // In a real app, this would route to the charity dashboard
                // For now, we'll route to the overcomer as a final placeholder or just alert
                router.replace('/(charity)');
            }, 2000);
        }
    };

    const isReady = agreedToTerms && agreedToPrivacy;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <LinearGradient
                colors={['#ffffff', '#fffbeb', '#ffffff']}
                locations={[0, 0.5, 1]}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <BackButton label="" />
                    <OnboardingProgress currentStep={4} totalSteps={4} variant="light" />
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.iconContainer}>
                        <ShieldCheck size={32} color="#8B5CF6" />
                    </View>

                    <Text style={styles.title}>
                        Final{'\n'}
                        <Text style={styles.titleAccent}>Verification</Text>
                    </Text>

                    <Text style={styles.subtitle}>
                        Review our policies and agree to the terms to activate your organization profile.
                    </Text>

                    {/* Verification Status Card */}
                    <View style={styles.statusCard}>
                        <View style={styles.statusHeader}>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusBadgeText}>Pending Review</Text>
                            </View>
                            <FileText size={20} color="#D97706" />
                        </View>
                        <Text style={styles.statusTitle}>Organization Review</Text>
                        <Text style={styles.statusDescription}>
                            After submission, our team will review your organization's credentials to grant you the <Text style={styles.bold}>Verified Organization</Text> badge.
                        </Text>
                        <View style={styles.timeline}>
                            <View style={styles.timelineItem}>
                                <CheckCircle2 size={16} color="#D97706" />
                                <Text style={styles.timelineText}>Profile Information Submitted</Text>
                            </View>
                            <View style={styles.timelineLine} />
                            <View style={styles.timelineItem}>
                                <AlertCircle size={16} color="#9CA3AF" />
                                <Text style={[styles.timelineText, { color: '#9CA3AF' }]}>Credential Verification (24-48h)</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.spacing} />

                    {/* Agreements */}
                    <View style={styles.agreementSection}>
                        <View style={styles.agreementRow}>
                            <View style={styles.agreementTextContainer}>
                                <Text style={styles.agreementLabel}>Terms of Service</Text>
                                <Text style={styles.agreementSubtext}>I agree to the fundraising and platform usage terms.</Text>
                            </View>
                            <Switch
                                value={agreedToTerms}
                                onValueChange={setAgreedToTerms}
                                trackColor={{ false: '#E5E7EB', true: '#FDE68A' }}
                                thumbColor={agreedToTerms ? '#D97706' : '#F3F4F6'}
                            />
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.agreementRow}>
                            <View style={styles.agreementTextContainer}>
                                <Text style={styles.agreementLabel}>Privacy & Data Policy</Text>
                                <Text style={styles.agreementSubtext}>I acknowledge how beneficiary and organization data is handled.</Text>
                            </View>
                            <Switch
                                value={agreedToPrivacy}
                                onValueChange={setAgreedToPrivacy}
                                trackColor={{ false: '#E5E7EB', true: '#FDE68A' }}
                                thumbColor={agreedToPrivacy ? '#D97706' : '#F3F4F6'}
                            />
                        </View>
                    </View>

                    <View style={styles.noticeBox}>
                        <AlertCircle size={18} color="#D97706" className="mr-2" />
                        <Text style={styles.noticeText}>
                            By proceeding, you confirm you are an authorized representative of the organization.
                        </Text>
                    </View>
                </ScrollView>

                <View style={styles.bottomSection}>
                    <Pressable
                        onPress={handleFinish}
                        disabled={!isReady || isVerifying}
                        style={[
                            styles.primaryButton,
                            (!isReady || isVerifying) && styles.primaryButtonDisabled,
                        ]}
                    >
                        {isVerifying ? (
                            <Text style={styles.buttonText}>Initializing...</Text>
                        ) : (
                            <View className="flex-row items-center">
                                <Text style={styles.buttonText}>Complete Setup</Text>
                                <ArrowRight size={20} color="#fff" style={{ marginLeft: 8 }} />
                            </View>
                        )}
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
    statusCard: {
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 24,
        borderWidth: 2,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 3,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusBadge: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 100,
    },
    statusBadgeText: {
        fontSize: 10,
        fontWeight: '800',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    statusDescription: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 20,
    },
    bold: {
        fontWeight: '800',
        color: '#D97706',
    },
    timeline: {
        marginTop: 8,
    },
    timelineItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    timelineText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111827',
    },
    timelineLine: {
        width: 2,
        height: 16,
        backgroundColor: '#F3F4F6',
        marginLeft: 7,
        marginVertical: 4,
    },
    spacing: {
        height: 24,
    },
    agreementSection: {
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        padding: 8,
    },
    agreementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    agreementTextContainer: {
        flex: 1,
    },
    agreementLabel: {
        fontSize: 15,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 2,
    },
    agreementSubtext: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 16,
    },
    noticeBox: {
        flexDirection: 'row',
        backgroundColor: '#FFFBEB',
        padding: 16,
        borderRadius: 20,
        marginTop: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    noticeText: {
        flex: 1,
        fontSize: 13,
        color: '#D97706',
        fontWeight: '600',
        lineHeight: 18,
    },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    primaryButton: {
        flexDirection: 'row',
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
