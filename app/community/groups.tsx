import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, Plus, Users, Shield, Heart, MapPin, ChevronRight } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function CommunityGroupsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');

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
                    className="px-6 pb-6 border-b border-gray-100"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <View className="flex-row items-center justify-between mb-8">
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                        >
                            <ArrowLeft size={20} color="#1f2937" />
                        </Pressable>
                        <Text className="text-xl font-bold text-gray-900">Community Groups</Text>
                        <Pressable
                            className="w-10 h-10 bg-violet-600 rounded-full items-center justify-center shadow-lg"
                        >
                            <Plus size={20} color="#fff" />
                        </Pressable>
                    </View>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Find groups to join..."
                            className="flex-1 ml-3 text-base text-gray-900"
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Categories */}
                <View className="px-6 py-6">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Suggested Categories</Text>
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
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">Discover Groups</Text>

                    {filteredGroups.map((group) => (
                        <Pressable
                            key={group.id}
                            onPress={() => router.push(group.route as any)}
                            className="bg-white rounded-[32px] p-4 border border-gray-100 shadow-sm mb-6 flex-row active:bg-gray-50"
                        >
                            <View className="w-24 h-24 rounded-2xl overflow-hidden mr-4">
                                <Image source={{ uri: group.image }} className="w-full h-full" />
                            </View>
                            <View className="flex-1 justify-center">
                                <View className="flex-row items-center justify-between mb-1">
                                    <Text className="text-gray-900 font-bold text-base">{group.name}</Text>
                                    <View className="flex-row items-center gap-1">
                                        <Users size={10} color="#9CA3AF" />
                                        <Text className="text-gray-400 text-[10px] font-bold">{group.members}</Text>
                                    </View>
                                </View>
                                <Text className="text-gray-500 text-xs leading-relaxed mb-3" numberOfLines={2}>
                                    {group.description}
                                </Text>
                                <View className="flex-row items-center justify-between">
                                    <View className="bg-gray-50 px-2 py-1 rounded-md">
                                        <Text className="text-gray-400 text-[8px] font-bold uppercase">{group.category}</Text>
                                    </View>
                                    <Pressable className={`px-4 py-1.5 rounded-full ${group.isJoined ? 'bg-gray-100' : 'bg-violet-600'}`}>
                                        <Text className={`text-[10px] font-bold ${group.isJoined ? 'text-gray-500' : 'text-white'}`}>
                                            {group.isJoined ? 'Joined' : 'Join'}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

function CategoryChip({ icon, label, bgColor, textColor }: any) {
    return (
        <Pressable className={`${bgColor} px-4 py-3 rounded-2xl flex-row items-center gap-2 border border-white/20`}>
            {icon}
            <Text className={`${textColor} font-bold text-xs`}>{label}</Text>
        </Pressable>
    );
}
