import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    MapPin,
    Users,
    Calendar,
    MessageSquare,
    Bell,
    Share2,
    Search,
    Heart,
    MoreVertical,
    CheckCircle2,
    Zap,
    ChevronRight,
    TrendingUp
} from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function AtlantaWarriorsRecreated() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('Home');

    const STATS = [
        { label: 'Members', value: '1,240', icon: <Users size={16} color="#8B5CF6" />, color: 'bg-violet-50' },
        { label: 'Daily Posts', value: '42', icon: <TrendingUp size={16} color="#10B981" />, color: 'bg-emerald-50' },
        { label: 'Local Events', value: '8', icon: <Calendar size={16} color="#3B82F6" />, color: 'bg-blue-50' },
    ];

    const EVENTS = [
        {
            id: 1,
            title: 'Downtown Support Meetup',
            time: 'Tomorrow, 10:00 AM',
            location: 'Centennial Park',
            attendees: 24,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400'
        },
        {
            id: 2,
            title: 'Virtual Q&A: Care Tips',
            time: 'Wed, 6:00 PM',
            location: 'Zoom Video Call',
            attendees: 56,
            image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&q=80&w=400'
        }
    ];

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />

            {/* Immersive Header */}
            <View className="h-[430px] relative">
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200' }}
                    className="w-full h-full"
                />
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'transparent', '#fff']}
                    className="absolute inset-0"
                />

                {/* Top Actions */}
                <View
                    className="absolute top-0 left-0 right-0 px-6 flex-row items-center justify-between"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-12 h-12 bg-black/30 backdrop-blur-xl rounded-full items-center justify-center border border-white/20"
                    >
                        <ArrowLeft size={22} color="#fff" />
                    </Pressable>
                    <View className="flex-row gap-3">
                        <Pressable className="w-12 h-12 bg-black/30 backdrop-blur-xl rounded-full items-center justify-center border border-white/20">
                            <Search size={20} color="#fff" />
                        </Pressable>
                        <Pressable className="w-12 h-12 bg-black/30 backdrop-blur-xl rounded-full items-center justify-center border border-white/20">
                            <MoreVertical size={22} color="#fff" />
                        </Pressable>
                    </View>
                </View>

                {/* Hero Content */}
                <View className="absolute bottom-24 px-6 w-full">
                    <View className="flex-row items-center gap-2 mb-3 bg-white/20 self-start px-3 py-1 rounded-full backdrop-blur-md border border-white/30">
                        <MapPin size={12} color="#fff" />
                        <Text className="text-white font-bold text-[10px] uppercase tracking-widest">Atlanta Chapter</Text>
                    </View>
                    <Text className="text-white text-5xl font-black leading-none mb-3">Atlanta{'\n'}Warriors</Text>
                    <Text className="text-white/80 text-base font-medium max-w-[280px]">
                        The heartbeat of the sickle cell community in Georgia.
                    </Text>
                </View>

                {/* Quick Stats Overlay */}
                <View className="absolute -bottom-8 left-6 right-6 flex-row gap-3">
                    {STATS.map((stat, i) => (
                        <View key={i} className={`flex-1 ${stat.color} rounded-3xl p-4 border border-white shadow-sm shadow-gray-200`}>
                            {stat.icon}
                            <Text className="text-gray-900 font-extrabold text-lg mt-2">{stat.value}</Text>
                            <Text className="text-gray-400 text-[8px] font-bold uppercase">{stat.label}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <ScrollView
                className="flex-1 mt-12"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                {/* Navigation Tabs */}
                <View className="px-6 mb-8 mt-4">
                    <View className="bg-gray-50 p-1.5 rounded-2xl flex-row">
                        {['Home', 'Events', 'Chat', 'Gallery'].map((tab) => (
                            <Pressable
                                key={tab}
                                onPress={() => setActiveTab(tab)}
                                className={`flex-1 py-2.5 rounded-xl items-center ${activeTab === tab ? 'bg-white shadow-sm' : ''}`}
                            >
                                <Text className={`font-bold text-xs ${activeTab === tab ? 'text-gray-900' : 'text-gray-400'}`}>
                                    {tab}
                                </Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                {/* Membership Status */}
                <View className="px-6 mb-10">
                    <View className="bg-gray-900 rounded-[40px] p-8 flex-row items-center relative overflow-hidden">
                        <View className="absolute -right-10 -bottom-10 w-40 h-40 bg-violet-500/10 rounded-full" />
                        <View className="flex-1">
                            <View className="flex-row items-center gap-2 mb-2">
                                <CheckCircle2 size={16} color="#A78BFA" />
                                <Text className="text-violet-300 font-bold text-[10px] uppercase tracking-widest">Active Member</Text>
                            </View>
                            <Text className="text-white text-xl font-bold mb-1">Stay Notified</Text>
                            <Text className="text-white/50 text-xs">Don't miss local emergency alerts.</Text>
                        </View>
                        <Pressable className="bg-white w-14 h-14 rounded-full items-center justify-center shadow-lg">
                            <Bell size={24} color="#1f2937" />
                        </Pressable>
                    </View>
                </View>

                {/* About Section */}
                <View className="px-6 mb-10">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">About our mission</Text>
                    <Text className="text-gray-500 text-base leading-relaxed">
                        We are a community-led initiative dedicated to improving the lives of individuals living with sickle cell disease in Atlanta. We provide support, advocacy, and a safe space for dialogue.
                    </Text>
                    <Pressable className="flex-row items-center gap-2 mt-4">
                        <Text className="text-violet-600 font-bold text-sm">Read Bylaws & Vision</Text>
                        <ChevronRight size={16} color="#8B5CF6" />
                    </Pressable>
                </View>

                {/* Upcoming Events Horizontal */}
                <View className="mb-10">
                    <View className="px-6 flex-row items-center justify-between mb-6">
                        <Text className="text-gray-900 font-bold text-xl">Upcoming Meetups</Text>
                        <Pressable><Text className="text-violet-600 font-bold text-xs">See All</Text></Pressable>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 24 }}
                    >
                        {EVENTS.map(event => (
                            <Pressable
                                key={event.id}
                                className="mr-6 bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm w-72"
                            >
                                <Image source={{ uri: event.image }} className="w-full h-40" />
                                <View className="p-5">
                                    <View className="flex-row items-center gap-2 mb-2">
                                        <Zap size={12} color="#F59E0B" fill="#F59E0B" />
                                        <Text className="text-amber-500 font-bold text-[10px] uppercase">{event.location}</Text>
                                    </View>
                                    <Text className="text-gray-900 font-bold text-base mb-1">{event.title}</Text>
                                    <View className="flex-row items-center justify-between mt-4">
                                        <Text className="text-gray-400 text-xs font-medium">{event.time}</Text>
                                        <View className="flex-row items-center">
                                            <View className="flex-row -space-x-2 mr-2">
                                                {[1, 2, 3].map(i => (
                                                    <View key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200" />
                                                ))}
                                            </View>
                                            <Text className="text-gray-400 text-[10px] font-bold">+{event.attendees}</Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Discussion Wall Preview */}
                <View className="px-6">
                    <View className="flex-row items-center justify-between mb-8">
                        <Text className="text-gray-900 font-bold text-xl">Discussion Hub</Text>
                        <View className="flex-row gap-2">
                            <View className="w-8 h-8 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                                <Share2 size={14} color="#94a3b8" />
                            </View>
                        </View>
                    </View>

                    <View className="bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm mb-6">
                        <View className="flex-row items-center justify-between mb-4">
                            <View className="flex-row items-center gap-3">
                                <View className="w-10 h-10 rounded-full bg-violet-50 items-center justify-center">
                                    <Text className="text-violet-600 font-bold">JR</Text>
                                </View>
                                <View>
                                    <Text className="text-gray-900 font-bold text-sm">Janice R.</Text>
                                    <Text className="text-gray-400 text-[10px]">Pinned by Moderator</Text>
                                </View>
                            </View>
                            <Heart size={18} color="#94a3b8" />
                        </View>
                        <Text className="text-gray-700 text-sm leading-relaxed mb-6 font-medium">
                            Has anyone had experience with the new care coordinator at Piedmont? Looking for insights before my next intake.
                        </Text>
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-4">
                                <View className="flex-row items-center gap-1.5">
                                    <MessageSquare size={16} color="#6B7280" />
                                    <Text className="text-gray-500 font-bold text-xs">24 Replies</Text>
                                </View>
                            </View>
                            <Pressable className="bg-gray-900 px-5 py-2 rounded-full">
                                <Text className="text-white font-bold text-[10px]">Reply</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Action Footer */}
            <BlurView intensity={80} tint="light" className="absolute bottom-10 left-6 right-6 h-20 rounded-[32px] overflow-hidden border border-white/40 shadow-2xl">
                <View className="flex-1 flex-row items-center px-4 gap-4">
                    <Pressable className="flex-row items-center justify-center bg-gray-900 px-6 py-3.5 rounded-2xl flex-1 gap-2">
                        <MessageSquare size={18} color="#fff" />
                        <Text className="text-white font-bold text-base">Join Chat</Text>
                    </Pressable>
                    <Pressable className="w-14 h-14 bg-violet-600 rounded-2xl items-center justify-center shadow-lg shadow-violet-200">
                        <Heart size={24} color="#fff" fill="#fff" />
                    </Pressable>
                </View>
            </BlurView>
        </View>
    );
}
