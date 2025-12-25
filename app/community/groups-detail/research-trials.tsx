import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Shield, Users, Globe, ExternalLink, Dna, FileBarChart, Microscope } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function ResearchTrialsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const TRIALS = [
        { title: 'Gene Therapy Study: Phase 3', location: 'Atlanta Medical Hub', id: 1 },
        { title: 'Pain Management Protocol V2', location: 'National Health Inst.', id: 2 },
        { title: 'Blood Oxygen Optimization', location: 'Emory Research', id: 3 },
    ];

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View
                    className="px-6 pb-4 flex-row items-center justify-between"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                    >
                        <ArrowLeft size={20} color="#1f2937" />
                    </Pressable>
                    <View className="flex-row items-center gap-2">
                        <Globe size={16} color="#3B82F6" />
                        <Text className="text-gray-900 font-bold">Scientific Community</Text>
                    </View>
                    <View className="w-10" />
                </View>

                {/* Hero Section */}
                <View className="px-6 py-10 items-center justify-center">
                    <View className="w-24 h-24 bg-blue-50 rounded-[32px] items-center justify-center mb-6 border border-blue-100 shadow-sm">
                        <Microscope size={44} color="#3B82F6" />
                    </View>
                    <Text className="text-gray-900 text-3xl font-extrabold text-center mb-2">Research & Trials</Text>
                    <View className="flex-row items-center gap-2 mb-8">
                        <Text className="text-blue-500 font-bold text-xs">Official Partner Group</Text>
                        <Shield size={12} color="#3B82F6" />
                    </View>

                    <View className="flex-row gap-6">
                        <View className="items-center">
                            <Text className="text-gray-900 font-black text-lg">3.4k</Text>
                            <Text className="text-gray-400 text-[10px] font-bold uppercase">Members</Text>
                        </View>
                        <View className="w-px h-8 bg-gray-100" />
                        <View className="items-center">
                            <Text className="text-gray-900 font-black text-lg">12+</Text>
                            <Text className="text-gray-400 text-[10px] font-bold uppercase">Active Trials</Text>
                        </View>
                        <View className="w-px h-8 bg-gray-100" />
                        <View className="items-center">
                            <Text className="text-gray-900 font-black text-lg">24/7</Text>
                            <Text className="text-gray-400 text-[10px] font-bold uppercase">Updates</Text>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View className="px-6">
                    {/* Featured Update */}
                    <View className="bg-gray-900 rounded-[40px] p-8 mb-10 overflow-hidden relative">
                        <View className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full" />
                        <Dna size={24} color="#3B82F6" className="mb-4" />
                        <Text className="text-white text-xl font-bold mb-2">Latest: FDA Approval on New Treatment Option</Text>
                        <Text className="text-white/60 text-sm leading-relaxed mb-6">
                            A new drug showing significant reduction in pain crises has been fast-tracked for distribution starting Q1 2025.
                        </Text>
                        <Pressable className="bg-white py-3 rounded-full items-center">
                            <Text className="text-gray-900 font-bold text-xs">Read Full Brief</Text>
                        </Pressable>
                    </View>

                    {/* Active Trials List */}
                    <View className="mb-10">
                        <View className="flex-row items-center justify-between mb-8">
                            <Text className="text-gray-900 font-bold text-xl tracking-tight">Recruiting Trials</Text>
                            <Text className="text-blue-600 font-bold text-xs">Refresh</Text>
                        </View>

                        {TRIALS.map(trial => (
                            <View key={trial.id} className="bg-white border border-gray-100 rounded-[32px] p-6 mb-6 shadow-sm">
                                <View className="flex-row justify-between items-start mb-4">
                                    <View className="bg-blue-50 px-3 py-1 rounded-full">
                                        <Text className="text-blue-600 font-bold text-[8px] uppercase tracking-wider">Clinical Study</Text>
                                    </View>
                                    <ExternalLink size={16} color="#CBD5E1" />
                                </View>
                                <Text className="text-gray-900 font-bold text-base mb-1">{trial.title}</Text>
                                <Text className="text-gray-400 text-xs font-medium mb-6">{trial.location}</Text>

                                <View className="flex-row items-center justify-between">
                                    <View className="flex-row items-center gap-1">
                                        <View className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <Text className="text-gray-400 text-[10px] font-bold">Open for signup</Text>
                                    </View>
                                    <Pressable className="bg-gray-50 px-6 py-2 rounded-full border border-gray-200">
                                        <Text className="text-gray-900 font-bold text-[10px]">Learn More</Text>
                                    </Pressable>
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Resource Grid */}
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">Documentation Hub</Text>
                    <View className="flex-row gap-4 mb-20">
                        <View className="flex-1 bg-gray-50 rounded-[32px] p-6 items-center">
                            <FileBarChart size={24} color="#6B7280" className="mb-3" />
                            <Text className="text-gray-900 font-bold text-xs text-center">Whitepapers</Text>
                        </View>
                        <View className="flex-1 bg-gray-50 rounded-[32px] p-6 items-center">
                            <Users size={24} color="#6B7280" className="mb-3" />
                            <Text className="text-gray-900 font-bold text-xs text-center">Researcher Q&A</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
