import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronLeft, Award, Clock, Calendar, Download, Share2 } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function VolunteerResumeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />

            {/* Header */}
            <View
                className="px-6 pb-6 border-b border-gray-100"
                style={{ paddingTop: insets.top + 10 }}
            >
                <View className="flex-row items-center justify-between mb-6">
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
                    >
                        <ChevronLeft size={24} color="#374151" />
                    </Pressable>
                    <Text className="text-lg font-bold text-gray-900">Volunteer Profile</Text>
                    <Pressable className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
                        <Share2 size={20} color="#374151" />
                    </Pressable>
                </View>

                <View className="items-center">
                    <View className="w-24 h-24 rounded-[32px] border-4 border-white shadow-lg shadow-violet-100 overflow-hidden mb-4">
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }}
                            className="w-full h-full"
                        />
                    </View>
                    <Text className="text-2xl font-black text-gray-900 text-center">Sarah Jenkins</Text>
                    <Text className="text-violet-600 font-bold text-sm uppercase tracking-widest mt-1">Stellar Volunteer</Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Stats Grid */}
                <View className="flex-row gap-4 p-6">
                    <View className="flex-1 bg-violet-50 rounded-2xl p-4 items-center border border-violet-100">
                        <Clock size={24} color="#8B5CF6" className="mb-2" />
                        <Text className="text-2xl font-black text-violet-900">124</Text>
                        <Text className="text-xs font-bold text-violet-600 uppercase">Total Hours</Text>
                    </View>
                    <View className="flex-1 bg-emerald-50 rounded-2xl p-4 items-center border border-emerald-100">
                        <Award size={24} color="#10B981" className="mb-2" />
                        <Text className="text-2xl font-black text-emerald-900">8</Text>
                        <Text className="text-xs font-bold text-emerald-600 uppercase">Badges</Text>
                    </View>
                    <View className="flex-1 bg-amber-50 rounded-2xl p-4 items-center border border-amber-100">
                        <Calendar size={24} color="#F59E0B" className="mb-2" />
                        <Text className="text-2xl font-black text-amber-900">24</Text>
                        <Text className="text-xs font-bold text-amber-600 uppercase">Events</Text>
                    </View>
                </View>

                {/* Badges Section */}
                <View className="px-6 mb-8">
                    <Text className="text-gray-900 font-bold text-lg mb-4">Earned Badges</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible -mx-2">
                        {['Community Hero', 'Top Host', 'Early Bird', 'Mentor'].map((badge, i) => (
                            <View key={i} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-3 mx-2 w-28 items-center">
                                <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center mb-2">
                                    <Award size={20} color={['#8B5CF6', '#EF4444', '#F59E0B', '#10B981'][i]} />
                                </View>
                                <Text className="text-gray-900 font-bold text-xs text-center">{badge}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>

                {/* History List */}
                <View className="px-6 mb-8">
                    <Text className="text-gray-900 font-bold text-lg mb-4">Activity History</Text>
                    {[1, 2, 3].map((item, i) => (
                        <View key={i} className="flex-row items-center mb-6">
                            <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center mr-4">
                                <Calendar size={20} color="#6B7280" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-bold text-base">Blood Drive Assistant</Text>
                                <Text className="text-gray-500 text-xs">Central Hospital • 4 hours</Text>
                            </View>
                            <Text className="text-gray-400 text-xs font-medium">Dec {20 - i}</Text>
                        </View>
                    ))}
                </View>

                {/* Certificates */}
                <View className="px-6 pb-12">
                    <View className="bg-gray-900 rounded-[32px] p-6 relative overflow-hidden">
                        <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <Text className="text-white font-black text-xl mb-1">Official Resume</Text>
                        <Text className="text-gray-400 text-sm mb-6">Download your verified volunteer history and certifications.</Text>
                        <Pressable className="bg-white py-4 rounded-xl flex-row items-center justify-center gap-2 active:bg-gray-50">
                            <Download size={20} color="#000" />
                            <Text className="text-black font-bold text-sm">Download PDF</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
