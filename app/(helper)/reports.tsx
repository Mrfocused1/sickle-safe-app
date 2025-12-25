import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar, ChevronDown, Download, Users, TrendingUp, TrendingDown, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;

const REPORT_TYPES = [
    { id: 'weekly', label: 'Weekly Summary' },
    { id: 'monthly', label: 'Monthly Report' },
    { id: 'incidents', label: 'Incident Log' },
];

const HEALTH_STATS = [
    { label: 'Pain-Free Days', value: '5', total: '7', trend: 'up', color: '#10B981' },
    { label: 'Avg Pain Level', value: '3.2', total: '10', trend: 'down', color: '#EF4444' },
    { label: 'Meds Adherence', value: '98', total: '%', trend: 'up', color: '#3B82F6' },
];

export default function ReportsScreen() {
    const insets = useSafeAreaInsets();
    const [selectedType, setSelectedType] = useState('weekly');

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header */}
                <View
                    className="px-6 pb-6 border-b border-gray-100 bg-white"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-3xl font-extrabold text-gray-900">Health Reports</Text>
                        <Pressable className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                            <Download size={20} color="#6B7280" />
                        </Pressable>
                    </View>
                    <Text className="text-gray-500 font-medium">Monitoring Maya Thompson</Text>
                </View>

                {/* Report Type Selector */}
                <View className="px-6 py-6">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                        <View className="flex-row gap-3">
                            {REPORT_TYPES.map((type) => (
                                <Pressable
                                    key={type.id}
                                    onPress={() => setSelectedType(type.id)}
                                    className={`px-5 py-2.5 rounded-full border ${selectedType === type.id
                                        ? 'bg-gray-900 border-gray-900'
                                        : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <Text
                                        className={`font-semibold text-xs ${selectedType === type.id ? 'text-white' : 'text-gray-600'
                                            }`}
                                    >
                                        {type.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Key Metrics Grid */}
                <View className="px-6 mb-8">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Key Metrics (This Week)</Text>
                    <View className="flex-row gap-3">
                        {HEALTH_STATS.map((stat, index) => (
                            <View
                                key={index}
                                className="flex-1 bg-gray-50 rounded-2xl p-3 border border-gray-100 items-center justify-between min-h-[110px]"
                            >
                                <View className="w-full flex-row justify-between items-start mb-2">
                                    <View className={`w-2 h-2 rounded-full`} style={{ backgroundColor: stat.color }} />
                                    {stat.trend === 'up' ? (
                                        <TrendingUp size={14} color="#10B981" />
                                    ) : (
                                        <TrendingDown size={14} color="#F59E0B" />
                                    )}
                                </View>
                                <View className="items-center">
                                    <Text className="text-2xl font-bold text-gray-900">
                                        {stat.value}
                                        <Text className="text-xs text-gray-400 font-normal">/{stat.total}</Text>
                                    </Text>
                                </View>
                                <Text className="text-[10px] font-bold text-gray-500 text-center mt-2 leading-3">{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Detailed Analysis Card */}
                <View className="px-6 mb-8">
                    <View className="bg-violet-600 rounded-[32px] p-6 shadow-xl relative overflow-hidden">
                        {/* Decorative background */}
                        <View className="absolute -right-10 -top-10 w-40 h-40 bg-violet-400 rounded-full opacity-20" />
                        <View className="absolute -left-10 -bottom-10 w-40 h-40 bg-violet-800 rounded-full opacity-20" />

                        <View className="flex-row items-center justify-between mb-8">
                            <View>
                                <Text className="text-white font-bold text-xl">Pain Analysis</Text>
                                <Text className="text-violet-200 text-xs font-medium">Dec 18 - Dec 25</Text>
                            </View>
                            <View className="bg-white/20 p-2.5 rounded-2xl">
                                <TrendingDown size={20} color="#fff" />
                            </View>
                        </View>

                        {/* Chart Placeholder (Simulated with Bars) */}
                        <View className="flex-row items-end justify-between h-32 mb-6 gap-3 px-2">
                            {[30, 45, 20, 60, 40, 80, 25].map((height, i) => (
                                <View key={i} className="flex-1 items-center gap-2">
                                    <View
                                        className="w-full bg-white/30 rounded-full"
                                        style={{ height: `${height}%` }}
                                    />
                                    <Text className="text-violet-200 text-[10px] font-bold">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <View className="bg-white/10 rounded-2xl p-4 flex-row items-center gap-3 border border-white/10">
                            <View className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                                <Clock size={16} color="#fff" />
                            </View>
                            <Text className="flex-1 text-xs text-white leading-5">
                                Average pain episodes decreased by <Text className="font-bold">15%</Text> compared to last week.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Team Updates */}
                <View className="px-6 mb-12">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Team Communication</Text>
                    <Pressable className="flex-row items-center bg-white border border-gray-100 rounded-[32px] p-5 shadow-sm active:bg-gray-50">
                        <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mr-4 border border-blue-100">
                            <Users size={22} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-bold text-base">Dr. Sarah Wilson</Text>
                            <Text className="text-gray-500 text-xs mt-1">Shared monthly vitals summary</Text>
                        </View>
                        <View className="bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                            <Text className="text-xs font-bold text-gray-700">View</Text>
                        </View>
                    </Pressable>
                </View>

            </ScrollView>
        </View>
    );
}
