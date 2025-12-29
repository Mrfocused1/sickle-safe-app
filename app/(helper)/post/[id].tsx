import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import {
    ArrowLeft,
    Heart,
    MessageCircle,
    Share2,
    MoreVertical,
    Send,
    Bookmark
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const POSTS_DATA: Record<string, any> = {
    '1': {
        id: 1,
        author: 'Sarah Jenkins',
        role: 'Mom of Overcomer',
        time: '2h ago',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
        title: 'Managing school absences?',
        content: `How do you all handle communicating properly with teachers about sudden crisis absences? Looking for advice on 504 plans.

My daughter has been missing quite a bit of school lately due to pain crises, and I'm struggling to keep up with the communication. Some teachers are understanding, but others seem frustrated.

Has anyone successfully set up a 504 plan? What accommodations did you include? I'd love to hear what's worked for your families.

Also, any tips on keeping up with homework during hospital stays would be amazing!`,
        likes: 24,
        comments: 12,
        tag: 'School & Work',
        tagColor: '#3b82f6',
        tagBg: '#eff6ff'
    },
    '2': {
        id: 2,
        author: 'Dr. Emily Chen',
        role: 'Hematologist',
        time: '5h ago',
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200',
        title: 'Hydration Tips for Summer',
        content: `With the heat wave approaching, remember that water intake needs to increase by about 20%. Here are some fun ways to keep kids hydrated:

1. **Fruit-infused water** - Add slices of cucumber, lemon, or berries to make water more appealing.

2. **Popsicles** - Make your own with fruit juice or coconut water. They count toward hydration!

3. **Set reminders** - Use phone alarms or apps to remind kids to drink throughout the day.

4. **Track intake** - A fun water bottle with measurements can make it a game.

5. **Watermelon & other fruits** - High water content fruits are great supplements.

Remember: By the time you feel thirsty, you're already mildly dehydrated. Stay ahead of it!

Feel free to ask questions below. I'll be checking in throughout the day.`,
        likes: 156,
        comments: 45,
        tag: 'Medical Tips',
        tagColor: '#10b981',
        tagBg: '#ecfdf5',
        isExpert: true
    },
    '3': {
        id: 3,
        author: 'Marcus Thompson',
        role: 'Primary Caregiver',
        time: '1d ago',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
        title: 'Weekly Wins Thread!',
        content: `Let's share some positivity. Maya went a full week without pain meds! What are your wins this week?

I know it can be tough, but celebrating the small victories really helps keep spirits up. Whether it's:

- A good day at school
- Trying a new healthy food
- Getting through a doctor's appointment like a champ
- Any improvement, no matter how small

Drop your wins below! Let's lift each other up.`,
        likes: 89,
        comments: 34,
        tag: 'Support',
        tagColor: '#8b5cf6',
        tagBg: '#f5f3ff'
    }
};

const COMMENTS_DATA: Record<string, any[]> = {
    '1': [
        { id: 1, author: 'Lisa Martinez', role: 'Mom', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', content: 'We have a 504 plan and it has been a game changer! Key accommodations: flexible deadlines, rest breaks, and access to water.', time: '1h ago', likes: 8 },
        { id: 2, author: 'David Park', role: 'Dad of Warrior', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200', content: 'I email all teachers at the start of each year with a brief overview. Most are very receptive once they understand.', time: '45m ago', likes: 5 },
        { id: 3, author: 'Dr. Emily Chen', role: 'Hematologist', avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200', content: 'I can provide a letter explaining the medical necessity if that would help with the school administration.', time: '30m ago', likes: 12, isExpert: true },
    ],
    '2': [
        { id: 1, author: 'Maria Santos', role: 'Caregiver', avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=200', content: 'The popsicle tip is brilliant! My son actually looks forward to "hydration time" now.', time: '3h ago', likes: 23 },
        { id: 2, author: 'James Wilson', role: 'Dad', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', content: 'What about sports drinks? Are those okay for sickle cell kids?', time: '2h ago', likes: 4 },
        { id: 3, author: 'Dr. Emily Chen', role: 'Hematologist', avatar: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200', content: '@James - In moderation, yes. But watch the sugar content. Coconut water is a great natural alternative!', time: '1h ago', likes: 31, isExpert: true },
    ],
    '3': [
        { id: 1, author: 'Sarah Jenkins', role: 'Mom', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', content: 'That is amazing Marcus! Our win: Emma tried swimming for the first time and loved it!', time: '20h ago', likes: 15 },
        { id: 2, author: 'Keisha Brown', role: 'Overcomer', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=200', content: 'I made it through finals week! Studying with breaks really helped.', time: '18h ago', likes: 28 },
    ]
};

export default function PostDetailScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();
    const postId = String(id);

    const post = POSTS_DATA[postId];
    const comments = COMMENTS_DATA[postId] || [];

    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [likeCount, setLikeCount] = useState(post?.likes || 0);

    if (!post) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <Text className="text-gray-500">Post not found</Text>
            </View>
        );
    }

    const handleLike = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleSave = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsSaved(!isSaved);
    };

    const handleSendComment = () => {
        if (commentText.trim()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            setCommentText('');
        }
    };

    return (
        <View className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                {/* Header */}
                <View
                    className="bg-white border-b border-gray-100 px-4 flex-row items-center justify-between"
                    style={{ paddingTop: insets.top + 8, paddingBottom: 12 }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
                    >
                        <ArrowLeft size={20} color="#0f172a" />
                    </Pressable>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: '#0f172a' }}>Post</Text>
                    <Pressable
                        onPress={handleSave}
                        className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
                    >
                        <Bookmark size={20} color={isSaved ? '#4f46e5' : '#64748b'} fill={isSaved ? '#4f46e5' : 'none'} />
                    </Pressable>
                </View>

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                >
                    {/* Post Content */}
                    <View className="px-6 py-6">
                        {/* Author Header */}
                        <View className="flex-row items-center mb-5">
                            <Image
                                source={{ uri: post.avatar }}
                                className="w-14 h-14 rounded-full"
                            />
                            <View className="ml-4 flex-1">
                                <View className="flex-row items-center">
                                    <Text style={{ fontSize: 17, fontWeight: '800', color: '#0f172a' }}>{post.author}</Text>
                                    {post.isExpert && (
                                        <View className="ml-2 bg-emerald-100 px-2 py-0.5 rounded-md">
                                            <Text style={{ fontSize: 10, fontWeight: '800', color: '#10b981' }}>EXPERT</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748b', marginTop: 2 }}>{post.role} • {post.time}</Text>
                            </View>
                            <Pressable className="w-10 h-10 rounded-full items-center justify-center">
                                <MoreVertical size={20} color="#94a3b8" />
                            </Pressable>
                        </View>

                        {/* Tag */}
                        <View
                            className="self-start px-4 py-2 rounded-full mb-4"
                            style={{ backgroundColor: post.tagBg }}
                        >
                            <Text style={{ fontSize: 12, fontWeight: '700', color: post.tagColor }}>{post.tag}</Text>
                        </View>

                        {/* Title */}
                        <Text style={{ fontSize: 24, fontWeight: '900', color: '#0f172a', lineHeight: 32, marginBottom: 16 }}>
                            {post.title}
                        </Text>

                        {/* Content */}
                        <Text style={{ fontSize: 16, fontWeight: '500', color: '#374151', lineHeight: 26 }}>
                            {post.content}
                        </Text>

                        {/* Actions */}
                        <View className="flex-row items-center mt-8 pt-6 border-t border-gray-100">
                            <Pressable
                                onPress={handleLike}
                                className="flex-row items-center mr-8"
                            >
                                <Heart
                                    size={22}
                                    color={isLiked ? '#ef4444' : '#64748b'}
                                    fill={isLiked ? '#ef4444' : 'none'}
                                />
                                <Text style={{ fontSize: 14, fontWeight: '700', color: isLiked ? '#ef4444' : '#64748b', marginLeft: 6 }}>
                                    {likeCount}
                                </Text>
                            </Pressable>
                            <View className="flex-row items-center mr-8">
                                <MessageCircle size={22} color="#64748b" />
                                <Text style={{ fontSize: 14, fontWeight: '700', color: '#64748b', marginLeft: 6 }}>
                                    {comments.length}
                                </Text>
                            </View>
                            <Pressable className="flex-row items-center">
                                <Share2 size={22} color="#64748b" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Comments Section */}
                    <View className="bg-gray-50 px-6 py-6">
                        <Text style={{ fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 20 }}>
                            Comments ({comments.length})
                        </Text>

                        {comments.map((comment) => (
                            <View key={comment.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                                <View className="flex-row items-start">
                                    <Image
                                        source={{ uri: comment.avatar }}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <View className="ml-3 flex-1">
                                        <View className="flex-row items-center">
                                            <Text style={{ fontSize: 14, fontWeight: '700', color: '#0f172a' }}>{comment.author}</Text>
                                            {comment.isExpert && (
                                                <View className="ml-2 bg-emerald-100 px-1.5 py-0.5 rounded">
                                                    <Text style={{ fontSize: 8, fontWeight: '800', color: '#10b981' }}>EXPERT</Text>
                                                </View>
                                            )}
                                            <Text style={{ fontSize: 12, fontWeight: '500', color: '#94a3b8', marginLeft: 8 }}>{comment.time}</Text>
                                        </View>
                                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#374151', marginTop: 6, lineHeight: 20 }}>
                                            {comment.content}
                                        </Text>
                                        <View className="flex-row items-center mt-3">
                                            <Pressable className="flex-row items-center">
                                                <Heart size={14} color="#94a3b8" />
                                                <Text style={{ fontSize: 12, fontWeight: '600', color: '#94a3b8', marginLeft: 4 }}>{comment.likes}</Text>
                                            </Pressable>
                                            <Pressable className="ml-6">
                                                <Text style={{ fontSize: 12, fontWeight: '700', color: '#4f46e5' }}>Reply</Text>
                                            </Pressable>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>

                {/* Comment Input */}
                <View
                    className="bg-white border-t border-gray-100 px-4 flex-row items-center"
                    style={{ paddingBottom: insets.bottom + 8, paddingTop: 12 }}
                >
                    <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-3">
                        <TextInput
                            placeholder="Write a comment..."
                            placeholderTextColor="#94a3b8"
                            value={commentText}
                            onChangeText={setCommentText}
                            style={{ flex: 1, fontSize: 15, fontWeight: '500', color: '#0f172a' }}
                        />
                    </View>
                    <Pressable
                        onPress={handleSendComment}
                        className="ml-3 w-11 h-11 rounded-full bg-indigo-500 items-center justify-center"
                        style={{ opacity: commentText.trim() ? 1 : 0.5 }}
                    >
                        <Send size={18} color="#fff" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}
