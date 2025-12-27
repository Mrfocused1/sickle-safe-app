import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    Upload,
    ChevronRight,
    Calendar,
    Shield,
    Heart,
    Users,
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';

interface FormItem {
    id: string;
    title: string;
    description: string;
    status: 'completed' | 'pending' | 'required';
    dueDate?: string;
    icon: React.ReactNode;
    iconBg: string;
}

const FORMS: FormItem[] = [
    {
        id: '1',
        title: 'Volunteer Agreement',
        description: 'Annual volunteer commitment form',
        status: 'completed',
        icon: <FileText size={20} color="#10B981" />,
        iconBg: '#ecfdf5',
    },
    {
        id: '2',
        title: 'Background Check Consent',
        description: 'Required for working with patients',
        status: 'completed',
        icon: <Shield size={20} color="#10B981" />,
        iconBg: '#ecfdf5',
    },
    {
        id: '3',
        title: 'HIPAA Training Certificate',
        description: 'Health information privacy training',
        status: 'pending',
        dueDate: 'Due Jan 15, 2025',
        icon: <Heart size={20} color="#f59e0b" />,
        iconBg: '#fffbeb',
    },
    {
        id: '4',
        title: 'Emergency Contact Form',
        description: 'Personal emergency information',
        status: 'required',
        dueDate: 'Required',
        icon: <AlertCircle size={20} color="#ef4444" />,
        iconBg: '#fef2f2',
    },
    {
        id: '5',
        title: 'Event Liability Waiver',
        description: 'For in-person event participation',
        status: 'pending',
        dueDate: 'Before next event',
        icon: <Calendar size={20} color="#f59e0b" />,
        iconBg: '#fffbeb',
    },
    {
        id: '6',
        title: 'Photo/Media Release',
        description: 'Permission for promotional use',
        status: 'completed',
        icon: <Users size={20} color="#10B981" />,
        iconBg: '#ecfdf5',
    },
];

