import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    Pressable,
    StyleSheet,
    Dimensions,
    Animated,
    Image,
    ScrollView,
    Alert,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MessageCircle, Phone, Video, MoreHorizontal, X, MapPin, Clock, ShieldCheck } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface UserProfileSheetProps {
    visible: boolean;
    onClose: () => void;
    member: {
        id: string;
        name: string;
        role: string;
        isOnline: boolean;
        avatar?: string;
        bio?: string;
        location?: string;
        joinedDate?: string;
    } | null;
}

export function UserProfileSheet({ visible, onClose, member }: UserProfileSheetProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(0);
            slideAnim.setValue(SCREEN_HEIGHT);
        }
    }, [visible]);

    const handleAction = (type: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
            `${type}`,
            `This feature will allow you to ${type.toLowerCase()} directly with ${member?.name}. Coming soon in the next update!`,
            [{ text: 'Great!', style: 'default' }]
        );
    };

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    if (!member) return null;

    const initials = member.name.split(' ').map(n => n[0]).join('');

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    </Pressable>
                </Animated.View>

                <Animated.View
                    style={[
                        styles.sheet,
                        { transform: [{ translateY: slideAnim }] }
                    ]}
                >
                    <View style={styles.handleContainer}>
                        <View style={styles.handle} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        {/* Header Info */}
                        <View style={styles.header}>
                            <View style={styles.avatarWrapper}>
                                <View style={styles.avatarMain}>
                                    <Text style={styles.avatarText}>{initials}</Text>
                                    {member.isOnline && <View style={styles.onlineBadge} />}
                                </View>
                            </View>

                            <Text style={styles.nameText}>{member.name}</Text>
                            <View style={styles.roleBadge}>
                                <ShieldCheck size={14} color="#3b82f6" style={{ marginRight: 4, marginTop: 2 }} />
                                <Text style={styles.roleText}>{member.role}</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionRow}>
                            <Pressable
                                style={({ pressed }) => [styles.actionButton, pressed && { scale: 0.95, opacity: 0.8 }]}
                                onPress={() => handleAction('Chat')}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: '#eff6ff' }]}>
                                    <MessageCircle size={22} color="#3b82f6" />
                                </View>
                                <Text style={styles.actionLabel}>Chat</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [styles.actionButton, pressed && { scale: 0.95, opacity: 0.8 }]}
                                onPress={() => handleAction('Voice Call')}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: '#f0fdf4' }]}>
                                    <Phone size={22} color="#10b981" />
                                </View>
                                <Text style={styles.actionLabel}>Call</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [styles.actionButton, pressed && { scale: 0.95, opacity: 0.8 }]}
                                onPress={() => handleAction('Video Call')}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: '#fdf2f8' }]}>
                                    <Video size={22} color="#ec4899" />
                                </View>
                                <Text style={styles.actionLabel}>Video</Text>
                            </Pressable>
                            <Pressable
                                style={({ pressed }) => [styles.actionButton, pressed && { scale: 0.95, opacity: 0.8 }]}
                                onPress={() => handleAction('Manage Contact')}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: '#f8fafc' }]}>
                                    <MoreHorizontal size={22} color="#64748b" />
                                </View>
                                <Text style={styles.actionLabel}>More</Text>
                            </Pressable>
                        </View>

                        {/* About Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About</Text>
                            <Text style={styles.bioText}>
                                {member.bio || "Dedicated member supporting the Sickle Safe community. Always here to help and share experiences."}
                            </Text>
                        </View>

                        {/* Details List */}
                        <View style={styles.detailsContainer}>
                            <View style={styles.detailItem}>
                                <MapPin size={18} color="#94a3b8" style={{ marginTop: 3 }} />
                                <Text style={styles.detailText}>{member.location || 'London, UK'}</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Clock size={18} color="#94a3b8" style={{ marginTop: 3 }} />
                                <Text style={styles.detailText}>Joined {member.joinedDate || 'March 2024'}</Text>
                            </View>
                        </View>

                        <View style={{ height: 60 }} />
                    </ScrollView>

                    <Pressable
                        style={({ pressed }) => [styles.closeButton, pressed && { scale: 0.9, backgroundColor: '#f1f5f9' }]}
                        onPress={handleClose}
                    >
                        <X size={20} color="#64748b" />
                    </Pressable>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: SCREEN_HEIGHT * 0.75,
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
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarWrapper: {
        marginBottom: 16,
    },
    avatarMain: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#eff6ff',
        borderWidth: 3,
        borderColor: '#3b82f6',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    avatarText: {
        fontSize: 32,
        fontWeight: '800',
        color: '#3b82f6',
    },
    onlineBadge: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#10b981',
        borderWidth: 3,
        borderColor: '#fff',
    },
    nameText: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 6,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eff6ff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    roleText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3b82f6',
        includeFontPadding: false,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    actionButton: {
        alignItems: 'center',
        width: (Dimensions.get('window').width - 48) / 4,
    },
    actionIcon: {
        width: 54,
        height: 54,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    actionLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
        includeFontPadding: false,
        lineHeight: 16,
        textAlign: 'center',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 12,
        marginLeft: 2,
    },
    bioText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#475569',
        fontWeight: '500',
    },
    detailsContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 24,
        padding: 20,
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    detailText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#64748b',
        includeFontPadding: false,
        lineHeight: 18,
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 24,
        width: 36,
        height: 36,
        backgroundColor: '#f8fafc',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
});
