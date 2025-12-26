import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Share2, ClipboardList, Lightbulb, Users } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function BloodDriveTipsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const TIPS = [
        { icon: <Users size={18} color="#3B82F6" />, title: 'Local Partnerships', text: 'Engage with churches, schools, and local businesses early. They are your primary sources of donors.' },
        { icon: <ClipboardList size={18} color="#F59E0B" />, title: 'Clear Logistics', text: 'Ensure you have a designated resting area with snacks. Donor comfort is key to repeat attendance.' },
        { icon: <Lightbulb size={18} color="#EF4444" />, title: 'Messaging Matters', text: 'Focus on the impact—one donation can save three lives. Share personal Overcomer stories to connect.' },
    ];

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
            >
                {/* Header */}
                <View
                    className="px-6 flex-row items-center justify-between bg-white pb-4 border-b border-gray-50"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                    >
                        <ArrowLeft size={20} color="#1f2937" />
                    </Pressable>
                    <Text className="text-xl font-bold text-gray-900">Community Tips</Text>
                    <Pressable className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                        <Share2 size={18} color="#1f2937" />
                    </Pressable>
                </View>

                {/* Author Info */}
                <View className="px-6 py-8 flex-row items-center">
                    <View className="w-14 h-14 rounded-full border-2 border-violet-100 p-0.5">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200' }}
                            className="w-full h-full rounded-full"
                        />
                    </View>
                    <View className="ml-4 flex-1">
                        <Text className="text-gray-900 font-bold text-lg">David Wilson</Text>
                        <View className="flex-row items-center gap-2">
                            <View className="bg-emerald-50 px-2 py-0.5 rounded">
                                <Text className="text-emerald-600 text-[10px] font-bold uppercase">Veteran Volunteer</Text>
                            </View>
                            <Text className="text-gray-400 text-xs text-medium">6 hours ago</Text>
                        </View>
                    </View>
                </View>

                <View className="px-6">
                    <Text className="text-gray-900 text-3xl font-extrabold leading-tight mb-6">
                        Tips for First-Time Blood Drive Hosts
                    </Text>

                    <Text className="text-gray-600 text-base leading-relaxed mb-10">
                        I have hosted 5 blood drives in the last 2 years. If you are starting out, the #1 thing to focus on is local church and school partnerships. Here is my breakdown of how to make your first drive a massive success.
                    </Text>

                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">Key Strategies</Text>

                    {TIPS.map((tip, i) => (
                        <View key={i} className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-6">
                            <View className="flex-row items-center gap-4 mb-3">
                                <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm">
                                    {tip.icon}
                                </View>
                                <Text className="text-gray-900 font-bold text-base">{tip.title}</Text>
                            </View>
                            <Text className="text-gray-500 text-sm leading-relaxed">{tip.text}</Text>
                        </View>
                    ))}

                    <View className="mt-10 py-10 border-t border-gray-100 items-center justify-center">
                        <View className="flex-row items-center gap-8 mb-8">
                            <Pressable className="items-center">
                                <View className="w-12 h-12 bg-pink-50 rounded-full items-center justify-center mb-2">
                                    <Heart size={24} color="#EC4899" fill="#EC4899" />
                                </View>
                                <Text className="text-gray-400 font-bold text-xs">124 Likes</Text>
                            </Pressable>
                            <Pressable className="items-center">
                                <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center mb-2 border border-gray-100">
                                    <MessageCircle size={24} color="#6B7280" />
                                </View>
                                <Text className="text-gray-400 font-bold text-xs">28 Comments</Text>
                            </Pressable>
                        </View>
                        <Pressable className="bg-violet-600 px-12 py-4 rounded-full shadow-lg">
                            <Text className="text-white font-bold text-base">Say Thank You</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
