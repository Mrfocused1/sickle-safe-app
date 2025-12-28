import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Pressable,
    Modal,
    Animated,
    Dimensions,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
} from 'react-native';
import { Heart, MessageCircle, X, Send } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Comment {
    id: string;
    user: string;
    role: string;
    content: string;
    time: string;
    likes: number;
    replies?: Comment[];
}

interface PostDetailSheetProps {
    visible: boolean;
    onClose: () => void;
    post: {
        user: string;
        role: string;
        time: string;
        content: string;
        category: string;
        supportCount: number;
        commentCount: number;
    } | null;
}

const SAMPLE_COMMENTS: Comment[] = [
    {
        id: '1',
        user: 'Maria L.',
        role: 'Caregiver',
        content: 'This is so inspiring! Keep up the amazing work! 💪',
        time: '1h ago',
        likes: 5,
        replies: [
            {
                id: '1-1',
                user: 'Jasmine W.',
                role: 'Overcomer',
                content: 'Thank you Maria! Your support means the world. ❤️',
                time: '45m ago',
                likes: 2,
            }
        ]
    },
    {
        id: '2',
        user: 'Dr. Chen',
        role: 'Hematologist',
        content: 'Great to see you staying active. Remember to pace yourself and stay hydrated!',
        time: '1h ago',
        likes: 12,
        replies: []
    },
    {
        id: '3',
        user: 'Kevin S.',
        role: 'Overcomer',
        content: 'You\'re an inspiration to all of us. I just started walking daily too!',
        time: '45m ago',
        likes: 3,
        replies: []
    },
    {
        id: '4',
        user: 'Nurse Joy',
        role: 'Nurse',
        content: 'Wonderful progress! How are you feeling after the walk?',
        time: '30m ago',
        likes: 2,
        replies: []
    },
];

const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
        case 'overcomer':
            return { bg: '#dbeafe', text: '#1d4ed8' };
        case 'hematologist':
        case 'doctor':
            return { bg: '#dbeafe', text: '#1d4ed8' };
        case 'caregiver':
        case 'helper':
            return { bg: '#d1fae5', text: '#047857' };
        case 'volunteer':
            return { bg: '#fef3c7', text: '#b45309' };
        case 'nurse':
            return { bg: '#fce7f3', text: '#be185d' };
        default:
            return { bg: '#f3f4f6', text: '#374151' };
    }
};

