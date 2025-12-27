import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Pressable,
    Animated,
    StyleSheet,
    Dimensions,
    Modal,
    TouchableOpacity
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export interface ActionItem {
    label: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
    color?: string;
    isDestructive?: boolean;
}

interface PostActionSheetProps {
    visible: boolean;
    onClose: () => void;
    actions: ActionItem[];
    title?: string;
}

export function PostActionSheet({ visible, onClose, actions, title }: PostActionSheetProps) {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

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
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const handleClose = () => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                {/* Backdrop */}
                <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    </Pressable>
                </Animated.View>

                {/* Sheet */}
                <Animated.View
                    style={[
                        styles.sheet,
                        {
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <View style={styles.handle} />

                    {title && (
                        <View className="px-6 pb-4 pt-2 border-b border-gray-100">
                            <Text className="text-brand-muted text-brand-section">{title}</Text>
                        </View>
                    )}

                    <View className="px-2 py-4">
                        {actions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
                                onPress={() => {
                                    action.onPress();
                                    handleClose();
                                }}
                                className="flex-row items-center px-4 py-4 active:bg-gray-50 rounded-2xl mb-1"
                            >
                                <View
                                    className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${action.isDestructive ? 'bg-red-50' : 'bg-gray-50'
                                        }`}
                                >
                                    <MaterialIcons
                                        name={action.icon}
                                        size={22}
                                        color={action.isDestructive ? '#EF4444' : (action.color || '#374151')}
                                    />
                                </View>
                                <Text
                                    className={`text-brand-label flex-1 ${action.isDestructive ? 'text-red-500' : 'text-brand-dark'
                                        }`}
                                >
                                    {action.label}
                                </Text>
                                <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View className="px-4 pb-10">
                        <TouchableOpacity
                            onPress={handleClose}
                            className="bg-gray-900 py-4 rounded-2xl items-center"
                        >
                            <Text className="text-white text-brand-button">Cancel</Text>
                        </TouchableOpacity>
                    </View>
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
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 10,
    },
});
