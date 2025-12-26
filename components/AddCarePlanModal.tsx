import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    Pressable,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Animated,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

interface AddCarePlanModalProps {
    visible: boolean;
    onClose: () => void;
    onAdd: (task: { title: string; description: string; priority: string }) => void;
}

const PRIORITIES = [
    { label: 'Critical', value: 'critical', color: '#ef4444', bgColor: '#fee2e2' },
    { label: 'Needs Help', value: 'needs_help', color: '#f59e0b', bgColor: '#fef3c7' },
    { label: 'Personal', value: 'personal', color: '#10b981', bgColor: '#d1fae5' },
];

export default function AddCarePlanModal({ visible, onClose, onAdd }: AddCarePlanModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('personal');

    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
        }
    }, [visible]);

    const handleAdd = () => {
        if (!title) return;
        onAdd({ title, description, priority });
        setTitle('');
        setDescription('');
        setPriority('personal');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={onClose}>
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    </Pressable>
                </Animated.View>

                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    <View style={styles.modalCard}>
                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>New Care Plan Item</Text>
                            <Pressable onPress={onClose} style={styles.closeButton}>
                                <MaterialIcons name="close" size={24} color="#6b7280" />
                            </Pressable>
                        </View>

                        {/* Form */}
                        <View style={styles.form}>
                            <Text style={styles.inputLabel}>Task Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Evening Meds"
                                value={title}
                                onChangeText={setTitle}
                                placeholderTextColor="#9ca3af"
                            />

                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="e.g., Take with glass of water..."
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={3}
                                placeholderTextColor="#9ca3af"
                            />

                            <Text style={styles.inputLabel}>Priority Level</Text>
                            <View style={styles.priorityContainer}>
                                {PRIORITIES.map((p) => (
                                    <Pressable
                                        key={p.value}
                                        onPress={() => setPriority(p.value)}
                                        style={[
                                            styles.priorityBadge,
                                            { backgroundColor: priority === p.value ? p.color : 'transparent' },
                                            { borderColor: p.color },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.priorityText,
                                                { color: priority === p.value ? '#ffffff' : p.color },
                                            ]}
                                        >
                                            {p.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>

                            <Pressable
                                onPress={handleAdd}
                                style={[styles.submitButton, !title && styles.submitButtonDisabled]}
                                disabled={!title}
                            >
                                <Text style={styles.submitButtonText}>Add to Care Plan</Text>
                            </Pressable>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    content: {
        width: '100%',
    },
    modalCard: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: Platform.OS === 'ios' ? 48 : 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    form: {
        gap: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: -8,
    },
    input: {
        backgroundColor: '#f9fafb',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#111827',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    priorityContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    priorityBadge: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1.5,
        alignItems: 'center',
    },
    priorityText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    submitButton: {
        backgroundColor: '#dc2626',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});
