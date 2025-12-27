import React, { useState } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { Heart, MessageCircle, Share2, MoreVertical } from 'lucide-react-native';
import { PostActionSheet, ActionItem } from './PostActionSheet';
import * as Haptics from 'expo-haptics';

interface CommunityPostCardProps {
    user: string;
    role: string;
    time: string;
    content: string;
    category: string;
    supportCount: number;
    commentCount: number;
    avatarColor?: string;
    onCardPress?: () => void;
    onCommentPress?: () => void;
    onSharePress?: () => void;
}

const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
        case 'overcomer':
            return { bg: 'bg-violet-100', text: 'text-violet-700', badge: 'text-violet-600' };
        case 'hematologist':
        case 'doctor':
            return { bg: 'bg-blue-100', text: 'text-blue-700', badge: 'text-blue-600' };
        case 'caregiver':
        case 'helper':
            return { bg: 'bg-emerald-100', text: 'text-emerald-700', badge: 'text-emerald-600' };
        case 'volunteer':
            return { bg: 'bg-amber-100', text: 'text-amber-700', badge: 'text-amber-600' };
        case 'nurse':
            return { bg: 'bg-pink-100', text: 'text-pink-700', badge: 'text-pink-600' };
        default:
            return { bg: 'bg-gray-100', text: 'text-gray-700', badge: 'text-gray-600' };
    }
};

export function CommunityPostCard({
    user,
    role,
    time,
    content,
    category,
    supportCount,
    commentCount,
    onCardPress,
    onCommentPress,
    onSharePress,
}: CommunityPostCardProps) {
    const [showSheet, setShowSheet] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likes, setLikes] = useState(supportCount);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const roleColors = getRoleColor(role);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    const handleCardPress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onCardPress?.();
    };

    const handleLike = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (isLiked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setIsLiked(!isLiked);
    };

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
            onPress: () => onSharePress?.() || alert("Opening share menu..."),
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
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPress={handleCardPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                }}
            >
                {/* Post Header */}
                <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center">
                        <View className={`w-10 h-10 ${roleColors.bg} rounded-full items-center justify-center`}>
                            <Text className={`${roleColors.text} font-bold text-lg`}>{user[0]}</Text>
                        </View>
                        <View className="ml-3">
                            <Text className="text-brand-dark text-brand-label">{user}</Text>
                            <View className="flex-row items-center">
                                <Text className={`${roleColors.badge} text-[13px] font-bold mr-2`}>{role}</Text>
                                <Text className="text-brand-muted text-brand-sub">• {time}</Text>
                            </View>
                        </View>
                    </View>
                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation();
                            setShowSheet(true);
                        }}
                        className="p-2 -mr-2"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <MoreVertical size={20} color="#94a3b8" />
                    </Pressable>
                </View>

                {/* Category Tag */}
                <View className="self-start px-2 py-0.5 bg-gray-100 rounded-md mb-3">
                    <Text className="text-brand-muted text-brand-section">{category}</Text>
                </View>

                {/* Content */}
                <Text className="text-brand-dark text-brand-body">
                    {content}
                </Text>

                {/* Engagement Divider */}
                <View className="h-[1px] bg-gray-100 mb-4" />

                {/* Action Buttons */}
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <Pressable
                            onPress={(e) => {
                                e.stopPropagation();
                                handleLike();
                            }}
                            className="flex-row items-center active:scale-95"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <Heart
                                size={20}
                                color={isLiked ? "#ef4444" : "#64748b"}
                                fill={isLiked ? "#ef4444" : "transparent"}
                            />
                            <Text className={`text-sm ml-1.5 font-medium ${isLiked ? 'text-red-500' : 'text-gray-500'}`}>
                                {likes}
                            </Text>
                        </Pressable>
                        <Pressable
                            onPress={(e) => {
                                e.stopPropagation();
                                onCommentPress?.();
                            }}
                            className="flex-row items-center ml-5 active:scale-95"
                            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                            <MessageCircle size={20} color="#64748b" />
                            <Text className="text-gray-500 text-sm ml-1.5 font-medium">{commentCount}</Text>
                        </Pressable>
                    </View>
                    <Pressable
                        onPress={(e) => {
                            e.stopPropagation();
                            onSharePress?.();
                        }}
                        className="active:scale-95"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Share2 size={20} color="#64748b" />
                    </Pressable>
                </View>
            </Pressable>

            <PostActionSheet
                visible={showSheet}
                onClose={() => setShowSheet(false)}
                actions={postActions}
                title={`Post by ${user}`}
            />
        </Animated.View>
    );
}
