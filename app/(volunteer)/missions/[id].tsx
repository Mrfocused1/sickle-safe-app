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
            <View className="relative h-80 w-full">
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1615461066841-6116ecaaba30?auto=format&fit=crop&q=80&w=800' }}
                    className="w-full h-full"
                    resizeMode="cover"
                />
                <View className="absolute inset-0 bg-black/40" />
                <View
                    className="absolute top-0 left-0 right-0 px-6 flex-row items-center justify-between z-10"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-black/20 items-center justify-center border border-white/20"
                    >
                        <ChevronLeft size={24} color="#FFF" />
                    </Pressable>
                    <Pressable className="w-10 h-10 rounded-full bg-black/20 items-center justify-center border border-white/20">
                        <Share2 size={20} color="#FFF" />
                    </Pressable>
                </View>

                {/* Status Badge */}
                <View className="absolute bottom-12 left-6 bg-red-600 px-4 py-2 rounded-full shadow-xl">
                    <Text className="text-white font-heavy text-[11px] uppercase tracking-widest">Urgent • 2h Left</Text>
                </View>
            </View>

            <ScrollView
                className="flex-1 -mt-8 bg-white rounded-t-[40px]"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 160 }}
            >
                <View className="px-6 pt-10">
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
                        <View className="flex-1 bg-gray-50 border border-gray-100 p-5 rounded-[24px] items-center">
                            <View className="w-12 h-12 bg-violet-100 rounded-2xl items-center justify-center mb-3">
                                <Calendar size={22} color="#8B5CF6" />
                            </View>
                            <Text className="text-gray-900 font-black text-sm">Date</Text>
                            <Text className="text-gray-500 text-[10px] font-bold mt-1">Sat, Dec 28</Text>
                        </View>
                        <View className="flex-1 bg-gray-50 border border-gray-100 p-5 rounded-[24px] items-center">
                            <View className="w-12 h-12 bg-emerald-100 rounded-2xl items-center justify-center mb-3">
                                <Clock size={22} color="#10B981" />
                            </View>
                            <Text className="text-gray-900 font-black text-sm">Time</Text>
                            <Text className="text-gray-500 text-[10px] font-bold mt-1">10:00 AM</Text>
                        </View>
                        <View className="flex-1 bg-gray-50 border border-gray-100 p-5 rounded-[24px] items-center">
                            <View className="w-12 h-12 bg-amber-100 rounded-2xl items-center justify-center mb-3">
                                <Users size={22} color="#F59E0B" />
                            </View>
                            <Text className="text-gray-900 font-black text-sm">Spots</Text>
                            <Text className="text-gray-500 text-[10px] font-bold mt-1">3 Left</Text>
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
            <View className="absolute bottom-20 left-0 right-0 bg-white/90 px-6 pt-4 pb-4">
                <Pressable className="w-full bg-violet-600 py-5 rounded-[24px] shadow-lg shadow-violet-200 active:scale-[0.98] transition-all">
                    <Text className="text-white font-black text-center text-lg tracking-wide">Join Mission</Text>
                </Pressable>
            </View>
        </View>
    );
}
