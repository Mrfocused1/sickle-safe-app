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
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width, height } = Dimensions.get('window');

type MetricType = 'pain' | 'hydration' | 'meds' | 'mood' | 'triggers' | 'crisis' | 'task' | 'wellness_summary' | 'member' | 'idea' | 'group' | 'log_selection' | 'community_actions' | 'activity_detail' | 'volunteer_actions' | 'volunteer_log_hours' | 'mission_detail' | 'invite_member' | 'manage_task' | 'request_task' | 'view_care_plan' | 'metrics_info' | 'message_selection' | 'notification_settings' | 'edit_member' | null;

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
    medsData?: { list: string[], checked: string[] };
    onMedsUpdate?: (list: string[], checked: string[]) => void;
    onPainUpdate?: (level: number, notes?: string) => void;
    onHydrationUpdate?: (amount: string, notes?: string) => void;
    onMoodUpdate?: (level: string, notes?: string) => void;
    onTriggersUpdate?: (triggers: string[], notes?: string) => void;
}

export default function AppBottomSheet({ visible, onClose, type, task, member, activity, mission, medsData, onMedsUpdate, onPainUpdate, onHydrationUpdate, onMoodUpdate, onTriggersUpdate }: AppBottomSheetProps) {
    const [value, setValue] = useState('');
    const [notes, setNotes] = useState('');
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
    const fadeAnim = useRef(new Animated.Value(0)).current;
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

    const navigateTo = (newType: MetricType) => {
        setHistory(prev => [...prev, activeType]);
        setActiveType(newType);
    };

    const goBack = () => {
        if (history.length > 0) {
            const previous = history[history.length - 1];
            setHistory(prev => prev.slice(0, -1));
            setActiveType(previous);
        } else {
            onClose();
        }
    };

    useEffect(() => {
        if (visible) {
            setActiveType(type || 'log_selection');
            setHistory([]);
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
            setSelectedHelpers([]);
        }
    }, [visible, type]);

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
                return { title: 'Invite Caregiver', icon: 'person-add', color: '#8b5cf6' };
            case 'manage_task':
                return { title: 'Task Details', icon: 'assignment', color: '#f59e0b' };
            case 'request_task':
                return { title: 'Help Needed', icon: 'handshake', color: '#3b82f6' };
            case 'metrics_info':
                return { title: 'Today\'s Metrics', icon: 'info', color: '#64748b' };
            case 'message_selection':
                return { title: 'Send Message', icon: 'textsms', color: '#6366f1' };
            case 'notification_settings':
                return { title: 'Notifications', icon: 'notifications', color: '#8b5cf6' };
            case 'edit_member':
                return { title: 'Edit Details', icon: 'edit', color: '#6366f1' };
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
                        {medications.map((med) => (
                            <Pressable
                                key={med}
                                onPress={() => {
                                    const newList = checkedMeds.includes(med)
                                        ? checkedMeds.filter(m => m !== med)
                                        : [...checkedMeds, med];
                                    setCheckedMeds(newList);
                                    if (onMedsUpdate) onMedsUpdate(medications, newList);
                                }}
                                style={styles.checkItem}
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
                                { id: 'group', label: 'New Event', icon: 'event', color: '#f59e0b', bg: '#fffbeb' },
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
                        <View style={styles.scaleContainer}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
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
                        <View style={[styles.taskDetailCard, { borderColor: '#f59e0b30', backgroundColor: '#fef3c705' }]}>
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
                                        style={[styles.actionBox, isRequest && { borderWidth: 2, borderStyle: 'dotted', borderColor: isSelected ? '#10b981' : '#e2e8f0', backgroundColor: isSelected ? '#ecfdf5' : 'transparent', borderRadius: 24 }]}
                                    >
                                        <View style={[styles.memberAvatarWrapper, { width: 50, height: 50, marginBottom: 8, opacity: isSelected || isRequest ? 1 : 0.6 }]}>
                                            {helper.avatar ? (
                                                <Image source={{ uri: helper.avatar }} style={[styles.memberAvatarLarge, { width: 50, height: 50 }]} />
                                            ) : (
                                                <View style={[styles.actionIconCircle, { width: 50, height: 50, margin: 0, backgroundColor: isSelected ? '#10b98120' : '#f8fafc', borderWidth: isRequest ? 0 : 1, borderColor: '#f1f5f9' }]}>
                                                    <MaterialIcons name={isRequest ? "add" : "help"} size={24} color={isRequest ? "#10b981" : "#3b82f6"} />
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.actionLabelText, isSelected && { color: isRequest ? '#10b981' : '#f59e0b', fontWeight: '800' }]}>{helper.name}</Text>
                                    </Pressable>
                                );
                            })}
                        </View>
                    </View>
                );
            case 'request_task':
                return (
                    <View style={styles.contentSection}>
                        <View style={[styles.taskDetailCard, { borderColor: '#3b82f630', backgroundColor: '#eff6ff05' }]}>
                            <View className="bg-blue-100 self-start px-3 py-1 rounded-full mb-3">
                                <Text className="text-blue-700 text-[10px] font-bold uppercase">Help Requested</Text>
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
                        <View style={{ gap: 16 }}>
                            <Pressable
                                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#e2e8f0' }}
                                onPress={() => { alert('Opening SMS...'); onClose(); }}
                            >
                                <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <MaterialIcons name="textsms" size={24} color="#fff" />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#1e293b' }}>Text Message</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748b' }}>Send a standard SMS</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#94a3b8" style={{ marginLeft: 'auto' }} />
                            </Pressable>

                            <Pressable
                                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#bbf7d0' }}
                                onPress={() => { alert('Opening WhatsApp...'); onClose(); }}
                            >
                                <View style={{ width: 52, height: 52, borderRadius: 18, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                                    <FontAwesome name="whatsapp" size={28} color="#fff" />
                                </View>
                                <View>
                                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#166534' }}>WhatsApp</Text>
                                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#22c55e' }}>Chat on WhatsApp</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={24} color="#22c55e" style={{ marginLeft: 'auto' }} />
                            </Pressable>
                        </View>
                        <Pressable onPress={goBack} style={{ alignItems: 'center', marginTop: 32 }}>
                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748b' }}>Go Back</Text>
                        </Pressable>
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
            default:
                return null;
        }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={goBack}>
            <View style={styles.container}>
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={goBack}>
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    </Pressable>
                </Animated.View>

                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
                    <View style={styles.modalCard}>
                        <View style={styles.grabber} />
                        <View style={styles.header}>
                            <View style={[styles.iconContainer, { backgroundColor: `${header.color}15` }]}>
                                <MaterialIcons name={header.icon as any} size={28} color={header.color} />
                            </View>
                            <View style={styles.headerText}>
                                <Text style={styles.headerTitle}>{activeType === 'member' ? header.title : activeType === 'community_actions' ? 'Community Hub' : 'Log ' + header.title}</Text>
                                <Text style={styles.headerSub}>
                                    {activeType === 'member' ? member?.status + ' • ' + member?.role :
                                        activeType === 'idea' ? 'Share with the community' :
                                            activeType === 'group' ? 'Start a new chapter' :
                                                activeType === 'community_actions' ? 'Manage your community' :
                                                    activeType === 'volunteer_actions' ? 'Your impact dashboard' :
                                                        activeType === 'volunteer_log_hours' ? 'Record service time' :
                                                            activeType === 'invite_member' ? 'Expand your circle' :
                                                                activeType === 'manage_task' ? 'Delegate this task' :
                                                                    activeType === 'request_task' ? 'Be a hero today' :
                                                                        'Recording for Today, ' + new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                </Text>
                            </View>
                            <Pressable onPress={goBack} style={styles.closeButton}>
                                <MaterialIcons name={history.length > 0 ? "arrow-back" : "close"} size={24} color="#94a3b8" />
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

                            {activeType !== 'activity_detail' && activeType !== 'metrics_info' && activeType !== 'member' && activeType !== 'message_selection' && (
                                <Pressable
                                    onPress={() => {
                                        switch (activeType) {
                                            case 'pain': if (value && onPainUpdate) onPainUpdate(parseInt(value), notes || undefined); break;
                                            case 'hydration': if (value && onHydrationUpdate) onHydrationUpdate(value, notes || undefined); break;
                                            case 'mood': if (value && onMoodUpdate) onMoodUpdate(value, notes || undefined); break;
                                            case 'triggers': if (value && onTriggersUpdate) onTriggersUpdate(value.split(', '), notes || undefined); break;
                                            case 'edit_member': alert('Changes saved locally!'); break;
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
                                                                            'Save Entry'}
                                    </Text>
                                </Pressable>
                            )}
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
        {/* Barcode Scanner Modal */ }
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
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'flex-end' },
    content: { height: height * 0.78, width: '100%' },
    modalCard: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, paddingBottom: Platform.OS === 'ios' ? 40 : 20 },
    grabber: { width: 40, height: 4, backgroundColor: '#e2e8f0', borderRadius: 2, alignSelf: 'center', marginTop: 12, marginBottom: 8 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
    iconContainer: { width: 52, height: 52, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
    headerText: { flex: 1 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
    headerSub: { fontSize: 13, color: '#64748b', marginTop: 2 },
    closeButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
    scrollContent: { padding: 24 },
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
});