export function PostDetailSheet({ visible, onClose, post }: PostDetailSheetProps) {
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const inputRef = useRef<TextInput>(null);
    const [comments, setComments] = useState<Comment[]>(SAMPLE_COMMENTS);
    const [comment, setComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const [isPostLiked, setIsPostLiked] = useState(false);
    const [postLikes, setPostLikes] = useState(post?.supportCount || 0);

    useEffect(() => {
        if (post) {
            setPostLikes(post.supportCount);
            setIsPostLiked(false);
            setComments(SAMPLE_COMMENTS);
            setReplyingTo(null);
        }
    }, [post]);

    useEffect(() => {
        if (visible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }).start();
        } else {
            slideAnim.setValue(SCREEN_HEIGHT);
        }
    }, [visible]);

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: SCREEN_HEIGHT,
            duration: 250,
            useNativeDriver: true,
        }).start(() => {
            onClose();
        });
    };

    const handleLikeComment = async (commentId: string) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setLikedComments(prev => {
            const newSet = new Set(prev);
            if (newSet.has(commentId)) {
                newSet.delete(commentId);
            } else {
                newSet.add(commentId);
            }
            return newSet;
        });
    };

    const handleLikePost = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (isPostLiked) {
            setPostLikes(postLikes - 1);
        } else {
            setPostLikes(postLikes + 1);
        }
        setIsPostLiked(!isPostLiked);
    };

    const handleSendComment = async () => {
        if (comment.trim()) {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            const newComment: Comment = {
                id: Date.now().toString(),
                user: 'You',
                role: 'Overcomer',
                content: comment.trim(),
                time: 'Just now',
                likes: 0,
                replies: [],
            };

            if (replyingTo) {
                setComments(prev => prev.map(c => {
                    if (c.id === replyingTo) {
                        return { ...c, replies: [...(c.replies || []), newComment] };
                    }
                    return c;
                }));
            } else {
                setComments(prev => [newComment, ...prev]);
            }

            setComment('');
            setReplyingTo(null);
        }
    };

    const handleReply = async (commentId: string, userName: string) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setReplyingTo(commentId);
        setComment(`@${userName} `);
        inputRef.current?.focus();
    };

    if (!post) return null;

    const roleColors = getRoleColor(post.role);

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                {/* Backdrop */}
                <Pressable style={styles.backdrop} onPress={handleClose} />

                {/* Sheet */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <Animated.View
                        style={[
                            styles.sheet,
                            { transform: [{ translateY: slideAnim }] }
                        ]}
                    >
                        {/* Handle */}
                        <View style={styles.handleContainer}>
                            <View style={styles.handle} />
                        </View>

                        {/* Header */}
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>Post</Text>
                            <Pressable onPress={handleClose} style={styles.closeButton}>
                                <X size={18} color="#6b7280" />
                            </Pressable>
                        </View>

                        <ScrollView
                            style={styles.scrollView}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* Original Post */}
                            <View style={styles.postContainer}>
                                <View style={styles.postHeader}>
                                    <View style={[styles.avatar, { backgroundColor: roleColors.bg }]}>
                                        <Text style={[styles.avatarText, { color: roleColors.text }]}>
                                            {post.user[0]}
                                        </Text>
                                    </View>
                                    <View style={styles.postHeaderInfo}>
                                        <Text style={styles.userName}>{post.user}</Text>
                                        <View style={styles.roleRow}>
                                            <Text style={[styles.roleBadge, { color: roleColors.text }]}>
                                                {post.role}
                                            </Text>
                                            <Text style={styles.timeText}>• {post.time}</Text>
                                        </View>
                                    </View>
                                </View>

                                <Text style={styles.postContent}>{post.content}</Text>

                                {/* Post Actions */}
                                <View style={styles.postActions}>
                                    <Pressable onPress={handleLikePost} style={styles.actionButton}>
                                        <Heart
                                            size={22}
                                            color={isPostLiked ? "#ef4444" : "#64748b"}
                                            fill={isPostLiked ? "#ef4444" : "transparent"}
                                        />
                                        <Text style={[
                                            styles.actionText,
                                            isPostLiked && { color: '#ef4444' }
                                        ]}>
                                            {postLikes}
                                        </Text>
                                    </Pressable>
                                    <View style={styles.actionButton}>
                                        <MessageCircle size={22} color="#64748b" />
                                        <Text style={styles.actionText}>{comments.length}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Comments Section */}
                            <View style={styles.commentsSection}>
                                <Text style={styles.commentsTitle}>Comments</Text>

                                {comments.map((item) => {
                                    const commentRoleColors = getRoleColor(item.role);
                                    const isLiked = likedComments.has(item.id);

                                    return (
                                        <View key={item.id} style={styles.commentContainer}>
                                            <View style={styles.commentItem}>
                                                <View style={[styles.commentAvatar, { backgroundColor: commentRoleColors.bg }]}>
                                                    <Text style={[styles.commentAvatarText, { color: commentRoleColors.text }]}>
                                                        {item.user[0]}
                                                    </Text>
                                                </View>
                                                <View style={styles.commentContent}>
                                                    <View style={styles.commentHeader}>
                                                        <Text style={styles.commentUserName}>{item.user}</Text>
                                                        <Text style={[styles.commentRole, { color: commentRoleColors.text }]}>
                                                            {item.role}
                                                        </Text>
                                                    </View>
                                                    <Text style={styles.commentText}>{item.content}</Text>
                                                    <View style={styles.commentActions}>
                                                        <Text style={styles.commentTime}>{item.time}</Text>
                                                        <Pressable
                                                            onPress={() => handleLikeComment(item.id)}
                                                            style={styles.commentLikeButton}
                                                        >
                                                            <Heart
                                                                size={14}
                                                                color={isLiked ? "#ef4444" : "#9ca3af"}
                                                                fill={isLiked ? "#ef4444" : "transparent"}
                                                            />
                                                            <Text style={[
                                                                styles.commentLikeText,
                                                                isLiked && { color: '#ef4444' }
                                                            ]}>
                                                                {item.likes + (isLiked ? 1 : 0)}
                                                            </Text>
                                                        </Pressable>
                                                        <Pressable
                                                            style={styles.replyButton}
                                                            onPress={() => handleReply(item.id, item.user)}
                                                        >
                                                            <Text style={styles.replyText}>Reply</Text>
                                                        </Pressable>
                                                    </View>
                                                </View>
                                            </View>

                                            {/* Sub-comments */}
                                            {item.replies && item.replies.map((reply) => {
                                                const replyRoleColors = getRoleColor(reply.role);
                                                const isReplyLiked = likedComments.has(reply.id);
                                                return (
                                                    <View key={reply.id} style={styles.subCommentItem}>
                                                        <View style={[styles.commentAvatar, styles.subCommentAvatar, { backgroundColor: replyRoleColors.bg }]}>
                                                            <Text style={[styles.commentAvatarText, { color: replyRoleColors.text }]}>
                                                                {reply.user[0]}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.commentContent}>
                                                            <View style={styles.commentHeader}>
                                                                <Text style={styles.commentUserName}>{reply.user}</Text>
                                                                <Text style={[styles.commentRole, { color: replyRoleColors.text }]}>
                                                                    {reply.role}
                                                                </Text>
                                                            </View>
                                                            <Text style={styles.commentText}>{reply.content}</Text>
                                                            <View style={styles.commentActions}>
                                                                <Text style={styles.commentTime}>{reply.time}</Text>
                                                                <Pressable
                                                                    onPress={() => handleLikeComment(reply.id)}
                                                                    style={styles.commentLikeButton}
                                                                >
                                                                    <Heart
                                                                        size={14}
                                                                        color={isReplyLiked ? "#ef4444" : "#9ca3af"}
                                                                        fill={isReplyLiked ? "#ef4444" : "transparent"}
                                                                    />
                                                                    <Text style={[
                                                                        styles.commentLikeText,
                                                                        isReplyLiked && { color: '#ef4444' }
                                                                    ]}>
                                                                        {reply.likes + (isReplyLiked ? 1 : 0)}
                                                                    </Text>
                                                                </Pressable>
                                                            </View>
                                                        </View>
                                                    </View>
                                                );
                                            })}
                                        </View>
                                    );
                                })}
                            </View>
                        </ScrollView>

                        {/* Comment Input */}
                        <View style={styles.inputContainer}>
                            <View style={styles.inputWrapper}>
                                <TextInput
                                    ref={inputRef}
                                    value={comment}
                                    onChangeText={setComment}
                                    placeholder="Write a comment..."
                                    placeholderTextColor="#9ca3af"
                                    style={styles.textInput}
                                    multiline
                                    maxLength={500}
                                />
                                <Pressable
                                    onPress={handleSendComment}
                                    disabled={!comment.trim()}
                                    style={[
                                        styles.sendButton,
                                        { backgroundColor: comment.trim() ? '#3b82f6' : '#d1d5db' }
                                    ]}
                                >
                                    <Send size={16} color="#ffffff" />
                                </Pressable>
                            </View>
                        </View>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    keyboardView: {
        maxHeight: '90%',
    },
    sheet: {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: SCREEN_HEIGHT * 0.85,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    handleContainer: {
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 8,
    },
    handle: {
        width: 40,
        height: 5,
        backgroundColor: '#e2e8f0',
        borderRadius: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    closeButton: {
        width: 32,
        height: 32,
        backgroundColor: '#f3f4f6',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollView: {
        flexGrow: 0,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    postContainer: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
    },
    postHeaderInfo: {
        marginLeft: 12,
        flex: 1,
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
    },
    roleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    roleBadge: {
        fontSize: 13,
        fontWeight: '500',
        marginRight: 6,
    },
    timeText: {
        fontSize: 12,
        color: '#9ca3af',
    },
    postContent: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 22,
        color: '#0f172a',
        marginBottom: 16,
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f8fafc',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
        marginLeft: 8,
    },
    commentsSection: {
        padding: 20,
    },
    commentsTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    commentContainer: {
        marginBottom: 8,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f8fafc',
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    subCommentItem: {
        flexDirection: 'row',
        marginLeft: 48,
        marginTop: 12,
        paddingLeft: 12,
        borderLeftWidth: 2,
        borderLeftColor: '#f1f5f9',
    },
    subCommentAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    commentAvatarText: {
        fontSize: 14,
        fontWeight: '700',
    },
    commentContent: {
        flex: 1,
        marginLeft: 12,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    commentUserName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0f172a',
        marginRight: 8,
    },
    commentRole: {
        fontSize: 10,
        fontWeight: '600',
    },
    commentText: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
        color: '#0f172a',
        marginBottom: 8,
    },
    commentActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    commentTime: {
        fontSize: 12,
        color: '#9ca3af',
    },
    commentLikeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 16,
    },
    commentLikeText: {
        fontSize: 12,
        color: '#9ca3af',
        marginLeft: 4,
    },
    replyButton: {
        marginLeft: 16,
    },
    replyText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#9ca3af',
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 32,
        backgroundColor: '#ffffff',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
        paddingVertical: 4,
        maxHeight: 80,
    },
    sendButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },
});
