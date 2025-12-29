import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    Calendar,
    Heart,
    HandHeart,
    Award,
    Clock,
    ChevronRight,
    Search,
    MapPin,
    ArrowRight
} from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import Animated from 'react-native-reanimated';
import AppBottomSheet from '../../components/AppBottomSheet';
import { ConversationListSheet, ContactPicker, GroupCreator, ChatSheet } from '../../components/messaging';
import { messagingStorage } from '../../services/messagingStorage';
import { CurrentUser, Conversation } from '../../types/messaging';
import * as Haptics from 'expo-haptics';

export default function VolunteerDashboard() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [activeMission, setActiveMission] = React.useState<any>(null);

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
        name: 'Volunteer',
        role: 'volunteer',
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
    }, []);

    const stats = [
        { label: 'Hours', value: '42', icon: Clock, color: '#8B5CF6' },
        { label: 'Impact', value: '12', icon: Heart, color: '#EF4444' },
        { label: 'Points', value: '1.2k', icon: Award, color: '#F59E0B' },
    ];

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header */}
                <View
                    className="px-6 pb-6"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <View className="flex-row items-center justify-between mb-2">
                        <View>
                            <Text className="text-gray-500 font-medium text-sm">Welcome back,</Text>
                            <Text className="text-3xl font-extrabold text-gray-900 mt-1">Volunteer</Text>
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
                </View>

                {/* Impact Stats Card - Redesigned to Light Theme (Purple Accents) */}
                <View className="px-6 mb-8">
                    <View className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 overflow-hidden">
                        <Text className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-6 ml-1">Your Impact This Month</Text>

                        <View className="flex-row gap-3 mb-6">
                            {stats.map((stat, i) => {
                                const Icon = stat.icon;
                                return (
                                    <View key={i} className="flex-1 bg-gray-50 border border-gray-100 p-3 rounded-2xl items-center">
                                        <View className="w-9 h-9 bg-white rounded-xl items-center justify-center mb-2 shadow-sm border border-gray-50">
                                            <Icon size={18} color={stat.color} />
                                        </View>
                                        <Text className="text-gray-900 font-extrabold text-xl">{stat.value}</Text>
                                        <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-tighter mt-1">{stat.label}</Text>
                                    </View>
                                );
                            })}
                        </View>

                        <Pressable
                            onPress={() => router.push('/(volunteer)/resume')}
                            className="bg-gray-50 py-3.5 rounded-2xl border border-gray-100 items-center active:bg-gray-100"
                        >
                            <Text className="text-gray-900 font-bold text-sm">View Volunteer Resume</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Active Support Missions */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-gray-900 font-bold text-xl">Active Missions</Text>
                        <Pressable onPress={() => router.push('/(volunteer)/events')}>
                            <Text className="text-violet-600 font-bold text-sm">See All</Text>
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setActiveMission({
                                title: 'Blood Drive Support',
                                detail: 'Help with registration and refreshments at the central hospital blood drive.',
                                time: 'Today • 2:00 PM - 6:00 PM',
                                location: 'Central Hospital',
                                status: 'Urgent • 2h left'
                            });
                        }}
                        className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm mb-4 active:bg-gray-50 active:scale-[0.98]"
                    >
                        <View className="flex-row justify-between items-start mb-4">
                            <View className="bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                                <Text className="text-violet-600 text-[10px] font-bold uppercase">Urgent • 2h left</Text>
                            </View>
                            <View className="bg-gray-50 p-2 rounded-xl">
                                <HandHeart size={18} color="#8B5CF6" />
                            </View>
                        </View>
                        <Text className="text-gray-900 font-bold text-lg mb-1">Blood Drive Support</Text>
                        <Text className="text-gray-500 text-sm mb-4 leading-5">Help with registration and refreshments at the central hospital blood drive.</Text>

                        <View className="flex-row items-center justify-between border-t border-gray-50 pt-4">
                            <View className="flex-row items-center">
                                <MapPin size={14} color="#9CA3AF" />
                                <Text className="text-gray-400 text-xs ml-1">Central Hospital</Text>
                            </View>
                            <Pressable
                                onPress={() => router.push('/(volunteer)/missions/1')}
                                className="bg-violet-600 px-5 py-2 rounded-2xl"
                            >
                                <Text className="text-white font-bold text-xs text-center">Join</Text>
                            </Pressable>
                        </View>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setActiveMission({
                                title: 'Awareness Talk',
                                detail: 'Joining our monthly community session to share experiences and build awareness.',
                                time: 'Saturday, Dec 28 • 10:00 AM',
                                location: 'Community Center',
                                status: 'Open Mission'
                            });
                        }}
                        className="bg-gray-50 border border-gray-100 rounded-[24px] p-5 mb-4 active:bg-gray-100 active:scale-[0.98]"
                    >
                        <View className="flex-row items-center gap-4">
                            <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm border border-violet-100">
                                <Calendar size={22} color="#8B5CF6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-bold text-base">Awareness Talk</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Saturday, Dec 28 • 10:00 AM</Text>
                            </View>
                            <ChevronRight size={20} color="#CBD5E1" />
                        </View>
                    </Pressable>
                </View>

                {/* Community Highlights */}
                <View className="px-6">
                    <Text className="text-gray-900 font-bold text-xl mb-4">Community Highlights</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible -mx-2">
                        {[1, 2, 3].map((i) => (
                            <Pressable
                                key={i}
                                onPress={() => router.push(`/(volunteer)/highlights/${i}`)}
                                className="w-64 mb-2 mr-4"
                            >
                                <Animated.View
                                    className="bg-white border border-gray-100 rounded-[24px] p-4 shadow-sm"
                                >
                                    <View className="h-32 bg-gray-100 rounded-2xl mb-4 overflow-hidden">
                                        <Animated.Image
                                            source={{ uri: `https://images.unsplash.com/photo-${1515023677547 + i}-51f16da88c0a?auto=format&fit=crop&q=80&w=400` }}
                                            className="w-full h-full"
                                        />
                                        
                                    </View>
                                    <View>
                                        <Text className="text-gray-900 font-bold text-base mb-1">Gala for Hope 2024</Text>
                                        <Text className="text-gray-500 text-xs leading-4">Thanks to our 50+ volunteers who made this event successful! We raised $20k...</Text>
                                        <View className="flex-row items-center mt-4">
                                            <View className="flex-row -space-x-2">
                                                {[1, 2, 3].map(j => (
                                                    <View key={j} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                                                        <Image source={{ uri: `https://i.pravatar.cc/50?u=${j + i}` }} className="w-full h-full" />
                                                    </View>
                                                ))}
                                            </View>
                                            <Text className="text-[10px] text-gray-400 font-bold ml-2">+45 others</Text>
                                        </View>
                                    </View>
                                </Animated.View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>

            <AppBottomSheet
                visible={activeMission !== null}
                onClose={() => setActiveMission(null)}
                type="mission_detail"
                mission={activeMission}
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
