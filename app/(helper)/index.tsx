import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing
} from 'react-native-reanimated';
import {
    HeartPulse,
    Phone,
    Calendar,
    Pill,
    ChevronRight,
    Activity,
    Droplets,
    Sun,
    TrendingDown,
    Info,
    CheckCircle2,
    Smile
} from 'lucide-react-native';
import AppBottomSheet from '../../components/AppBottomSheet';
import { ConversationListSheet, ContactPicker, GroupCreator, ChatSheet } from '../../components/messaging';
import { messagingStorage } from '../../services/messagingStorage';
import { CurrentUser, Conversation } from '../../types/messaging';

const QUICK_ACTIONS = [
    { id: 'log', label: 'Log Incident', icon: 'edit-calendar', color: '#4f46e5' },
    { id: 'meds', label: 'Meds', icon: 'medication', color: '#10B981' },
    { id: 'doctor', label: 'Contact', icon: 'call', color: '#3B82F6' },
];

const RECENT_ACTIVITY = [
    { id: 1, type: 'check-in', title: 'Daily Check-in', time: '10:00 AM', detail: 'Pain Level: 2/10', icon: 'check-circle', color: '#10B981' },
    { id: 2, type: 'meds', title: 'Hydroxyurea', time: '8:00 AM', detail: 'Taken on time', icon: 'medication', color: '#6366F1' },
    { id: 3, type: 'pain', title: 'Mild Discomfort', time: 'Yesterday', detail: 'Knee pain reported', icon: 'warning', color: '#F59E0B' },
];

const METRICS_TODAY = [
    {
        id: 'hydration',
        label: 'HYDRATION LEVEL',
        value: '2.4',
        total: '3L',
        change: '+0.5L',
        progress: 0.8,
        color: '#3b82f6',
        bg: '#eff6ff',
        description: 'Fantastic hydration progress today!',
        icon: Droplets,
        changeColor: '#10b981'
    },
    {
        id: 'pain',
        label: 'PAIN MANAGEMENT',
        value: '2.1',
        total: '10',
        change: '-0.8',
        progress: 0.21,
        color: '#f59e0b',
        bg: '#fffbeb',
        description: 'Slightly lower than yesterday morning.',
        icon: TrendingDown,
        changeColor: '#f59e0b'
    },
    {
        id: 'meds',
        label: 'MEDS ADHERENCE',
        value: '100',
        total: '%',
        change: '+5%',
        progress: 1.0,
        color: '#10b981',
        bg: '#ecfdf5',
        description: 'Perfect adherence. All doses taken.',
        icon: CheckCircle2,
        changeColor: '#10b981'
    },
    {
        id: 'mood',
        label: 'MOOD',
        value: '7',
        total: '10',
        change: '+1',
        progress: 0.7,
        color: '#8b5cf6',
        bg: '#f5f3ff',
        description: 'Feeling better than yesterday.',
        icon: Smile,
        changeColor: '#10b981'
    }
];

const AVA_MEMBER = {
    name: 'Ava Thompson',
    role: 'Overcomer',
    priority: 'Primary',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    status: 'Recovering',
    isEmergency: false
};

// Separate component to avoid hooks in map
const MetricCard = ({ metric, progressValue }: { metric: typeof METRICS_TODAY[0], progressValue: Animated.SharedValue<number> }) => {
    const animatedBarStyle = useAnimatedStyle(() => ({
        width: `${progressValue.value * metric.progress * 100}%`
    }));

    return (
        <View className="bg-white rounded-[28px] p-4 mb-3 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-center mb-0.5">
                <Text style={{ fontSize: 10, fontWeight: '800', color: '#94a3b8', letterSpacing: 0.5 }}>{metric.label}</Text>
                <Text style={{ fontSize: 11, fontWeight: '800', color: metric.changeColor }}>{metric.change}</Text>
            </View>

            <View className="flex-row items-baseline mb-2">
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#0f172a' }}>{metric.value}</Text>
                <View style={{ width: 3 }} />
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#94a3b8' }}>/{metric.total}</Text>
            </View>

            <View className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                <Animated.View
                    className="h-full rounded-full"
                    style={[{ backgroundColor: metric.color }, animatedBarStyle]}
                />
            </View>
        </View>
    );
};

