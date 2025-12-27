import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    Modal,
    Animated,
    Dimensions,
    ScrollView,
    Switch,
    StyleSheet,
} from 'react-native';
import {
    X,
    Bell,
    MapPin,
    Shield,
    Clock,
    Users,
    AlertTriangle,
    ChevronRight,
    Phone,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CircleSettingsSheetProps {
    visible: boolean;
    onClose: () => void;
}

export function CircleSettingsSheet({ visible, onClose }: CircleSettingsSheetProps) {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    // Settings state
    const [locationSharing, setLocationSharing] = useState(true);
    const [crisisAlerts, setCrisisAlerts] = useState(true);
    const [dailyUpdates, setDailyUpdates] = useState(false);
    const [autoCall, setAutoCall] = useState(true);
    const [shareHealthData, setShareHealthData] = useState(true);

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }).start();
        } else {
            slideAnim.setValue(SCREEN_HEIGHT);
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    const handleToggle = async (setter: (val: boolean) => void, value: boolean) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setter(!value);
    };

    const SettingRow = ({
        icon,
        iconColor,
        iconBg,
        title,
        subtitle,
        value,
        onToggle
    }: {
        icon: React.ReactNode;
        iconColor: string;
        iconBg: string;
        title: string;
        subtitle: string;
        value: boolean;
        onToggle: () => void;
    }) => (
        <View style={styles.settingRow}>
            <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
                {icon}
            </View>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.settingSubtitle}>{subtitle}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#e2e8f0', true: '#8B5CF6' }}
                thumbColor="#ffffff"
                ios_backgroundColor="#e2e8f0"
            />
        </View>
    );

    const ActionRow = ({
        icon,
        iconColor,
        iconBg,
        title,
        subtitle,
        onPress
    }: {
        icon: React.ReactNode;
        iconColor: string;
        iconBg: string;
        title: string;
        subtitle: string;
        onPress: () => void;
    }) => (
        <Pressable style={styles.actionRow} onPress={onPress}>
            <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
                {icon}
            </View>
            <View style={styles.settingContent}>
                <Text style={styles.settingTitle}>{title}</Text>
                <Text style={styles.settingSubtitle}>{subtitle}</Text>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
        </Pressable>
    );

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={handleClose} />

                <Animated.View
                    style={[
                        styles.sheet,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    {/* Handle */}
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Circle Settings</Text>
                        <Pressable onPress={handleClose} style={styles.closeButton}>
                            <X size={18} color="#6b7280" />
                        </Pressable>
                    </View>

                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        {/* Alert Preferences */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Alert Preferences</Text>

                            <SettingRow
                                icon={<AlertTriangle size={20} color="#ef4444" />}
                                iconColor="#ef4444"
                                iconBg="#fef2f2"
                                title="Crisis Alerts"
                                subtitle="Notify circle during emergencies"
                                value={crisisAlerts}
                                onToggle={() => handleToggle(setCrisisAlerts, crisisAlerts)}
                            />

                            <SettingRow
                                icon={<Bell size={20} color="#8B5CF6" />}
                                iconColor="#8B5CF6"
                                iconBg="#f3e8ff"
                                title="Daily Updates"
                                subtitle="Share daily wellness summary"
                                value={dailyUpdates}
                                onToggle={() => handleToggle(setDailyUpdates, dailyUpdates)}
                            />

                            <SettingRow
                                icon={<Phone size={20} color="#10B981" />}
                                iconColor="#10B981"
                                iconBg="#ecfdf5"
                                title="Auto-Call Primary"
                                subtitle="Call primary contact in crisis"
                                value={autoCall}
                                onToggle={() => handleToggle(setAutoCall, autoCall)}
                            />
                        </View>

                        {/* Privacy Settings */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Privacy & Sharing</Text>

                            <SettingRow
                                icon={<MapPin size={20} color="#3B82F6" />}
                                iconColor="#3B82F6"
                                iconBg="#eff6ff"
                                title="Location Sharing"
                                subtitle="Share location during crisis"
                                value={locationSharing}
                                onToggle={() => handleToggle(setLocationSharing, locationSharing)}
                            />

                            <SettingRow
                                icon={<Shield size={20} color="#f59e0b" />}
                                iconColor="#f59e0b"
                                iconBg="#fffbeb"
                                title="Health Data Sharing"
                                subtitle="Share vitals with care team"
                                value={shareHealthData}
                                onToggle={() => handleToggle(setShareHealthData, shareHealthData)}
                            />
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Manage Circle</Text>

                            <ActionRow
                                icon={<Users size={20} color="#8B5CF6" />}
                                iconColor="#8B5CF6"
                                iconBg="#f3e8ff"
                                title="Member Permissions"
                                subtitle="Control who sees what"
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                            />

                            <ActionRow
                                icon={<Clock size={20} color="#6366f1" />}
                                iconColor="#6366f1"
                                iconBg="#eef2ff"
                                title="Quiet Hours"
                                subtitle="Set do not disturb times"
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                            />
                        </View>

                        {/* Info Card */}
                        <View style={styles.infoCard}>
                            <Shield size={20} color="#8B5CF6" />
                            <Text style={styles.infoText}>
                                Your circle members only receive information you've explicitly shared.
                                All data is encrypted end-to-end.
                            </Text>
                        </View>
                    </ScrollView>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    sheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: SCREEN_HEIGHT * 0.85,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    handleContainer: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    closeButton: {
        width: 32,
        height: 32,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        maxHeight: SCREEN_HEIGHT * 0.7,
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 16,
        padding: 16,
        marginBottom: 8,
    },
    settingIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    settingContent: {
        flex: 1,
        marginLeft: 12,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
    },
    settingSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748b',
        marginTop: 2,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f3e8ff',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 20,
        marginTop: 20,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#6d28d9',
        marginLeft: 12,
        lineHeight: 18,
    },
});
