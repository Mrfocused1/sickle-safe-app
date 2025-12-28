import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Modal,
    TextInput,
    Pressable,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Animated,
    ScrollView,
    Image,
    TouchableOpacity
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { ArrowLeft, Camera, Image as ImageIcon, Link as LinkIcon, Hash, Send, X } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const { width, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ComposePostSheetProps {
    visible: boolean;
    onClose: () => void;
}

const CATEGORIES = ['General', 'Stories', 'Questions', 'Tips', 'Medication'];

import * as ImagePicker from 'expo-image-picker';

export function ComposePostSheet({ visible, onClose }: ComposePostSheetProps) {
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('General');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(0);
            slideAnim.setValue(SCREEN_HEIGHT);
            // Reset state on close
            setContent('');
            setSelectedImage(null);
            setSelectedCategory('General');
        }
    }, [visible]);

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: SCREEN_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onClose();
        });
    };

    const handlePost = async () => {
        if (!content.trim() && !selectedImage) return;
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        alert('Post Shared!');
        handleClose();
    };

    const pickImage = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Camera permission is required to take photos');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const addHashtag = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setContent(prev => prev + (prev.endsWith(' ') || prev === '' ? '#' : ' #'));
    };

    const addLink = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Simple prompt for illustration, in a real app you'd use a nicer modal
        alert('Link feature: Enter URL in the text editor');
        setContent(prev => prev + (prev.endsWith(' ') || prev === '' ? 'https://' : ' https://'));
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={handleClose}
        >
            <View style={styles.container}>
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
                        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    </Pressable>
                </Animated.View>

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
                        <View style={styles.handleContainer}>
                            <View style={styles.handle} />
                        </View>

                        <View style={styles.header}>
                            <Pressable
                                onPress={handleClose}
                                style={styles.backButton}
                            >
                                <ArrowLeft size={20} color="#1f2937" />
                            </Pressable>
                            <Text style={styles.headerTitle}>New Post</Text>
                            <TouchableOpacity
                                onPress={handlePost}
                                disabled={!content.trim() && !selectedImage}
                                style={[
                                    styles.postButton,
                                    { backgroundColor: (content.trim() || selectedImage) ? '#3b82f6' : '#F3F4F6' }
                                ]}
                            >
                                <Send size={14} color={(content.trim() || selectedImage) ? '#fff' : '#9CA3AF'} />
                                <Text style={[
                                    styles.postButtonText,
                                    { color: (content.trim() || selectedImage) ? '#fff' : '#9CA3AF' }
                                ]}>Post</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* User Info */}
                            <View style={styles.userInfo}>
                                <View style={styles.avatarContainer}>
                                    <Image
                                        source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }}
                                        style={styles.avatar}
                                    />
                                </View>
                                <View style={styles.userText}>
                                    <Text style={styles.userName}>Maya Thompson</Text>
                                    <Text style={styles.userStatus}>Posting to Public Feed</Text>
                                </View>
                            </View>

                            {/* Editor */}
                            <TextInput
                                multiline
                                placeholder="What's on your mind? Share your story, ask a question, or offer some tips..."
                                placeholderTextColor="#9CA3AF"
                                style={styles.textInput}
                                textAlignVertical="top"
                                value={content}
                                onChangeText={setContent}
                                autoFocus
                            />

                            {/* Image Preview */}
                            {selectedImage && (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                                    <TouchableOpacity
                                        style={styles.removeImageButton}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                            setSelectedImage(null);
                                        }}
                                    >
                                        <X size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* Categories */}
                            <View style={styles.categorySection}>
                                <Text style={styles.sectionLabel}>Select Category</Text>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                                    <View style={styles.categoryContainer}>
                                        {CATEGORIES.map((cat) => (
                                            <Pressable
                                                key={cat}
                                                onPress={() => {
                                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                    setSelectedCategory(cat);
                                                }}
                                                style={[
                                                    styles.categoryChip,
                                                    selectedCategory === cat && styles.categoryChipActive
                                                ]}
                                            >
                                                <Text style={[
                                                    styles.categoryText,
                                                    selectedCategory === cat && styles.categoryTextActive
                                                ]}>{cat}</Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                </ScrollView>
                            </View>

                            {/* Toolbar & Footer */}
                            <View style={styles.footer}>
                                <View style={styles.toolbar}>
                                    <Pressable style={styles.toolbarButton} onPress={takePhoto}><Camera size={24} color="#6B7280" /></Pressable>
                                    <Pressable style={styles.toolbarButton} onPress={pickImage}><ImageIcon size={24} color="#6B7280" /></Pressable>
                                    <Pressable style={styles.toolbarButton} onPress={addHashtag}><Hash size={24} color="#6B7280" /></Pressable>
                                    <Pressable style={styles.toolbarButton} onPress={addLink}><LinkIcon size={24} color="#6B7280" /></Pressable>
                                </View>
                                <Text style={[
                                    styles.charCount,
                                    content.length > 450 && { color: '#f59e0b' },
                                    content.length > 500 && { color: '#ef4444' }
                                ]}>
                                    {content.length} / 500
                                </Text>
                            </View>
                        </ScrollView>
                    </Animated.View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    keyboardView: {
        width: '100%',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        maxHeight: SCREEN_HEIGHT * 0.9,
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
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    backButton: {
        width: 40,
        height: 40,
        backgroundColor: '#f8fafc',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '800',
        color: '#1e293b',
    },
    postButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    postButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
    },
    avatar: {
        width: 48,
        height: 48,
    },
    userText: {
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1e293b',
    },
    userStatus: {
        fontSize: 13,
        color: '#64748b',
        marginTop: 2,
    },
    textInput: {
        fontSize: 18,
        color: '#1e293b',
        minHeight: 120,
        marginBottom: 32,
    },
    categorySection: {
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 13,
        fontWeight: '800',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 16,
    },
    categoryScroll: {
        marginHorizontal: -24,
        paddingHorizontal: 24,
    },
    categoryContainer: {
        flexDirection: 'row',
        gap: 8,
        paddingRight: 24,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        backgroundColor: '#fff',
    },
    categoryChipActive: {
        backgroundColor: '#3b82f6',
        borderColor: '#3b82f6',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748b',
    },
    categoryTextActive: {
        color: '#fff',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    toolbar: {
        flexDirection: 'row',
        gap: 16,
    },
    toolbarButton: {
        padding: 4,
    },
    charCount: {
        fontSize: 12,
        fontWeight: '700',
        color: '#cbd5e1',
    },
    imagePreviewContainer: {
        width: '100%',
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
