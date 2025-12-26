import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    Search,
    MessageCircle,
    Heart,
    Share2,
    MoreVertical,
    Users,
    Megaphone,
    Lightbulb
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PostActionSheet, ActionItem } from '../../components/PostActionSheet';
import { LinearGradient } from 'expo-linear-gradient';

const POSTS = [
    {
        id: 1,
        author: 'SickleSafe Foundation',
        role: 'Official Account',
        time: '3h ago',
        avatar: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200',
        title: 'New Policy Advocacy Kit!',
        content: 'Our latest guide on advocating for better Sickle Cell policies at the state level is now available for all volunteers. Check it out!',
        likes: 342,
        comments: 56,
        tag: 'Advocacy',
        tagColor: 'bg-violet-50 text-violet-600',
        isOfficial: true,
        route: '/community/updates/advocacy-kit'
    },
    {
        id: 2,
        author: 'David Wilson',
        role: 'Veteran Volunteer',
        time: '6h ago',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
        title: 'Tips for first-time blood drive hosts',
        content: 'I have hosted 5 blood drives in the last 2 years. If you are starting out, the #1 thing to focus on is local church and school partnerships...',
        likes: 124,
        comments: 28,
        tag: 'Tips',
        tagColor: 'bg-emerald-50 text-emerald-600',
        route: '/community/updates/blood-drive-tips'
    },
    {
        id: 3,
        author: 'Elena Rodriguez',
        role: 'Policy Advisor',
        time: '1d ago',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
        title: 'Call to Action: Local Council Meeting',
        content: 'There’s a crucial hearing on Tuesday regarding health accessibility. We need as many volunteers as possible to attend!',
        likes: 567,
        comments: 112,
        tag: 'Action',
        tagColor: 'bg-blue-50 text-blue-600',
        route: '/community/updates/council-meeting'
    }
];

