import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ChevronLeft, MapPin, Clock, Calendar, Users, Share2, Heart, CheckCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

export default function MissionDetailScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { id } = useLocalSearchParams();

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="light" />

            {/* Hero Image Header */}
            <View className="relative h-72 w-full">
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1615461066841-6116ecaaba30?auto=format&fit=crop&q=80&w=800' }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/30" />
                <View
                    className="absolute top-0 left-0 right-0 px-6 flex-row items-center justify-between z-10"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center border border-white/10"
                    >
                        <ChevronLeft size={24} color="#FFF" />
                    </Pressable>
                    <Pressable className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center border border-white/10">
                        <Share2 size={20} color="#FFF" />
                    </Pressable>
                </View>

                {/* Status Badge */}
                <View className="absolute bottom-6 left-6 bg-red-600 px-3 py-1.5 rounded-full shadow-lg">
                    <Text className="text-white font-bold text-[10px] uppercase tracking-wider">Urgent • 2h Left</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1 -mt-6 bg-white rounded-t-[32px] overflow-visible"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <View className="px-6 pt-8">
                    {/* Header Info */}
                    <Text className="text-3xl font-black text-gray-900 leading-tight mb-2">Blood Drive Support</Text>
                    <View className="flex-row items-center mb-6">
                        <MapPin size={16} color="#6B7280" />
                        <Text className="text-gray-500 text-sm ml-1.5 font-medium">Central Hospital • 2.4 miles away</Text>
                    </View>

                    {/* Organizer */}
                    <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-2xl mb-8 border border-gray-100">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-white items-center justify-center border border-gray-100">
                                <Heart size={20} color="#EF4444" fill="#EF4444" />
                            </View>
                            <View>
                                <Text className="text-gray-900 font-bold text-sm">SickleSafe Foundation</Text>
                                <Text className="text-gray-500 text-xs">Official Organizer</Text>
                            </View>
                        </View>
                        <Pressable className="bg-white px-4 py-2 rounded-xl border border-gray-200">
                            <Text className="text-gray-900 font-bold text-xs">Follow</Text>
                        </Pressable>
                    </View>

                    {/* Details Grid */}
                    <Text className="text-gray-900 font-bold text-lg mb-4">Mission Details</Text>
                    <View className="flex-row gap-4 mb-8">
                        <View className="flex-1 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                            <Calendar size={20} color="#8B5CF6" className="mb-2" />
                            <Text className="text-gray-900 font-bold text-sm">Date</Text>
                            <Text className="text-gray-500 text-xs">Sat, Dec 28</Text>
                        </View>
                        <View className="flex-1 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                            <Clock size={20} color="#10B981" className="mb-2" />
                            <Text className="text-gray-900 font-bold text-sm">Time</Text>
                            <Text className="text-gray-500 text-xs">10:00 AM</Text>
                        </View>
                        <View className="flex-1 bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                            <Users size={20} color="#F59E0B" className="mb-2" />
                            <Text className="text-gray-900 font-bold text-sm">Spots</Text>
                            <Text className="text-gray-500 text-xs">3 Left</Text>
                        </View>
                    </View>

                    {/* Description */}
                    <Text className="text-gray-900 font-bold text-lg mb-3">About the Mission</Text>
                    <Text className="text-gray-600 text-base leading-relaxed mb-8">
                        We need energetic volunteers to help manage the registration desk and distribute refreshments to blood donors. This is a critical event for our holiday blood supply drive. No prior medical experience is required.
                    </Text>

                    {/* Checklist */}
                    <Text className="text-gray-900 font-bold text-lg mb-3">Requirements</Text>
                    <View className="space-y-3 mb-8">
                        {['Must be 18 or older', 'Able to stand for 2 hours', 'Friendly attitude'].map((req, i) => (
                            <View key={i} className="flex-row items-center gap-3">
                                <CheckCircle size={18} color="#10B981" />
                                <Text className="text-gray-600 text-sm">{req}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Action */}
            <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-6 pb-10">
                <Pressable className="w-full bg-violet-600 py-5 rounded-[24px] shadow-lg shadow-violet-200 active:scale-[0.98] transition-all">
                    <Text className="text-white font-black text-center text-lg tracking-wide">Join Mission</Text>
                </Pressable>
            </View>
        </View>
    );
}
