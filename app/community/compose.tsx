import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Image as ImageIcon, Link as LinkIcon, Hash, Send } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function ComposePostScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [content, setContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('General');

    const CATEGORIES = ['General', 'Stories', 'Questions', 'Tips', 'Medication'];

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 bg-white"
        >
            <StatusBar style="dark" />
            <View
                className="px-6 pb-4 flex-row items-center justify-between border-b border-gray-50"
                style={{ paddingTop: insets.top + 10 }}
            >
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                >
                    <ArrowLeft size={20} color="#1f2937" />
                </Pressable>
                <Text className="text-xl font-bold text-gray-900">New Post</Text>
                <Pressable
                    onPress={() => {
                        alert('Post Shared!');
                        router.back();
                    }}
                    disabled={!content.trim()}
                    className={`px-4 py-2 rounded-full flex-row items-center gap-2 ${content.trim() ? 'bg-violet-600' : 'bg-gray-100'}`}
                >
                    <Send size={14} color={content.trim() ? '#fff' : '#9CA3AF'} />
                    <Text className={`font-bold text-xs ${content.trim() ? 'text-white' : 'text-gray-400'}`}>Post</Text>
                </Pressable>
            </View>

            <ScrollView className="flex-1 px-6 pt-6">
                {/* User Info */}
                <View className="flex-row items-center mb-6">
                    <View className="w-12 h-12 rounded-full border border-gray-100 overflow-hidden">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }}
                            className="w-full h-full"
                        />
                    </View>
                    <View className="ml-4">
                        <Text className="text-gray-900 font-bold text-base">Maya Thompson</Text>
                        <Text className="text-gray-400 text-xs">Posting to Public Feed</Text>
                    </View>
                </View>

                {/* Editor */}
                <TextInput
                    multiline
                    placeholder="What's on your mind? Share your story, ask a question, or offer some tips..."
                    placeholderTextColor="#9CA3AF"
                    className="text-gray-900 text-lg leading-relaxed min-h-[200px]"
                    textAlignVertical="top"
                    value={content}
                    onChangeText={setContent}
                    autoFocus
                />

                {/* Categories */}
                <View className="mt-8">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">Select Category</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                        <View className="flex-row gap-2">
                            {CATEGORIES.map((cat) => (
                                <Pressable
                                    key={cat}
                                    onPress={() => setSelectedCategory(cat)}
                                    className={`px-4 py-2 rounded-full border ${selectedCategory === cat ? 'bg-violet-600 border-violet-600' : 'bg-white border-gray-200'}`}
                                >
                                    <Text className={`font-bold text-xs ${selectedCategory === cat ? 'text-white' : 'text-gray-500'}`}>{cat}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Toolbar */}
            <View className="px-6 py-4 border-t border-gray-100 flex-row items-center justify-between mb-8">
                <View className="flex-row items-center gap-6">
                    <Pressable className="p-2">
                        <Camera size={24} color="#6B7280" />
                    </Pressable>
                    <Pressable className="p-2">
                        <ImageIcon size={24} color="#6B7280" />
                    </Pressable>
                    <Pressable className="p-2">
                        <Hash size={24} color="#6B7280" />
                    </Pressable>
                    <Pressable className="p-2">
                        <LinkIcon size={24} color="#6B7280" />
                    </Pressable>
                </View>
                <Text className={`text-xs font-bold ${content.length > 200 ? 'text-amber-500' : 'text-gray-300'}`}>
                    {content.length} / 500
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
}