export default function VolunteerCommunity() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [showSheet, setShowSheet] = useState(false);
    const [selectedUpdateTitle, setSelectedUpdateTitle] = useState('');

    const updateActions: ActionItem[] = [
        {
            label: "Save for Later",
            icon: "bookmark-border",
            onPress: () => alert("Added to your saved items"),
            color: "#6366F1"
        },
        {
            label: "Share via Message",
            icon: "send",
            onPress: () => alert("Opening messages..."),
            color: "#3B82F6"
        },
        {
            label: "Hide Update",
            icon: "visibility-off",
            onPress: () => alert("This update will be hidden"),
            isDestructive: true
        }
    ];

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header */}
                <View
                    className="px-6 pb-2"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-3xl font-extrabold text-gray-900">Community</Text>
                            <Text className="text-gray-500 font-medium text-sm">Organize & Advocate together</Text>
                        </View>
                        <Pressable className="bg-violet-50 p-2.5 rounded-xl border border-violet-100">
                            <Megaphone size={20} color="#8B5CF6" />
                        </Pressable>
                    </View>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 mb-6">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search discussions..."
                            className="flex-1 ml-3 text-base text-gray-900"
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Redesigned Engagement Cards */}
                <View className="px-6 py-4">
                    <View className="flex-row gap-4 h-[200px]">
                        {/* Find Groups Card */}
                        <Pressable
                            onPress={() => router.push('/community/groups')}
                            className="flex-1 rounded-[32px] overflow-hidden shadow-sm"
                            style={{
                                shadowColor: '#8B5CF6',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.15,
                                shadowRadius: 12,
                                elevation: 8
                            }}
                        >
                            <LinearGradient
                                colors={['#F5F3FF', '#DDD6FE']}
                                style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View className="absolute -right-4 -bottom-4 opacity-10">
                                    <Users size={120} color="#8B5CF6" />
                                </View>

                                <View className="w-14 h-14 bg-white/60 backdrop-blur-md rounded-2xl items-center justify-center border border-white/40">
                                    <Users size={28} color="#7C3AED" />
                                </View>
                                <View>
                                    <Text className="text-gray-900 font-black text-2xl leading-tight">Find{'\n'}Groups</Text>
                                    <View className="bg-white/40 self-start px-3 py-1.5 rounded-full mt-3 border border-white/20">
                                        <Text className="text-violet-700 text-[10px] font-black uppercase tracking-wider">Join Local Teams</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </Pressable>

                        {/* Share Idea Card */}
                        <Pressable
                            onPress={() => router.push('/community/compose')}
                            className="flex-1 rounded-[32px] overflow-hidden shadow-sm"
                            style={{
                                shadowColor: '#3B82F6',
                                shadowOffset: { width: 0, height: 8 },
                                shadowOpacity: 0.15,
                                shadowRadius: 12,
                                elevation: 8
                            }}
                        >
                            <LinearGradient
                                colors={['#EFF6FF', '#BFDBFE']}
                                style={{ flex: 1, padding: 24, justifyContent: 'space-between' }}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View className="absolute -right-4 -bottom-4 opacity-10">
                                    <Lightbulb size={120} color="#3B82F6" />
                                </View>

                                <View className="w-14 h-14 bg-white/60 backdrop-blur-md rounded-2xl items-center justify-center border border-white/40">
                                    <Lightbulb size={28} color="#2563EB" />
                                </View>
                                <View>
                                    <Text className="text-gray-900 font-black text-2xl leading-tight">Share{'\n'}Idea</Text>
                                    <View className="bg-white/40 self-start px-3 py-1.5 rounded-full mt-3 border border-white/20">
                                        <Text className="text-blue-700 text-[10px] font-black uppercase tracking-wider">Start Discussion</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                        </Pressable>
                    </View>
                </View>

                {/* Posts Feed */}
                <View className="px-6 py-6">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">Latest Updates</Text>

                    {POSTS.map((post) => (
                        <Pressable
                            key={post.id}
                            onPress={() => router.push(post.route as any)}
                            className="mb-6 bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 active:bg-gray-50"
                        >
                            <View className="flex-row items-center justify-between mb-4">
                                <View className="flex-row items-center">
                                    <View className="w-10 h-10 rounded-full border border-violet-100 overflow-hidden">
                                        <Image source={{ uri: post.avatar }} className="w-full h-full" />
                                    </View>
                                    <View className="ml-3">
                                        <View className="flex-row items-center gap-1.5">
                                            <Text className="text-sm font-bold text-gray-900">{post.author}</Text>
                                            {post.isOfficial && (
                                                <View className="bg-violet-600 rounded-full w-3.5 h-3.5 items-center justify-center">
                                                    <View className="w-1.5 h-1.5 bg-white rounded-full" />
                                                </View>
                                            )}
                                        </View>
                                        <Text className="text-xs text-gray-500">{post.role} • {post.time}</Text>
                                    </View>
                                </View>
                                <Pressable
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        setSelectedUpdateTitle(post.title);
                                        setShowSheet(true);
                                    }}
                                    className="p-2 -mr-2"
                                >
                                    <MoreVertical size={20} color="#9CA3AF" />
                                </Pressable>
                            </View>

                            <View className="mb-4">
                                <Text className="text-gray-900 font-bold text-base mb-2 leading-snug">{post.title}</Text>
                                <Text className="text-gray-600 text-sm leading-relaxed">{post.content}</Text>
                            </View>

                            <View className="flex-row items-center justify-between border-t border-gray-50 pt-4 mt-2">
                                <View className={`px-3 py-1 rounded-full ${post.id === 1 ? 'bg-violet-50' : post.tagColor.split(' ')[0]}`}>
                                    <Text className={`text-[10px] font-bold ${post.id === 1 ? 'text-violet-600' : post.tagColor.split(' ')[1]}`}>{post.tag}</Text>
                                </View>

                                <View className="flex-row items-center gap-4">
                                    <Pressable className="flex-row items-center gap-1.5">
                                        <Heart size={18} color="#6B7280" />
                                        <Text className="text-xs font-medium text-gray-500">{post.likes}</Text>
                                    </Pressable>
                                    <Pressable className="flex-row items-center gap-1.5">
                                        <MessageCircle size={18} color="#6B7280" />
                                        <Text className="text-xs font-medium text-gray-500">{post.comments}</Text>
                                    </Pressable>
                                    <Pressable>
                                        <Share2 size={18} color="#6B7280" />
                                    </Pressable>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
            <PostActionSheet
                visible={showSheet}
                onClose={() => setShowSheet(false)}
                actions={updateActions}
                title={`Update: ${selectedUpdateTitle}`}
            />
        </View>
    );
}
