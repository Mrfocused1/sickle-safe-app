import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, Share2, Heart, MessageCircle, MoreHorizontal } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function HighlightDetailScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { id } = useLocalSearchParams();

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <Animated.View
                    sharedTransitionTag={`card-${id}`}
                    style={{ backgroundColor: '#fff', flex: 1 }}
                >
                    {/* Hero Image Swiper (Mock) */}
                    <View className="relative h-96 w-full">
                        <Animated.Image
                            sharedTransitionTag={`image-${id}`}
                            source={{
                                uri: id === '1' ? 'https://images.unsplash.com/photo-1515023677547-51f16da88c0a?auto=format&fit=crop&q=80&w=800' :
                                    id === '2' ? 'https://images.unsplash.com/photo-1515023677548-51f16da88c0a?auto=format&fit=crop&q=80&w=800' :
                                        'https://images.unsplash.com/photo-1515023677549-51f16da88c0a?auto=format&fit=crop&q=80&w=800'
                            }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        <View className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />

                        {/* Navigation */}
                        <View
                            className="absolute top-0 left-0 right-0 px-6 flex-row items-center justify-between z-10"
                            style={{ paddingTop: insets.top + 10 }}
                        >
                            <Pressable
                                onPress={() => router.back()}
                                className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md items-center justify-center border border-white/10"
                            >
                                <ChevronLeft size={24} color="#FFF" />
                            </Pressable>
                            <Pressable className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md items-center justify-center border border-white/10">
                                <MoreHorizontal size={20} color="#FFF" />
                            </Pressable>
                        </View>

                        {/* Pagination Dots */}
                        <View className="absolute bottom-6 left-0 right-0 flex-row justify-center gap-2">
                            <View className="w-6 h-2 bg-white rounded-full" />
                            <View className="w-2 h-2 bg-white/50 rounded-full" />
                            <View className="w-2 h-2 bg-white/50 rounded-full" />
                        </View>
                    </View>

                    {/* Content */}
                    <View className="px-6 py-6">
                        <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-2">Fundraiser • Dec 20, 2024</Text>
                        <Text className="text-3xl font-black text-gray-900 leading-tight mb-6">Gala for Hope 2024: A Night to Remember</Text>

                        {/* Engagement Bar */}
                        <View className="flex-row items-center justify-between mb-8 pb-8 border-b border-gray-100">
                            <View className="flex-row items-center gap-6">
                                <View className="flex-row items-center gap-2">
                                    <Heart size={24} color="#EF4444" fill="#EF4444" />
                                    <Text className="text-gray-900 font-bold">1,240</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <MessageCircle size={24} color="#6B7280" />
                                    <Text className="text-gray-900 font-bold">56</Text>
                                </View>
                            </View>
                            <Pressable>
                                <Share2 size={24} color="#6B7280" />
                            </Pressable>
                        </View>

                        {/* Story */}
                        <Text className="text-gray-900 font-bold text-lg mb-3">The Impact</Text>
                        <Text className="text-gray-600 text-lg leading-relaxed mb-6">
                            Thanks to our 50+ volunteers who made this event successful! We raised over $20,000 for local families affected by Sickle Cell Disease. The night was filled with joy, community, and support.
                        </Text>
                        <Text className="text-gray-600 text-lg leading-relaxed mb-8">
                            Special shoutout to our keynote speaker, Dr. Emily Carter, for her inspiring words on resilience and hope. We look forward to seeing you all next year!
                        </Text>

                        {/* Attendees */}
                        <Text className="text-gray-900 font-bold text-lg mb-4">Who was there?</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible -mx-2 mb-8">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <View key={i} className="mx-2 items-center">
                                    <View className="w-14 h-14 rounded-full border-2 border-white shadow-sm overflow-hidden mb-2">
                                        <Image source={{ uri: `https://i.pravatar.cc/100?u=${i + 10}` }} className="w-full h-full" />
                                    </View>
                                    <Text className="text-gray-500 text-xs font-medium">User</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </Animated.View>
            </ScrollView>
        </View>
    );
}
