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
    Plus,
    Filter,
    Users,
    BookOpen
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { PostActionSheet, ActionItem } from '../../components/PostActionSheet';

const CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'support', label: 'Support' },
    { id: 'medical', label: 'Medical Tips' },
    { id: 'school', label: 'School & Work' },
    { id: 'diet', label: 'Lifestyle' },
];

const POSTS = [
    {
        id: 1,
        author: 'Sarah Jenkins',
        role: 'Mom of Warrior',
        time: '2h ago',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        title: 'Managing school absences?',
        content: 'How do you all handle communicating properly with teachers about sudden crisis absences? Looking for advice on 504 plans.',
        likes: 24,
        comments: 12,
        tag: 'School & Work',
        tagColor: 'bg-blue-50 text-blue-600'
    },
    {
        id: 2,
        author: 'Dr. Emily Chen',
        role: 'Hematologist',
        time: '5h ago',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200',
        title: 'Hydration Tips for Summer',
        content: 'With the heat wave approaching, remember that water intake needs to increase by about 20%. Here are some fun ways to keep kids hydrated...',
        likes: 156,
        comments: 45,
        tag: 'Medical Tips',
        tagColor: 'bg-emerald-50 text-emerald-600',
        isExpert: true
    },
    {
        id: 3,
        author: 'Marcus Thompson',
        role: 'Primary Caregiver',
        time: '1d ago',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        title: 'Weekly Wins Thread!',
        content: 'Let’s share some positivity. Maya went a full week without pain meds! What are your wins this week?',
        likes: 89,
        comments: 34,
        tag: 'Support',
        tagColor: 'bg-violet-50 text-violet-600'
    }
];

export default function CommunityScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSheet, setShowSheet] = useState(false);
    const [selectedPostAuthor, setSelectedPostAuthor] = useState('');

    const postActions: ActionItem[] = [
        {
            label: "Save Post",
            icon: "bookmark-border",
            onPress: () => alert("Saved to collection"),
            color: "#6366F1"
        },
        {
            label: "Share Post",
            icon: "share",
            onPress: () => alert("Opening share menu..."),
            color: "#3B82F6"
        },
        {
            label: "Report Post",
            icon: "report-problem",
            onPress: () => alert("Thank you for your report"),
            isDestructive: true
        }
    ];

    const handleAction = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                stickyHeaderIndices={[1]}
            >
                {/* Header */}
                <View
                    className="px-6 pb-2 bg-white"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <View className="flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-3xl font-extrabold text-gray-900">Community</Text>
                            <Text className="text-gray-500 font-medium text-sm">Connect with other caregivers</Text>
                        </View>
                        <Pressable
                            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                            onPress={() => router.push('/community/groups')}
                        >
                            <Users size={20} color="#374151" />
                        </Pressable>
                    </View>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 mb-2">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search topics, questions..."
                            className="flex-1 ml-3 text-base text-gray-900"
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Categories Tab (Sticky) */}
                <View className="bg-white py-4 px-6 border-b border-gray-50 z-10">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                        <View className="flex-row gap-2">
                            {CATEGORIES.map((cat) => (
                                <Pressable
                                    key={cat.id}
                                    onPress={() => {
                                        handleAction();
                                        setSelectedCategory(cat.id);
                                    }}
                                    className={`px-5 py-2.5 rounded-full border ${selectedCategory === cat.id
                                        ? 'bg-gray-900 border-gray-900'
                                        : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <Text className={`font-semibold text-xs ${selectedCategory === cat.id ? 'text-white' : 'text-gray-600'
                                        }`}>
                                        {cat.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Featured Resource (Optional - could vary) */}
                <View className="px-6 py-6">
                    <View className="bg-blue-50 rounded-[32px] p-5 border border-blue-100 flex-row items-center relative overflow-hidden">
                        <View className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 rounded-full opacity-50" />
                        <View className="w-12 h-12 bg-white rounded-full items-center justify-center mr-4">
                            <BookOpen size={20} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-blue-900 font-bold text-sm">Caregiver Guide 2024</Text>
                            <Text className="text-blue-700 text-xs mt-0.5">Essential protocols & school forms</Text>
                        </View>
                        <Pressable className="bg-white px-3 py-1.5 rounded-full">
                            <Text className="text-xs font-bold text-blue-600">Read</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Posts Feed */}
                <View className="px-6 pb-20">
                    {POSTS.map((post) => (
                        <View key={post.id} className="mb-6 bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                            {/* User Info */}
                            <View className="flex-row items-center justify-between mb-3">
                                <View className="flex-row items-center">
                                    <Image
                                        source={{ uri: post.avatar }}
                                        className="w-10 h-10 rounded-full border border-gray-100"
                                    />
                                    <View className="ml-3">
                                        <View className="flex-row items-center gap-1.5">
                                            <Text className="text-sm font-bold text-gray-900">{post.author}</Text>
                                            {post.isExpert && (
                                                <View className="bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">
                                                    <Text className="text-emerald-700 font-bold text-[8px] uppercase">Expert</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text className="text-xs text-gray-500">{post.role} • {post.time}</Text>
                                    </View>
                                </View>
                                <Pressable
                                    onPress={() => {
                                        setSelectedPostAuthor(post.author);
                                        setShowSheet(true);
                                    }}
                                    className="p-2 -mr-2"
                                >
                                    <MoreVertical size={20} color="#9CA3AF" />
                                </Pressable>
                            </View>

                            {/* Content */}
                            <View className="mb-4">
                                <Text className="text-base font-bold text-gray-900 mb-1 leading-snug">{post.title}</Text>
                                <Text className="text-sm text-gray-600 leading-relaxed">{post.content}</Text>
                            </View>

                            {/* Footer / Tags */}
                            <View className="flex-row items-center justify-between">
                                <View className={`px-3 py-1 rounded-full ${post.tagColor.split(' ')[0]}`}>
                                    <Text className={`text-[10px] font-bold ${post.tagColor.split(' ')[1]}`}>{post.tag}</Text>
                                </View>

                                <View className="flex-row items-center gap-4">
                                    <Pressable className="flex-row items-center gap-1.5" onPress={handleAction}>
                                        <Heart size={18} color="#6B7280" />
                                        <Text className="text-xs font-medium text-gray-500">{post.likes}</Text>
                                    </Pressable>
                                    <Pressable className="flex-row items-center gap-1.5" onPress={handleAction}>
                                        <MessageCircle size={18} color="#6B7280" />
                                        <Text className="text-xs font-medium text-gray-500">{post.comments}</Text>
                                    </Pressable>
                                    <Pressable onPress={handleAction}>
                                        <Share2 size={18} color="#6B7280" />
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>

            {/* FAB - Compose (Optional if "+" menu is sufficient, but community often needs a direct "Post" button) 
                Since we have the central "+" menu, we might not need this, or this could trigger the "Post" option in the menu.
                I'll leave it clean without a second FAB for now to rely on the main menu or a header action.
            */}
            <PostActionSheet
                visible={showSheet}
                onClose={() => setShowSheet(false)}
                actions={postActions}
                title={`Post by ${selectedPostAuthor}`}
            />
        </View>
    );
}
