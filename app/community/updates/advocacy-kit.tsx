import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Download, FileText, CheckCircle2, Share2, Bookmark } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function AdvocacyKitScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const CHAPTERS = [
        { title: 'Understanding State Legislation', duration: '12 mins', id: 1 },
        { title: 'Effective Communication with Representatives', duration: '15 mins', id: 2 },
        { title: 'Patient Rights & Coverage Policies', duration: '10 mins', id: 3 },
        { title: 'Media Engagement for Local Causes', duration: '8 mins', id: 4 },
    ];

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 60 }}
            >
                {/* Hero Header */}
                <View className="relative h-72">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1541872703-74c5e443d1f5?auto=format&fit=crop&q=80&w=800' }}
                        className="w-full h-full"
                    />
                    <View className="absolute inset-0 bg-black/40" />
                    <View
                        className="absolute top-0 left-0 right-0 px-6 flex-row items-center justify-between"
                        style={{ paddingTop: insets.top + 10 }}
                    >
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center"
                        >
                            <ArrowLeft size={20} color="#fff" />
                        </Pressable>
                        <View className="flex-row gap-3">
                            <Pressable className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center">
                                <Bookmark size={18} color="#fff" />
                            </Pressable>
                            <Pressable className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center">
                                <Share2 size={18} color="#fff" />
                            </Pressable>
                        </View>
                    </View>
                    <View className="absolute bottom-8 px-6">
                        <View className="bg-orange-500 px-3 py-1 rounded-md self-start mb-3">
                            <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Official Publication</Text>
                        </View>
                        <Text className="text-white text-3xl font-extrabold leading-tight">Policy Advocacy{'\n'}Kit 2024</Text>
                    </View>
                </View>

                {/* Content */}
                <View className="px-6 py-8">
                    <View className="flex-row items-center gap-4 mb-8">
                        <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center border border-gray-100">
                            <FileText size={24} color="#F97316" />
                        </View>
                        <View>
                            <Text className="text-gray-900 font-bold text-lg">24-Page PDF Guide</Text>
                            <Text className="text-gray-400 text-xs text-medium">Updated 3 hours ago • 4.2 MB</Text>
                        </View>
                    </View>

                    <Text className="text-gray-600 text-base leading-relaxed mb-8">
                        Our latest guide on advocating for better Sickle Cell policies at the state level is now available. This kit provides the tools you need to engage with local lawmakers and push for expanded care access in your community.
                    </Text>

                    <Pressable className="bg-gray-900 rounded-3xl py-5 items-center flex-row justify-center gap-3 shadow-xl mb-10">
                        <Download size={20} color="#fff" />
                        <Text className="text-white font-bold text-lg">Download Full Kit</Text>
                    </Pressable>

                    {/* Chapters */}
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">What's Inside</Text>
                    {CHAPTERS.map((chap) => (
                        <View key={chap.id} className="bg-gray-50 rounded-3xl p-5 border border-gray-100 mb-4 flex-row items-center">
                            <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-4 shadow-sm">
                                <CheckCircle2 size={18} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-bold text-sm">{chap.title}</Text>
                                <Text className="text-gray-400 text-[10px] mt-0.5">{chap.duration} reading time</Text>
                            </View>
                        </View>
                    ))}

                    <View className="mt-8 bg-violet-50 rounded-[40px] p-8 items-center border border-violet-100">
                        <Text className="text-violet-900 font-bold text-lg mb-2">Need Help Presenting?</Text>
                        <Text className="text-violet-600 text-sm text-center mb-6 leading-relaxed">
                            Schedule a 1-on-1 session with our advocacy team to practice your pitch for local council members.
                        </Text>
                        <Pressable className="bg-white px-8 py-3 rounded-full border border-violet-200">
                            <Text className="text-violet-600 font-bold text-sm">Book Session</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
