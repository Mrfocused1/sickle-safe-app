import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Sparkles, Heart, Share2, MessageSquare, MoreVertical, Trophy, Camera } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function DailyVictoriesScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const FEED = [
        {
            user: 'Maya J.',
            action: 'celebrated a win',
            content: 'Finally back in the gym today! Transitioning from crisis to movement feels so good. 🏋️‍♀️',
            likes: 42,
            id: 1,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400'
        },
        {
            user: 'Chris T.',
            action: 'shared a recovery milestone',
            content: '30 days since my last hospital visit. The new hydration routine is working wonders!',
            likes: 128,
            id: 2
        }
    ];

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Custom Content Hub Header */}
                <View
                    className="px-6 flex-row items-center justify-between"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-pink-50 rounded-full items-center justify-center border border-pink-100"
                    >
                        <ArrowLeft size={20} color="#EC4899" />
                    </Pressable>
                    <View className="flex-row items-center gap-2">
                        <Sparkles size={18} color="#EC4899" />
                        <Text className="text-gray-900 font-extrabold text-lg">Daily Victories</Text>
                    </View>
                    <Pressable className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                        <MoreVertical size={20} color="#1f2937" />
                    </Pressable>
                </View>

                {/* Hero / Motivation */}
                <View className="px-6 py-10 items-center">
                    <View className="w-20 h-20 bg-pink-500 rounded-[24px] items-center justify-center mb-6 shadow-lg shadow-pink-200">
                        <Trophy size={36} color="#fff" />
                    </View>
                    <Text className="text-gray-900 text-3xl font-black text-center mb-2">Celebrate progress.</Text>
                    <Text className="text-gray-400 text-sm text-center px-8 leading-relaxed">
                        Big or small, every step forward counts. Join 5.6k others in sharing the light during the journey.
                    </Text>
                </View>

                {/* Engagement Stats High-fidelity */}
                <View className="px-6 flex-row gap-4 mb-10">
                    <View className="flex-1 bg-pink-50/50 rounded-[32px] p-6 border border-pink-100 items-center">
                        <Text className="text-pink-600 font-black text-2xl">4.2k</Text>
                        <Text className="text-pink-400 text-[10px] font-bold uppercase tracking-widest mt-1">Victories Shared</Text>
                    </View>
                    <View className="flex-1 bg-violet-50/50 rounded-[32px] p-6 border border-violet-100 items-center">
                        <Text className="text-violet-600 font-black text-2xl">12k</Text>
                        <Text className="text-violet-400 text-[10px] font-bold uppercase tracking-widest mt-1">High Fives</Text>
                    </View>
                </View>

                {/* Feed */}
                <View className="px-6">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-8 ml-1">The Wall of Wins</Text>

                    {FEED.map(post => (
                        <View key={post.id} className="bg-white border-b border-gray-50 pb-8 mb-8">
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-10 h-10 rounded-full bg-gray-100 border border-gray-50 overflow-hidden">
                                        <Image source={{ uri: `https://i.pravatar.cc/100?u=${post.id}` }} className="w-full h-full" />
                                    </View>
                                    <View>
                                        <Text className="text-gray-900 font-black text-sm">{post.user}</Text>
                                        <Text className="text-pink-500 font-bold text-[10px] uppercase tracking-wider">{post.action}</Text>
                                    </View>
                                </View>
                                <Pressable className="p-2"><Heart size={18} color="#EC4899" /></Pressable>
                            </View>

                            <Text className="text-gray-700 text-base leading-relaxed mb-4">{post.content}</Text>

                            {post.image && (
                                <View className="w-full h-56 rounded-[32px] overflow-hidden mb-4 bg-gray-100">
                                    <Image source={{ uri: post.image }} className="w-full h-full" />
                                </View>
                            )}

                            <View className="flex-row items-center gap-6">
                                <View className="flex-row items-center gap-1.5">
                                    <View className="bg-pink-50 p-1.5 rounded-full"><Heart size={12} color="#EC4899" fill="#EC4899" /></View>
                                    <Text className="text-gray-900 font-black text-xs">{post.likes}</Text>
                                </View>
                                <View className="flex-row items-center gap-1.5">
                                    <MessageSquare size={16} color="#CBD5E1" />
                                    <Text className="text-gray-400 font-bold text-xs">Join celebration</Text>
                                </View>
                            </View>
                        </View>
                    ))}

                    <View className="items-center py-10 opacity-30">
                        <Sparkles size={24} color="#CBD5E1" />
                    </View>
                </View>

                {/* Floating Add Button for this group context */}
                <View className="px-6 pb-20">
                    <Pressable className="bg-pink-500 flex-row items-center justify-center gap-3 py-5 rounded-[28px] shadow-xl shadow-pink-200">
                        <Camera size={20} color="#fff" />
                        <Text className="text-white font-black text-lg">Share Your Victory</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}
