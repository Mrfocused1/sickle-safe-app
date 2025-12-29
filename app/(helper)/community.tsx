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
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
        role: 'Mom of Overcomer',
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
    const router = useRouter();
    const insets = useSafeAreaInsets();
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

    const filteredPosts = React.useMemo(() => {
        const searchLower = searchQuery.toLowerCase().trim();
        return POSTS.filter(post => {
            const matchesCategory = selectedCategory === 'all' ||
                post.tag.toLowerCase() === CATEGORIES.find(c => c.id === selectedCategory)?.label.toLowerCase();

            const matchesSearch = !searchLower ||
                post.title.toLowerCase().includes(searchLower) ||
                post.content.toLowerCase().includes(searchLower) ||
                post.author.toLowerCase().includes(searchLower);

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchQuery]);

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 120 }}
                stickyHeaderIndices={[1]}
                keyboardShouldPersistTaps="handled"
                removeClippedSubviews={false}
            >
                {/* Header Section */}
                <View className="px-6 pb-2 bg-white" style={{ paddingTop: insets.top + 8 }}>
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-1">
                            <Text style={{ fontSize: 34, fontWeight: '900', color: '#0f172a', letterSpacing: -1.2 }}>Community</Text>
                            <Text style={{ fontSize: 16, fontWeight: '500', color: '#64748b', marginTop: 2 }}>Connect with other caregivers</Text>
                        </View>
                        <Pressable
                            className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100 active:scale-90 transition-transform"
                            onPress={() => {
                                handleAction();
                                Alert.alert("Groups", "Group feature coming soon!");
                            }}
                        >
                            <Users size={22} color="#4f46e5" />
                        </Pressable>
                    </View>
                </View>

                {/* Sticky Interactive Bar */}
                <View className="bg-white pb-4 pt-2 border-b border-gray-50" style={{ zIndex: 100 }}>
                    {/* Search Bar */}
                    <View className="px-6 mb-4">
                        <View className="flex-row items-center bg-gray-50 rounded-[24px] px-5 py-3 border border-gray-100 shadow-sm focus-within:border-indigo-200">
                            <Search size={18} color="#4f46e5" strokeWidth={2.5} />
                            <TextInput
                                placeholder="Search medical tips, school advice..."
                                style={{ fontSize: 16, fontWeight: '600', color: '#0f172a', flex: 1, marginLeft: 12 }}
                                placeholderTextColor="#94a3b8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                clearButtonMode="while-editing"
                                selectionColor="#4f46e5"
                            />
                        </View>
                    </View>

                    {/* Animated Category Selector */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingLeft: 24, paddingRight: 24, paddingBottom: 4, gap: 10 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        {CATEGORIES.map((cat) => (
                            <Pressable
                                key={cat.id}
                                onPress={() => {
                                    handleAction();
                                    setSelectedCategory(cat.id);
                                }}
                                className={`px-6 py-3 rounded-full border ${selectedCategory === cat.id
                                    ? 'bg-[#0f172a] border-[#0f172a]'
                                    : 'bg-white border-gray-200'
                                    } active:scale-95 transition-all shadow-sm`}
                            >
                                <Text
                                    style={{ fontSize: 13, fontWeight: '700' }}
                                    className={selectedCategory === cat.id ? 'text-white' : 'text-gray-600'}
                                >
                                    {cat.label}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Featured Resource Card */}
                <View className="px-6 py-6">
                    <Pressable
                        className="bg-[#eff6ff] rounded-[32px] p-6 border border-blue-100 flex-row items-center active:scale-[0.98] transition-all relative overflow-hidden shadow-sm"
                        onPress={() => {
                            handleAction();
                            router.push('/(helper)/guide');
                        }}
                    >
                        <View className="absolute -right-10 -top-10 w-32 h-32 bg-white rounded-full opacity-40" />
                        <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center mr-4 shadow-sm border border-blue-50">
                            <BookOpen size={26} color="#3b82f6" strokeWidth={2.5} />
                        </View>
                        <View className="flex-1">
                            <Text style={{ fontSize: 17, fontWeight: '900', color: '#1e3a8a', letterSpacing: -0.5 }}>Caregiver Guide 2024</Text>
                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#3b82f6', marginTop: 2 }}>Essential protocols & school forms</Text>
                        </View>
                        <View className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-blue-50">
                            <Text style={{ fontSize: 13, fontWeight: '900', color: '#3b82f6' }}>Read</Text>
                        </View>
                    </Pressable>
                </View>

                {/* Posts Feed */}
                <View className="px-6 pb-20 pt-2">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
                            <Pressable
                                key={post.id}
                                onPress={() => {
                                    handleAction();
                                    router.push(`/(helper)/post/${post.id}`);
                                }}
                                className="mb-8 bg-white rounded-[32px] p-6 shadow-md border border-gray-50 active:scale-[0.98]"
                            >
                                {/* User Info Header */}
                                <View className="flex-row items-center justify-between mb-5">
                                    <View className="flex-row items-center">
                                        <View className="w-14 h-14 rounded-full border-2 border-indigo-50 overflow-hidden shadow-sm">
                                            <Image
                                                source={{ uri: post.avatar }}
                                                className="w-full h-full"
                                            />
                                        </View>
                                        <View className="ml-4">
                                            <View className="flex-row items-center gap-2">
                                                <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a' }}>{post.author}</Text>
                                                {post.isExpert && (
                                                    <View className="bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                                        <Text style={{ fontSize: 9, fontWeight: '900', color: '#059669', letterSpacing: 0.8 }}>EXPERT</Text>
                                                    </View>
                                                )}
                                            </View>
                                            <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748b', marginTop: 1 }}>{post.role} • {post.time}</Text>
                                        </View>
                                    </View>
                                    <Pressable
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            handleAction();
                                            setSelectedPostAuthor(post.author);
                                            setShowSheet(true);
                                        }}
                                        className="w-10 h-10 items-center justify-center bg-gray-50 rounded-2xl active:scale-90 transition-transform"
                                    >
                                        <MoreVertical size={20} color="#94a3b8" />
                                    </Pressable>
                                </View>

                                {/* Content Section */}
                                <View className="mb-6">
                                    <Text style={{ fontSize: 20, fontWeight: '900', color: '#0f172a', marginBottom: 8, lineHeight: 28, letterSpacing: -0.4 }}>{post.title}</Text>
                                    <Text style={{ fontSize: 15, fontWeight: '500', color: '#4b5563', lineHeight: 24 }} numberOfLines={3}>{post.content}</Text>
                                </View>

                                {/* Interactive Footer */}
                                <View className="flex-row items-center justify-between pt-2">
                                    <View className="bg-indigo-50/50 px-4 py-2 rounded-2xl border border-indigo-100/30">
                                        <Text style={{ fontSize: 12, fontWeight: '800', color: '#4f46e5' }}>{post.tag}</Text>
                                    </View>

                                    <View className="flex-row items-center gap-5">
                                        <Pressable className="flex-row items-center gap-2 active:scale-95 px-2 py-1" onPress={(e) => { e.stopPropagation(); handleAction(); }}>
                                            <Heart size={22} color="#94a3b8" strokeWidth={2} />
                                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#64748b' }}>{post.likes}</Text>
                                        </Pressable>
                                        <Pressable className="flex-row items-center gap-2 active:scale-95 px-2 py-1" onPress={(e) => { e.stopPropagation(); handleAction(); }}>
                                            <MessageCircle size={22} color="#94a3b8" strokeWidth={2} />
                                            <Text style={{ fontSize: 14, fontWeight: '800', color: '#64748b' }}>{post.comments}</Text>
                                        </Pressable>
                                        <Pressable className="active:scale-95 p-1" onPress={(e) => { e.stopPropagation(); handleAction(); }}>
                                            <Share2 size={22} color="#94a3b8" strokeWidth={2} />
                                        </Pressable>
                                    </View>
                                </View>
                            </Pressable>
                        ))
                    ) : (
                        <View className="py-32 items-center justify-center">
                            <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
                                <Search size={32} color="#cbd5e1" />
                            </View>
                            <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a' }}>No results found</Text>
                            <Text style={{ fontSize: 14, fontWeight: '500', color: '#64748b', marginTop: 4 }}>Try adjusting your search or filters</Text>
                        </View>
                    )}
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