export default function VolunteerFormsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const completedCount = FORMS.filter(f => f.status === 'completed').length;
    const pendingCount = FORMS.filter(f => f.status === 'pending').length;
    const requiredCount = FORMS.filter(f => f.status === 'required').length;

    const handleFormPress = async (form: FormItem) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // In a real app, this would open the form or document
        if (form.status === 'completed') {
            alert(`View ${form.title}`);
        } else {
            alert(`Complete ${form.title}`);
        }
    };

    const getStatusBadge = (status: FormItem['status']) => {
        switch (status) {
            case 'completed':
                return (
                    <View style={[styles.badge, { backgroundColor: '#ecfdf5' }]}>
                        <CheckCircle2 size={12} color="#10B981" />
                        <Text style={[styles.badgeText, { color: '#10B981' }]}>Completed</Text>
                    </View>
                );
            case 'pending':
                return (
                    <View style={[styles.badge, { backgroundColor: '#fffbeb' }]}>
                        <Clock size={12} color="#f59e0b" />
                        <Text style={[styles.badgeText, { color: '#f59e0b' }]}>Pending</Text>
                    </View>
                );
            case 'required':
                return (
                    <View style={[styles.badge, { backgroundColor: '#fef2f2' }]}>
                        <AlertCircle size={12} color="#ef4444" />
                        <Text style={[styles.badgeText, { color: '#ef4444' }]}>Required</Text>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                    <View style={styles.headerTop}>
                        <Pressable
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <ArrowLeft size={20} color="#1f2937" />
                        </Pressable>
                        <Text style={styles.headerTitle}>Volunteer Forms</Text>
                        <View style={{ width: 40 }} />
                    </View>
                </View>

                {/* Stats Summary */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <View style={[styles.statIcon, { backgroundColor: '#ecfdf5' }]}>
                            <CheckCircle2 size={20} color="#10B981" />
                        </View>
                        <Text style={styles.statValue}>{completedCount}</Text>
                        <Text style={styles.statLabel}>Completed</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={[styles.statIcon, { backgroundColor: '#fffbeb' }]}>
                            <Clock size={20} color="#f59e0b" />
                        </View>
                        <Text style={styles.statValue}>{pendingCount}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <View style={[styles.statIcon, { backgroundColor: '#fef2f2' }]}>
                            <AlertCircle size={20} color="#ef4444" />
                        </View>
                        <Text style={styles.statValue}>{requiredCount}</Text>
                        <Text style={styles.statLabel}>Required</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <Pressable style={styles.actionButton}>
                        <Download size={18} color="#8B5CF6" />
                        <Text style={styles.actionText}>Download All</Text>
                    </Pressable>
                    <Pressable style={[styles.actionButton, { backgroundColor: '#8B5CF6' }]}>
                        <Upload size={18} color="#ffffff" />
                        <Text style={[styles.actionText, { color: '#ffffff' }]}>Upload Form</Text>
                    </Pressable>
                </View>

                {/* Required Forms */}
                {requiredCount > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Action Required</Text>
                        {FORMS.filter(f => f.status === 'required').map((form) => (
                            <Pressable
                                key={form.id}
                                style={styles.formCard}
                                onPress={() => handleFormPress(form)}
                            >
                                <View style={[styles.formIcon, { backgroundColor: form.iconBg }]}>
                                    {form.icon}
                                </View>
                                <View style={styles.formContent}>
                                    <Text style={styles.formTitle}>{form.title}</Text>
                                    <Text style={styles.formDescription}>{form.description}</Text>
                                    {form.dueDate && (
                                        <Text style={styles.dueDate}>{form.dueDate}</Text>
                                    )}
                                </View>
                                {getStatusBadge(form.status)}
                            </Pressable>
                        ))}
                    </View>
                )}

                {/* Pending Forms */}
                {pendingCount > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Pending</Text>
                        {FORMS.filter(f => f.status === 'pending').map((form) => (
                            <Pressable
                                key={form.id}
                                style={styles.formCard}
                                onPress={() => handleFormPress(form)}
                            >
                                <View style={[styles.formIcon, { backgroundColor: form.iconBg }]}>
                                    {form.icon}
                                </View>
                                <View style={styles.formContent}>
                                    <Text style={styles.formTitle}>{form.title}</Text>
                                    <Text style={styles.formDescription}>{form.description}</Text>
                                    {form.dueDate && (
                                        <Text style={styles.dueDate}>{form.dueDate}</Text>
                                    )}
                                </View>
                                {getStatusBadge(form.status)}
                            </Pressable>
                        ))}
                    </View>
                )}

                {/* Completed Forms */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Completed</Text>
                    {FORMS.filter(f => f.status === 'completed').map((form) => (
                        <Pressable
                            key={form.id}
                            style={styles.formCard}
                            onPress={() => handleFormPress(form)}
                        >
                            <View style={[styles.formIcon, { backgroundColor: form.iconBg }]}>
                                {form.icon}
                            </View>
                            <View style={styles.formContent}>
                                <Text style={styles.formTitle}>{form.title}</Text>
                                <Text style={styles.formDescription}>{form.description}</Text>
                            </View>
                            {getStatusBadge(form.status)}
                        </Pressable>
                    ))}
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <FileText size={20} color="#6366f1" />
                    <Text style={styles.infoText}>
                        All forms are securely stored and encrypted. Contact support if you need help completing any documents.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#111827',
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: '#f1f5f9',
        marginVertical: 8,
    },
    quickActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginTop: 16,
        gap: 12,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3e8ff',
        paddingVertical: 14,
        borderRadius: 14,
        gap: 8,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8B5CF6',
    },
    section: {
        paddingHorizontal: 20,
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 4,
    },
    formCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    formIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formContent: {
        flex: 1,
        marginLeft: 12,
    },
    formTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    formDescription: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 2,
    },
    dueDate: {
        fontSize: 11,
        color: '#ef4444',
        fontWeight: '600',
        marginTop: 4,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#eef2ff',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 24,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#4338ca',
        marginLeft: 12,
        lineHeight: 18,
    },
});
