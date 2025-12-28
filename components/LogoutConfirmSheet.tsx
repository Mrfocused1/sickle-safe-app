import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    Modal,
    Animated,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { LogOut, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LogoutConfirmSheetProps {
    visible: boolean;
    onClose: () => void;
}

export function LogoutConfirmSheet({ visible, onClose }: LogoutConfirmSheetProps) {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const router = useRouter();

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

    const handleLogout = async () => {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        handleClose();
        // Navigate to onboarding/welcome after a short delay
        setTimeout(() => {
            router.replace('/(onboarding)/welcome');
        }, 300);
    };

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

                    {/* Content */}
                    <View style={styles.content}>
                        {/* Icon */}
                        <View style={styles.iconContainer}>
                            <LogOut size={32} color="#ef4444" />
                        </View>

                        <Text style={styles.title}>Log Out?</Text>
                        <Text style={styles.subtitle}>
                            You'll need to sign in again to access your health data and receive crisis alerts.
                        </Text>

                        {/* Warning */}
                        <View style={styles.warningCard}>
                            <Text style={styles.warningText}>
                                Your circle of care will not be notified of emergencies while logged out.
                            </Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            <Pressable
                                style={styles.cancelButton}
                                onPress={handleClose}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </Pressable>

                            <Pressable
                                style={styles.logoutButton}
                                onPress={handleLogout}
                            >
                                <LogOut size={18} color="#ffffff" />
                                <Text style={styles.logoutText}>Log Out</Text>
                            </Pressable>
                        </View>
                    </View>
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
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    iconContainer: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#fef2f2',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 20,
    },
    warningCard: {
        backgroundColor: '#fef3c7',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        width: '100%',
    },
    warningText: {
        fontSize: 13,
        color: '#92400e',
        textAlign: 'center',
        lineHeight: 18,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#64748b',
    },
    logoutButton: {
        flex: 1,
        backgroundColor: '#ef4444',
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    logoutText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#ffffff',
    },
});
