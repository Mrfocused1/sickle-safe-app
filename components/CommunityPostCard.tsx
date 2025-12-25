import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react-native';
import { PostActionSheet, ActionItem } from './PostActionSheet';

interface CommunityPostCardProps {
    user: string;
    role: string;
    time: string;
    content: string;
    category: string;
    supportCount: number;
    commentCount: number;
}

export function CommunityPostCard({
    user,
    role,
    time,
    content,
    category,
    supportCount,
    commentCount,
}: CommunityPostCardProps) {
    const [showSheet, setShowSheet] = useState(false);

    const postActions: ActionItem[] = [
        {
            label: "Save Post",
            icon: "bookmark-border",
            onPress: () => alert("Post saved to bookmarks"),
            color: "#6366F1"
        },
        {
            label: "Share via...",
            icon: "share",
            onPress: () => alert("Opening share menu..."),
            color: "#3B82F6"
        },
        {
            label: "Report Post",
            icon: "report-problem",
            onPress: () => alert("Thank you. Our moderators will review this post."),
            isDestructive: true
        },
        {
            label: "Mute User",
            icon: "volume-off",
            onPress: () => alert(`You will no longer see posts from ${user}`),
            isDestructive: true
        }
    ];

    return (
        <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
            {/* Post Header */}
            <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-violet-100 rounded-full items-center justify-center">
                        <Text className="text-violet-700 font-bold text-lg">{user[0]}</Text>
                    </View>
                    <View className="ml-3">
                        <Text className="text-gray-900 font-bold text-base">{user}</Text>
                        <View className="flex-row items-center">
                            <Text className="text-violet-600 text-xs font-semibold mr-2">{role}</Text>
                            <Text className="text-gray-400 text-xs">• {time}</Text>
                        </View>
                    </View>
                </View>
                <Pressable
                    onPress={() => setShowSheet(true)}
                    className="p-2 -mr-2"
                >
                    <MoreVertical size={20} color="#94a3b8" />
                </Pressable>
            </View>

            {/* Category Tag */}
            <View className="self-start px-2 py-0.5 bg-gray-100 rounded-md mb-3">
                <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-wider">{category}</Text>
            </View>

            {/* Content */}
            <Text className="text-gray-800 text-sm leading-relaxed mb-4">
                {content}
            </Text>

            {/* Engagement Divider */}
            <View className="h-[1px] bg-gray-50 mb-4" />

            {/* Action Buttons */}
            <View className="flex-row items-center justify-between">
                <View className="flex-row items-center space-x-6">
                    <Pressable className="flex-row items-center">
                        <Heart size={20} color="#64748b" />
                        <Text className="text-gray-500 text-sm ml-1.5 font-medium">{supportCount}</Text>
                    </Pressable>
                    <Pressable className="flex-row items-center ml-4">
                        <MessageCircle size={20} color="#64748b" />
                        <Text className="text-gray-500 text-sm ml-1.5 font-medium">{commentCount}</Text>
                    </Pressable>
                </View>
                <Pressable>
                    <Share2 size={20} color="#64748b" />
                </Pressable>
            </View>

            <PostActionSheet
                visible={showSheet}
                onClose={() => setShowSheet(false)}
                actions={postActions}
                title={`Post by ${user}`}
            />
        </View>
    );
}
