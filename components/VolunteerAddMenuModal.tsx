import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { CountUp, AnimatedProgress } from './SummaryAnimations';

const { width, height } = Dimensions.get('window');

interface AddMenuModalProps {
    visible: boolean;
    onClose: () => void;
    fabRotation: Animated.Value;
}

export default function VolunteerAddMenuModal({ visible, onClose, fabRotation }: AddMenuModalProps) {
    const scaleAnim1 = useRef(new Animated.Value(0)).current;
    const scaleAnim2 = useRef(new Animated.Value(0)).current;
    const scaleAnim4 = useRef(new Animated.Value(0)).current;
    const backdropOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            // Animate in
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();

            // Animate menu items immediately with stagger
            Animated.stagger(80, [
                Animated.spring(scaleAnim1, {
                    toValue: 1,
                    tension: 100,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim2, {
                    toValue: 1,
                    tension: 100,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.spring(scaleAnim4, {
                    toValue: 1,
                    tension: 100,
                    friction: 7,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // Reset animations
            backdropOpacity.setValue(0);
            scaleAnim1.setValue(0);
            scaleAnim2.setValue(0);
            scaleAnim4.setValue(0);
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(backdropOpacity, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim1, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim2, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim4, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    if (!visible) return null;

    const rotation = fabRotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    return (
        <Animated.View style={[styles.container, { opacity: backdropOpacity }]} pointerEvents={visible ? 'auto' : 'none'}>
            {/* Blurred Background */}
            <View style={styles.blurContainer}>
                <BlurView intensity={32} tint="light" style={StyleSheet.absoluteFill} />
            </View>

            {/* At a Glance Summary - iOS Dashboard Style */}
            <Animated.View
                style={[
                    styles.summaryContainer,
                    {
                        opacity: backdropOpacity,
                        transform: [{
                            translateY: backdropOpacity.interpolate({
                                inputRange: [0, 1],
                                outputRange: [40, 0]
                            })
                        }]
                    }
                ]}
            >
                <View style={styles.headerRow}>
                    <Text style={styles.greetingText}>Hello, Volunteer</Text>
                    <Text style={styles.dateText}>Friday, December 26</Text>
                </View>

                <View style={styles.widgetContainer}>
                    {/* Hero Widget - Volunteer Hours */}
                    <View style={[styles.widget, styles.heroWidget]}>
                        <View style={styles.widgetHeader}>
                            <View style={[styles.inlineIcon, { backgroundColor: '#F0F9FF' }]}>
                                <Feather name="clock" size={14} color="#0EA5E9" />
                            </View>
                            <Text style={styles.widgetTitle}>Community Impact</Text>
                        </View>
                        <View style={styles.heroContent}>
                            <CountUp to={24.5} suffix="" decimals={1} style={styles.heroValue} />
                            <AnimatedProgress progress={0.7} color="#0EA5E9" delay={400} />
                            <Text style={styles.heroSubtext}>Total Service Hours</Text>
                        </View>
                    </View>

                    {/* Secondary Metrics Row */}
                    <View style={styles.sideBySideRow}>
                        <View style={[styles.widget, styles.smallWidget]}>
                            <View style={styles.widgetHeader}>
                                <View style={[styles.inlineIcon, { backgroundColor: '#F5F3FF' }]}>
                                    <Feather name="users" size={12} color="#8B5CF6" />
                                </View>
                                <Text style={styles.smallWidgetTitle}>Missions</Text>
                            </View>
                            <CountUp to={12} suffix="" style={styles.smallWidgetValue} />
                            <Text style={styles.smallWidgetSubtext}>Completed</Text>
                        </View>

                        <View style={[styles.widget, styles.smallWidget]}>
                            <View style={styles.widgetHeader}>
                                <View style={[styles.inlineIcon, { backgroundColor: '#FFF7ED' }]}>
                                    <Feather name="star" size={12} color="#F97316" />
                                </View>
                                <Text style={styles.smallWidgetTitle}>Points</Text>
                            </View>
                            <CountUp to={850} suffix="" style={styles.smallWidgetValue} />
                            <Text style={styles.smallWidgetSubtext}>Karma earned</Text>
                        </View>
                    </View>
                </View>
            </Animated.View>

            {/* Radial Menu */}
            <View style={styles.menuContainer}>
                {/* Item 1 - Left - Post Update */}
                <Animated.View
                    style={[
                        styles.menuItem,
                        styles.item1Position,
                        {
                            transform: [{ scale: scaleAnim1 }],
                        },
                    ]}
                >
                    <Pressable
                        onPress={() => {
                            alert('Post Update (Coming Soon)');
                            handleClose();
                        }}
                        style={styles.actionButton}
                    >
                        <View style={[styles.iconContainer, styles.violetIcon]}>
                            <Feather name="image" size={32} color="#ffffff" />
                        </View>
                        <Text style={styles.label}>Post</Text>
                    </Pressable>
                </Animated.View>

                {/* Item 2 - Center Up - Log Hours */}
                <Animated.View
                    style={[
                        styles.menuItem,
                        styles.item2Position,
                        {
                            transform: [{ scale: scaleAnim2 }],
                        },
                    ]}
                >
                    <Pressable
                        onPress={() => {
                            alert('Log Hours (Coming Soon)');
                            handleClose();
                        }}
                        style={styles.actionButton}
                    >
                        <View style={[styles.iconContainer, styles.greenIcon]}>
                            <Feather name="clock" size={32} color="#ffffff" />
                        </View>
                        <Text style={styles.label}>Log Hours</Text>
                    </Pressable>
                </Animated.View>

                {/* Item 3 - Far Right - New Event */}
                <Animated.View
                    style={[
                        styles.menuItem,
                        styles.item4Position,
                        {
                            transform: [{ scale: scaleAnim4 }],
                        },
                    ]}
                >
                    <Pressable
                        onPress={() => {
                            alert('Create Event (Coming Soon)');
                            handleClose();
                        }}
                        style={styles.actionButton}
                    >
                        <View style={[styles.iconContainer, styles.amberIcon]}>
                            <Feather name="calendar" size={32} color="#ffffff" />
                        </View>
                        <Text style={styles.label}>Event</Text>
                    </Pressable>
                </Animated.View>
            </View>

            {/* Clear Black Button */}
            <Animated.View
                style={[
                    styles.clearButton,
                    {
                        transform: [{ rotate: rotation }],
                    },
                ]}
            >
                <Pressable
                    onPress={handleClose}
                    style={styles.clearButtonInner}
                >
                    <Feather name="plus" size={28} color="#ffffff" />
                </Pressable>
            </Animated.View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
        zIndex: 999,
    },
    blurContainer: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1,
    },
    menuContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        zIndex: 3,
    },
    menuItem: {
        position: 'absolute',
    },
    item1Position: {
        bottom: 130,
        left: width / 2 - 130,
    },
    item2Position: {
        bottom: 200,
        left: width / 2 - 32,
    },
    item4Position: {
        bottom: 130,
        left: width / 2 + 66,
    },
    actionButton: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    greenIcon: {
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#6EE7B7',
    },
    violetIcon: {
        backgroundColor: '#8B5CF6',
        borderWidth: 2,
        borderColor: '#C4B5FD',
    },
    amberIcon: {
        backgroundColor: '#F59E0B',
        borderWidth: 2,
        borderColor: '#FCD34D',
    },
    label: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: '600',
        color: '#1f2937',
        textAlign: 'center',
    },
    clearButton: {
        position: 'absolute',
        bottom: 44,
        alignSelf: 'center',
        width: 56,
        height: 56,
        zIndex: 10,
    },
    clearButtonInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#1f2937',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    summaryContainer: {
        position: 'absolute',
        top: height * 0.12,
        left: 16,
        right: 16,
        zIndex: 2,
    },
    headerRow: {
        marginBottom: 24,
        paddingHorizontal: 8,
    },
    greetingText: {
        fontSize: 34,
        fontWeight: '900',
        color: '#111827',
        letterSpacing: -1.2,
    },
    dateText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
        marginTop: 2,
        letterSpacing: -0.2,
    },
    widgetContainer: {
        gap: 12,
    },
    widget: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.8)',
    },
    heroWidget: {
        width: '100%',
        paddingBottom: 24,
    },
    widgetHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    inlineIcon: {
        width: 24,
        height: 24,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    widgetTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#4b5563',
        letterSpacing: -0.3,
    },
    heroContent: {
        alignItems: 'center',
        marginTop: 8,
    },
    heroValue: {
        fontSize: 72,
        fontWeight: '900',
        color: '#111827',
        letterSpacing: -3,
        marginBottom: 4,
    },
    heroSubtext: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6b7280',
        marginTop: 12,
    },
    sideBySideRow: {
        flexDirection: 'row',
        gap: 12,
    },
    smallWidget: {
        flex: 1,
        padding: 18,
    },
    smallWidgetTitle: {
        fontSize: 13,
        fontWeight: '800',
        color: '#4b5563',
        letterSpacing: -0.2,
    },
    smallWidgetValue: {
        fontSize: 26,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 4,
        letterSpacing: -0.8,
    },
    smallWidgetSubtext: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9ca3af',
    },
});
