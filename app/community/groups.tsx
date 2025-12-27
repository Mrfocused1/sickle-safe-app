import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Plus, Users, Shield, Heart, MapPin, ChevronRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import AppBottomSheet from '../../components/AppBottomSheet';

export default function CommunityGroupsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSheet, setShowSheet] = useState(false);

    const GROUPS = [
        {
            id: 1,
            name: 'Atlanta Overcomers',
            members: '1.2k',
            description: 'Local support group for overcomers in the Atlanta area.',
            image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=400',
            category: 'Location',
            isJoined: true,
            route: '/community/groups-detail/atlanta-overcomers'
        },
        {
            id: 2,
            name: 'Caregiver Strength',
            members: '850',
            description: 'A private space for caregivers to share tips and find mental health support.',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=400',
            category: 'Support',
            isJoined: false,
            route: '/community/groups-detail/caregiver-strength'
        },
        {
            id: 3,
            name: 'Research & Trials',
            members: '3.4k',
            description: 'Stay updated on the latest clinical trials and medical breakthroughs.',
            image: 'https://images.unsplash.com/photo-1532187875605-2fe358a3d46a?auto=format&fit=crop&q=80&w=400',
            category: 'Medical',
            isJoined: false,
            route: '/community/groups-detail/research-trials'
        },
        {
            id: 4,
            name: 'Daily Victories',
            members: '5.6k',
            description: 'Sharing daily wins and positive stories from the community.',
            image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=400',
            category: 'Motivation',
            isJoined: true,
            route: '/community/groups-detail/daily-victories'
        }
    ];

    const filteredGroups = GROUPS.filter(g =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    className="px-6 pb-6 border-b border-gray-50"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <View className="flex-row items-center justify-between mb-6">
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100 active:scale-95"
                        >
                            <ArrowLeft size={20} color="#0f172a" />
                        </Pressable>
                        <Pressable
                            onPress={() => setShowSheet(true)}
                            className="w-10 h-10 bg-violet-600 rounded-full items-center justify-center shadow-lg active:scale-95"
                        >
                            <Plus size={20} color="#fff" />
                        </Pressable>
                    </View>

                    <View className="mb-6">
                        <Text className="text-brand-muted text-brand-sub">Community</Text>
                        <Text className="text-brand-title text-brand-dark">Groups</Text>
                    </View>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                        <Search size={20} color="#64748b" />
                        <TextInput
                            placeholder="Find groups to join..."
                            className="flex-1 ml-3 text-brand-label text-brand-dark"
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Categories */}
                <View className="px-6 py-6">
                    <Text className="text-brand-muted text-brand-section mb-4 ml-1">Suggested Categories</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                        <View className="flex-row gap-3">
                            <CategoryChip icon={<MapPin size={14} color="#8B5CF6" />} label="Local" bgColor="bg-violet-50" textColor="text-violet-600" />
                            <CategoryChip icon={<Shield size={14} color="#10B981" />} label="Medical" bgColor="bg-emerald-50" textColor="text-emerald-600" />
                            <CategoryChip icon={<Heart size={14} color="#EF4444" />} label="Support" bgColor="bg-red-50" textColor="text-red-600" />
                            <CategoryChip icon={<Users size={14} color="#3B82F6" />} label="Advocacy" bgColor="bg-blue-50" textColor="text-blue-600" />
                        </View>
                    </ScrollView>
                </View>

                {/* Groups List */}
                <View className="px-6 pb-10">
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748b', textTransform: 'uppercase', letterSpacing: 1 }} className="mb-6 ml-1">Discover Groups</Text>

                    {filteredGroups.map((group) => (
                        <Pressable
                            key={group.id}
                            onPress={() => router.push(group.route as any)}
                            className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm mb-4 flex-row active:bg-gray-50 active:scale-[0.98]"
                        >
                            <View className="w-20 h-20 rounded-2xl overflow-hidden mr-4">
                                <Image source={{ uri: group.image }} className="w-full h-full" />
                            </View>
                            <View className="flex-1 justify-center">
                                <View className="flex-row items-center justify-between mb-1">
                                    <Text className="text-brand-dark text-brand-label">{group.name}</Text>
                                    <View className="flex-row items-center gap-1">
                                        <Users size={12} color="#64748b" />
                                        <Text className="text-brand-muted text-brand-sub font-bold">{group.members}</Text>
                                    </View>
                                </View>
                                <Text className="text-brand-muted text-brand-sub mb-3" numberOfLines={2}>
                                    {group.description}
                                </Text>
                                <View className="flex-row items-center justify-between">
                                    <View className="bg-gray-50 px-2 py-1 rounded-md">
                                        <Text className="text-brand-muted text-[9px] font-bold uppercase tracking-wider">{group.category}</Text>
                                    </View>
                                    <Pressable className={`px-4 py-1.5 rounded-full ${group.isJoined ? 'bg-gray-100' : 'bg-violet-600'}`}>
                                        <Text className={`text-[11px] font-extrabold ${group.isJoined ? 'text-brand-muted' : 'text-white'}`}>
                                            {group.isJoined ? 'Joined' : 'Join'}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>

            <AppBottomSheet
                visible={showSheet}
                onClose={() => setShowSheet(false)}
                type="community_actions"
            />
        </View>
    );
}

function CategoryChip({ icon, label, bgColor, textColor }: any) {
    return (
        <Pressable className={`${bgColor} px-4 py-3 rounded-2xl flex-row items-center gap-2 border border-white/20`}>
            {icon}
            <Text className={`${textColor} text-brand-sub font-bold`}>{label}</Text>
        </Pressable>
    );
}
