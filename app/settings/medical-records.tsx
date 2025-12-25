import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, FileText, Download, Share2, Filter, ChevronRight, Activity, Calendar } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function MedicalRecordsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const RECORDS = [
        { id: 1, type: 'Lab Result', title: 'Complete Blood Count (CBC)', date: 'Oct 24, 2023', provider: 'City Lab Corp', status: 'Final' },
        { id: 2, type: 'Care Plan', title: 'Transition Care Plan 2024', date: 'Sep 12, 2023', provider: 'Dr. Sarah Wilson', status: 'Active' },
        { id: 3, type: 'Summary', title: 'Hospital Discharge Summary', date: 'Aug 05, 2023', provider: 'Metro General', status: 'Final' },
    ];

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Header */}
                <View
                    className="px-6 pb-6 border-b border-gray-50"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <View className="flex-row items-center justify-between mb-8">
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                        >
                            <ArrowLeft size={20} color="#1f2937" />
                        </Pressable>
                        <Text className="text-xl font-bold text-gray-900">Medical Records</Text>
                        <Pressable>
                            <Filter size={20} color="#6B7280" />
                        </Pressable>
                    </View>

                    {/* Quick Selection */}
                    <View className="flex-row gap-3">
                        <Pressable className="flex-1 bg-violet-600 rounded-2xl p-4 items-center justify-center flex-row gap-2">
                            <Share2 size={16} color="#fff" />
                            <Text className="text-white font-bold text-xs">Share All</Text>
                        </Pressable>
                        <Pressable className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100 items-center justify-center flex-row gap-2">
                            <Download size={16} color="#4B5563" />
                            <Text className="text-gray-700 font-bold text-xs">Export PDF</Text>
                        </Pressable>
                    </View>
                </View>

                <View className="px-6 py-8">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">Recent Documents</Text>

                    {RECORDS.map((record) => (
                        <Pressable key={record.id} className="bg-white rounded-[32px] p-5 border border-gray-100 shadow-sm mb-6 flex-row items-center">
                            <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${record.type === 'Lab Result' ? 'bg-blue-50' :
                                    record.type === 'Care Plan' ? 'bg-emerald-50' : 'bg-violet-50'
                                }`}>
                                <FileText size={24} color={
                                    record.type === 'Lab Result' ? '#3B82F6' :
                                        record.type === 'Care Plan' ? '#10B981' : '#8B5CF6'
                                } />
                            </View>
                            <View className="flex-1">
                                <View className="flex-row items-center gap-2 mb-1">
                                    <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-tighter">{record.type}</Text>
                                    <View className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-tighter">{record.status}</Text>
                                </View>
                                <Text className="text-gray-900 font-bold text-sm mb-1">{record.title}</Text>
                                <View className="flex-row items-center">
                                    <Calendar size={10} color="#9CA3AF" />
                                    <Text className="text-gray-400 text-xs ml-1">{record.date}</Text>
                                </View>
                            </View>
                            <ChevronRight size={18} color="#D1D5DB" />
                        </Pressable>
                    ))}

                    <View className="mt-4 p-6 bg-gray-50 rounded-[32px] border border-gray-100 border-dashed items-center justify-center">
                        <Activity size={32} color="#D1D5DB" />
                        <Text className="text-gray-500 font-bold text-sm mt-3 text-center">Auto-Sync Medical Records</Text>
                        <Text className="text-gray-400 text-xs mt-1 text-center">Connect your myChart or Hospital account.</Text>
                        <Pressable className="mt-4 bg-white border border-gray-200 px-6 py-2.5 rounded-full">
                            <Text className="text-gray-900 font-bold text-xs">Connect Portal</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
