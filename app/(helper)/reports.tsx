import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Calendar, ChevronDown, Download, Users, TrendingUp, TrendingDown, Clock } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppBottomSheet from '../../components/AppBottomSheet';
import * as Haptics from 'expo-haptics';

const SCREEN_WIDTH = Dimensions.get('window').width;

const REPORT_TYPES = [
    { id: 'weekly', label: 'Weekly Summary' },
    { id: 'monthly', label: 'Monthly Report' },
    { id: 'incidents', label: 'Incident Log' },
];

const HEALTH_STATS = [
    { label: 'Pain-Free Days', value: '5', total: '7', subtitle: 'Fantastic progress this week!', trend: '+2 days', color: '#10B981', icon: 'wb-sunny', progress: 0.71 },
    { label: 'Avg Pain Level', value: '3.2', total: '10', subtitle: 'Slightly lower than last week', trend: '-0.4', color: '#F59E0B', icon: 'show-chart', progress: 0.32 },
    { label: 'Meds Adherence', value: '98', total: '%', subtitle: 'Very consistent performance', trend: '+5%', color: '#3B82F6', icon: 'medication', progress: 0.98 },
];

export default function ReportsScreen() {
    const [selectedType, setSelectedType] = useState('weekly');
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);

    const DOCTOR_DATA = {
        name: 'Dr. Sarah Wilson',
        role: 'Hematologist',
        priority: 'Medical',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200',
        status: 'Online',
        isEmergency: false
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header */}
                <View
                    className="px-6 pb-6 border-b border-gray-100 bg-white"
                    style={{ paddingTop: 60 }}
                >
                    <View className="flex-row items-center justify-between mb-2">
                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 }}>Health Reports</Text>
                        <Pressable className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                            <Download size={20} color="#6B7280" />
                        </Pressable>
                    </View>
                    <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748b' }}>Monitoring Maya Thompson</Text>
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
                                        style={{ fontSize: 12, fontWeight: '700' }}
                                        className={selectedType === type.id ? 'text-white' : 'text-gray-600'}
                                    >
                                        {type.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Key Metrics Section */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center justify-between mb-4 px-1">
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }}>Key Metrics (This Week)</Text>
                        <MaterialIcons name="info-outline" size={16} color="#94a3b8" />
                    </View>

                    <View className="gap-4">
                        {HEALTH_STATS.map((stat, index) => (
                            <View
                                key={index}
                                className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex-row items-center"
                            >
                                <View
                                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                                    style={{ backgroundColor: `${stat.color}10` }}
                                >
                                    <MaterialIcons name={stat.icon as any} size={28} color={stat.color} />
                                </View>

                                <View className="flex-1">
                                    <View className="flex-row items-center justify-between mb-1">
                                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.5 }}>{stat.label}</Text>
                                        <Text style={{ fontSize: 12, fontWeight: '800', color: stat.color }}>{stat.trend}</Text>
                                    </View>

                                    <View className="flex-row items-baseline mb-2">
                                        <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a' }}>{stat.value}</Text>
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#94a3b8', marginLeft: 2 }}>/{stat.total}</Text>
                                    </View>

                                    {/* Small Progress Bar */}
                                    <View className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                        <View
                                            className="h-full rounded-full"
                                            style={{
                                                backgroundColor: stat.color,
                                                width: `${stat.progress * 100}%`
                                            }}
                                        />
                                    </View>

                                    <Text style={{ fontSize: 12, fontWeight: '500', color: '#64748b', marginTop: 8 }}>{stat.subtitle}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Detailed Analysis Card - Light Version */}
                <View className="px-6 mb-8">
                    <View className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 relative overflow-hidden">
                        {/* Decorative background - subtle light tints */}
                        <View className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-50 rounded-full opacity-40" />

                        <View className="flex-row items-center justify-between mb-8">
                            <View>
                                <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a' }}>Pain Analysis</Text>
                                <Text style={{ fontSize: 12, fontWeight: '500', color: '#64748b' }}>Dec 18 - Dec 25</Text>
                            </View>
                            <View className="bg-indigo-50 p-2.5 rounded-2xl">
                                <TrendingDown size={20} color="#4f46e5" />
                            </View>
                        </View>

                        {/* Chart Placeholder (Indigo Bars) */}
                        <View className="flex-row items-end justify-between h-32 mb-6 gap-3 px-2">
                            {[30, 45, 20, 60, 40, 80, 25].map((height, i) => (
                                <View key={i} className="flex-1 items-center gap-2">
                                    <View
                                        className="w-full bg-indigo-100 rounded-full overflow-hidden"
                                        style={{ height: '100%', justifyContent: 'flex-end' }}
                                    >
                                        <View
                                            className="w-full bg-indigo-600 rounded-full"
                                            style={{ height: `${height}%` }}
                                        />
                                    </View>
                                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#94a3b8' }}>
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <View className="bg-indigo-50/50 rounded-2xl p-4 flex-row items-center gap-3 border border-indigo-100/50">
                            <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
                                <Clock size={16} color="#4f46e5" />
                            </View>
                            <Text style={{ fontSize: 13, fontWeight: '500', color: '#4338ca', lineHeight: 20 }} className="flex-1">
                                Average pain episodes decreased by <Text style={{ fontWeight: '800' }}>15%</Text> compared to last week.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Team Updates */}
                <View className="px-6 mb-12">
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#64748b', letterSpacing: 1, textTransform: 'uppercase' }} className="mb-4 ml-1">Team Communication</Text>
                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setShowMemberModal(true);
                        }}
                        className="flex-row items-center bg-white border border-gray-100 rounded-[32px] p-5 shadow-sm active:bg-gray-50 active:scale-[0.98]"
                    >
                        <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mr-4 border border-blue-100">
                            <Users size={22} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>Dr. Sarah Wilson</Text>
                            <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748b', marginTop: 4 }}>Hematologist • Online</Text>
                        </View>
                        <View className="bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                            <Text style={{ fontSize: 12, fontWeight: '800', color: '#0f172a' }}>View</Text>
                        </View>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setShowInviteModal(true);
                        }}
                        className="flex-row items-center bg-gray-50 border border-dashed border-gray-300 rounded-[32px] p-5 mt-4 active:bg-gray-100 active:scale-[0.98]"
                    >
                        <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center mr-4 border border-gray-200">
                            <MaterialIcons name="person-add" size={22} color="#4f46e5" />
                        </View>
                        <View className="flex-1">
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#4f46e5' }}>Add Team Member</Text>
                            <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748b' }}>Invite specialists or family</Text>
                        </View>
                    </Pressable>
                </View>

            </ScrollView>

            <AppBottomSheet
                visible={showMemberModal}
                onClose={() => setShowMemberModal(false)}
                type="member"
                member={DOCTOR_DATA}
            />

            <AppBottomSheet
                visible={showInviteModal}
                onClose={() => setShowInviteModal(false)}
                type="invite_member"
            />
        </View>
    );
}
