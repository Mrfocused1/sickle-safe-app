import React, { useState } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Map, Heart, Share2, Globe, ShieldCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import OnboardingProgress from '../../../components/OnboardingProgress';
import { BackButton, ChipSelection } from '../../../components/onboarding';

const { width } = Dimensions.get('window');

const IMPACT_CATEGORIES = [
    { value: 'research', label: 'Medical Research' },
    { value: 'financial', label: 'Financial Aid' },
    { value: 'education', label: 'Educational Tools' },
    { value: 'crisis', label: 'Crisis Support' },
    { value: 'awareness', label: 'Public Awareness' },
    { value: 'advocacy', label: 'Policy Advocacy' },
    { value: 'wellbeing', label: 'Mental Wellbeing' },
    { value: 'transport', label: 'Transport Aid' },
];

const GEOGRAPHIC_FOCUS = [
    { value: 'local', label: 'Local City' },
    { value: 'regional', label: 'Regional' },
    { value: 'national', label: 'National' },
    { value: 'global', label: 'Global Impact' },
];

const PARTNER_PREFERENCES = [
    { value: 'hospitals', label: 'Hospitals' },
    { value: 'universities', label: 'Universities' },
    { value: 'charities', label: 'Other Charities' },
    { value: 'government', label: 'Gov Bodies' },
];

export default function ImpactAreasScreen() {
    const [categories, setCategories] = useState<string[]>(['research', 'financial']);
    const [geoFocus, setGeoFocus] = useState<string[]>(['regional']);
    const [partners, setPartners] = useState<string[]>(['hospitals']);

    const handleContinue = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/charity-onboarding/verification');
    };

    const isValid = categories.length > 0 && geoFocus.length > 0;

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
                    <OnboardingProgress currentStep={3} totalSteps={4} variant="light" />
                    <View style={styles.headerSpacer} />
                </View>

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={styles.title}>
                        Impact{'\n'}
                        <Text style={styles.titleAccent}>Reach</Text>
                    </Text>

                    <Text style={styles.subtitle}>
                        Determine where your organization will operate and who you'll partner with.
                    </Text>

                    {/* Impact Categories */}
                    <ChipSelection
                        label="Key Impact Areas"
                        options={IMPACT_CATEGORIES}
                        selectedValues={categories}
                        onChange={setCategories}
                        color="#D97706"
                        maxSelections={4}
                    />

                    <View style={styles.spacing} />

                    {/* Geographic Focus */}
                    <ChipSelection
                        label="Geographic Focus"
                        options={GEOGRAPHIC_FOCUS}
                        selectedValues={geoFocus}
                        onChange={setGeoFocus}
                        color="#D97706"
                        maxSelections={1}
                    />

                    <View style={styles.spacing} />

                    {/* Partner Preferences */}
                    <ChipSelection
                        label="Partner Preferences"
                        options={PARTNER_PREFERENCES}
                        selectedValues={partners}
                        onChange={setPartners}
                        color="#D97706"
                        maxSelections={3}
                    />

                    {/* Impact Summary Card */}
                    <View style={styles.infoCard}>
                        <View className="flex-row items-center mb-3">
                            <ShieldCheck size={20} color="#D97706" className="mr-2" />
                            <Text style={styles.infoTitle}>Network Strategy</Text>
                        </View>
                        <Text style={styles.infoText}>
                            By selecting these areas, we'll suggest partnerships and highlight relevant community needs in your <Text style={styles.bold}>{geoFocus[0]}</Text> region.
                        </Text>
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
    spacing: {
        height: 24,
    },
    infoCard: {
        backgroundColor: '#FEF3C7',
        borderRadius: 24,
        padding: 24,
        marginTop: 32,
        borderWidth: 1,
        borderColor: '#FCD34D',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },
    infoText: {
        fontSize: 14,
        color: '#D97706',
        lineHeight: 20,
        fontWeight: '500',
    },
    bold: {
        fontWeight: '800',
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
