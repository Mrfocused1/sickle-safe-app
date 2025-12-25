import React from 'react';
import { View, Text, ScrollView, Pressable, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageCircle, BookOpen, Clock, ChevronRight, Search, PhoneCall, HelpCircle } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function HelpScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const FAQS = [
        "How do I add a caregiver?",
        "What happens during a crisis alert?",
        "How is my medical data managed?",
        "Can I export my health logs?",
    ];

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Header */}
                <View
                    className="px-6 pb-6 border-b border-gray-50"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <View className="flex-row items-center justify-between mb-6">
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                        >
                            <ArrowLeft size={20} color="#1f2937" />
                        </Pressable>
                        <Text className="text-xl font-bold text-gray-900">Help & Support</Text>
                        <View className="w-10" />
                    </View>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search help articles..."
                            className="flex-1 ml-3 text-base text-gray-900"
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                </View>

                <View className="px-6 py-8">
                    {/* Contact Channels */}
                    <View className="mb-8">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Contact Support</Text>
                        <View className="flex-row gap-4">
                            <Pressable className="flex-1 bg-violet-50 rounded-3xl p-5 border border-violet-100 items-center">
                                <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center mb-3 shadow-sm">
                                    <MessageCircle size={22} color="#8B5CF6" />
                                </View>
                                <Text className="text-gray-900 font-bold text-sm">Live Chat</Text>
                                <Text className="text-violet-600 text-[10px] font-bold mt-1">Online now</Text>
                            </Pressable>
                            <Pressable className="flex-1 bg-gray-50 rounded-3xl p-5 border border-gray-100 items-center">
                                <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center mb-3 shadow-sm">
                                    <PhoneCall size={22} color="#10B981" />
                                </View>
                                <Text className="text-gray-900 font-bold text-sm">Call Us</Text>
                                <Text className="text-gray-400 text-[10px] font-bold mt-1">9 AM - 6 PM</Text>
                            </Pressable>
                        </View>
                    </View>

                    {/* Knowledge Base */}
                    <View className="mb-8">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Knowledge Base</Text>
                        <View className="bg-gray-50 rounded-[32px] px-6 py-2 border border-gray-100 shadow-sm">
                            <HelpItem
                                icon={<BookOpen size={18} color="#6366F1" />}
                                label="App Guide"
                                description="Learn everything about SickleSafe"
                                bgColor="bg-indigo-50"
                            />
                            <HelpItem
                                icon={<Clock size={18} color="#F59E0B" />}
                                label="Log History"
                                description="Troubleshoot syncing issues"
                                bgColor="bg-amber-50"
                            />
                            <HelpItem
                                icon={<HelpCircle size={18} color="#EF4444" />}
                                label="Feedback"
                                description="Tell us how we can improve"
                                bgColor="bg-red-50"
                                isLast
                            />
                        </View>
                    </View>

                    {/* FAQs */}
                    <View className="mb-8">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Common Questions</Text>
                        <View className="space-y-3">
                            {FAQS.map((faq, i) => (
                                <Pressable key={i} className="flex-row items-center justify-between bg-white border border-gray-100 p-4 rounded-2xl">
                                    <Text className="text-gray-700 font-semibold text-sm flex-1 mr-4">{faq}</Text>
                                    <ChevronRight size={18} color="#cbd5e1" />
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function HelpItem({ icon, label, description, bgColor, isLast }: any) {
    return (
        <Pressable className={`flex-row items-center justify-between py-5 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <View className="flex-row items-center gap-4 flex-1">
                <View className={`w-10 h-10 rounded-xl items-center justify-center ${bgColor}`}>
                    {icon}
                </View>
                <View className="flex-1">
                    <Text className="font-semibold text-base text-gray-900">{label}</Text>
                    <Text className="text-gray-400 text-xs mt-0.5">{description}</Text>
                </View>
            </View>
            <ChevronRight size={18} color="#cbd5e1" />
        </Pressable>
    );
}