export default function CaregiverDashboard() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const [activeActivity, setActiveActivity] = React.useState<any>(null);
    const [activeType, setActiveType] = React.useState<any>(null);
    const [activeTask, setActiveTask] = React.useState<any>(null);
    const floatValue = useSharedValue(0);
    const progressValue = useSharedValue(0);

    // Messaging state
    const [showMessageSelection, setShowMessageSelection] = useState(false);
    const [showConversationList, setShowConversationList] = useState(false);
    const [conversationFilterType, setConversationFilterType] = useState<'all' | 'direct' | 'group'>('all');
    const [showContactPicker, setShowContactPicker] = useState(false);
    const [showGroupCreator, setShowGroupCreator] = useState(false);
    const [showChatSheet, setShowChatSheet] = useState(false);
    const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);
    const [currentUser] = useState<CurrentUser>({
        id: 'current_user',
        name: 'Marcus',
        role: 'helper',
    });

    const loadUnreadCount = async () => {
        try {
            await messagingStorage.initializeWithMockData();
            const count = await messagingStorage.getTotalUnreadCount();
            setTotalUnreadCount(count);
        } catch (error) {
            console.error('Failed to load unread count:', error);
        }
    };

    useEffect(() => {
        loadUnreadCount();
        floatValue.value = withRepeat(
            withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
            -1,
            true
        );

        // Animate metrics progress bars on mount
        progressValue.value = withTiming(1, {
            duration: 1500,
            easing: Easing.out(Easing.exp)
        });
    }, []);

    // Handle openMessages param from CaregiverAddMenuModal
    useFocusEffect(
        React.useCallback(() => {
            if (params.openMessages === 'true') {
                setTimeout(() => {
                    setShowMessageSelection(true);
                    router.setParams({ openMessages: undefined });
                }, 100);
            }
        }, [params.openMessages])
    );

    const animatedCircleStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: -floatValue.value * 280 + 40 },
            { translateY: Math.sin(floatValue.value * Math.PI) * 20 },
            { scale: 0.9 + Math.sin(floatValue.value * Math.PI) * 0.2 }
        ]
    }));

    const handleAction = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (id === 'log') setActiveType('log_selection');
        else if (id === 'meds') setActiveType('meds');
        else if (id === 'doctor') setActiveType('member');
        else if (id === 'Ava') setActiveType('member');
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

                {/* Header Section */}
                <View className="bg-white px-6 pb-6 rounded-b-[40px]" style={{ paddingTop: insets.top + 10 }}>
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748b' }} className="mb-1">Good Morning,</Text>
                            <Text style={{ fontSize: 22, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 }}>Marcus</Text>
                        </View>
                        <Pressable
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setShowMessageSelection(true);
                            }}
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                backgroundColor: '#10B981',
                                alignItems: 'center',
                                justifyContent: 'center',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.15,
                                shadowRadius: 8,
                                elevation: 6,
                                position: 'relative',
                            }}
                        >
                            <MaterialIcons name="chat-bubble" size={22} color="#ffffff" />
                            {totalUnreadCount > 0 && (
                                <View
                                    style={{
                                        position: 'absolute',
                                        top: -4,
                                        right: -4,
                                        minWidth: 20,
                                        height: 20,
                                        borderRadius: 10,
                                        backgroundColor: '#EF4444',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        paddingHorizontal: 4,
                                        borderWidth: 2,
                                        borderColor: '#fff',
                                    }}
                                >
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>
                                        {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                                    </Text>
                                </View>
                            )}
                        </Pressable>
                    </View>

                    {/* Overcomer Status Card - Full Width Adjustment */}
                    <View className="shadow-2xl shadow-indigo-200/40">
                        <View
                            className="bg-white overflow-hidden"
                            style={{ borderRadius: 32, padding: 20, borderWidth: 1, borderColor: '#f1f5f9' }}
                        >
                            {/* Animated Glassmorphic Background Shape */}
                            <Animated.View
                                style={[{
                                    position: 'absolute',
                                    top: 10,
                                    right: -40,
                                    width: 80,
                                    height: 80,
                                    borderRadius: 40,
                                    backgroundColor: '#eff6ff',
                                    opacity: 0.7
                                }, animatedCircleStyle]}
                            />

                            <View className="flex-row items-center justify-between">
                                <View className="flex-row items-center">
                                    <View className="w-16 h-16 rounded-3xl border-2 border-indigo-50 overflow-hidden mr-4 bg-white shadow-sm">
                                        <Image
                                            source={{ uri: AVA_MEMBER.avatar }}
                                            className="w-full h-full"
                                        />
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 22, fontWeight: '900', color: '#1e3a8a', letterSpacing: -0.8 }}>{AVA_MEMBER.name}</Text>
                                        <View className="flex-row items-center mt-1">
                                            <View className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 border-2 border-white" />
                                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748b' }}>{AVA_MEMBER.status} • 4h ago</Text>
                                        </View>
                                    </View>
                                </View>
                                <Pressable
                                    onPress={() => handleAction('Ava')}
                                    className="w-14 h-14 bg-[#eff6ff] rounded-3xl items-center justify-center border border-blue-100 active:scale-90 transition-transform shadow-sm"
                                >
                                    <Phone size={22} color="#3b82f6" strokeWidth={2.5} />
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Key Metrics Today Section */}
                <View className="px-6 py-6">
                    <View className="flex-row items-center justify-between mb-5 px-1">
                        <Text style={{ fontSize: 13, fontWeight: '800', color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>Key Metrics (Today)</Text>
                        <Pressable
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setActiveType('metrics_info');
                            }}
                            className="bg-black px-4 py-1.5 rounded-full active:scale-90 shadow-sm"
                        >
                            <Text style={{ fontSize: 11, fontWeight: '900', color: '#fff', letterSpacing: 0.5 }}>INFO</Text>
                        </Pressable>
                    </View>

                    {METRICS_TODAY.map((metric) => (
                        <MetricCard key={metric.id} metric={metric} progressValue={progressValue} />
                    ))}
                </View>

                <View className="px-6 mb-8">
                    <View className="flex-row items-center justify-between mb-4 px-1">
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>Help Requested</Text>
                        <Pressable onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setActiveType('view_care_plan');
                        }}>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#4f46e5' }}>See Full Plan</Text>
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setActiveType('request_task');
                            setActiveTask({
                                title: 'Prescription Refill',
                                description: 'Hydroxyurea supply is low. Needs to be picked up from the downtown pharmacy.'
                            });
                        }}
                        className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex-row items-center active:bg-gray-50 active:scale-[0.98]"
                    >
                        <View className="w-12 h-12 rounded-2xl bg-amber-50 items-center justify-center border border-amber-100 mr-4">
                            <MaterialIcons name="shopping-basket" size={24} color="#f59e0b" />
                        </View>
                        <View className="flex-1">
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>Prescription Refill</Text>
                            <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748b' }}>Downtown Pharmacy • Needs pickup</Text>
                        </View>
                        <View className="bg-amber-500 px-3 py-1.5 rounded-xl shadow-sm">
                            <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff', textTransform: 'uppercase' }}>Claim</Text>
                        </View>
                    </Pressable>
                </View>

                {/* Activity Feed */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center justify-between mb-4 px-1">
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>Recent Updates</Text>
                        <Pressable onPress={() => handleAction('View All History')}>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: '#4f46e5' }}>View History</Text>
                        </Pressable>
                    </View>

                    <View>
                        {RECENT_ACTIVITY.map((item) => (
                            <Pressable
                                key={item.id}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setActiveActivity(item);
                                }}
                                className="bg-white rounded-[24px] p-5 mb-4 shadow-sm border border-gray-100 flex-row items-center active:bg-gray-50 active:scale-[0.98]"
                            >
                                <View
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                    style={{ backgroundColor: `${item.color}10` }}
                                >
                                    <MaterialIcons name={item.icon as any} size={24} color={item.color} />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>{item.title}</Text>
                                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#64748b' }}>{item.time}</Text>
                                    </View>
                                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748b' }}>{item.detail}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>


                {/* Caregiver Tip */}
                <View className="px-6 mb-12">
                    <View className="bg-blue-50 p-5 rounded-[24px] border border-blue-100 flex-row items-center gap-4">
                        <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                            <MaterialIcons name="lightbulb" size={20} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-blue-900 font-bold text-sm mb-1">Care Tip</Text>
                            <Text className="text-blue-700 text-xs leading-4">Keeping track of hydration levels helps prevent future crises effectively.</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            <AppBottomSheet
                visible={activeActivity !== null}
                onClose={() => setActiveActivity(null)}
                type="activity_detail"
                activity={activeActivity}
            />

            <AppBottomSheet
                visible={activeType !== null}
                onClose={() => {
                    setActiveType(null);
                    setActiveTask(null);
                }}
                type={activeType}
                activity={activeActivity}
                member={AVA_MEMBER}
                task={activeTask}
            />

            {/* Message Selection Sheet */}
            <AppBottomSheet
                visible={showMessageSelection}
                onClose={() => setShowMessageSelection(false)}
                type="message_selection"
                onNewDM={() => {
                    setShowMessageSelection(false);
                    setShowContactPicker(true);
                }}
                onNewGroup={() => {
                    setShowMessageSelection(false);
                    setShowGroupCreator(true);
                }}
                onOpenDMInbox={() => {
                    setShowMessageSelection(false);
                    setConversationFilterType('direct');
                    setShowConversationList(true);
                }}
                onOpenGroupInbox={() => {
                    setShowMessageSelection(false);
                    setConversationFilterType('group');
                    setShowConversationList(true);
                }}
            />

            {/* Messaging Sheets */}
            <ConversationListSheet
                visible={showConversationList}
                onClose={() => {
                    setShowConversationList(false);
                    setConversationFilterType('all');
                    loadUnreadCount();
                }}
                filterType={conversationFilterType}
                currentUser={currentUser}
                onNewDM={() => setShowContactPicker(true)}
                onNewGroup={() => setShowGroupCreator(true)}
                onOpenChat={(conversation) => {
                    setActiveConversation(conversation);
                    setShowChatSheet(true);
                }}
            />

            <ContactPicker
                visible={showContactPicker}
                onClose={() => setShowContactPicker(false)}
                onSelect={(conversation: Conversation) => {
                    setShowContactPicker(false);
                    setActiveConversation(conversation);
                    setShowChatSheet(true);
                    loadUnreadCount();
                }}
                currentUser={currentUser}
            />

            <GroupCreator
                visible={showGroupCreator}
                onClose={() => setShowGroupCreator(false)}
                onCreate={(conversation: Conversation) => {
                    setShowGroupCreator(false);
                    setActiveConversation(conversation);
                    setShowChatSheet(true);
                    loadUnreadCount();
                }}
                currentUser={currentUser}
            />

            <ChatSheet
                visible={showChatSheet}
                onClose={() => {
                    setShowChatSheet(false);
                    setActiveConversation(null);
                    loadUnreadCount();
                }}
                onBack={() => {
                    setShowChatSheet(false);
                    setActiveConversation(null);
                    setShowConversationList(true);
                    loadUnreadCount();
                }}
                conversation={activeConversation}
                currentUser={currentUser}
            />
        </View>
    );
}
