import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageSquare, Heart, Share2, MoreVertical, Edit3 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { PostActionSheet, ActionItem } from '../../components/PostActionSheet';

export default function MyPostsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [showSheet, setShowSheet] = React.useState(false);
    const [selectedPostTitle, setSelectedPostTitle] = React.useState('');

    const postActions: ActionItem[] = [
        {
            label: "Edit Post",
            icon: "edit",
            onPress: () => alert("Opening editor..."),
            color: "#6366F1"
        },
        {
            label: "Pin to Profile",
            icon: "push-pin",
            onPress: () => alert("Post pinned to top"),
            color: "#F59E0B"
        },
        {
            label: "Share Stats",
            icon: "analytics",
            onPress: () => alert("Generating shareable report..."),
            color: "#10B981"
        },
        {
            label: "Delete Post",
            icon: "delete-forever",
            onPress: () => alert("Post deleted permanently"),
            isDestructive: true
        }
    ];

    const MY_POSTS = [
        {
            id: 1,
            time: '2 days ago',
            title: 'Found a great new hematologist!',
            content: 'Just had my first appointment with Dr. Wilson and she is fantastic. Very attentive to my pain management plan.',
            likes: 42,
            comments: 8,
            category: 'Tips'
        },
        {
            id: 2,
            time: '1 week ago',
            title: 'Feeling much better today',
            content: 'After a rough weekend of crisis, I’m finally back on my feet. Thank you everyone for the support tokens!',
            likes: 128,
            comments: 24,
            category: 'Stories'
        }
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
                        <Text className="text-xl font-bold text-gray-900">My Activity</Text>
                        <View className="w-10" />
                    </View>

                    {/* Stats Summary */}
                    <View className="flex-row gap-4">
                        <View className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Posts</Text>
                            <Text className="text-gray-900 text-2xl font-extrabold">{MY_POSTS.length}</Text>
                        </View>
                        <View className="flex-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Likes</Text>
                            <Text className="text-gray-900 text-2xl font-extrabold">170</Text>
                        </View>
                    </View>
                </View>

                {/* Posts List */}
                <View className="px-6 py-8">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">Recent Posts</Text>

                    {MY_POSTS.map((post) => (
                        <View key={post.id} className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm mb-6">
                            <View className="flex-row justify-between items-start mb-4">
                                <View className="bg-violet-50 px-3 py-1 rounded-full border border-violet-100">
                                    <Text className="text-violet-600 text-[9px] font-bold uppercase">{post.category}</Text>
                                </View>
                                <Pressable
                                    onPress={() => {
                                        setSelectedPostTitle(post.title);
                                        setShowSheet(true);
                                    }}
                                    className="p-2 -mr-2"
                                >
                                    <MoreVertical size={16} color="#D1D5DB" />
                                </Pressable>
                            </View>

                            <Text className="text-gray-900 font-bold text-lg mb-2">{post.title}</Text>
                            <Text className="text-gray-500 text-sm leading-relaxed mb-6" numberOfLines={3}>
                                {post.content}
                            </Text>

                            <View className="flex-row items-center justify-between pt-4 border-t border-gray-50">
                                <View className="flex-row items-center gap-4">
                                    <View className="flex-row items-center gap-1.5">
                                        <Heart size={16} color="#EF4444" fill="#EF4444" />
                                        <Text className="text-gray-900 font-bold text-xs">{post.likes}</Text>
                                    </View>
                                    <View className="flex-row items-center gap-1.5">
                                        <MessageSquare size={16} color="#6B7280" />
                                        <Text className="text-gray-500 font-bold text-xs">{post.comments}</Text>
                                    </View>
                                </View>
                                <Pressable className="flex-row items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                                    <Edit3 size={14} color="#6B7280" />
                                    <Text className="text-gray-500 font-bold text-[10px]">Edit Post</Text>
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <PostActionSheet
                visible={showSheet}
                onClose={() => setShowSheet(false)}
                actions={postActions}
                title={`Manage: ${selectedPostTitle}`}
            />
        </View>
    );
}
