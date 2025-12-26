import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ArrowLeft,
    Users,
    Shield,
    UserPlus,
    Heart,
    Phone,
    MessageCircle,
    Star,
    Settings,
    MoreVertical,
    ChevronRight
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, router, useNavigation } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AppBottomSheet from '../components/AppBottomSheet';

const { width } = Dimensions.get('window');

const CIRCLE_MEMBERS = [
    {
        id: '1',
        name: 'Dr. Sarah Wilson',
        role: 'Primary Hematologist',
        priority: 'Emergency',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200',
        status: 'Online',
        isEmergency: true
    },
    {
        id: '2',
        name: 'Marcus Thompson',
        role: 'Primary Caregiver (Spouse)',
        priority: 'Emergency',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        status: 'Away',
        isEmergency: true
    },
    {
        id: '3',
        name: 'Linda Thompson',
        role: 'Emergency Contact (Mom)',
        priority: 'Primary',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        status: 'Online',
        isEmergency: false
    },
    {
        id: '4',
        name: 'Nurse Joy',
        role: 'Specialist Nurse',
        priority: 'Support',
        avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=200',
        status: 'Offline',
        isEmergency: false
    },
];

const MemberCard = ({ member, index, onShowDetails }: { member: any, index: number, onShowDetails: (m: any) => void }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                delay: index * 100,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                delay: index * 100,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onShowDetails(member);
    };

    return (
        <Animated.View
            style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }]
            }}
        >
            <Pressable
                onPress={handlePress}
                className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100 flex-row items-center active:bg-gray-50"
            >
                <View className="relative w-16 h-16">
                    <View className="absolute inset-0 bg-gray-100 rounded-2xl items-center justify-center">
                        <Users size={24} color="#CBD5E1" />
                    </View>
                    <Image
                        source={{ uri: member.avatar }}
                        className="w-full h-full rounded-2xl"
                    />
                    <View className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-white ${member.status === 'Online' ? 'bg-emerald-500' :
                        member.status === 'Away' ? 'bg-amber-500' : 'bg-gray-400'
                        }`} />
                </View>

                <View className="ml-4 flex-1">
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray-900 font-bold text-base">{member.name}</Text>
                        {member.isEmergency && (
                            <View className="bg-red-50 px-2 py-0.5 rounded-full">
                                <Shield size={10} color="#EF4444" />
                            </View>
                        )}
                    </View>
                    <Text className="text-gray-500 text-xs mt-0.5">{member.role}</Text>

                    <View className="flex-row items-center mt-3 space-x-3">
                        <Pressable className="bg-violet-50 p-2 rounded-xl active:bg-violet-100">
                            <Phone size={14} color="#8B5CF6" />
                        </Pressable>
                        <Pressable className="bg-violet-50 p-2 rounded-xl active:bg-violet-100">
                            <MessageCircle size={14} color="#8B5CF6" />
                        </Pressable>
                        <View className="flex-1" />
                        <View className={`px-2 py-1 rounded-lg ${member.priority === 'Emergency' ? 'bg-red-50' :
                            member.priority === 'Primary' ? 'bg-blue-50' : 'bg-gray-50'
                            }`}>
                            <Text className={`text-[10px] font-bold uppercase tracking-wider ${member.priority === 'Emergency' ? 'text-red-500' :
                                member.priority === 'Primary' ? 'text-blue-500' : 'text-gray-500'
                                }`}>{member.priority}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );
};

export default function CircleOfCareScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('All');
    const [activeMember, setActiveMember] = useState<any>(null);

    const insets = useSafeAreaInsets();

    // Background animation removed

    const handleAddMember = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        alert('Add new member (Coming Soon)');
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
            >
                {/* Clean White Header */}
                <View className="bg-white pb-6 px-6 border-b border-gray-100">
                    <View className="flex-row items-center justify-between mb-6" style={{ paddingTop: insets.top }}>
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100 active:scale-95 transition-transform"
                        >
                            <ArrowLeft size={20} color="#374151" />
                        </Pressable>
                        <Text className="text-xl font-bold text-gray-900">Circle of Care</Text>
                        <Pressable
                            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100 active:scale-95 transition-transform"
                            onPress={() => alert('Settings (Coming Soon)')}
                        >
                            <Settings size={20} color="#374151" />
                        </Pressable>
                    </View>

                    <View className="items-center mt-2 mb-4">
                        <View className="relative mb-4">
                            <View className="w-20 h-20 bg-violet-50 rounded-full items-center justify-center border border-violet-100 shadow-sm">
                                <Users size={32} color="#7C3AED" />
                            </View>
                            <View className="absolute -top-1 -right-1 bg-red-500 w-6 h-6 rounded-full items-center justify-center border-2 border-white shadow-sm">
                                <Text className="text-white text-[10px] font-bold">{CIRCLE_MEMBERS.length}</Text>
                            </View>
                        </View>
                        <Text className="text-gray-900 text-2xl font-bold">Support System</Text>
                        <Text className="text-gray-500 text-xs text-center mt-1.5 px-10 leading-relaxed">
                            Trusted individuals notified automatically during a health crisis
                        </Text>
                    </View>
                </View>

                {/* Tab Bar Container (Sticky) */}
                <View className="bg-white px-6 pt-6 pb-2">
                    <View className="flex-row bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                        {['All', 'Emergency', 'Support'].map((tab) => (
                            <Pressable
                                key={tab}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setActiveTab(tab);
                                }}
                                className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === tab ? 'bg-white shadow-sm' : ''
                                    }`}
                            >
                                <Text className={`text-sm font-bold ${activeTab === tab ? 'text-violet-600' : 'text-gray-400'
                                    }`}>{tab}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Members List */}
                <View className="px-6 py-4">
                    <View className="flex-row items-center justify-between mb-4 px-2">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                            {activeTab} Members
                        </Text>
                        <Pressable
                            onPress={handleAddMember}
                            className="flex-row items-center"
                        >
                            <UserPlus size={14} color="#8B5CF6" />
                            <Text className="text-violet-600 font-bold text-xs ml-1.5">Invite Someone</Text>
                        </Pressable>
                    </View>

                    {CIRCLE_MEMBERS
                        .filter(member =>
                            activeTab === 'All' ||
                            (activeTab === 'Emergency' && member.isEmergency) ||
                            (activeTab === 'Support' && !member.isEmergency)
                        )
                        .map((member, index) => (
                            <MemberCard
                                key={member.id}
                                member={member}
                                index={index}
                                onShowDetails={(m) => setActiveMember(m)}
                            />
                        ))
                    }

                    {/* Tips Card */}
                    {/* Redesigned Safety Tip - Clean & Integrated */}
                    <View className="mt-6 mb-8">
                        <View className="bg-orange-50 p-5 rounded-[24px] border border-orange-100 relative overflow-hidden">
                            {/* Decorative Background Blur */}
                            <View className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full blur-2xl opacity-60" />

                            <View className="flex-row items-center gap-3 mb-3">
                                <View className="w-8 h-8 bg-amber-50 rounded-full items-center justify-center border border-amber-100">
                                    <Star size={14} color="#D97706" fill="#D97706" />
                                </View>
                                <Text className="text-gray-900 font-bold text-sm tracking-tight">Pro Tip</Text>
                            </View>

                            <Text className="text-gray-500 text-xs leading-5 mb-4 pr-4">
                                Adding a secondary emergency contact increases response reliability by <Text className="font-bold text-amber-600">40%</Text>.
                            </Text>

                            <Pressable
                                onPress={() => alert('View Guide')}
                                className="flex-row items-center"
                            >
                                <Text className="text-amber-600 font-bold text-xs mr-1">Read Safety Guide</Text>
                                <ChevronRight size={12} color="#D97706" />
                            </Pressable>
                        </View>
                    </View>

                    <View className="h-40" />
                </View>
            </ScrollView>

            <AppBottomSheet
                visible={activeMember !== null}
                onClose={() => setActiveMember(null)}
                type="member"
                member={activeMember}
            />
        </View>
    );
}
