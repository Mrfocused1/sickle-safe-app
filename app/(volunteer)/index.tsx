import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { StatusBar } from 'expo-status-bar';

export default function VolunteerDashboard() {
    const insets = useSafeAreaInsets();

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
                        <View className="w-12 h-12 rounded-full border border-gray-100 overflow-hidden">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }}
                                className="w-full h-full"
                            />
                        </View>
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

                        <Pressable className="bg-gray-50 py-3.5 rounded-2xl border border-gray-100 items-center active:bg-gray-100">
                            <Text className="text-gray-900 font-bold text-sm">View Volunteer Resume</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Active Support Missions */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-gray-900 font-bold text-xl">Active Missions</Text>
                        <Pressable>
                            <Text className="text-violet-600 font-bold text-sm">See All</Text>
                        </Pressable>
                    </View>

                    <Pressable className="bg-white border border-gray-100 rounded-[32px] p-5 shadow-sm mb-4">
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
                            <Pressable className="bg-violet-600 px-5 py-2 rounded-2xl">
                                <Text className="text-white font-bold text-xs text-center">Join</Text>
                            </Pressable>
                        </View>
                    </Pressable>

                    <Pressable className="bg-gray-50 border border-gray-100 rounded-[32px] p-5">
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
                            <Pressable key={i} className="w-64 bg-white border border-gray-100 rounded-[32px] p-4 m-2 shadow-sm">
                                <View className="h-32 bg-gray-100 rounded-2xl mb-4 overflow-hidden">
                                    <Image
                                        source={{ uri: `https://images.unsplash.com/photo-${1515023677547 + i}-51f16da88c0a?auto=format&fit=crop&q=80&w=400` }}
                                        className="w-full h-full"
                                    />
                                </View>
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
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>
        </View>
    );
}
