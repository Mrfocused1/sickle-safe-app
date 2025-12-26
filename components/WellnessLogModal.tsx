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
    ScrollView,
    Image,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

type MetricType = 'pain' | 'hydration' | 'meds' | 'mood' | 'triggers' | 'crisis' | 'task' | 'wellness_summary' | 'member' | null;

interface WellnessLogModalProps {
    visible: boolean;
    onClose: () => void;
    type: MetricType;
    task?: { title: string; description: string; priority: string };
    member?: { name: string; role: string; priority: string; avatar: string; status: string; isEmergency: boolean };
}

export default function WellnessLogModal({ visible, onClose, type, task, member }: WellnessLogModalProps) {
    const [value, setValue] = useState('');
    const [notes, setNotes] = useState('');
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
            setValue('');
            setNotes('');
        }
    }, [visible]);

    const getHeaderInfo = () => {
        switch (type) {
            case 'pain':
                return { title: 'Pain Level', icon: 'favorite', color: '#f59e0b' };
            case 'hydration':
                return { title: 'Hydration', icon: 'water-drop', color: '#3b82f6' };
            case 'meds':
                return { title: 'Medications', icon: 'medication', color: '#a855f7' };
            case 'mood':
                return { title: 'Mood & Energy', icon: 'mood', color: '#10b981' };
            case 'triggers':
                return { title: 'Active Triggers', icon: 'warning', color: '#f43f5e' };
            case 'crisis':
                return { title: 'Crisis Episodes', icon: 'crisis-alert', color: '#ef4444' };
            case 'task':
                return { title: task?.title || 'Care Plan Task', icon: 'assignment', color: task?.priority === 'critical' ? '#ef4444' : task?.priority === 'needs_help' ? '#f59e0b' : '#10b981' };
            case 'wellness_summary':
                return { title: 'Daily Overview', icon: 'auto-graph', color: '#2563eb' };
            case 'member':
                return { title: member?.name || 'Member', icon: 'person', color: '#8b5cf6' };
            default:
                return { title: '', icon: '', color: '#000' };
        }
    };

    const header = getHeaderInfo();

    const renderContent = () => {
        switch (type) {
            case 'pain':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Severity (1-10)</Text>
                        <View style={styles.scaleContainer}>
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <Pressable
                                    key={num}
                                    onPress={() => setValue(num.toString())}
                                    style={[
                                        styles.scaleButton,
                                        value === num.toString() && { backgroundColor: header.color, borderColor: header.color },
                                    ]}
                                >
                                    <Text style={[styles.scaleText, value === num.toString() && { color: '#fff' }]}>{num}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            case 'hydration':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Add Amount</Text>
                        <View style={styles.gridContainer}>
                            {['250ml', '500ml', '750ml', '1L'].map((amount) => (
                                <Pressable
                                    key={amount}
                                    onPress={() => setValue(amount)}
                                    style={[
                                        styles.gridButton,
                                        value === amount && { backgroundColor: header.color, borderColor: header.color },
                                    ]}
                                >
                                    <Text style={[styles.gridText, value === amount && { color: '#fff' }]}>{amount}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            case 'meds':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Medications Checklist</Text>
                        {['Hydroxyurea (8:00 AM)', 'Folic Acid (8:00 AM)', 'Pain Relief (As needed)'].map((med) => (
                            <Pressable
                                key={med}
                                onPress={() => { }}
                                style={styles.checkItem}
                            >
                                <View style={styles.checkbox}>
                                    <MaterialIcons name="check-box-outline-blank" size={24} color="#cbd5e1" />
                                </View>
                                <Text style={styles.checkLabel}>{med}</Text>
                            </Pressable>
                        ))}
                    </View>
                );
            case 'mood':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>How are you feeling?</Text>
                        <View style={styles.moodContainer}>
                            {[
                                { icon: 'sentiment-very-dissatisfied', label: 'Awful' },
                                { icon: 'sentiment-dissatisfied', label: 'Not Good' },
                                { icon: 'sentiment-neutral', label: 'Okay' },
                                { icon: 'sentiment-satisfied', label: 'Good' },
                                { icon: 'sentiment-very-satisfied', label: 'Great' },
                            ].map((mood) => (
                                <Pressable
                                    key={mood.label}
                                    onPress={() => setValue(mood.label)}
                                    style={styles.moodItem}
                                >
                                    <MaterialIcons
                                        name={mood.icon as any}
                                        size={40}
                                        color={value === mood.label ? header.color : '#cbd5e1'}
                                    />
                                    <Text style={[styles.moodLabel, value === mood.label && { color: header.color, fontWeight: '700' }]}>
                                        {mood.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            case 'triggers':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Select Active Triggers</Text>
                        <View style={styles.gridContainer}>
                            {['Cold Weather', 'Dehydration', 'Stress', 'High Altitude', 'Infection', 'Physical Fatigue'].map((trigger) => (
                                <Pressable
                                    key={trigger}
                                    onPress={() => setValue(trigger)}
                                    style={[
                                        styles.gridButton,
                                        value === trigger && { backgroundColor: header.color, borderColor: header.color },
                                    ]}
                                >
                                    <Text style={[styles.gridText, value === trigger && { color: '#fff' }]}>{trigger}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            case 'crisis':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Quick Episode Log</Text>
                        <View style={styles.crisisForm}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>Start Time</Text>
                                <TextInput
                                    style={styles.smallInput}
                                    placeholder="e.g. 10:30 AM"
                                    placeholderTextColor="#94a3b8"
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>Pain Level (0-10)</Text>
                                <TextInput
                                    style={styles.smallInput}
                                    placeholder="e.g. 8"
                                    placeholderTextColor="#94a3b8"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>
                );
            case 'task':
                return (
                    <View style={styles.contentSection}>
                        <View style={[styles.taskDetailCard, { borderColor: header.color + '30' }]}>
                            <Text style={styles.taskDescription}>{task?.description}</Text>
                        </View>
                        <Text style={styles.sectionLabel}>Action</Text>
                        <Pressable
                            onPress={() => setValue('complete')}
                            style={[
                                styles.checkItem,
                                value === 'complete' && { backgroundColor: header.color + '10' }
                            ]}
                        >
                            <View style={styles.checkbox}>
                                <MaterialIcons
                                    name={value === 'complete' ? "check-box" : "check-box-outline-blank"}
                                    size={24}
                                    color={value === 'complete' ? header.color : "#cbd5e1"}
                                />
                            </View>
                            <Text style={[styles.checkLabel, value === 'complete' && { color: header.color }]}>
                                Mark as Completed
                            </Text>
                        </Pressable>
                    </View>
                );
            case 'wellness_summary':
                return (
                    <View style={styles.contentSection}>
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIcon, { backgroundColor: '#eff6ff' }]}>
                                    <MaterialIcons name="water-drop" size={20} color="#3b82f6" />
                                </View>
                                <View style={styles.summaryInfo}>
                                    <Text style={styles.summaryLabel}>Hydration</Text>
                                    <Text style={styles.summaryValue}>1.8L / 2.5L</Text>
                                </View>
                                <View style={styles.summaryStatus}>
                                    <Text style={styles.statusText}>72%</Text>
                                </View>
                            </View>

                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIcon, { backgroundColor: '#f5f3ff' }]}>
                                    <MaterialIcons name="medication" size={20} color="#8b5cf6" />
                                </View>
                                <View style={styles.summaryInfo}>
                                    <Text style={styles.summaryLabel}>Medications</Text>
                                    <Text style={styles.summaryValue}>3 of 4 taken</Text>
                                </View>
                                <View style={styles.summaryStatus}>
                                    <Text style={[styles.statusText, { color: '#f59e0b' }]}>Pending</Text>
                                </View>
                            </View>

                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIcon, { backgroundColor: '#ecfdf5' }]}>
                                    <MaterialIcons name="mood" size={20} color="#10b981" />
                                </View>
                                <View style={styles.summaryInfo}>
                                    <Text style={styles.summaryLabel}>Mood</Text>
                                    <Text style={styles.summaryValue}>Stable & Good</Text>
                                </View>
                                <View style={styles.summaryStatus}>
                                    <MaterialIcons name="check-circle" size={20} color="#10b981" />
                                </View>
                            </View>
                        </View>

                        <Text style={styles.sectionLabel}>Insights</Text>
                        <View style={styles.insightBox}>
                            <Text style={styles.insightText}>
                                You're doing great with hydration today! Try to take your evening meds by 8 PM to stay on schedule.
                            </Text>
                        </View>
                    </View>
                );
            case 'member':
                return (
                    <View style={styles.contentSection}>
                        <View style={styles.memberProfileCard}>
                            <View style={styles.memberAvatarWrapper}>
                                <Image source={{ uri: member?.avatar }} style={styles.memberAvatarLarge} />
                                <View style={[styles.statusIndicator, { backgroundColor: member?.status === 'Online' ? '#10b981' : member?.status === 'Away' ? '#f59e0b' : '#94a3b8' }]} />
                            </View>
                            <Text style={styles.memberRoleText}>{member?.role}</Text>
                            <View style={[styles.priorityBadgeModal, { backgroundColor: member?.priority === 'Emergency' ? '#fee2e2' : member?.priority === 'Primary' ? '#eff6ff' : '#f8fafc' }]}>
                                <Text style={[styles.priorityTextModal, { color: member?.priority === 'Emergency' ? '#ef4444' : member?.priority === 'Primary' ? '#3b82f6' : '#64748b' }]}>
                                    {member?.priority} Contact
                                </Text>
                            </View>
                        </View>

                        <Text style={styles.sectionLabel}>Communication</Text>
                        <View style={styles.actionGrid}>
                            <Pressable style={styles.actionBox} onPress={() => alert('Calling...')}>
                                <View style={[styles.actionIconCircle, { backgroundColor: '#f5f3ff' }]}>
                                    <MaterialIcons name="phone" size={24} color="#8b5cf6" />
                                </View>
                                <Text style={styles.actionLabelText}>Voice Call</Text>
                            </Pressable>
                            <Pressable style={styles.actionBox} onPress={() => alert('Messaging...')}>
                                <View style={[styles.actionIconCircle, { backgroundColor: '#f5f3ff' }]}>
                                    <MaterialIcons name="chat" size={24} color="#8b5cf6" />
                                </View>
                                <Text style={styles.actionLabelText}>Message</Text>
                            </Pressable>
                        </View>

                        <Text style={styles.sectionLabel}>Member Actions</Text>
                        <Pressable style={styles.checkItem} onPress={() => { }}>
                            <MaterialIcons name="notifications-none" size={24} color="#64748b" />
                            <Text style={styles.checkLabel}>Notification Settings</Text>
                        </Pressable>
                        <Pressable style={styles.checkItem} onPress={() => { }}>
                            <MaterialIcons name="edit" size={24} color="#64748b" />
                            <Text style={styles.checkLabel}>Edit Details</Text>
                        </Pressable>
                    </View>
                );
            default:
                return null;
        }
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
                        {/* Grabber */}
                        <View style={styles.grabber} />

                        {/* Header */}
                        <View style={styles.header}>
                            <View style={[styles.iconContainer, { backgroundColor: `${header.color}15` }]}>
                                <MaterialIcons name={header.icon as any} size={28} color={header.color} />
                            </View>
                            <View style={styles.headerText}>
                                <Text style={styles.headerTitle}>Log {header.title}</Text>
                                <Text style={styles.headerSub}>Recording for Today, 25 Dec</Text>
                            </View>
                            <Pressable onPress={onClose} style={styles.closeButton}>
                                <MaterialIcons name="close" size={24} color="#94a3b8" />
                            </Pressable>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            {renderContent()}

                            <View style={styles.notesSection}>
                                <Text style={styles.sectionLabel}>Additional Notes</Text>
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="How are you feeling otherwise?"
                                    placeholderTextColor="#94a3b8"
                                    multiline
                                    numberOfLines={4}
                                    value={notes}
                                    onChangeText={setNotes}
                                />
                            </View>

                            <Pressable
                                onPress={() => {
                                    alert('Entry Saved!');
                                    onClose();
                                }}
                                style={[styles.saveButton, { backgroundColor: header.color }]}
                            >
                                <Text style={styles.saveButtonText}>Save Entry</Text>
                            </Pressable>
                        </ScrollView>
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
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        maxHeight: height * 0.85,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    grabber: {
        width: 40,
        height: 4,
        backgroundColor: '#e2e8f0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        flex: 1,
        marginLeft: 16,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    headerSub: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    contentSection: {
        marginBottom: 24,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    scaleContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    scaleButton: {
        width: (width - 80) / 5,
        height: (width - 80) / 5,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#f1f5f9',
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scaleText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#475569',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    gridButton: {
        flex: 1,
        minWidth: '45%',
        paddingVertical: 20,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#f1f5f9',
        backgroundColor: '#f8fafc',
        alignItems: 'center',
    },
    gridText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#475569',
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    checkbox: {
        marginRight: 12,
    },
    checkLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#334155',
    },
    moodContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
    },
    moodItem: {
        alignItems: 'center',
        flex: 1,
    },
    moodLabel: {
        fontSize: 10,
        color: '#94a3b8',
        marginTop: 8,
        fontWeight: '500',
    },
    notesSection: {
        marginBottom: 32,
    },
    textArea: {
        backgroundColor: '#f8fafc',
        borderWidth: 2,
        borderColor: '#f1f5f9',
        borderRadius: 20,
        padding: 16,
        height: 120,
        fontSize: 16,
        color: '#0f172a',
        textAlignVertical: 'top',
    },
    saveButton: {
        paddingVertical: 18,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    crisisForm: {
        gap: 16,
    },
    inputWrapper: {
        gap: 8,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748b',
        marginLeft: 4,
    },
    smallInput: {
        backgroundColor: '#f8fafc',
        borderWidth: 2,
        borderColor: '#f1f5f9',
        borderRadius: 16,
        padding: 14,
        fontSize: 15,
        color: '#0f172a',
    },
    taskDetailCard: {
        backgroundColor: '#f8fafc',
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 24,
    },
    taskDescription: {
        fontSize: 16,
        lineHeight: 24,
        color: '#334155',
        fontWeight: '500',
    },
    summaryCard: {
        backgroundColor: '#f8fafc',
        borderRadius: 24,
        padding: 8,
        marginBottom: 24,
    },
    summaryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        margin: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    summaryIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryInfo: {
        flex: 1,
        marginLeft: 12,
    },
    summaryLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1e293b',
        marginTop: 2,
    },
    summaryStatus: {
        marginLeft: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#3b82f6',
    },
    insightBox: {
        backgroundColor: '#fffbeb',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#fef3c7',
    },
    insightText: {
        fontSize: 15,
        color: '#92400e',
        lineHeight: 22,
        fontWeight: '500',
    },
    memberProfileCard: {
        alignItems: 'center',
        marginBottom: 32,
    },
    memberAvatarWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
    memberAvatarLarge: {
        width: 100,
        height: 100,
        borderRadius: 32,
    },
    statusIndicator: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 4,
        borderColor: '#ffffff',
    },
    memberRoleText: {
        fontSize: 16,
        color: '#64748b',
        fontWeight: '500',
        marginBottom: 12,
    },
    priorityBadgeModal: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    priorityTextModal: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    actionGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    actionBox: {
        flex: 1,
        backgroundColor: '#f8fafc',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    actionIconCircle: {
        width: 56,
        height: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionLabelText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1e293b',
    },
});
