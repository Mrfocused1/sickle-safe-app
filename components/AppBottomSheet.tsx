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
    PanResponder,
    Keyboard,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { BlurView } from 'expo-blur';
import Slider from '@react-native-community/slider';
import { MaterialIcons, FontAwesome, Ionicons, Feather } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FundingOpportunity } from '../data/funding_data';
import {
    Medication,
    MedicationFrequency,
    FREQUENCY_LABELS,
    createMedication,
    formatMedicationDisplay,
    getMedicationSubtext,
    migrateLegacyMedication,
} from '../types/medication';
import { healthLogStorage } from '../services/healthLogStorage';

const { width, height } = Dimensions.get('window');

type MetricType = 'pain' | 'hydration' | 'meds' | 'mood' | 'triggers' | 'crisis' | 'task' | 'wellness_summary' | 'member' | 'idea' | 'group' | 'log_selection' | 'community_actions' | 'activity_detail' | 'volunteer_actions' | 'volunteer_log_hours' | 'mission_detail' | 'invite_member' | 'manage_task' | 'request_task' | 'view_care_plan' | 'metrics_info' | 'message_selection' | 'notification_settings' | 'edit_member' | 'create_event' | 'event_detail' | 'event_calendar' | 'funding_detail' | 'funding_ai_helper' | 'learning_module' | 'module_lesson' | 'quiz_start' | 'quiz_question' | 'quiz_results' | null;

interface AppBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    type: MetricType;
    task?: {
        id?: string;
        title: string;
        description: string;
        priority: string;
        comments?: Array<{ author: string; text: string; time: string; }>;
    };
    member?: { name: string; role: string; priority: string; avatar: string; status: string; isEmergency: boolean };
    activity?: { title: string; detail: string; time: string; color: string; icon: string };
    mission?: { title: string; detail: string; time: string; location?: string; status?: string };
    event?: { id: number; title: string; category: string; date: string; time: string; location: string; volunteers: number; needed: number; image: string };
    medsData?: { list: string[], checked: string[] };
    onMedsUpdate?: (list: string[], checked: string[]) => void;
    onPainUpdate?: (level: number, notes?: string) => void;
    onHydrationUpdate?: (amount: string, notes?: string) => void;
    onMoodUpdate?: (level: string, notes?: string) => void;
    onTriggersUpdate?: (triggers: string[], notes?: string) => void;
    onCrisisUpdate?: (startTime: string, level: number, notes?: string) => void;
    eventsList?: Array<{ id: number; title: string; category: string; date: string; time: string; location: string; volunteers: number; needed: number; image: string }>;
    fundingItem?: FundingOpportunity;
    educationModule?: any;
    educationLesson?: any;
    quizItem?: any;
    // Messaging callbacks
    onNewDM?: () => void;
    onNewGroup?: () => void;
    onOpenDMInbox?: () => void;
    onOpenGroupInbox?: () => void;
}

