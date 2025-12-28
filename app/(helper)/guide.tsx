import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ChevronLeft,
    BookOpen,
    FileText,
    AlertCircle,
    Phone,
    Heart,
    Shield,
    School,
    Download
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const GUIDE_SECTIONS = [
    {
        title: 'Emergency Protocols',
        icon: AlertCircle,
        color: '#ef4444',
        items: [
            'Recognizing Pain Crisis',
            'When to go to the ER',
            'Temperature Monitoring',
            'Hydration Emergency Plan'
        ]
    },
    {
        title: 'School Support',
        icon: School,
        color: '#3b82f6',
        items: [
            '504 Plan Template',
            'Letter to Teachers',
            'Physical Activity Limits',
            'Bathroom & Water Access'
        ]
    },
    {
        title: 'Daily Care',
        icon: Heart,
        color: '#ec4899',
        items: [
            'Medication Scheduling',
            'Nutrition & Supplements',
            'Sleep Hygiene',
            'Pain Management at Home'
        ]
    },
    {
        title: 'Legal Resource',
        icon: Shield,
        color: '#8b5cf6',
        items: [
            'Caregiver Rights',
            'Insurance Navigation',
            'Medical Records Storage',
            'Crisis Documentation'
        ]
    }
];

export default function GuideScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const handleAction = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
            >
                {/* Minimal Light Hero Section */}
                <LinearGradient
                    colors={['#f8fafc', '#ffffff']}
                    style={[styles.header, { paddingTop: insets.top + 20 }]}
                >
                    <View style={styles.headerTop}>
                        <Pressable
                            onPress={() => {
                                handleAction();
                                router.back();
                            }}
                            style={styles.backButton}
                        >
                            <ChevronLeft size={24} color="#1e3a8a" />
                        </Pressable>
                    </View>

                    <View style={styles.heroContent}>
                        <Text style={styles.title}>Caregiver Guide</Text>
                        <Text style={styles.subtitle}>Essential protocols, school forms, and daily wellness management for sickle cell caregivers.</Text>

                        <View style={styles.minimalStats}>
                            <View style={[styles.miniBadge, { backgroundColor: '#eff6ff' }]}>
                                <Shield size={12} color="#3b82f6" />
                                <Text style={[styles.miniBadgeText, { color: '#3b82f6' }]}>Verified</Text>
                            </View>
                            <View style={[styles.miniBadge, { backgroundColor: '#f8fafc' }]}>
                                <FileText size={12} color="#64748b" />
                                <Text style={[styles.miniBadgeText, { color: '#64748b' }]}>16 Resources</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    {GUIDE_SECTIONS.map((section, idx) => (
                        <View key={idx} style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <View style={[styles.sectionIcon, { backgroundColor: `${section.color}15` }]}>
                                    <section.icon size={22} color={section.color} />
                                </View>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                            </View>

                            <View style={styles.itemsContainer}>
                                {section.items.map((item, itemIdx) => (
                                    <Pressable
                                        key={itemIdx}
                                        style={styles.itemRow}
                                        onPress={() => {
                                            handleAction();
                                            Alert.alert(item, "Opening resource details...");
                                        }}
                                    >
                                        <View style={styles.itemBullet} />
                                        <Text style={styles.itemText}>{item}</Text>
                                        <FileText size={16} color="#94a3b8" />
                                    </Pressable>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Download Section */}
                    <Pressable
                        style={styles.downloadCard}
                        onPress={() => {
                            handleAction();
                            Alert.alert("Download", "Full guide is being downloaded to your device.");
                        }}
                    >
                        <LinearGradient
                            colors={['#1e3a8a', '#1e40af']}
                            style={styles.downloadGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <View style={styles.downloadInfo}>
                                <Text style={styles.downloadTitle}>Full PDF Version</Text>
                                <Text style={styles.downloadSubtitle}>Download for offline access</Text>
                            </View>
                            <Download size={24} color="#ffffff" />
                        </LinearGradient>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#1e3a8a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    heroContent: {
        marginTop: 10,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#1e3a8a',
        letterSpacing: -1.5,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#64748b',
        marginTop: 12,
        lineHeight: 24,
        maxWidth: '95%',
    },
    minimalStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 24,
        gap: 10,
    },
    miniBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 6,
    },
    miniBadgeText: {
        fontSize: 12,
        fontWeight: '800',
    },
    content: {
        paddingHorizontal: 24,
        marginTop: 20,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
    },
    itemsContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 24,
        padding: 8,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    itemBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#cbd5e1',
        marginRight: 12,
    },
    itemText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#475569',
    },
    downloadCard: {
        marginTop: 10,
        marginBottom: 40,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#1e3a8a',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    downloadGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
    },
    downloadInfo: {
        flex: 1,
    },
    downloadTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#ffffff',
    },
    downloadSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 2,
    }
});
