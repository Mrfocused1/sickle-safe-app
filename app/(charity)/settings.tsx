import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
    Building2,
    Users,
    Bell,
    Lock,
    CreditCard,
    FileText,
    HelpCircle,
    LogOut,
    ChevronRight,
    Mail,
    Globe,
    Shield
} from 'lucide-react-native';

export default function SettingsScreen() {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);

    const settingsSections = [
        {
            title: 'Organization',
            items: [
                { icon: Building2, label: 'Organization Profile', subtitle: 'Update your charity details', action: 'profile' },
                { icon: Users, label: 'Team Members', subtitle: '5 active members', action: 'team' },
                { icon: Shield, label: 'Verification Status', subtitle: 'Verified Organization', action: 'verification' },
            ]
        },
        {
            title: 'Account',
            items: [
                { icon: Mail, label: 'Email Preferences', subtitle: 'Manage email settings', action: 'email' },
                { icon: Bell, label: 'Notifications', subtitle: 'Configure alerts', action: 'notifications' },
                { icon: Lock, label: 'Privacy & Security', subtitle: 'Manage your security', action: 'security' },
            ]
        },
        {
            title: 'Billing',
            items: [
                { icon: CreditCard, label: 'Payment Methods', subtitle: 'Manage payment options', action: 'payment' },
                { icon: FileText, label: 'Billing History', subtitle: 'View past transactions', action: 'billing' },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: HelpCircle, label: 'Help Center', subtitle: 'Get support', action: 'help' },
                { icon: Globe, label: 'Terms & Privacy', subtitle: 'Legal information', action: 'legal' },
            ]
        }
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Settings</Text>
                        <Text style={styles.headerSubtitle}>Manage your profile and team</Text>
                    </View>
                </View>

                {/* Organization Card */}
                <View style={styles.orgCard}>
                    <View style={styles.orgAvatar}>
                        <Building2 size={24} color="#374151" />
                    </View>
                    <View style={styles.orgInfo}>
                        <Text style={styles.orgName}>Hope Foundation</Text>
                        <Text style={styles.orgEmail}>contact@hopefoundation.org</Text>
                    </View>
                    <View style={styles.verifiedBadge}>
                        <Shield size={14} color="#10B981" />
                    </View>
                </View>

                {/* Settings List */}
                <ScrollView
                    style={styles.settingsList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.settingsContent}
                >
                    {settingsSections.map((section, sectionIndex) => (
                        <View key={sectionIndex} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <View style={styles.sectionCard}>
                                {section.items.map((item, itemIndex) => (
                                    <View key={itemIndex}>
                                        <Pressable style={styles.settingItem}>
                                            <View style={styles.settingIconContainer}>
                                                <item.icon size={20} color="#374151" />
                                            </View>
                                            <View style={styles.settingContent}>
                                                <Text style={styles.settingLabel}>{item.label}</Text>
                                                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                                            </View>
                                            <ChevronRight size={20} color="#9CA3AF" />
                                        </Pressable>
                                        {itemIndex < section.items.length - 1 && (
                                            <View style={styles.divider} />
                                        )}
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* Quick Toggles */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quick Settings</Text>
                        <View style={styles.sectionCard}>
                            <View style={styles.toggleItem}>
                                <View style={styles.toggleLeft}>
                                    <View style={styles.settingIconContainer}>
                                        <Mail size={20} color="#374151" />
                                    </View>
                                    <View style={styles.settingContent}>
                                        <Text style={styles.settingLabel}>Email Notifications</Text>
                                        <Text style={styles.settingSubtitle}>Receive updates via email</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={emailNotifications}
                                    onValueChange={setEmailNotifications}
                                    trackColor={{ false: '#E5E7EB', true: '#D1D5DB' }}
                                    thumbColor={emailNotifications ? '#374151' : '#F3F4F6'}
                                />
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.toggleItem}>
                                <View style={styles.toggleLeft}>
                                    <View style={styles.settingIconContainer}>
                                        <Bell size={20} color="#374151" />
                                    </View>
                                    <View style={styles.settingContent}>
                                        <Text style={styles.settingLabel}>Push Notifications</Text>
                                        <Text style={styles.settingSubtitle}>Get mobile alerts</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={pushNotifications}
                                    onValueChange={setPushNotifications}
                                    trackColor={{ false: '#E5E7EB', true: '#D1D5DB' }}
                                    thumbColor={pushNotifications ? '#374151' : '#F3F4F6'}
                                />
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.toggleItem}>
                                <View style={styles.toggleLeft}>
                                    <View style={styles.settingIconContainer}>
                                        <Lock size={20} color="#374151" />
                                    </View>
                                    <View style={styles.settingContent}>
                                        <Text style={styles.settingLabel}>Two-Factor Authentication</Text>
                                        <Text style={styles.settingSubtitle}>Extra security layer</Text>
                                    </View>
                                </View>
                                <Switch
                                    value={twoFactorAuth}
                                    onValueChange={setTwoFactorAuth}
                                    trackColor={{ false: '#E5E7EB', true: '#D1D5DB' }}
                                    thumbColor={twoFactorAuth ? '#374151' : '#F3F4F6'}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Logout Button */}
                    <Pressable style={styles.logoutButton}>
                        <LogOut size={20} color="#DC2626" />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </Pressable>

                    {/* Version */}
                    <Text style={styles.versionText}>Version 1.0.0</Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    orgCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        marginHorizontal: 24,
        padding: 16,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    orgAvatar: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    orgInfo: {
        flex: 1,
    },
    orgName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 2,
    },
    orgEmail: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    verifiedBadge: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#D1FAE5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingsList: {
        flex: 1,
    },
    settingsContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#6B7280',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
    },
    sectionCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    settingIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    settingContent: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    settingSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 68,
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    toggleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FEF2F2',
        padding: 16,
        borderRadius: 16,
        marginTop: 8,
        gap: 8,
    },
    logoutText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#DC2626',
    },
    versionText: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 24,
    },
});
