import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Megaphone, Users, Shield } from 'lucide-react-native';

export default function VolunteerOnboardingScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            <SafeAreaView className="flex-1">
                {/* Progress Bar */}
                <View className="px-6 mb-6">
                    <View className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <View className="h-full w-3/4 bg-violet-600 rounded-full" />
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1 px-6">
                    <View className="mb-10">
                        <Text className="text-2xl font-black mb-3 tracking-tight text-gray-900">
                            Empower the <Text className="text-violet-600">Community</Text>
                        </Text>
                        <Text className="text-base text-gray-600 leading-relaxed">
                            As a volunteer, you are the backbone of advocacy and support. Connect, organize, and make a real difference.
                        </Text>
                    </View>

                    {/* Features List */}
                    <View>
                        <View className="flex-row items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-5">
                            <View className="w-12 h-12 bg-violet-50 rounded-2xl items-center justify-center">
                                <Users size={24} color="#8B5CF6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-bold text-base">Organize Events</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Host blood drives and awareness sessions.</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-5">
                            <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center">
                                <Megaphone size={24} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-bold text-base">Policy Advocacy</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Stay updated on health policy and take action.</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm mb-5">
                            <View className="w-12 h-12 bg-emerald-50 rounded-2xl items-center justify-center">
                                <Shield size={24} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-bold text-base">Support Network</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Connect with families and provide local aid.</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bottom CTA */}
                <View className="px-6 pb-6">
                    <Pressable
                        onPress={() => router.replace('/(volunteer)')}
                        className="w-full bg-violet-600 py-4 rounded-2xl shadow-lg active:scale-95"
                    >
                        <View className="flex-row items-center justify-center">
                            <Text className="text-white font-semibold text-lg">Enter Dashboard</Text>
                            <ArrowRight size={20} color="#ffffff" className="ml-2" />
                        </View>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
}