export default function AppBottomSheet({ visible, onClose, type, task, member, activity, mission, event, eventsList, fundingItem, educationModule, educationLesson, quizItem, medsData, onMedsUpdate, onPainUpdate, onHydrationUpdate, onMoodUpdate, onTriggersUpdate, onCrisisUpdate, onNewDM, onNewGroup, onOpenDMInbox, onOpenGroupInbox }: AppBottomSheetProps) {
    const insets = useSafeAreaInsets();
    const [value, setValue] = useState('');
    const [notes, setNotes] = useState('');
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [showNotesModal, setShowNotesModal] = useState(false);
    const [tempNotes, setTempNotes] = useState('');
    const [selectedHelpers, setSelectedHelpers] = useState<string[]>([]);
    const [activeType, setActiveType] = useState<MetricType>(type);
    const [medications, setMedications] = useState(['Hydroxyurea (8:00 AM)', 'Folic Acid (8:00 AM)', 'Pain Relief (As needed)']);
    const [newMed, setNewMed] = useState('');
    const [showAddMed, setShowAddMed] = useState(false);
    const [checkedMeds, setCheckedMeds] = useState<string[]>([]);
    const [history, setHistory] = useState<MetricType[]>([]);
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('');
    const [editStatus, setEditStatus] = useState('');
    const [medSuggestions, setMedSuggestions] = useState<string[]>([]);
    const [isSearchingMeds, setIsSearchingMeds] = useState(false);
    const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    // Edit Medication Overlay State
    const [showEditMedOverlay, setShowEditMedOverlay] = useState(false);
    const [editingMedIndex, setEditingMedIndex] = useState<number | null>(null);
    const [editMedName, setEditMedName] = useState('');
    const [editMedDosage, setEditMedDosage] = useState('');
    const [editMedFrequency, setEditMedFrequency] = useState<MedicationFrequency>('once_daily');
    const [editMedTimes, setEditMedTimes] = useState<string[]>(['8:00 AM']);
    const [editMedNotes, setEditMedNotes] = useState('');
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const toastAnim = useRef(new Animated.Value(-100)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return gestureState.dy > 5;
            },
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    slideAnim.setValue(gestureState.dy);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 100 || gestureState.vy > 0.5) {
                    Animated.timing(slideAnim, {
                        toValue: height,
                        duration: 200,
                        useNativeDriver: true,
                    }).start(() => {
                        onClose();
                        slideAnim.setValue(0);
                    });
                } else {
                    Animated.spring(slideAnim, {
                        toValue: 0,
                        useNativeDriver: true,
                        bounciness: 8,
                    }).start();
                }
            },
        })
    ).current;
    const [showToast, setShowToast] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [startTime, setStartTime] = useState('');
    const [eventDate, setEventDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [eventLink, setEventLink] = useState('');
    const [eventTitle, setEventTitle] = useState('');
    const [eventCategoryTitle, setEventCategoryTitle] = useState('');
    const [fundingStep, setFundingStep] = useState(1);
    const [fundingAnswers, setFundingAnswers] = useState<Record<string, string>>({});
    const [isGeneratingFunding, setIsGeneratingFunding] = useState(false);
    const [generatedFundingText, setGeneratedFundingText] = useState('');
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [moduleProgress, setModuleProgress] = useState<Record<string, number>>({});
    const [quizAnswers, setQuizAnswers] = useState<Record<string, string | number>>({});
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [quizResult, setQuizResult] = useState({ score: 0, passed: false });
    const [showExplanation, setShowExplanation] = useState(false);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Common SCD medications for quick suggestions
    const commonSCDMeds = [
        'Hydroxyurea',
        'Folic Acid',
        'Penicillin',
        'Ibuprofen',
        'Acetaminophen',
        'Morphine',
        'Oxycodone',
        'Hydromorphone',
        'L-Glutamine',
        'Voxelotor',
        'Crizanlizumab',
    ];

    // Search for medication suggestions
    const searchMedications = async (query: string) => {
        if (query.length < 2) {
            setMedSuggestions([]);
            return;
        }

        // Clear existing timeout
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        // Debounce search
        searchTimeoutRef.current = setTimeout(async () => {
            setIsSearchingMeds(true);

            try {
                // First, show common SCD medications that match
                const localMatches = commonSCDMeds.filter(med =>
                    med.toLowerCase().includes(query.toLowerCase())
                );

                // Then search FDA OpenFDA API for additional suggestions
                const response = await fetch(
                    `https://api.fda.gov/drug/ndc.json?search=brand_name:${encodeURIComponent(query)}*&limit=5`
                );

                if (response.ok) {
                    const data = await response.json();
                    const apiSuggestions = data.results?.map((drug: any) =>
                        drug.brand_name || drug.generic_name
                    ).filter(Boolean) || [];

                    // Combine and deduplicate
                    const combined = [...new Set([...localMatches, ...apiSuggestions])];
                    setMedSuggestions(combined.slice(0, 8));
                } else {
                    // Fallback to local matches only
                    setMedSuggestions(localMatches);
                }
            } catch (error) {
                console.log('Medication search error:', error);
                // Fallback to local matches
                const localMatches = commonSCDMeds.filter(med =>
                    med.toLowerCase().includes(query.toLowerCase())
                );
                setMedSuggestions(localMatches);
            } finally {
                setIsSearchingMeds(false);
            }
        }, 300); // 300ms debounce
    };

    // Look up medication by barcode (NDC)
    const lookupMedicationByBarcode = async (barcode: string) => {
        try {
            // FDA uses NDC codes in barcodes
            const response = await fetch(
                `https://api.fda.gov/drug/ndc.json?search=product_ndc:"${barcode}"&limit=1`
            );

            if (response.ok) {
                const data = await response.json();
                if (data.results && data.results.length > 0) {
                    const drug = data.results[0];
                    const medName = drug.brand_name || drug.generic_name || 'Unknown Medication';
                    setNewMed(medName);
                    setShowBarcodeScanner(false);
                    setMedSuggestions([]);
                    return medName;
                }
            }
            alert('Medication not found. Please enter manually.');
            setShowBarcodeScanner(false);
        } catch (error) {
            console.log('Barcode lookup error:', error);
            alert('Failed to lookup medication. Please try again or enter manually.');
            setShowBarcodeScanner(false);
        }
    };

    const handleBarcodeScanned = ({ data }: { data: string }) => {
        lookupMedicationByBarcode(data);
    };

    // Open medication edit overlay
    const openEditMedOverlay = (med: string, index: number) => {
        // Parse legacy format: "Medication Name (8:00 AM)" or "Medication Name (As needed)"
        const match = med.match(/^(.+?)\s*\((.+?)\)$/);
        if (match) {
            const name = match[1].trim();
            const timeOrFreq = match[2].trim();

            setEditMedName(name);
            setEditMedDosage('');
            if (timeOrFreq.toLowerCase() === 'as needed') {
                setEditMedFrequency('as_needed');
                setEditMedTimes([]);
            } else {
                setEditMedFrequency('once_daily');
                setEditMedTimes([timeOrFreq]);
            }
        } else {
            setEditMedName(med);
            setEditMedDosage('');
            setEditMedFrequency('once_daily');
            setEditMedTimes(['8:00 AM']);
        }
        setEditMedNotes('');
        setEditingMedIndex(index);
        setShowEditMedOverlay(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    // Save edited medication
    const saveEditedMedication = () => {
        if (editingMedIndex === null || !editMedName.trim()) return;

        // Build the new medication string in legacy format
        let newMedString = editMedName.trim();
        if (editMedDosage.trim()) {
            newMedString += ` ${editMedDosage.trim()}`;
        }
        if (editMedFrequency === 'as_needed') {
            newMedString += ' (As needed)';
        } else if (editMedTimes.length > 0) {
            newMedString += ` (${editMedTimes[0]})`;
        } else {
            newMedString += ' (8:00 AM)';
        }

        const newList = [...medications];
        newList[editingMedIndex] = newMedString;
        setMedications(newList);

        // Update checked list if the old med was checked
        const oldMed = medications[editingMedIndex];
        if (checkedMeds.includes(oldMed)) {
            const newChecked = checkedMeds.map(m => m === oldMed ? newMedString : m);
            setCheckedMeds(newChecked);
            if (onMedsUpdate) onMedsUpdate(newList, newChecked);
        } else {
            if (onMedsUpdate) onMedsUpdate(newList, checkedMeds);
        }

        setShowEditMedOverlay(false);
        setEditingMedIndex(null);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const navigateTo = (newType: MetricType) => {
        setHistory(prev => [...prev, activeType]);
        setActiveType(newType);
    };

    const goBack = () => {
        if (showToast) return; // Prevent closing while toast is showing
        if (history.length > 0) {
            const previous = history[history.length - 1];
            setHistory(prev => prev.slice(0, -1));
            setActiveType(previous);
        } else {
            onClose();
        }
    };

    const triggerToast = () => {
        setShowToast(true);
        setShowConfetti(true);
        Animated.spring(toastAnim, {
            toValue: 20,
            useNativeDriver: true,
            tension: 80,
            friction: 10
        }).start();

        // Sequence of subtle vibrations
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 100);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

        setTimeout(() => {
            Animated.timing(toastAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true
            }).start(() => {
                setShowToast(false);
                setShowConfetti(false);
                onClose();
            });
        }, 2200);
    };

    useEffect(() => {
        if (visible) {
            setActiveType(type || 'log_selection');
            setHistory([]);
            slideAnim.setValue(0);
            if (medsData) {
                setMedications(medsData.list);
                setCheckedMeds(medsData.checked);
            }
            if (member) {
                setEditName(member.name);
                setEditRole(member.role);
                setEditStatus(member.status);
            }
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            fadeAnim.setValue(0);
            setValue('');
            setNotes('');
            setStartTime('');
            setSelectedHelpers([]);
            setEventDate(new Date());
            setEventLink('');
            setEventTitle('');
            setEventCategoryTitle('');
            setShowDatePicker(false);
        }
    }, [visible, type]);

    // Keyboard visibility listener for sheets with text inputs
    useEffect(() => {
        const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const getHeaderInfo = () => {
        switch (activeType) {
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
                return { title: member?.name || 'Member', icon: 'person', color: '#6366f1' };
            case 'idea':
                return { title: 'Share Idea', icon: 'lightbulb', color: '#3b82f6' };
            case 'group':
                return { title: 'New Community Group', icon: 'groups', color: '#4f46e5' };
            case 'log_selection':
                return { title: 'Wellness Log', icon: 'add-circle', color: '#6366f1' };
            case 'community_actions':
                return { title: 'Community Actions', icon: 'groups', color: '#8b5cf6' };
            case 'volunteer_actions':
                return { title: 'Volunteer Hub', icon: 'volunteer-activism', color: '#4f46e5' };
            case 'volunteer_log_hours':
                return { title: 'Log Service Hours', icon: 'schedule', color: '#10b981' };
            case 'mission_detail':
                return { title: mission?.title || 'Mission Detail', icon: 'volunteer-activism', color: '#8b5cf6' };
            case 'invite_member':
                return { title: 'Invite Caregiver', icon: 'person-add', color: '#3b82f6' };
            case 'manage_task':
                return { title: 'Task Details', icon: 'assignment', color: task?.priority === 'critical' ? '#ef4444' : task?.priority === 'needs_help' ? '#f59e0b' : '#10b981' };
            case 'request_task':
                return { title: 'Help Needed', icon: 'handshake', color: task?.priority === 'critical' ? '#ef4444' : task?.priority === 'needs_help' ? '#f59e0b' : '#10b981' };
            case 'metrics_info':
                return { title: 'Today\'s Metrics', icon: 'info', color: '#64748b' };
            case 'message_selection':
                return { title: 'New Conversation', icon: null, color: '#0ea5e9', hideHeader: true };
            case 'notification_settings':
                return { title: 'Notifications', icon: 'notifications', color: '#8b5cf6' };
            case 'edit_member':
                return { title: 'Edit Details', icon: 'edit', color: '#6366f1' };
            case 'event_detail':
                return { title: event?.title || 'Event Detail', icon: 'event', color: '#10b981' };
            case 'event_calendar':
                return { title: 'Event Schedule', icon: 'event-note', color: '#6366f1' };
            case 'funding_detail':
                return { title: fundingItem?.title || 'Funding Detail', icon: fundingItem?.icon || 'account-balance', color: fundingItem?.color || '#10b981' };
            case 'funding_ai_helper':
                return { title: 'AI Application Helper', icon: 'auto-awesome', color: '#8b5cf6' };
            case 'learning_module':
                return { title: educationModule?.title || 'Learning Module', icon: educationModule?.icon || 'school', color: educationModule?.color || '#3b82f6' };
            case 'module_lesson':
                return { title: educationLesson?.title || 'Lesson', icon: 'menu-book', color: educationModule?.color || '#3b82f6' };
            case 'quiz_start':
                return { title: quizItem?.title || 'Quick Quiz', icon: quizItem?.icon || 'quiz', color: quizItem?.color || '#f59e0b' };
            case 'quiz_question':
                return { title: 'Question ' + (currentQuestionIdx + 1), icon: 'help_outline', color: quizItem?.color || '#f59e0b' };
            case 'quiz_results':
                return { title: 'Quiz Results', icon: 'assessment', color: quizResult.passed ? '#10b981' : '#f43f5e' };
            default:
                return { title: '', icon: '', color: '#000' };
        }
    };

    const header = getHeaderInfo();

    const renderContent = () => {
        switch (activeType) {
            case 'pain':
                return (
                    <View style={styles.contentSection}>
                        <View style={{ alignItems: 'center', marginBottom: 24 }}>
                            <Text style={{ fontSize: 64, fontWeight: '800', color: header.color }}>{value || '0'}</Text>
                            <Text style={{ fontSize: 16, fontWeight: '700', color: '#64748b', marginTop: -8 }}>
                                {parseInt(value) <= 3 ? 'Mild' : parseInt(value) <= 7 ? 'Moderate' : 'Severe'}
                            </Text>
                        </View>
                        <Text style={styles.sectionLabel}>Severity (0-10)</Text>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={10}
                            step={1}
                            value={parseInt(value) || 0}
                            onValueChange={(val) => {
                                setValue(val.toString());
                                Haptics.selectionAsync();
                            }}
                            minimumTrackTintColor={header.color}
                            maximumTrackTintColor="#e2e8f0"
                            thumbTintColor={header.color}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#94a3b8' }}>Low</Text>
                            <Text style={{ fontSize: 13, fontWeight: '600', color: '#94a3b8' }}>High</Text>
                        </View>
                    </View>
                );
            case 'hydration':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Add Amount</Text>
                        <View style={styles.gridContainer}>
                            {['1 cup', '250ml', '50cl', '500ml', '75cl', '750ml', '1L', '100cl'].map((amount) => (
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
                        {medications.map((med, index) => (
                            <View key={med} style={styles.checkItem}>
                                <Pressable
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        const newList = checkedMeds.includes(med)
                                            ? checkedMeds.filter(m => m !== med)
                                            : [...checkedMeds, med];
                                        setCheckedMeds(newList);
                                        if (onMedsUpdate) onMedsUpdate(medications, newList);
                                    }}
                                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                                >
                                    <View style={styles.checkbox}>
                                        <MaterialIcons
                                            name={checkedMeds.includes(med) ? "check-box" : "check-box-outline-blank"}
                                            size={24}
                                            color={checkedMeds.includes(med) ? header.color : "#cbd5e1"}
                                        />
                                    </View>
                                    <Text style={[styles.checkLabel, checkedMeds.includes(med) && { color: header.color, textDecorationLine: 'line-through', opacity: 0.6 }]}>{med}</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => openEditMedOverlay(med, index)}
                                    style={{ padding: 6 }}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <MaterialIcons name="more-vert" size={20} color="#64748b" />
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        const newList = medications.filter(m => m !== med);
                                        const newChecked = checkedMeds.filter(m => m !== med);
                                        setMedications(newList);
                                        setCheckedMeds(newChecked);
                                        if (onMedsUpdate) onMedsUpdate(newList, newChecked);
                                    }}
                                    style={{ padding: 4 }}
                                >
                                    <MaterialIcons name="delete-outline" size={20} color="#94a3b8" />
                                </Pressable>
                            </View>
                        ))}

                        {showAddMed ? (
                            <View style={{ marginTop: 16, gap: 12 }}>
                                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                                    <TextInput
                                        style={[styles.smallInput, { flex: 1 }]}
                                        placeholder="Enter medication name & time..."
                                        placeholderTextColor="#94a3b8"
                                        value={newMed}
                                        onChangeText={(text) => {
                                            setNewMed(text);
                                            searchMedications(text);
                                        }}
                                        autoFocus
                                    />
                                    <Pressable
                                        onPress={async () => {
                                            if (!permission?.granted) {
                                                const result = await requestPermission();
                                                if (!result.granted) {
                                                    alert('Camera permission is required to scan barcodes');
                                                    return;
                                                }
                                            }
                                            setShowBarcodeScanner(true);
                                        }}
                                        style={{
                                            width: 48,
                                            height: 48,
                                            backgroundColor: header.color + '15',
                                            borderRadius: 12,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderWidth: 1,
                                            borderColor: header.color + '30',
                                        }}
                                    >
                                        <MaterialIcons name="qr-code-scanner" size={24} color={header.color} />
                                    </Pressable>
                                </View>

                                {/* Medication Suggestions Dropdown */}
                                {medSuggestions.length > 0 && (
                                    <View style={{
                                        backgroundColor: '#fff',
                                        borderRadius: 16,
                                        borderWidth: 1,
                                        borderColor: '#e2e8f0',
                                        marginTop: -8,
                                        maxHeight: 200,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.1,
                                        shadowRadius: 8,
                                        elevation: 4,
                                    }}>
                                        <ScrollView>
                                            {medSuggestions.map((suggestion, idx) => (
                                                <Pressable
                                                    key={idx}
                                                    onPress={() => {
                                                        setNewMed(suggestion);
                                                        setMedSuggestions([]);
                                                    }}
                                                    style={{
                                                        padding: 12,
                                                        borderBottomWidth: idx < medSuggestions.length - 1 ? 1 : 0,
                                                        borderBottomColor: '#f1f5f9',
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <MaterialIcons name="medication" size={18} color="#8b5cf6" style={{ marginRight: 12 }} />
                                                    <Text style={{ fontSize: 15, fontWeight: '600', color: '#334155', flex: 1 }}>
                                                        {suggestion}
                                                    </Text>
                                                </Pressable>
                                            ))}
                                        </ScrollView>
                                    </View>
                                )}
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <Pressable
                                        onPress={() => {
                                            if (newMed.trim()) {
                                                const newList = [...medications, newMed.trim()];
                                                setMedications(newList);
                                                if (onMedsUpdate) onMedsUpdate(newList, checkedMeds);
                                                setNewMed('');
                                                setShowAddMed(false);
                                            }
                                        }}
                                        style={[styles.gridButton, { backgroundColor: '#000', borderColor: '#000', paddingVertical: 12 }]}
                                    >
                                        <Text style={[styles.gridText, { color: '#fff' }]}>Add</Text>
                                    </Pressable>
                                    <Pressable
                                        onPress={() => setShowAddMed(false)}
                                        style={[styles.gridButton, { paddingVertical: 12 }]}
                                    >
                                        <Text style={styles.gridText}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        ) : (
                            <Pressable
                                onPress={() => setShowAddMed(true)}
                                style={[styles.checkItem, { borderBottomWidth: 0, opacity: 0.8 }]}
                            >
                                <View style={[styles.checkbox, { backgroundColor: header.color + '15', borderRadius: 8, padding: 4 }]}>
                                    <MaterialIcons name="add" size={20} color={header.color} />
                                </View>
                                <Text style={[styles.checkLabel, { color: header.color, fontWeight: '700' }]}>Add more medicine</Text>
                            </Pressable>
                        )}
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
                                    onPress={() => {
                                        const current = value ? value.split(', ') : [];
                                        const next = current.includes(trigger)
                                            ? current.filter(t => t !== trigger)
                                            : [...current, trigger];
                                        setValue(next.join(', '));
                                    }}
                                    style={[
                                        styles.gridButton,
                                        value.includes(trigger) && { backgroundColor: header.color, borderColor: header.color },
                                    ]}
                                >
                                    <Text style={[styles.gridText, value.includes(trigger) && { color: '#fff' }]}>{trigger}</Text>
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
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <TextInput
                                        style={[styles.smallInput, { flex: 1 }]}
                                        placeholder="e.g. 10:30 AM"
                                        placeholderTextColor="#94a3b8"
                                        value={startTime}
                                        onChangeText={setStartTime}
                                    />
                                    <Pressable
                                        onPress={() => {
                                            const now = new Date();
                                            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                            setStartTime(time);
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        }}
                                        style={{ backgroundColor: header.color + '15', paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16 }}
                                    >
                                        <Text style={{ fontWeight: '700', color: header.color }}>Now</Text>
                                    </Pressable>
                                </View>
                            </View>
                            <View style={styles.inputWrapper}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                    <Text style={styles.inputLabel}>Pain Level (0-10)</Text>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: header.color }}>{value || '0'}</Text>
                                </View>
                                <Slider
                                    style={{ width: '100%', height: 40 }}
                                    minimumValue={0}
                                    maximumValue={10}
                                    step={1}
                                    value={parseInt(value) || 0}
                                    onValueChange={(val) => {
                                        setValue(val.toString());
                                        Haptics.selectionAsync();
                                    }}
                                    minimumTrackTintColor={header.color}
                                    maximumTrackTintColor="#e2e8f0"
                                    thumbTintColor={header.color}
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

                        <View style={styles.insightCard}>
                            <Text style={styles.insightTitle}>Daily Insight</Text>
                            <Text style={styles.insightMessage}>
                                You're doing great with hydration today! Try to take your evening meds by 8 PM to stay on schedule.
                            </Text>
                        </View>
                    </View>
                );
            case 'member':
                return (
                    <View style={styles.contentSection}>
                        <View style={{ alignItems: 'center', marginBottom: 32 }}>
                            <View style={{ position: 'relative', marginBottom: 16 }}>
                                <Image
                                    source={{ uri: member?.avatar }}
                                    style={{ width: 110, height: 110, borderRadius: 36 }}
                                />
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                        width: 28,
                                        height: 28,
                                        borderRadius: 14,
                                        backgroundColor: '#94a3b8',
                                        borderWidth: 4,
                                        borderColor: '#fff'
                                    }}
                                />
                            </View>
                            <Text style={{ fontSize: 16, fontWeight: '600', color: '#64748b', marginBottom: 12 }}>{member?.role}</Text>
                            <View style={{ backgroundColor: '#eff6ff', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 12 }}>
                                <Text style={{ fontSize: 11, fontWeight: '800', color: '#3b82f6', textTransform: 'uppercase', letterSpacing: 0.5 }}>Primary Contact</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionLabel}>Communication</Text>
                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32, marginTop: 8 }}>
                            <Pressable
                                style={{ flex: 1, backgroundColor: '#f5f3ff', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#ddd6fe' }}
                                onPress={() => alert('Calling...')}
                            >
                                <View style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: '#8b5cf6', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                    <MaterialIcons name="phone" size={24} color="#fff" />
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b' }}>Voice Call</Text>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#8b5cf6', marginTop: 2 }}>Audio only</Text>
                            </Pressable>

                            <Pressable
                                style={{ flex: 1, backgroundColor: '#eef2ff', padding: 16, borderRadius: 24, borderWidth: 1, borderColor: '#c7d2fe' }}
                                onPress={() => navigateTo('message_selection')}
                            >
                                <View style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                    <MaterialIcons name="textsms" size={24} color="#fff" />
                                </View>
                                <Text style={{ fontSize: 16, fontWeight: '800', color: '#1e293b' }}>Message</Text>
                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#6366f1', marginTop: 2 }}>Text or WhatsApp</Text>
                            </Pressable>
                        </View>

                        <Text style={styles.sectionLabel}>Member Actions</Text>
                        <View style={{ gap: 4 }}>
                            <Pressable
                                onPress={() => navigateTo('notification_settings')}
                                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}
                            >
                                <MaterialIcons name="notifications-none" size={24} color="#64748b" />
                                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b', marginLeft: 12 }}>Notification Settings</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => navigateTo('edit_member')}
                                style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}
                            >
                                <MaterialIcons name="edit" size={24} color="#64748b" />
                                <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b', marginLeft: 12 }}>Edit Details</Text>
                            </Pressable>
                        </View>
                    </View>
                );
            case 'idea':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>What's on your mind?</Text>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Enter a catchy title..."
                            placeholderTextColor="#94a3b8"
                            value={value}
                            onChangeText={setValue}
                        />
                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Category</Text>
                        <View style={styles.gridContainer}>
                            {['Advocacy', 'Fundraising', 'Community', 'Innovation'].map((cat) => (
                                <Pressable
                                    key={cat}
                                    onPress={() => setNotes(prev => prev.includes(cat) ? prev : prev + ' #' + cat)}
                                    style={styles.gridButton}
                                >
                                    <Text style={styles.gridText}>{cat}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            case 'group':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Propose a Group</Text>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Group name (e.g. 'NYC Support')..."
                            placeholderTextColor="#94a3b8"
                            value={value}
                            onChangeText={setValue}
                        />
                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Purpose & Category</Text>
                        <TextInput
                            style={[styles.smallInput, { height: 80, paddingTop: 12 }]}
                            placeholder="What should this group focus on?"
                            placeholderTextColor="#94a3b8"
                            multiline
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />
                        <View style={[styles.gridContainer, { marginTop: 16 }]}>
                            {['Support', 'Medical', 'Daily Wins', 'Advocacy'].map((cat) => (
                                <Pressable
                                    key={cat}
                                    onPress={() => setNotes(prev => prev.includes('#' + cat) ? prev : prev + ' #' + cat)}
                                    style={styles.gridButton}
                                >
                                    <Text style={styles.gridText}>{cat}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            case 'log_selection':
                const LOG_TYPES = [
                    { id: 'hydration', label: 'Hydration', icon: 'water-drop', color: '#3b82f6', bg: '#eff6ff' },
                    { id: 'pain', label: 'Pain Level', icon: 'favorite', color: '#f59e0b', bg: '#fffbeb' },
                    { id: 'meds', label: 'Medications', icon: 'medication', color: '#a855f7', bg: '#faf5ff' },
                    { id: 'mood', label: 'Mood', icon: 'mood', color: '#10b981', bg: '#f0fdf4' },
                    { id: 'triggers', label: 'Triggers', icon: 'warning', color: '#f43f5e', bg: '#fff1f2' },
                    { id: 'crisis', label: 'Crisis', icon: 'crisis-alert', color: '#ef4444', bg: '#fef2f2' },
                    { id: 'group', label: 'Propose Group', icon: 'groups', color: '#8b5cf6', bg: '#f5f3ff' },
                ];
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>What would you like to log?</Text>
                        <View style={styles.logSelectorGrid}>
                            {LOG_TYPES.map((item) => (
                                <Pressable
                                    key={item.id}
                                    onPress={() => setActiveType(item.id as MetricType)}
                                    style={styles.logTypeCard}
                                >
                                    <View style={[styles.logTypeIcon, { backgroundColor: item.bg }]}>
                                        <MaterialIcons name={item.icon as any} size={28} color={item.color} />
                                    </View>
                                    <Text style={styles.logTypeLabel}>{item.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            case 'community_actions':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Group Management</Text>
                        <View style={styles.logSelectorGrid}>
                            {[
                                { id: 'group', label: 'Propose Group', icon: 'add-business', color: '#8b5cf6', bg: '#f5f3ff' },
                                { id: 'events', label: 'Find Events', icon: 'event', color: '#3b82f6', bg: '#eff6ff' },
                                { id: 'my_groups', label: 'My Groups', icon: 'group-work', color: '#10b981', bg: '#f0fdf4' },
                                { id: 'guidelines', label: 'Guidelines', icon: 'verified-user', color: '#f59e0b', bg: '#fffbeb' },
                            ].map((item) => (
                                <Pressable
                                    key={item.id}
                                    onPress={() => {
                                        if (item.id === 'group') setActiveType('group');
                                        else alert(`${item.label} coming soon!`);
                                    }}
                                    style={styles.logTypeCard}
                                >
                                    <View style={[styles.logTypeIcon, { backgroundColor: item.bg }]}>
                                        <MaterialIcons name={item.icon as any} size={28} color={item.color} />
                                    </View>
                                    <Text style={styles.logTypeLabel}>{item.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            case 'volunteer_actions':
                return (
                    <View style={styles.contentSection}>
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIcon, { backgroundColor: '#f0f9ff' }]}>
                                    <MaterialIcons name="schedule" size={20} color="#0ea5e9" />
                                </View>
                                <View style={styles.summaryInfo}>
                                    <Text style={styles.summaryLabel}>Total Hours</Text>
                                    <Text style={styles.summaryValue}>24.5 hrs</Text>
                                </View>
                                <View style={styles.summaryStatus}>
                                    <Text style={[styles.statusText, { color: '#0ea5e9' }]}>+2.4</Text>
                                </View>
                            </View>

                            <View style={styles.summaryItem}>
                                <View style={[styles.summaryIcon, { backgroundColor: '#f5f3ff' }]}>
                                    <MaterialIcons name="task-alt" size={20} color="#8b5cf6" />
                                </View>
                                <View style={styles.summaryInfo}>
                                    <Text style={styles.summaryLabel}>Missions</Text>
                                    <Text style={styles.summaryValue}>12 Done</Text>
                                </View>
                                <View style={styles.summaryStatus}>
                                    <MaterialIcons name="check-circle" size={20} color="#8b5cf6" />
                                </View>
                            </View>
                        </View>

                        <Text style={styles.sectionLabel}>Quick Actions</Text>
                        <View style={styles.logSelectorGrid}>
                            {[
                                { id: 'idea', label: 'Post Update', icon: 'image', color: '#8b5cf6', bg: '#f5f3ff' },
                                { id: 'volunteer_log_hours', label: 'Log Hours', icon: 'schedule', color: '#10b981', bg: '#f0fdf4' },
                                { id: 'create_event', label: 'New Event', icon: 'event', color: '#f59e0b', bg: '#fffbeb' },
                            ].map((item) => (
                                <Pressable
                                    key={item.id}
                                    onPress={() => setActiveType(item.id as MetricType)}
                                    style={styles.logTypeCard}
                                >
                                    <View style={[styles.logTypeIcon, { backgroundColor: item.bg }]}>
                                        <MaterialIcons name={item.icon as any} size={28} color={item.color} />
                                    </View>
                                    <Text style={styles.logTypeLabel}>{item.label}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            case 'volunteer_log_hours':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Hours Contributed</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32, paddingVertical: 12 }}>
                            <Pressable
                                onPress={() => {
                                    const val = Math.max(0.5, (parseFloat(value) || 0) - 0.5);
                                    setValue(val.toString());
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                                style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <MaterialIcons name="remove" size={28} color="#475569" />
                            </Pressable>
                            <View style={{ alignItems: 'center', minWidth: 100 }}>
                                <Text style={{ fontSize: 48, fontWeight: '800', color: '#1e293b' }}>{value || '0'}</Text>
                                <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748b', marginTop: -4 }}>Hours Today</Text>
                            </View>
                            <Pressable
                                onPress={() => {
                                    const val = (parseFloat(value) || 0) + 0.5;
                                    setValue(val.toString());
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                                style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: header.color + '15', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <MaterialIcons name="add" size={28} color={header.color} />
                            </Pressable>
                        </View>
                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Mission Category</Text>
                        <View style={styles.gridContainer}>
                            {['Support', 'Advocacy', 'Medical', 'Organizing'].map((cat) => (
                                <Pressable
                                    key={cat}
                                    onPress={() => setNotes(prev => prev + ' ' + cat)}
                                    style={styles.gridButton}
                                >
                                    <Text style={styles.gridText}>{cat}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            case 'mission_detail':
                return (
                    <View style={styles.contentSection}>
                        <View style={[styles.taskDetailCard, { borderColor: '#8b5cf630', backgroundColor: '#8b5cf605' }]}>
                            <View className="bg-violet-100 self-start px-3 py-1 rounded-full mb-3">
                                <Text className="text-violet-700 text-[10px] font-bold uppercase">{mission?.status || 'Active Mission'}</Text>
                            </View>
                            <Text style={[styles.taskDescription, { fontSize: 18, color: '#0f172a', fontWeight: '700' }]}>{mission?.detail}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                                <MaterialIcons name="schedule" size={14} color="#64748b" />
                                <Text style={{ fontSize: 13, color: '#64748b', marginLeft: 4 }}>{mission?.time}</Text>
                                <MaterialIcons name="place" size={14} color="#64748b" style={{ marginLeft: 16 }} />
                                <Text style={{ fontSize: 13, color: '#64748b', marginLeft: 4 }}>{mission?.location}</Text>
                            </View>
                        </View>

                        <Text style={styles.sectionLabel}>Requirements</Text>
                        {['Official ID required', 'Must be 18+', 'Orientation completion'].map((req) => (
                            <View key={req} style={styles.checkItem}>
                                <MaterialIcons name="verified" size={20} color="#8b5cf6" />
                                <Text style={[styles.checkLabel, { fontSize: 14 }]}>{req}</Text>
                            </View>
                        ))}
                    </View>
                );
            case 'invite_member':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Contact Method</Text>
                        <View style={styles.gridContainer}>
                            {['Phone Number', 'Email Address'].map((method) => (
                                <Pressable
                                    key={method}
                                    onPress={() => setValue(method)}
                                    style={[
                                        styles.gridButton,
                                        value === method && { backgroundColor: header.color, borderColor: header.color },
                                    ]}
                                >
                                    <Text style={[styles.gridText, value === method && { color: '#fff' }]}>{method}</Text>
                                </Pressable>
                            ))}
                        </View>
                        <TextInput
                            style={[styles.smallInput, { marginTop: 24 }]}
                            placeholder={value === 'Email Address' ? "caregiver@example.com" : "+1 (555) 000-0000"}
                            placeholderTextColor="#94a3b8"
                            keyboardType={value === 'Email Address' ? 'email-address' : 'phone-pad'}
                        />
                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Role / Relationship</Text>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="e.g. Primary Caregiver, Spouse, Parent"
                            placeholderTextColor="#94a3b8"
                        />
                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Personal Message</Text>
                        <TextInput
                            style={[styles.smallInput, { height: 100, paddingTop: 12 }]}
                            placeholder="Add a custom note to your invitation..."
                            placeholderTextColor="#94a3b8"
                            multiline
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>
                );
            case 'manage_task':
                return (
                    <View style={styles.contentSection}>
                        <View style={[styles.taskDetailCard, { borderColor: header.color + '30', backgroundColor: header.color + '05' }]}>
                            <Text style={[styles.taskDescription, { fontSize: 18, color: '#0f172a', fontWeight: '700' }]}>{task?.title}</Text>
                            <Text style={[styles.taskDescription, { marginTop: 8 }]}>{task?.description}</Text>
                        </View>

                        <Text style={styles.sectionLabel}>Assign to Helper</Text>
                        <View style={styles.actionGrid}>
                            {[
                                { name: 'Marcus', role: 'Spouse', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' },
                                { name: 'Linda', role: 'Mom', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' },
                                { name: 'Request Help', role: 'Open to anyone', avatar: null }
                            ].map((helper) => {
                                const isSelected = selectedHelpers.includes(helper.name);
                                const isRequest = helper.name === 'Request Help';
                                return (
                                    <Pressable
                                        key={helper.name}
                                        onPress={() => setSelectedHelpers(prev => prev.includes(helper.name) ? prev.filter(h => h !== helper.name) : [...prev, helper.name])}
                                        style={[styles.actionBox, isRequest && { backgroundColor: isSelected ? '#ecfdf5' : 'transparent', borderRadius: 24 }]}
                                    >
                                        <View style={[styles.memberAvatarWrapper, { width: 50, height: 50, marginBottom: 8, opacity: isSelected || isRequest ? 1 : 0.6 }]}>
                                            {helper.avatar ? (
                                                <Image source={{ uri: helper.avatar }} style={[styles.memberAvatarLarge, { width: 50, height: 50, borderWidth: isSelected ? 3 : 0, borderColor: header.color }]} />
                                            ) : (
                                                <View style={[styles.actionIconCircle, { width: 50, height: 50, margin: 0, backgroundColor: isSelected ? header.color + '20' : '#f8fafc', borderWidth: 1, borderColor: isSelected ? header.color : '#f1f5f9' }]}>
                                                    <MaterialIcons name={isRequest ? "add" : "help"} size={24} color={isSelected ? header.color : isRequest ? '#94a3b8' : '#3b82f6'} />
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.actionLabelText, isSelected && { color: header.color, fontWeight: '800' }]}>{helper.name}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                );
            case 'request_task':
                return (
                    <View style={styles.contentSection}>
                        <View style={[styles.taskDetailCard, { borderColor: header.color + '30', backgroundColor: header.color + '05' }]}>
                            <View style={{ backgroundColor: header.color + '20', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 12 }}>
                                <Text style={{ color: header.color, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>Help Requested</Text>
                            </View>
                            <Text style={[styles.taskDescription, { fontSize: 18, color: '#0f172a', fontWeight: '700' }]}>{task?.title}</Text>
                            <Text style={[styles.taskDescription, { marginTop: 8 }]}>{task?.description}</Text>
                        </View>
                        <View style={styles.insightBox}>
                            <Text style={styles.insightText}>Maya has flagged this task as something she needs help with. By claiming this task, it will be moved to your assigned missions.</Text>
                        </View>
                    </View>
                );
            case 'view_care_plan':
                const TASKS = [
                    { id: 1, title: 'Emergency Bag Check', detail: 'Ensure hospital bag is ready.', status: 'Assigned', helper: 'Marcus', priority: 'critical' },
                    { id: 2, title: 'Prescription Refill', detail: 'Hydroxyurea supply is low.', status: 'Help Needed', priority: 'needs_help' },
                    { id: 3, title: 'Evening Walk', detail: 'Light 15 min walk.', status: 'Unassigned', priority: 'personal' },
                ];
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Active Tasks & Requests</Text>
                        {TASKS.map((t) => (
                            <Pressable
                                key={t.id}
                                onPress={() => setActiveType('request_task')}
                                style={{ backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#f1f5f9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                            >
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b' }}>{t.title}</Text>
                                    <Text style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{t.detail}</Text>
                                </View>
                                <MaterialIcons name={t.status === 'Assigned' ? "swap-horiz" : "add-circle-outline"} size={24} color={t.status === 'Assigned' ? "#94a3b8" : "#8b5cf6"} />
                            </Pressable>
                        ))}
                    </View>
                );
            case 'activity_detail':
                return (
                    <View style={styles.contentSection}>
                        <View style={[styles.taskDetailCard, { borderColor: activity?.color + '20', backgroundColor: activity?.color + '05' }]}>
                            <Text style={[styles.sectionLabel, { marginBottom: 8, color: activity?.color }]}>Summary</Text>
                            <Text style={[styles.taskDescription, { fontSize: 18, color: '#0f172a' }]}>{activity?.detail}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
                                <MaterialIcons name="access-time" size={14} color="#64748b" />
                                <Text style={{ fontSize: 13, color: '#64748b', marginLeft: 4 }}>Logged {activity?.time}</Text>
                            </View>
                        </View>
                    </View>
                );
            case 'metrics_info':
                return (
                    <View style={styles.contentSection}>
                        <View style={styles.insightBox}>
                            <Text style={styles.insightText}>
                                These metrics are calculated based on the overcomer's log entries for today. They provide a real-time snapshot of wellness and adherence to the care plan.
                            </Text>
                        </View>
                        <View style={{ marginTop: 24 }}>
                            <Text style={styles.sectionLabel}>What's included</Text>
                            <View style={styles.checkItem}>
                                <MaterialIcons name="water-drop" size={20} color="#3b82f6" />
                                <Text style={[styles.checkLabel, { marginLeft: 12 }]}>Hydration targets</Text>
                            </View>
                            <View style={styles.checkItem}>
                                <MaterialIcons name="trending-down" size={20} color="#f59e0b" />
                                <Text style={[styles.checkLabel, { marginLeft: 12 }]}>Pain level trends</Text>
                            </View>
                            <View style={styles.checkItem}>
                                <MaterialIcons name="check-circle" size={20} color="#10b981" />
                                <Text style={[styles.checkLabel, { marginLeft: 12 }]}>Medication adherence</Text>
                            </View>
                        </View>
                    </View>
                );
            case 'message_selection':
                return (
                    <View style={styles.contentSection}>
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 20 }}>New Conversation</Text>
                        <View style={{ gap: 16 }}>
                            <Pressable
                                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#bae6fd' }}
                                onPress={() => { onNewDM?.(); }}
                            >
                                <View style={{ width: 56, height: 56, borderRadius: 20, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <MaterialIcons name="person" size={28} color="#fff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#0c4a6e' }}>Direct Message</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#0ea5e9', marginTop: 2 }}>Chat one-on-one with someone</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#0ea5e9" />
                            </Pressable>

                            <Pressable
                                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#faf5ff', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#e9d5ff' }}
                                onPress={() => { onNewGroup?.(); }}
                            >
                                <View style={{ width: 56, height: 56, borderRadius: 20, backgroundColor: '#a855f7', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <MaterialIcons name="groups" size={28} color="#fff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#581c87' }}>Group Message</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#a855f7', marginTop: 2 }}>Chat with your care circle</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#a855f7" />
                            </Pressable>
                        </View>

                        {/* Inbox Section */}
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#0f172a', marginBottom: 20, marginTop: 32 }}>Inbox</Text>
                        <View style={{ gap: 16 }}>
                            <Pressable
                                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f9ff', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#bae6fd', position: 'relative' }}
                                onPress={() => { onOpenDMInbox?.(); }}
                            >
                                <View style={{ width: 56, height: 56, borderRadius: 20, backgroundColor: '#0ea5e9', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <MaterialIcons name="person" size={28} color="#fff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#0c4a6e' }}>Direct Messages</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#0ea5e9', marginTop: 2 }}>View your conversations</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#0ea5e9" />
                                {/* Notification Badge */}
                                <View style={{ position: 'absolute', top: 12, right: 12, backgroundColor: '#ef4444', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#fff' }}>3</Text>
                                </View>
                            </Pressable>

                            <Pressable
                                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#faf5ff', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#e9d5ff', position: 'relative' }}
                                onPress={() => { onOpenGroupInbox?.(); }}
                            >
                                <View style={{ width: 56, height: 56, borderRadius: 20, backgroundColor: '#a855f7', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <MaterialIcons name="groups" size={28} color="#fff" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#581c87' }}>Group Messages</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#a855f7', marginTop: 2 }}>View group conversations</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#a855f7" />
                                {/* Notification Badge */}
                                <View style={{ position: 'absolute', top: 12, right: 12, backgroundColor: '#ef4444', width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '800', color: '#fff' }}>5</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                );
            case 'notification_settings':
                const NOTIF_OPTIONS = [
                    { id: 'crisis', label: 'Crisis Alerts', sub: 'Immediate alerts for health emergencies', icon: 'emergency', color: '#ef4444', bg: '#fef2f2' },
                    { id: 'meds', label: 'Medication Reminders', sub: 'Stay on track with schedule', icon: 'medication', color: '#a855f7', bg: '#f5f3ff' },
                    { id: 'health', label: 'Health Insights', sub: 'Daily logs and trend updates', icon: 'analytics', color: '#3b82f6', bg: '#eff6ff' },
                    { id: 'messages', label: 'Direct Messages', sub: 'Pushed for new chat messages', icon: 'chat-bubble', color: '#10b981', bg: '#f0fdf4' },
                ];
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>Preferences for {member?.name || 'this member'}</Text>
                        <View style={{ gap: 12 }}>
                            {NOTIF_OPTIONS.map((opt) => (
                                <Pressable
                                    key={opt.id}
                                    onPress={() => {
                                        const current = value ? value.split(',') : [];
                                        const next = current.includes(opt.id)
                                            ? current.filter(id => id !== opt.id)
                                            : [...current, opt.id];
                                        setValue(next.join(','));
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#fff',
                                        padding: 16,
                                        borderRadius: 24,
                                        borderWidth: 1,
                                        borderColor: '#f1f5f9',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 10,
                                        elevation: 2
                                    }}
                                >
                                    <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: opt.bg, alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                        <MaterialIcons name={opt.icon as any} size={22} color={opt.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#1e293b' }}>{opt.label}</Text>
                                        <Text style={{ fontSize: 12, fontWeight: '500', color: '#94a3b8', marginTop: 1 }}>{opt.sub}</Text>
                                    </View>
                                    <View
                                        style={{
                                            width: 48,
                                            height: 28,
                                            borderRadius: 14,
                                            backgroundColor: value.includes(opt.id) ? '#8b5cf6' : '#e2e8f0',
                                            padding: 4,
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <View
                                            style={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: 10,
                                                backgroundColor: '#fff',
                                                transform: [{ translateX: value.includes(opt.id) ? 20 : 0 }]
                                            }}
                                        />
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                        <View style={{ marginTop: 24, padding: 16, backgroundColor: '#f8fafc', borderRadius: 20, borderLeftWidth: 4, borderLeftColor: '#8b5cf6' }}>
                            <Text style={{ fontSize: 13, color: '#64748b', fontStyle: 'italic', lineHeight: 20 }}>
                                Notification settings are synced across your Circle of Care to ensure everyone stays informed.
                            </Text>
                        </View>
                        <Pressable onPress={goBack} style={{ alignItems: 'center', marginTop: 32 }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748b' }}>Go Back</Text>
                        </Pressable>
                    </View>
                );
            case 'edit_member':
                return (
                    <View style={styles.contentSection}>
                        <View style={{ alignItems: 'center', marginBottom: 24 }}>
                            <View style={{ position: 'relative' }}>
                                <Image
                                    source={{ uri: member?.avatar }}
                                    style={{ width: 100, height: 100, borderRadius: 32 }}
                                />
                                <Pressable
                                    style={{
                                        position: 'absolute',
                                        bottom: -4,
                                        right: -4,
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        backgroundColor: '#6366f1',
                                        borderWidth: 3,
                                        borderColor: '#fff',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <MaterialIcons name="camera-alt" size={16} color="#fff" />
                                </Pressable>
                            </View>
                        </View>

                        <Text style={styles.sectionLabel}>Full Name</Text>
                        <TextInput
                            style={[styles.smallInput, { marginBottom: 20 }]}
                            placeholder="Full Name"
                            value={editName}
                            onChangeText={setEditName}
                        />

                        <Text style={styles.sectionLabel}>Role / Relationship</Text>
                        <TextInput
                            style={[styles.smallInput, { marginBottom: 20 }]}
                            placeholder="e.g. Spouse, Primary Caregiver"
                            value={editRole}
                            onChangeText={setEditRole}
                        />

                        <Text style={styles.sectionLabel}>Active Status</Text>
                        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
                            {['Active', 'Away', 'Offline', 'Recovering'].map((s) => (
                                <Pressable
                                    key={s}
                                    onPress={() => setEditStatus(s)}
                                    style={{
                                        paddingHorizontal: 14,
                                        paddingVertical: 10,
                                        borderRadius: 12,
                                        borderWidth: 1,
                                        borderColor: editStatus === s ? '#6366f1' : '#e2e8f0',
                                        backgroundColor: editStatus === s ? '#eef2ff' : 'transparent'
                                    }}
                                >
                                    <Text style={{
                                        fontSize: 13,
                                        fontWeight: '700',
                                        color: editStatus === s ? '#6366f1' : '#64748b'
                                    }}>{s}</Text>
                                </Pressable>
                            ))}
                        </View>

                        <Pressable
                            onPress={goBack}
                            style={{ alignItems: 'center', marginTop: 16 }}
                        >
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748b' }}>Discard Changes</Text>
                        </Pressable>
                    </View>
                );
            case 'create_event':
                return (
                    <View style={styles.contentSection}>
                        <Text style={styles.sectionLabel}>EVENT CATEGORY</Text>
                        <View style={styles.gridContainer}>
                            {['Blood Drive', 'Awareness', 'Fundraiser', 'Support'].map((cat) => (
                                <Pressable
                                    key={cat}
                                    onPress={() => {
                                        setValue(cat);
                                        setEventCategoryTitle(cat);
                                    }}
                                    style={[
                                        styles.gridButton,
                                        value === cat && { backgroundColor: header.color, borderColor: header.color },
                                    ]}
                                >
                                    <Text style={[styles.gridText, value === cat && { color: '#fff' }]}>{cat}</Text>
                                </Pressable>
                            ))}
                            <Pressable
                                onPress={() => {
                                    setValue('Other');
                                    setEventCategoryTitle('');
                                }}
                                style={[
                                    styles.gridButton,
                                    value === 'Other' && { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
                                    { flexDirection: 'row', alignItems: 'center', gap: 6, borderColor: '#3b82f6' }
                                ]}
                            >
                                <MaterialIcons
                                    name="add"
                                    size={18}
                                    color={value === 'Other' ? '#fff' : '#3b82f6'}
                                />
                                <Text style={[
                                    styles.gridText,
                                    { color: value === 'Other' ? '#fff' : '#3b82f6' }
                                ]}>
                                    Other category
                                </Text>
                            </Pressable>
                        </View>

                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>CATEGORY NAME / TYPE</Text>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="e.g. Advocacy Campaign"
                            placeholderTextColor="#94a3b8"
                            value={eventCategoryTitle}
                            onChangeText={setEventCategoryTitle}
                        />

                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>EVENT TITLE</Text>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="e.g. Community Blood Drive 2024"
                            placeholderTextColor="#94a3b8"
                            value={eventTitle}
                            onChangeText={setEventTitle}
                        />

                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>DATE & TIME</Text>
                        <Pressable
                            onPress={() => setShowDatePicker(!showDatePicker)}
                            style={[styles.smallInput, { justifyContent: 'center', borderColor: showDatePicker ? '#3b82f6' : '#f1f5f9' }]}
                        >
                            <Text style={{ color: eventDate ? '#1e293b' : '#94a3b8', fontSize: 16, fontWeight: '500' }}>
                                {eventDate ? eventDate.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'Select Date & Time'}
                            </Text>
                        </Pressable>

                        {showDatePicker && (
                            <View style={{ backgroundColor: '#f8fafc', borderRadius: 20, marginTop: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0' }}>
                                {Platform.OS === 'ios' && (
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' }}>
                                        <Pressable onPress={() => setShowDatePicker(false)}>
                                            <Text style={{ color: '#3b82f6', fontWeight: '800', fontSize: 15 }}>Done</Text>
                                        </Pressable>
                                    </View>
                                )}
                                <DateTimePicker
                                    value={eventDate}
                                    mode="datetime"
                                    is24Hour={true}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, date) => {
                                        if (Platform.OS === 'android') {
                                            setShowDatePicker(false);
                                        }
                                        if (date) setEventDate(date);
                                    }}
                                />
                            </View>
                        )}

                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>EXTERNAL LINK</Text>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="e.g. www.google.com"
                            placeholderTextColor="#94a3b8"
                            value={eventLink}
                            onChangeText={setEventLink}
                            autoCapitalize="none"
                            keyboardType="url"
                        />

                        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>DESCRIPTION & GOALS</Text>
                        <TextInput
                            style={[styles.smallInput, { height: 100, paddingTop: 12 }]}
                            placeholder="What is the goal of this event? How many volunteers do you need?"
                            placeholderTextColor="#94a3b8"
                            multiline
                            textAlignVertical="top"
                            value={notes}
                            onChangeText={setNotes}
                        />

                        <View style={styles.insightBox}>
                            <Text style={styles.insightText}>Your proposed event will be reviewed by the community lead before being visible to other volunteers.</Text>
                        </View>
                    </View>
                );
            case 'event_detail':
                return (
                    <View style={{ gap: 24 }}>
                        {/* Unified Event Card */}
                        <View style={{ backgroundColor: '#fff', borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#f1f5f9' }}>
                            <Image
                                source={{ uri: event?.image || 'https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&q=80&w=800' }}
                                style={{ width: '100%', height: 180 }}
                            />

                            <View style={{ padding: 20 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <View style={{ backgroundColor: '#f0fdf4', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
                                        <Text style={{ color: '#10b981', fontSize: 12, fontWeight: '800', textTransform: 'uppercase' }}>{event?.category}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 }}>
                                        <MaterialIcons name="people" size={16} color="#64748b" />
                                        <Text style={{ marginLeft: 6, fontSize: 14, color: '#334155', fontWeight: '700' }}>{event?.volunteers}/{event?.needed} Joiners</Text>
                                    </View>
                                </View>

                                <Text style={{ fontSize: 24, fontWeight: '900', color: '#1e293b', marginBottom: 16, lineHeight: 30 }}>{event?.title}</Text>

                                <View style={{ gap: 12, marginBottom: 24 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
                                            <MaterialIcons name="event" size={18} color="#94a3b8" />
                                        </View>
                                        <Text style={{ marginLeft: 12, fontSize: 15, color: '#475569', fontWeight: '500' }}>{event?.date} • {event?.time}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
                                            <MaterialIcons name="location-on" size={18} color="#94a3b8" />
                                        </View>
                                        <Text style={{ marginLeft: 12, fontSize: 15, color: '#475569', fontWeight: '500' }}>{event?.location}</Text>
                                    </View>
                                </View>

                                <Pressable
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#eff6ff',
                                        padding: 16,
                                        borderRadius: 16,
                                        borderWidth: 1,
                                        borderColor: '#dbeafe',
                                        gap: 10
                                    }}
                                    onPress={() => alert('Opening external link...')}
                                >
                                    <MaterialIcons name="launch" size={20} color="#3b82f6" />
                                    <Text style={{ color: '#3b82f6', fontWeight: '800', fontSize: 16 }}>Visit Website</Text>
                                </Pressable>
                            </View>
                        </View>

                        {/* Mission Section */}
                        <View style={{ gap: 12 }}>
                            <Text style={styles.sectionLabel}>Mission Goal</Text>
                            <View style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 20, borderLeftWidth: 4, borderLeftColor: '#10b981' }}>
                                <Text style={{ fontSize: 16, color: '#475569', lineHeight: 24, fontWeight: '500' }}>
                                    Join us for the {event?.title}. We are looking for volunteers to assist with logistics, attendee management, and overall support to make this {event?.category} a massive success for the community.
                                </Text>
                            </View>
                        </View>
                    </View>
                );
            case 'funding_detail':
                return (
                    <View style={{ gap: 24 }}>
                        {/* Summary Card */}
                        <View style={{ backgroundColor: '#f8fafc', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#f1f5f9' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: (fundingItem?.color || '#3b82f6') + '15', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <MaterialIcons name={fundingItem?.icon as any || 'account-balance'} size={32} color={fundingItem?.color || '#3b82f6'} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', marginBottom: 4 }}>{fundingItem?.title}</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748b' }}>{fundingItem?.organization}</Text>
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                                <View style={{ backgroundColor: '#ffffff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' }}>
                                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#475569' }}>{fundingItem?.category}</Text>
                                </View>
                                {fundingItem?.amount && (
                                    <View style={{ backgroundColor: '#ffffff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0' }}>
                                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#10b981' }}>{fundingItem.amount}</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Description Section */}
                        <View style={{ gap: 10 }}>
                            <Text style={styles.sectionLabel}>About this Support</Text>
                            <Text style={{ fontSize: 15, color: '#4b5563', lineHeight: 24, fontWeight: '500' }}>{fundingItem?.description}</Text>
                        </View>

                        {/* AI Helper CTA */}
                        {fundingItem?.requiresAIHelper && (
                            <Pressable
                                style={{
                                    backgroundColor: '#8b5cf6',
                                    padding: 20,
                                    borderRadius: 20,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 12,
                                    shadowColor: '#8b5cf6',
                                    shadowOffset: { width: 0, height: 10 },
                                    shadowOpacity: 0.2,
                                    shadowRadius: 15,
                                    elevation: 8
                                }}
                                onPress={() => {
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                    setActiveType('funding_ai_helper');
                                    setFundingStep(1);
                                }}
                            >
                                <Ionicons name="sparkles" size={24} color="#ffffff" />
                                <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '800' }}>Apply with AI Helper</Text>
                            </Pressable>
                        )}

                        {/* Eligibility Section */}
                        <View style={{ gap: 12 }}>
                            <Text style={styles.sectionLabel}>Who can apply?</Text>
                            <View style={{ gap: 8 }}>
                                {fundingItem?.eligibility.map((item, idx) => (
                                    <View key={idx} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: fundingItem?.color || '#3b82f6' }} />
                                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#4b5563' }}>{item}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* External Link */}
                        <Pressable
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#fdf4ff',
                                padding: 16,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: '#fae8ff'
                            }}
                            onPress={() => alert('Opening ' + fundingItem?.organization + ' official website...')}
                        >
                            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                <MaterialIcons name="public" size={20} color="#a855f7" />
                                <View>
                                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#7e22ce' }}>Official Website</Text>
                                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#a855f7' }}>View official application details</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#a855f7" />
                        </Pressable>
                    </View>
                );
            case 'funding_ai_helper':
                const steps = [
                    {
                        title: 'Daily Challenges',
                        question: 'How does Sickle Cell affect your daily activities (cooking, cleaning, etc.)?',
                        key: 'daily_life'
                    },
                    {
                        title: 'Pain & Crisis',
                        question: 'Describe the frequency and severity of your pain crises.',
                        key: 'pain'
                    },
                    {
                        title: 'Mobility',
                        question: 'How far can you walk without severe pain or exhaustion?',
                        key: 'mobility'
                    }
                ];

                const currentQuestion = steps[fundingStep - 1];

                const generateApplication = () => {
                    setIsGeneratingFunding(true);
                    // Mock AI generation delay
                    setTimeout(() => {
                        let text = `Subject: Application for ${fundingItem?.title}\n\n`;
                        text += `I am writing to formally apply for ${fundingItem?.title}. As someone living with Sickle Cell Disease, I face significant daily challenges that align with your support criteria.\n\n`;

                        text += `Medical Impact:\n`;
                        text += `Client experiences ${fundingAnswers.pain?.toLowerCase() || 'chronic pain'}. This results in ${fundingAnswers.daily_life?.toLowerCase() || 'difficulties with daily tasks'}.\n\n`;

                        text += `Mobility Assessment:\n`;
                        text += `Functional mobility is limited to ${fundingAnswers.mobility?.toLowerCase() || 'short distances'}, which severely impacts standard independent living capability.\n\n`;

                        text += `Verification:\n`;
                        text += `My clinical history confirms chronic symptomatic sickle cell with associated fatigue and pain. I request consideration for this assistance to help manage these extra costs.`;

                        setGeneratedFundingText(text);
                        setIsGeneratingFunding(false);
                        setFundingStep(4);
                    }, 2000);
                };

                return (
                    <View style={{ flex: 1, gap: 20 }}>
                        {fundingStep <= 3 ? (
                            <>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <Text style={{ fontSize: 13, fontWeight: '800', color: '#8b5cf6', textTransform: 'uppercase', letterSpacing: 1 }}>Step {fundingStep} of 3</Text>
                                    <View style={{ flexDirection: 'row', gap: 4 }}>
                                        {[1, 2, 3].map(s => (
                                            <View key={s} style={{ width: 24, height: 4, borderRadius: 2, backgroundColor: s <= fundingStep ? '#8b5cf6' : '#e2e8f0' }} />
                                        ))}
                                    </View>
                                </View>

                                <View style={{ gap: 8 }}>
                                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#1e293b' }}>{currentQuestion.title}</Text>
                                    <Text style={{ fontSize: 16, color: '#64748b', fontWeight: '500', lineHeight: 24 }}>{currentQuestion.question}</Text>
                                </View>

                                <TextInput
                                    style={{
                                        backgroundColor: '#f8fafc',
                                        borderRadius: 20,
                                        padding: 20,
                                        height: 150,
                                        fontSize: 16,
                                        fontWeight: '500',
                                        color: '#1e293b',
                                        borderWidth: 1,
                                        borderColor: '#e2e8f0',
                                        textAlignVertical: 'top'
                                    }}
                                    placeholder="Type your answer here..."
                                    multiline
                                    value={fundingAnswers[currentQuestion.key] || ''}
                                    onChangeText={(text) => setFundingAnswers(prev => ({ ...prev, [currentQuestion.key]: text }))}
                                />

                                <Pressable
                                    style={{
                                        backgroundColor: '#1F2937',
                                        padding: 18,
                                        borderRadius: 18,
                                        alignItems: 'center',
                                        marginTop: 'auto',
                                        opacity: fundingAnswers[currentQuestion.key] ? 1 : 0.5
                                    }}
                                    disabled={!fundingAnswers[currentQuestion.key]}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        if (fundingStep < 3) {
                                            setFundingStep(fundingStep + 1);
                                        } else {
                                            generateApplication();
                                        }
                                    }}
                                >
                                    <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '800' }}>
                                        {fundingStep < 3 ? 'Continue' : 'Generate Application'}
                                    </Text>
                                </Pressable>
                            </>
                        ) : fundingStep === 4 ? (
                            <View style={{ flex: 1, gap: 20 }}>
                                <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                                    {isGeneratingFunding ? (
                                        <>
                                            <Ionicons name="sparkles" size={48} color="#8b5cf6" style={{ marginBottom: 16 }} />
                                            <Text style={{ fontSize: 20, fontWeight: '900', color: '#1e293b' }}>Generating Text...</Text>
                                            <Text style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>Converting your answers to medical terminology</Text>
                                        </>
                                    ) : (
                                        <>
                                            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                                                <MaterialIcons name="check" size={28} color="#10b981" />
                                            </View>
                                            <Text style={{ fontSize: 20, fontWeight: '900', color: '#1e293b' }}>Application Ready</Text>
                                            <Text style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>Review and copy the generated text below</Text>
                                        </>
                                    )}
                                </View>

                                {!isGeneratingFunding && (
                                    <>
                                        <View style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 20, borderWidth: 1, borderColor: '#e2e8f0', flex: 1 }}>
                                            <ScrollView showsVerticalScrollIndicator={false}>
                                                <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>{generatedFundingText}</Text>
                                            </ScrollView>
                                        </View>

                                        <View style={{ flexDirection: 'row', gap: 12 }}>
                                            <Pressable
                                                style={{ flex: 1, backgroundColor: '#f1f5f9', padding: 18, borderRadius: 18, alignItems: 'center' }}
                                                onPress={() => {
                                                    setFundingStep(1);
                                                    setFundingAnswers({});
                                                    setActiveType('funding_detail');
                                                }}
                                            >
                                                <Text style={{ color: '#64748b', fontSize: 16, fontWeight: '800' }}>Discard</Text>
                                            </Pressable>
                                            <Pressable
                                                style={{ flex: 2, backgroundColor: '#8b5cf6', padding: 18, borderRadius: 18, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
                                                onPress={() => {
                                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                                    alert('Application text copied to clipboard!');
                                                    onClose();
                                                }}
                                            >
                                                <MaterialIcons name="content-copy" size={20} color="#ffffff" />
                                                <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '800' }}>Copy to Clipboard</Text>
                                            </Pressable>
                                        </View>
                                    </>
                                )}
                            </View>
                        ) : null}
                    </View>
                );
            case 'learning_module':
                return (
                    <View style={{ gap: 24 }}>
                        {/* Module Overview Card */}
                        <View style={{ backgroundColor: (educationModule?.bg || '#eff6ff'), padding: 24, borderRadius: 28, borderWidth: 1, borderColor: (educationModule?.border || '#dbeafe') }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <MaterialIcons name={educationModule?.icon as any || 'school'} size={32} color={educationModule?.color || '#3b82f6'} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontSize: 20, fontWeight: '900', color: '#111827', marginBottom: 4 }}>{educationModule?.title}</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#64748b' }}>{educationModule?.totalDuration || '20 min'} • {educationModule?.lessons?.length || 0} Lessons</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 14, color: '#4b5563', lineHeight: 22, fontWeight: '500' }}>{educationModule?.description}</Text>
                        </View>

                        {/* Lesson List */}
                        <View style={{ gap: 12 }}>
                            <Text style={styles.sectionLabel}>Course Content</Text>
                            {(educationModule?.lessons || []).map((lesson: any, idx: number) => {
                                const isCompleted = (moduleProgress[educationModule?.id] || 0) > (idx / educationModule?.lessons?.length);
                                return (
                                    <Pressable
                                        key={idx}
                                        onPress={() => {
                                            Haptics.selectionAsync();
                                            setCurrentLessonIndex(idx);
                                            setActiveType('module_lesson');
                                        }}
                                        style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            backgroundColor: '#fff',
                                            padding: 16,
                                            borderRadius: 20,
                                            borderWidth: 1,
                                            borderColor: '#f1f5f9',
                                            gap: 16
                                        }}
                                    >
                                        <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#94a3b8' }}>{idx + 1}</Text>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 2 }}>{lesson.title}</Text>
                                            <Text style={{ fontSize: 12, color: '#94a3b8', fontWeight: '600' }}>{lesson.duration}</Text>
                                        </View>
                                        <MaterialIcons name={isCompleted ? "check-circle" : "play-circle-outline"} size={22} color={isCompleted ? "#10b981" : "#cbd5e1"} />
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                );
            case 'module_lesson':
                const currentLesson = educationModule?.lessons?.[currentLessonIndex];
                const isLastLesson = currentLessonIndex === educationModule?.lessons?.length - 1;
                return (
                    <View style={{ flex: 1 }}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                            <View style={{ gap: 24 }}>
                                <View style={{ gap: 8 }}>
                                    <Text style={{ fontSize: 12, fontWeight: '800', color: (educationModule?.color || '#3b82f6'), textTransform: 'uppercase', letterSpacing: 1 }}>
                                        LESSON {currentLessonIndex + 1} OF {educationModule?.lessons?.length}
                                    </Text>
                                    <Text style={{ fontSize: 24, fontWeight: '900', color: '#111827' }}>{currentLesson?.title}</Text>
                                </View>

                                <Text style={{ fontSize: 16, color: '#475569', lineHeight: 28, fontWeight: '500' }}>
                                    {currentLesson?.content}
                                </Text>

                                {currentLesson?.keyPoints && (
                                    <View style={{ backgroundColor: '#f8fafc', padding: 24, borderRadius: 24, gap: 16 }}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                            <MaterialIcons name="auto-awesome" size={18} color={educationModule?.color || '#3b82f6'} />
                                            <Text style={{ fontSize: 15, fontWeight: '800', color: '#1e293b' }}>Key Takeaways</Text>
                                        </View>
                                        <View style={{ gap: 12 }}>
                                            {currentLesson.keyPoints.map((point: string, i: number) => (
                                                <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: (educationModule?.color || '#3b82f6') }} />
                                                    <Text style={{ fontSize: 14, color: '#4b5563', fontWeight: '600' }}>{point}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}
                            </View>
                        </ScrollView>

                        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', paddingTop: 20, flexDirection: 'row', gap: 12 }}>
                            <Pressable
                                onPress={() => setActiveType('learning_module')}
                                style={{ flex: 1, height: 56, borderRadius: 18, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '700', color: '#64748b' }}>Exit</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                    if (!isLastLesson) {
                                        setCurrentLessonIndex(currentLessonIndex + 1);
                                    } else {
                                        // Update progress and exit
                                        setModuleProgress(prev => ({
                                            ...prev,
                                            [educationModule?.id]: 1
                                        }));
                                        setActiveType('learning_module');
                                    }
                                }}
                                style={{ flex: 2, height: 56, borderRadius: 18, backgroundColor: (educationModule?.color || '#3b82f6'), alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
                            >
                                <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                                    {isLastLesson ? 'Complete Module' : 'Next Lesson'}
                                </Text>
                                <MaterialIcons name="arrow-forward" size={18} color="#fff" />
                            </Pressable>
                        </View>
                    </View>
                );
            case 'quiz_start':
                return (
                    <View style={{ gap: 24 }}>
                        <View style={{ backgroundColor: (quizItem?.color || '#f59e0b') + '10', padding: 24, borderRadius: 28, borderWidth: 1, borderColor: (quizItem?.color || '#f59e0b') + '20' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
                                <View style={{ width: 64, height: 64, borderRadius: 22, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <MaterialIcons name={quizItem?.icon as any || 'quiz'} size={32} color={quizItem?.color || '#f59e0b'} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View className="bg-amber-50 self-start px-2 py-0.5 rounded-md mb-1">
                                        <Text className="text-amber-600 text-[10px] font-black uppercase">{quizItem?.subtitle || 'CHALLENGE'}</Text>
                                    </View>
                                    <Text style={{ fontSize: 20, fontWeight: '900', color: '#111827' }}>{quizItem?.title}</Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 14, color: '#4b5563', lineHeight: 22, fontWeight: '500' }}>{quizItem?.description}</Text>
                        </View>

                        <View style={{ gap: 12 }}>
                            <Text style={styles.sectionLabel}>Quiz Details</Text>
                            <View className="flex-row items-center justify-between bg-white p-4 rounded-2xl border border-gray-100">
                                <View className="flex-row items-center gap-3">
                                    <Feather name="help-circle" size={18} color="#64748b" />
                                    <Text className="text-gray-600 font-bold">Total Questions</Text>
                                </View>
                                <Text className="text-gray-900 font-black">{quizItem?.questions?.length || 0}</Text>
                            </View>
                            <View className="flex-row items-center justify-between bg-white p-4 rounded-2xl border border-gray-100">
                                <View className="flex-row items-center gap-3">
                                    <Feather name="target" size={18} color="#64748b" />
                                    <Text className="text-gray-600 font-bold">Passing Score</Text>
                                </View>
                                <Text className="text-gray-900 font-black">{quizItem?.passingScore}%</Text>
                            </View>
                        </View>

                        <Pressable
                            style={{ backgroundColor: quizItem?.color || '#8b5cf6', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 20 }}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                setQuizAnswers({});
                                setCurrentQuestionIdx(0);
                                setActiveType('quiz_question');
                            }}
                        >
                            <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>Start Quiz</Text>
                        </Pressable>
                    </View>
                );
            case 'quiz_question':
                const q = quizItem?.questions?.[currentQuestionIdx];
                const progress = ((currentQuestionIdx + 1) / (quizItem?.questions?.length || 1)) * 100;

                return (
                    <View style={{ flex: 1 }}>
                        <View style={{ height: 4, backgroundColor: '#f1f5f9', borderRadius: 2, marginBottom: 24, overflow: 'hidden' }}>
                            <View style={{ width: `${progress}%`, height: '100%', backgroundColor: quizItem?.color || '#f59e0b' }} />
                        </View>

                        <Text style={{ fontSize: 18, fontWeight: '800', color: '#111827', lineHeight: 28, marginBottom: 32 }}>
                            {q?.question}
                        </Text>

                        <View style={{ gap: 12 }}>
                            {(q?.options || []).map((option: string, idx: number) => {
                                const isSelected = quizAnswers[q.id] === option;
                                return (
                                    <Pressable
                                        key={idx}
                                        onPress={() => {
                                            Haptics.selectionAsync();
                                            setQuizAnswers(prev => ({ ...prev, [q.id]: option }));
                                            setShowExplanation(true);
                                        }}
                                        disabled={showExplanation}
                                        style={{
                                            padding: 20,
                                            borderRadius: 20,
                                            backgroundColor: isSelected ? (showExplanation ? (option === q.correctAnswer ? '#f0fdf4' : '#fef2f2') : '#f8fbfc') : '#fff',
                                            borderWidth: 2,
                                            borderColor: isSelected ? (showExplanation ? (option === q.correctAnswer ? '#10b981' : '#f43f5e') : (quizItem?.color || '#8b5cf6')) : '#f1f5f9',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        <Text style={{ fontSize: 15, fontWeight: '700', color: isSelected ? '#111827' : '#475569', flex: 1 }}>
                                            {option}
                                        </Text>
                                        {showExplanation && (
                                            <MaterialIcons
                                                name={option === q.correctAnswer ? "check-circle" : (isSelected ? "cancel" : "radio-button-unchecked")}
                                                size={24}
                                                color={option === q.correctAnswer ? "#10b981" : (isSelected ? "#f43f5e" : "#cbd5e1")}
                                            />
                                        )}
                                    </Pressable>
                                );
                            })}
                        </View>

                        {showExplanation && (
                            <View style={{ backgroundColor: '#f8fafc', padding: 20, borderRadius: 20, marginTop: 24, borderLeftWidth: 4, borderLeftColor: quizAnswers[q.id] === q.correctAnswer ? '#10b981' : '#f43f5e' }}>
                                <Text style={{ fontSize: 12, fontWeight: '800', color: quizAnswers[q.id] === q.correctAnswer ? '#10b981' : '#f43f5e', textTransform: 'uppercase', marginBottom: 4 }}>
                                    {quizAnswers[q.id] === q.correctAnswer ? 'Correct!' : 'Keep Learning'}
                                </Text>
                                <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22, fontWeight: '500' }}>
                                    {q.explanation}
                                </Text>
                            </View>
                        )}

                        {showExplanation && (
                            <Pressable
                                style={{ backgroundColor: '#111827', padding: 20, borderRadius: 20, alignItems: 'center', marginTop: 'auto' }}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    if (currentQuestionIdx < (quizItem?.questions?.length - 1)) {
                                        setCurrentQuestionIdx(currentQuestionIdx + 1);
                                        setShowExplanation(false);
                                    } else {
                                        // Finalize quiz
                                        let correctCount = 0;
                                        quizItem.questions.forEach((quest: any) => {
                                            if (quizAnswers[quest.id] === quest.correctAnswer) correctCount++;
                                        });
                                        const finalScore = Math.round((correctCount / quizItem.questions.length) * 100);
                                        setQuizResult({ score: finalScore, passed: finalScore >= quizItem.passingScore });
                                        if (finalScore >= quizItem.passingScore) {
                                            setShowConfetti(true);
                                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                        } else {
                                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                                        }
                                        setActiveType('quiz_results');
                                    }
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>
                                    {currentQuestionIdx < (quizItem?.questions?.length - 1) ? 'Next Question' : 'View Results'}
                                </Text>
                            </Pressable>
                        )}
                    </View>
                );
            case 'quiz_results':
                return (
                    <View style={{ alignItems: 'center', gap: 24 }}>
                        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: quizResult.passed ? '#f0fdf4' : '#fff1f2', alignItems: 'center', justifyContent: 'center' }}>
                            <MaterialIcons name={quizResult.passed ? "auto-awesome" : "sentiment-very-dissatisfied"} size={64} color={quizResult.passed ? "#10b981" : "#f43f5e"} />
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 32, fontWeight: '900', color: '#111827' }}>{quizResult.score}%</Text>
                            <Text style={{ fontSize: 18, fontWeight: '700', color: quizResult.passed ? '#10b981' : '#f43f5e', marginTop: 4 }}>
                                {quizResult.passed ? 'Excellent! Quiz Passed' : 'Not quite. Try again!'}
                            </Text>
                        </View>

                        <View style={{ width: '100%', backgroundColor: '#f8fafc', padding: 24, borderRadius: 28, gap: 16 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748b' }}>Weekly Streak</Text>
                                <Text style={{ fontSize: 14, fontWeight: '800', color: '#fbbf24' }}>5 Days 🔥</Text>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748b' }}>Accuracy</Text>
                                <Text style={{ fontSize: 14, fontWeight: '800', color: '#1e293b' }}>{quizResult.passed ? 'High' : 'Improving'}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
                            <Pressable
                                style={{ flex: 1, backgroundColor: '#f1f5f9', padding: 18, borderRadius: 18, alignItems: 'center' }}
                                onPress={() => {
                                    setQuizAnswers({});
                                    setCurrentQuestionIdx(0);
                                    setShowExplanation(false);
                                    setActiveType('quiz_start');
                                }}
                            >
                                <Text style={{ color: '#64748b', fontSize: 16, fontWeight: '800' }}>Retake</Text>
                            </Pressable>
                            <Pressable
                                style={{ flex: 2, backgroundColor: '#111827', padding: 18, borderRadius: 18, alignItems: 'center' }}
                                onPress={() => {
                                    onClose();
                                    setShowConfetti(false);
                                }}
                            >
                                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '800' }}>Complete</Text>
                            </Pressable>
                        </View>
                    </View>
                );
            case 'event_calendar':
                return (
                    <View style={{ gap: 24 }}>
                        {/* Custom Calendar Header */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                            <Text style={{ fontSize: 20, fontWeight: '900', color: '#1e293b' }}>January 2026</Text>
                            <View style={{ flexDirection: 'row', gap: 8 }}>
                                <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
                                    <MaterialIcons name="chevron-left" size={20} color="#64748b" />
                                </Pressable>
                                <Pressable style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
                                    <MaterialIcons name="chevron-right" size={20} color="#64748b" />
                                </Pressable>
                            </View>
                        </View>

                        {/* Calendar Grid */}
                        <View>
                            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                    <Text key={i} style={{ flex: 1, textAlign: 'center', fontSize: 12, fontWeight: '800', color: '#94a3b8' }}>{day}</Text>
                                ))}
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                                {Array.from({ length: 35 }).map((_, i) => {
                                    const day = i - 2; // Start from Tues for Jan 2026 placeholder
                                    const isCurrentMonth = day > 0 && day <= 31;
                                    const hasEvent = isCurrentMonth && [5, 12, 28].includes(day);

                                    return (
                                        <View key={i} style={{ width: '14.28%', height: 44, alignItems: 'center', justifyContent: 'center' }}>
                                            {isCurrentMonth && (
                                                <Pressable
                                                    style={{
                                                        width: 34,
                                                        height: 34,
                                                        borderRadius: 12,
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        backgroundColor: day === 28 ? '#1e293b' : 'transparent',
                                                        borderWidth: hasEvent && day !== 28 ? 1 : 0,
                                                        borderColor: '#e2e8f0'
                                                    }}
                                                >
                                                    <Text style={{
                                                        fontSize: 14,
                                                        fontWeight: '700',
                                                        color: day === 28 ? '#fff' : hasEvent ? '#1e293b' : '#64748b'
                                                    }}>{day}</Text>
                                                    {hasEvent && day !== 28 && (
                                                        <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: '#10b981', position: 'absolute', bottom: 4 }} />
                                                    )}
                                                </Pressable>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Upcoming Events List */}
                        <View style={{ gap: 16 }}>
                            <Text style={styles.sectionLabel}>Upcoming this month</Text>
                            {(eventsList || []).map((item) => (
                                <Pressable
                                    key={item.id}
                                    onPress={() => navigateTo('event_detail')}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: '#fff',
                                        padding: 12,
                                        borderRadius: 20,
                                        borderWidth: 1,
                                        borderColor: '#f1f5f9',
                                        gap: 12
                                    }}
                                >
                                    <Image source={{ uri: item.image }} style={{ width: 48, height: 48, borderRadius: 12 }} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#1e293b' }}>{item.title}</Text>
                                        <Text style={{ fontSize: 13, color: '#64748b', fontWeight: '500' }}>{item.date} • {item.location}</Text>
                                    </View>
                                    <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' }}>
                                        <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
                                    </View>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Modal visible={visible} transparent animationType="slide" onRequestClose={goBack}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                <View style={styles.container}>
                    <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                        <Pressable style={StyleSheet.absoluteFill} onPress={goBack}>
                            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                        </Pressable>
                    </Animated.View>

                    <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                        <View
                            style={[
                                styles.content,
                                (activeType === 'event_detail' || activeType === 'event_calendar' || activeType === 'create_event' || activeType === 'volunteer_actions' || activeType === 'volunteer_log_hours' || activeType === 'log_selection' || activeType === 'community_actions' || activeType === 'funding_detail' || activeType === 'funding_ai_helper' || activeType === 'learning_module' || activeType === 'module_lesson' || activeType === 'task') && { height: height * 0.85 },
                                (activeType === 'request_task') && { height: height * 0.55 },
                                (activeType === 'hydration') && { height: height * 0.65 },
                                (activeType === 'meds') && { height: height * 0.75 },
                                (activeType === 'pain') && { minHeight: height * 0.65 },
                                (activeType === 'mood') && { minHeight: height * 0.62 },
                                (activeType === 'triggers') && { minHeight: height * 0.65 },
                                (activeType === 'crisis') && { minHeight: height * 0.68 },
                                (activeType === 'wellness_summary' || activeType === 'metrics_info' || activeType === 'manage_task') && { minHeight: height * 0.55 },
                                (activeType === 'activity_detail') && { minHeight: height * 0.38 },
                                (activeType === 'member') && { height: height * 0.85 },
                                (activeType === 'mission_detail') && { minHeight: height * 0.70 },
                                (activeType === 'idea') && { minHeight: height * 0.55 },
                                (activeType === 'group') && { minHeight: height * 0.60 }
                            ]}
                        >
                            <View style={styles.modalCard}>
                                <View {...panResponder.panHandlers} style={styles.grabberArea}>
                                    <View style={styles.grabber} />
                                </View>
                            {activeType !== 'message_selection' ? (
                            <View style={styles.header}>
                                {activeType !== 'mission_detail' && (
                                <View style={[styles.iconContainer, { backgroundColor: `${header.color}15` }]}>
                                    <MaterialIcons name={header.icon as any} size={28} color={header.color} />
                                </View>
                                )}
                                <View style={styles.headerText}>
                                    <Text style={styles.headerTitle}>
                                        {activeType === 'member' ? header.title :
                                            activeType === 'community_actions' ? 'Community Hub' :
                                                activeType === 'mission_detail' ? header.title :
                                                (activeType === 'event_detail' || activeType === 'event_calendar' || activeType === 'create_event' || activeType === 'volunteer_actions' || activeType === 'volunteer_log_hours' || activeType === 'manage_task' || activeType === 'request_task')
                                                    ? header.title : 'Log ' + header.title}
                                    </Text>
                                    <Text style={styles.headerSub}>
                                        {activeType === 'member' ? member?.status + ' • ' + member?.role :
                                            activeType === 'idea' ? 'Share with the community' :
                                                activeType === 'group' ? 'Start a new chapter' :
                                                    activeType === 'community_actions' ? 'Manage your community' :
                                                        activeType === 'volunteer_actions' ? 'Your impact dashboard' :
                                                            activeType === 'volunteer_log_hours' ? 'Record service time' :
                                                                activeType === 'mission_detail' ? 'Support opportunity details' :
                                                                activeType === 'invite_member' ? 'Expand your circle' :
                                                                    activeType === 'manage_task' ? 'Delegate this task' :
                                                                        activeType === 'request_task' ? 'Be a hero today' :
                                                                            activeType === 'event_calendar' ? 'View upcoming community initiatives' :
                                                                                activeType === 'event_detail' ? 'Event Information' :
                                                                                    activeType === 'learning_module' ? 'Master your health journey' :
                                                                                        activeType === 'module_lesson' ? 'Topic Deep Dive' :
                                                                                            'Recording for Today, ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                    </Text>
                                </View>
                                <Pressable onPress={goBack} style={styles.closeButton}>
                                    <MaterialIcons name={history.length > 0 ? "arrow-back" : "close"} size={24} color="#94a3b8" />
                                </Pressable>
                            </View>
                            ) : (
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 20, paddingBottom: 8 }}>
                                <Pressable onPress={onClose} style={styles.closeButton}>
                                    <MaterialIcons name="close" size={24} color="#94a3b8" />
                                </Pressable>
                            </View>
                            )}

                            <ScrollView
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={styles.scrollContent}
                                style={{ flex: 1 }}
                                keyboardShouldPersistTaps="always"
                                keyboardDismissMode="on-drag"
                            >
                                {renderContent()}

                                {(activeType === 'pain' || activeType === 'hydration' || activeType === 'meds' || activeType === 'mood' || activeType === 'triggers' || activeType === 'crisis' || activeType === 'idea' || activeType === 'log_selection' || activeType === 'create_event') && (
                                    <View style={styles.notesSection}>
                                        <Text style={styles.sectionLabel}>Additional Notes</Text>
                                        <Pressable
                                            style={[styles.textArea, { justifyContent: 'flex-start' }]}
                                            onPress={() => {
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                setTempNotes(notes);
                                                setShowNotesModal(true);
                                            }}
                                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                        >
                                            <Text style={{ color: notes ? '#1e293b' : '#94a3b8', fontSize: 16 }}>
                                                {notes || 'Tap to add notes...'}
                                            </Text>
                                        </Pressable>
                                    </View>
                                )}

                            </ScrollView>

                            {activeType !== 'activity_detail' && activeType !== 'metrics_info' && activeType !== 'member' && activeType !== 'message_selection' && activeType !== 'learning_module' && activeType !== 'module_lesson' && activeType !== 'wellness_summary' && (
                                <View style={{
                                    paddingHorizontal: 24,
                                    paddingTop: 16,
                                    paddingBottom: Math.max(insets.bottom, 40),
                                    backgroundColor: '#fff',
                                    borderTopWidth: 1,
                                    borderTopColor: '#f1f5f9',
                                }}>
                                    <Pressable
                                        onPress={() => {
                                            switch (activeType) {
                                                case 'pain': if (value && onPainUpdate) onPainUpdate(parseInt(value), notes || undefined); break;
                                                case 'hydration': if (value && onHydrationUpdate) onHydrationUpdate(value, notes || undefined); break;
                                                case 'mood': if (value && onMoodUpdate) onMoodUpdate(value, notes || undefined); break;
                                                case 'triggers': if (value && onTriggersUpdate) onTriggersUpdate(value.split(', '), notes || undefined); break;
                                                case 'crisis': if (value && onCrisisUpdate) onCrisisUpdate(startTime, parseInt(value), notes || undefined); break;
                                                case 'edit_member': alert('Changes saved locally!'); break;
                                                case 'create_event':
                                                case 'event_detail':
                                                    triggerToast();
                                                    return;
                                                case 'manage_task':
                                                    if (selectedHelpers.length > 0) {
                                                        triggerToast();
                                                        return;
                                                    } else {
                                                        alert('Please select at least one helper');
                                                        return;
                                                    }
                                            }
                                            onClose();
                                        }}
                                        style={[styles.saveButton, { backgroundColor: header.color }]}
                                    >
                                        <Text style={styles.saveButtonText}>
                                            {activeType === 'idea' ? 'Post to Community' :
                                                activeType === 'group' ? 'Send Proposal' :
                                                    activeType === 'volunteer_log_hours' ? 'Save Service Log' :
                                                        activeType === 'mission_detail' ? 'Join Mission' :
                                                            activeType === 'invite_member' ? 'Send Invitation' :
                                                                activeType === 'manage_task' ? 'Assign Task' :
                                                                    activeType === 'request_task' ? 'Claim Task' :
                                                                        activeType === 'view_care_plan' ? 'Close' :
                                                                            activeType === 'edit_member' ? 'Save Changes' :
                                                                                activeType === 'create_event' ? 'Propose Event' :
                                                                                    activeType === 'event_detail' ? 'Join Initiative' :
                                                                                        activeType === 'event_calendar' ? 'Close' :
                                                                                            'Save Entry'}
                                        </Text>
                                    </Pressable>
                                </View>
                            )}

                            {/* Premium Toast Notification */}
                            {showToast && (
                                <Animated.View
                                    style={[
                                        styles.toastContainer,
                                        { transform: [{ translateY: toastAnim }] }
                                    ]}
                                >
                                    <View style={styles.toastContent}>
                                        <View style={styles.toastIcon}>
                                            <MaterialIcons name="check-circle" size={20} color="#fff" />
                                        </View>
                                        <Text style={styles.toastText}>
                                            {selectedHelpers.length > 1 ? 'Helpers notified' : `${selectedHelpers[0]} will be notified`}
                                        </Text>
                                    </View>
                                </Animated.View>
                            )}

                            {showConfetti && (
                                <View style={StyleSheet.absoluteFill} pointerEvents="none">
                                    <ConfettiCannon
                                        count={50}
                                        origin={{ x: width / 2, y: -20 }}
                                        fadeOut={true}
                                        fallSpeed={3000}
                                        colors={['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b']}
                                    />
                                </View>
                            )}
                        </View>
                        </View>
                    </Animated.View>
                </View>

                {/* Compact Notes Input Overlay */}
                {showNotesModal && (
                    <Pressable
                        style={styles.notesModalOverlay}
                        onPress={() => setShowNotesModal(false)}
                    >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.notesModalKeyboardView}
                        >
                            <Pressable
                                style={styles.notesModalContent}
                                onPress={(e) => e.stopPropagation()}
                            >
                                <View style={styles.notesModalHandle} />
                                <View style={styles.notesModalHeader}>
                                    <Text style={styles.notesModalTitle}>Additional Notes</Text>
                                    <Pressable onPress={() => setShowNotesModal(false)} style={styles.notesModalCloseButton}>
                                        <MaterialIcons name="close" size={24} color="#6B7280" />
                                    </Pressable>
                                </View>
                                <View style={styles.notesModalInputContainer}>
                                    <TextInput
                                        style={styles.notesModalInput}
                                        value={tempNotes}
                                        onChangeText={setTempNotes}
                                        placeholder="How are you feeling otherwise?"
                                        placeholderTextColor="#9CA3AF"
                                        autoFocus={true}
                                        returnKeyType="done"
                                        onSubmitEditing={() => {
                                            setNotes(tempNotes);
                                            setShowNotesModal(false);
                                        }}
                                    />
                                    <Pressable
                                        onPress={() => {
                                            setNotes(tempNotes);
                                            setShowNotesModal(false);
                                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                        }}
                                        style={styles.notesModalDoneButton}
                                    >
                                        <MaterialIcons name="check" size={24} color="#fff" />
                                    </Pressable>
                                </View>
                                <Text style={styles.notesModalHint}>
                                    Add any additional context about how you're feeling
                                </Text>
                            </Pressable>
                        </KeyboardAvoidingView>
                    </Pressable>
                )}

                {/* Edit Medication Overlay */}
                {showEditMedOverlay && (
                    <Pressable
                        style={styles.editMedOverlay}
                        onPress={() => setShowEditMedOverlay(false)}
                    >
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.editMedKeyboardView}
                            pointerEvents="box-none"
                        >
                            <View
                                style={styles.editMedContent}
                                onStartShouldSetResponder={() => true}
                            >
                                <View style={styles.editMedHandle} />
                                <View style={styles.editMedHeader}>
                                    <Text style={styles.editMedTitle}>Edit Medication</Text>
                                    <Pressable onPress={() => setShowEditMedOverlay(false)} style={styles.editMedCloseButton}>
                                        <MaterialIcons name="close" size={24} color="#6B7280" />
                                    </Pressable>
                                </View>

                                <ScrollView
                                    style={{ maxHeight: 450 }}
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="always"
                                >
                                    {/* Medication Name */}
                                    <View style={styles.editMedField}>
                                        <Text style={styles.editMedLabel}>Medication Name</Text>
                                        <TextInput
                                            style={styles.editMedInput}
                                            value={editMedName}
                                            onChangeText={setEditMedName}
                                            placeholder="Enter medication name"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>

                                    {/* Dosage */}
                                    <View style={styles.editMedField}>
                                        <Text style={styles.editMedLabel}>Dosage (optional)</Text>
                                        <TextInput
                                            style={styles.editMedInput}
                                            value={editMedDosage}
                                            onChangeText={setEditMedDosage}
                                            placeholder="e.g., 500mg, 1 tablet"
                                            placeholderTextColor="#9CA3AF"
                                        />
                                    </View>

                                    {/* Frequency */}
                                    <View style={styles.editMedField}>
                                        <Text style={styles.editMedLabel}>Frequency</Text>
                                        <View style={styles.frequencyChipsContainer}>
                                            {(['once_daily', 'twice_daily', 'as_needed'] as MedicationFrequency[]).map((freq) => (
                                                <Pressable
                                                    key={freq}
                                                    onPress={() => {
                                                        setEditMedFrequency(freq);
                                                        Haptics.selectionAsync();
                                                    }}
                                                    style={[
                                                        styles.frequencyChip,
                                                        editMedFrequency === freq && styles.frequencyChipActive,
                                                    ]}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.frequencyChipText,
                                                            editMedFrequency === freq && styles.frequencyChipTextActive,
                                                        ]}
                                                    >
                                                        {FREQUENCY_LABELS[freq]}
                                                    </Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                    </View>

                                    {/* Time (only if not as_needed) */}
                                    {editMedFrequency !== 'as_needed' && (
                                        <View style={styles.editMedField}>
                                            <Text style={styles.editMedLabel}>Time</Text>
                                            <View style={styles.timeChipsContainer}>
                                                {['6:00 AM', '8:00 AM', '12:00 PM', '6:00 PM', '8:00 PM', '10:00 PM'].map((time) => (
                                                    <Pressable
                                                        key={time}
                                                        onPress={() => {
                                                            setEditMedTimes([time]);
                                                            Haptics.selectionAsync();
                                                        }}
                                                        style={[
                                                            styles.timeChip,
                                                            editMedTimes.includes(time) && styles.timeChipActive,
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styles.timeChipText,
                                                                editMedTimes.includes(time) && styles.timeChipTextActive,
                                                            ]}
                                                        >
                                                            {time}
                                                        </Text>
                                                    </Pressable>
                                                ))}
                                            </View>
                                        </View>
                                    )}

                                    {/* Notes */}
                                    <View style={styles.editMedField}>
                                        <Text style={styles.editMedLabel}>Notes (optional)</Text>
                                        <TextInput
                                            style={[styles.editMedInput, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
                                            value={editMedNotes}
                                            onChangeText={setEditMedNotes}
                                            placeholder="Add any notes about this medication..."
                                            placeholderTextColor="#9CA3AF"
                                            multiline
                                        />
                                    </View>
                                </ScrollView>

                                {/* Save Button */}
                                <Pressable
                                    onPress={saveEditedMedication}
                                    disabled={!editMedName.trim()}
                                    style={[
                                        styles.editMedSaveButton,
                                        !editMedName.trim() && styles.editMedSaveButtonDisabled,
                                    ]}
                                >
                                    <Text style={styles.editMedSaveButtonText}>Save Changes</Text>
                                </Pressable>
                            </View>
                        </KeyboardAvoidingView>
                    </Pressable>
                )}
                </KeyboardAvoidingView>
            </Modal>
            {/* Barcode Scanner Modal */}
            <Modal
                visible={showBarcodeScanner}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setShowBarcodeScanner(false)}
            >
                <View style={{ flex: 1, backgroundColor: '#000' }}>
                    <CameraView
                        style={{ flex: 1 }}
                        facing="back"
                        barcodeScannerSettings={{
                            barcodeTypes: ['upc_a', 'upc_e', 'ean13', 'ean8', 'code128', 'code39'],
                        }}
                        onBarcodeScanned={handleBarcodeScanned}
                    >
                        {/* Overlay */}
                        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                            {/* Top Bar */}
                            <View style={{
                                paddingTop: Platform.OS === 'ios' ? 60 : 40,
                                paddingHorizontal: 20,
                                paddingBottom: 20,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#fff' }}>
                                        Scan Medication Barcode
                                    </Text>
                                    <Pressable
                                        onPress={() => setShowBarcodeScanner(false)}
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 18,
                                            backgroundColor: 'rgba(255,255,255,0.2)',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <MaterialIcons name="close" size={24} color="#fff" />
                                    </Pressable>
                                </View>
                            </View>

                            {/* Scanning Frame */}
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 }}>
                                <View style={{
                                    width: 280,
                                    height: 180,
                                    borderWidth: 3,
                                    borderColor: '#8b5cf6',
                                    borderRadius: 20,
                                    backgroundColor: 'transparent',
                                }}>
                                    {/* Corner markers */}
                                    <View style={{ position: 'absolute', top: -3, left: -3, width: 40, height: 40, borderTopWidth: 6, borderLeftWidth: 6, borderColor: '#8b5cf6', borderTopLeftRadius: 20 }} />
                                    <View style={{ position: 'absolute', top: -3, right: -3, width: 40, height: 40, borderTopWidth: 6, borderRightWidth: 6, borderColor: '#8b5cf6', borderTopRightRadius: 20 }} />
                                    <View style={{ position: 'absolute', bottom: -3, left: -3, width: 40, height: 40, borderBottomWidth: 6, borderLeftWidth: 6, borderColor: '#8b5cf6', borderBottomLeftRadius: 20 }} />
                                    <View style={{ position: 'absolute', bottom: -3, right: -3, width: 40, height: 40, borderBottomWidth: 6, borderRightWidth: 6, borderColor: '#8b5cf6', borderBottomRightRadius: 20 }} />
                                </View>

                                <Text style={{
                                    marginTop: 30,
                                    fontSize: 16,
                                    fontWeight: '600',
                                    color: '#fff',
                                    textAlign: 'center',
                                    textShadowColor: 'rgba(0,0,0,0.75)',
                                    textShadowOffset: { width: 0, height: 2 },
                                    textShadowRadius: 4,
                                }}>
                                    Position barcode within the frame
                                </Text>
                            </View>

                            {/* Bottom Instructions */}
                            <View style={{
                                paddingHorizontal: 20,
                                paddingVertical: 30,
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                alignItems: 'center',
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <MaterialIcons name="info-outline" size={20} color="#8b5cf6" style={{ marginRight: 8 }} />
                                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>
                                        Scan the barcode on your medication box
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 13, color: '#94a3b8', textAlign: 'center' }}>
                                    We'll automatically look up the medication details
                                </Text>
                            </View>
                        </View>
                    </CameraView>
                </View>
            </Modal>

                    </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-end' },
    content: { width: '100%', maxHeight: height * 0.9, minHeight: height * 0.5, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
    modalCard: { flex: 1, paddingBottom: 0 },
    grabberArea: { paddingVertical: 12, alignItems: 'center' },
    grabber: { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    iconContainer: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    headerText: { flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
    headerSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
    closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
    scrollContent: { padding: 24, paddingBottom: 100 },
    contentSection: { marginBottom: 24 },
    sectionLabel: { fontSize: 13, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 },
    scaleContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    scaleButton: { width: (width - 80) / 5, height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
    scaleText: { fontSize: 16, fontWeight: '700', color: '#475569' },
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    gridButton: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
    gridText: { fontSize: 14, fontWeight: '600', color: '#475569' },
    checkItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    checkbox: { marginRight: 12 },
    checkLabel: { fontSize: 16, fontWeight: '600', color: '#334155', flex: 1 },
    smallInput: { backgroundColor: '#f8fafc', borderRadius: 16, padding: 16, fontSize: 15, color: '#1e293b', borderWidth: 1, borderColor: '#f1f5f9' },
    textArea: { backgroundColor: '#f8fafc', borderRadius: 20, padding: 16, fontSize: 15, color: '#1e293b', height: 120, textAlignVertical: 'top' },
    notesSection: { marginTop: 8, marginBottom: 32 },
    saveButton: { backgroundColor: '#000', borderRadius: 20, paddingVertical: 18, alignItems: 'center' },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '800' },
    moodContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
    moodItem: { alignItems: 'center' },
    moodLabel: { fontSize: 12, color: '#64748b', marginTop: 8 },
    crisisForm: { gap: 16 },
    inputWrapper: { gap: 8 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#64748b' },
    taskDetailCard: { backgroundColor: '#f8fafc', borderRadius: 20, padding: 16, borderWidth: 1, marginBottom: 20 },
    taskDescription: { fontSize: 15, color: '#475569', lineHeight: 22 },
    insightBox: { backgroundColor: '#f8fafc', borderRadius: 20, padding: 16, borderLeftWidth: 4, borderLeftColor: '#cbd5e1' },
    insightText: { fontSize: 14, color: '#64748b', fontStyle: 'italic', lineHeight: 20 },
    insightCard: { backgroundColor: '#f0fdf4', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#dcfce7' },
    insightTitle: { fontSize: 13, fontWeight: '800', color: '#15803d', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 },
    insightMessage: { fontSize: 14, color: '#166534', lineHeight: 20 },
    summaryCard: { backgroundColor: '#f8fafc', borderRadius: 24, padding: 16, gap: 12, marginBottom: 24 },
    summaryItem: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    summaryIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    summaryInfo: { flex: 1 },
    summaryLabel: { fontSize: 12, color: '#64748b' },
    summaryValue: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    summaryStatus: { alignItems: 'flex-end' },
    statusText: { fontSize: 14, fontWeight: '700', color: '#3b82f6' },
    actionGrid: { flexDirection: 'row', gap: 12 },
    actionBox: { flex: 1, alignItems: 'center', padding: 12, borderRadius: 20 },
    memberAvatarWrapper: { position: 'relative' },
    memberAvatarLarge: { width: 50, height: 50, borderRadius: 18 },
    statusIndicator: { position: 'absolute', width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: '#fff' },
    actionIconCircle: { width: 50, height: 50, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    actionLabelText: { fontSize: 12, fontWeight: '600', color: '#64748b', marginTop: 8 },
    logSelectorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    logTypeCard: { width: (width - 60) / 2, backgroundColor: '#f8fafc', borderRadius: 24, padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#f1f5f9' },
    logTypeIcon: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    logTypeLabel: { fontSize: 14, fontWeight: '700', color: '#334155' },
    toastContainer: {
        position: 'absolute',
        top: 0,
        left: 20,
        right: 20,
        zIndex: 9999,
        alignItems: 'center',
    },
    toastContent: {
        backgroundColor: '#10b981',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    toastIcon: {
        marginRight: 10,
    },
    toastText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
    },
    // Compact Notes Modal styles
    notesModalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        zIndex: 9999,
    },
    notesModalKeyboardView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    notesModalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 16,
        paddingTop: 8,
        margin: 5,
    },
    notesModalHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 12,
    },
    notesModalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    notesModalTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    notesModalCloseButton: {
        padding: 4,
    },
    notesModalInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notesModalInput: {
        flex: 1,
        height: 56,
        backgroundColor: '#F3F4F6',
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    notesModalDoneButton: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notesModalHint: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 12,
    },
    // Edit Medication Overlay styles
    editMedOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
        zIndex: 9999,
    },
    editMedKeyboardView: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    editMedContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 24 : 20,
        paddingTop: 8,
        margin: 5,
    },
    editMedHandle: {
        width: 40,
        height: 4,
        backgroundColor: '#D1D5DB',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 12,
    },
    editMedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    editMedTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    editMedCloseButton: {
        padding: 4,
    },
    editMedField: {
        marginBottom: 16,
    },
    editMedLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
        marginBottom: 8,
    },
    editMedInput: {
        height: 48,
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    frequencyChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    frequencyChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    frequencyChipActive: {
        backgroundColor: '#8b5cf6',
        borderColor: '#8b5cf6',
    },
    frequencyChipText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    frequencyChipTextActive: {
        color: '#FFFFFF',
    },
    timeChipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    timeChip: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    timeChipActive: {
        backgroundColor: '#8b5cf6',
        borderColor: '#8b5cf6',
    },
    timeChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4B5563',
    },
    timeChipTextActive: {
        color: '#FFFFFF',
    },
    editMedSaveButton: {
        backgroundColor: '#8b5cf6',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    editMedSaveButtonDisabled: {
        backgroundColor: 'rgba(139, 92, 246, 0.4)',
    },
    editMedSaveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});
