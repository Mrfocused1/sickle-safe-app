import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, Shield, Heart, Share2, MessageCircle, MoreVertical, Bookmark } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function CaregiverStrengthScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [isJoined, setIsJoined] = useState(false);

    const RESOURCES = [
        { title: 'Self-Care Checklist', type: 'PDF', id: 1 },
        { title: 'Managing Burnout Workshop', date: 'Video • 15m', id: 2 },
    ];

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View
                    className="px-6 pb-6 flex-row items-center justify-between"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                    >
                        <ArrowLeft size={20} color="#1f2937" />
                    </Pressable>
                    <Text className="text-xl font-bold text-gray-900">Support Group</Text>
                    <Pressable className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                        <MoreVertical size={20} color="#1f2937" />
                    </Pressable>
                </View>

                {/* Profile Section */}
                <View className="items-center px-6 py-8 border-b border-gray-50">
                    <View className="w-32 h-32 rounded-[48px] overflow-hidden mb-6 shadow-xl border-4 border-emerald-50">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400' }}
                            className="w-full h-full"
                        />
                    </View>
                    <Text className="text-gray-900 text-3xl font-extrabold mb-2">Caregiver Strength</Text>
                    <View className="flex-row items-center gap-4 mb-8">
                        <View className="flex-row items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
                            <Shield size={12} color="#10B981" />
                            <Text className="text-emerald-600 font-bold text-[10px] uppercase">Private Group</Text>
                        </View>
                        <View className="flex-row items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full">
                            <Users size={12} color="#6B7280" />
                            <Text className="text-gray-500 font-bold text-[10px] uppercase">850 Members</Text>
                        </View>
                    </View>

                    <Pressable
                        onPress={() => setIsJoined(!isJoined)}
                        className={`w-full py-4 rounded-[24px] items-center flex-row justify-center gap-3 ${isJoined ? 'bg-gray-100' : 'bg-gray-900'}`}
                    >
                        {!isJoined && <Heart size={18} color="#fff" fill="#fff" />}
                        <Text className={`font-bold text-lg ${isJoined ? 'text-gray-500' : 'text-white'}`}>
                            {isJoined ? 'Requested' : 'Ask to Join'}
                        </Text>
                    </Pressable>
                </View>

                {/* Info */}
                <View className="px-6 py-10">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">The Mission</Text>
                    <Text className="text-gray-600 text-lg leading-relaxed mb-10">
                        Caregiving is a journey that requires immense strength, but you don't have to carry it alone. This group is a dedicated sanctuary for caregivers to share their struggles, find mental health resources, and lift each other up.
                    </Text>

                    {/* Resources */}
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">Learning & Support</Text>
                    <View className="flex-row gap-4 mb-10">
                        {RESOURCES.map(res => (
                            <Pressable
                                key={res.id}
                                className="flex-1 bg-emerald-50/50 rounded-[32px] p-6 border border-emerald-100"
                            >
                                <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mb-4 shadow-sm">
                                    <Bookmark size={18} color="#10B981" />
                                </View>
                                <Text className="text-gray-900 font-bold text-sm mb-1">{res.title}</Text>
                                <Text className="text-emerald-700/60 font-bold text-[10px] uppercase">{res.type || res.date}</Text>
                            </Pressable>
                        ))}
                    </View>

                    {/* Rules */}
                    <View className="bg-gray-50 rounded-[40px] p-8 border border-gray-100">
                        <Text className="text-gray-900 font-bold text-lg mb-6">Group Rules</Text>
                        <View className="space-y-6">
                            <RuleItem number="01" title="Privacy First" description="What is shared here stays here. Respect member confidentiality." />
                            <RuleItem number="02" title="Be Kind" description="Supportive and empathetic communication only." />
                        </View>
                    </View>

                    <View className="h-20" />
                </View>
            </ScrollView>
        </View>
    );
}

function RuleItem({ number, title, description }: any) {
    return (
        <View className="flex-row items-start gap-4 mb-6">
            <Text className="text-emerald-500 font-black text-lg">{number}</Text>
            <View className="flex-1">
                <Text className="text-gray-900 font-bold text-sm mb-1">{title}</Text>
                <Text className="text-gray-500 text-xs leading-relaxed">{description}</Text>
            </View>
        </View>
    );
}
