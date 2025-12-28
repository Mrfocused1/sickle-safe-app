import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, TextInput, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { UserPlus, Check, Search, Loader2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BackButton } from '../../../components/onboarding';

type IdentifierType = 'name' | 'email' | 'phone';

export default function CaringForScreen() {
    const params = useLocalSearchParams();
    const count = parseInt(params.count as string) || 1;
    const [values, setValues] = useState<string[]>(Array(count).fill(''));
    const [identifierTypes, setIdentifierTypes] = useState<IdentifierType[]>(Array(count).fill('name'));
    const [isRequesting, setIsRequesting] = useState<boolean[]>(Array(count).fill(false));
    const [isRequested, setIsRequested] = useState<boolean[]>(Array(count).fill(false));

    const handleUpdateValue = (text: string, index: number) => {
        const newValues = [...values];
        newValues[index] = text;
        setValues(newValues);
    };

    const handleUpdateType = (type: IdentifierType, index: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newTypes = [...identifierTypes];
        newTypes[index] = type;
        setIdentifierTypes(newTypes);

        // Clear value when switching types for cleanliness
        const newValues = [...values];
        newValues[index] = '';
        setValues(newValues);
    };

    const handleSendRequest = async (index: number) => {
        if (!values[index].trim()) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        const newIsRequesting = [...isRequesting];
        newIsRequesting[index] = true;
        setIsRequesting(newIsRequesting);

        // Simulate API request to the overcomer
        await new Promise(resolve => setTimeout(resolve, 1500));

        const finalIsRequesting = [...newIsRequesting];
        finalIsRequesting[index] = false;
        setIsRequesting(finalIsRequesting);

        const newIsRequested = [...isRequested];
        newIsRequested[index] = true;
        setIsRequested(newIsRequested);

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const handleContinue = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/(onboarding)/helper/actionable-support');
    };

    const anyValueEntered = values.some(v => v.trim().length > 0);

    const getPlaceholder = (type: IdentifierType) => {
        switch (type) {
            case 'email': return 'caregiver@example.com';
            case 'phone': return '+1 (555) 000-0000';
            default: return 'Enter their full name';
        }
    };

    const getKeyboardType = (type: IdentifierType) => {
        switch (type) {
            case 'email': return 'email-address';
            case 'phone': return 'phone-pad';
            default: return 'default';
        }
    };

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
                        <Text style={styles.stepText}>Step 2 of 3</Text>
                    </View>
                    <Pressable onPress={() => router.replace('/(helper)')}>
                        <Text style={styles.skipText}>Skip</Text>
                    </Pressable>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressFill, { width: '66.6%' }]} />
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <UserPlus size={32} color="#10B981" />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>
                        Who are you{'\n'}
                        <Text style={styles.titleAccent}>caring for?</Text>
                    </Text>

                    <Text style={styles.subtitle}>
                        Choose how to identify the Overcomer. We'll send them a request to link your accounts.
                    </Text>

                    {/* Overcomer Inputs */}
                    <View style={styles.inputSection}>
                        {values.map((value, index) => (
                            <View key={index} style={styles.personCard}>
                                <Text style={styles.inputLabel}>Overcomer {index + 1} Info</Text>

                                {/* Type Selector */}
                                <View style={styles.typeSelector}>
                                    {(['name', 'email', 'phone'] as IdentifierType[]).map((type) => (
                                        <Pressable
                                            key={type}
                                            onPress={() => handleUpdateType(type, index)}
                                            style={[
                                                styles.typeButton,
                                                identifierTypes[index] === type && styles.typeButtonActive
                                            ]}
                                        >
                                            <Text style={[
                                                styles.typeButtonText,
                                                identifierTypes[index] === type && styles.typeButtonTextActive
                                            ]}>
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>

                                <View style={styles.inputRow}>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder={getPlaceholder(identifierTypes[index])}
                                        value={value}
                                        onChangeText={(text) => handleUpdateValue(text, index)}
                                        keyboardType={getKeyboardType(identifierTypes[index])}
                                        editable={!isRequested[index]}
                                        autoCapitalize={identifierTypes[index] === 'name' ? 'words' : 'none'}
                                    />
                                    <Pressable
                                        onPress={() => handleSendRequest(index)}
                                        disabled={!value.trim() || isRequesting[index] || isRequested[index]}
                                        style={[
                                            styles.requestButton,
                                            (!value.trim() || isRequesting[index]) && styles.requestButtonDisabled,
                                            isRequested[index] && styles.requestButtonSuccess
                                        ]}
                                    >
                                        {isRequesting[index] ? (
                                            <Loader2 size={20} color="#fff" style={styles.rotatingLoader} />
                                        ) : isRequested[index] ? (
                                            <Check size={18} color="#fff" />
                                        ) : (
                                            <Text style={styles.requestButtonText}>Request</Text>
                                        )}
                                    </Pressable>
                                </View>

                                {isRequested[index] && (
                                    <View style={styles.statusBadge}>
                                        <Text style={styles.statusText}>Request Sent</Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                            Once they accept your request, you'll be able to view their health logs, triggers, and receive crisis alerts in real-time.
                        </Text>
                    </View>
                </ScrollView>

                {/* Bottom CTA */}
                <View style={styles.bottomSection}>
                    <Pressable
                        onPress={handleContinue}
                        disabled={!anyValueEntered}
                        style={[
                            styles.primaryButton,
                            !anyValueEntered && styles.primaryButtonDisabled,
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
        paddingTop: 32,
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
        gap: 16,
    },
    personCard: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#F3F4F6',
        borderRadius: 24,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '800',
        color: '#374151',
        marginBottom: 12,
    },
    inputRow: {
        flexDirection: 'row',
        gap: 12,
    },
    typeSelector: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 4,
        marginBottom: 16,
    },
    typeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 8,
    },
    typeButtonActive: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    typeButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    typeButtonTextActive: {
        color: '#10B981',
    },
    textInput: {
        flex: 1,
        height: 56,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    rotatingLoader: {
        // Animation handled by component logic if needed, 
        // but style is required for prop
    },
    requestButton: {
        backgroundColor: '#111827',
        paddingHorizontal: 16,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 90,
    },
    requestButtonDisabled: {
        opacity: 0.5,
    },
    requestButtonSuccess: {
        backgroundColor: '#10B981',
    },
    requestButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '800',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        backgroundColor: '#ECFDF5',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#10B981',
    },
    infoBox: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 16,
        marginTop: 8,
    },
    infoText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
        lineHeight: 20,
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
});
