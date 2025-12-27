import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
    Bell,
    Lock,
    User,
    LogOut,
    ChevronRight,
    Shield,
    Smartphone,
    Award,
    BookOpen,
    HelpCircle,
    FileText
} from 'lucide-react-native';

export default function VolunteerSettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [pushEnabled, setPushEnabled] = useState(true);
    const [availabilityEnabled, setAvailabilityEnabled] = useState(true);

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header */}
                <View
                    className="px-6 pb-6 border-b border-gray-100 bg-white"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <Text className="text-3xl font-extrabold text-gray-900 mb-6">Settings</Text>

                    {/* Profile Card */}
                    <View className="flex-row items-center bg-gray-50 p-4 rounded-[32px] border border-gray-100">
                        <View className="w-16 h-16 rounded-2xl overflow-hidden mr-4 border border-violet-100 shadow-sm bg-white">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }}
                                className="w-full h-full"
                            />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-900">Volunteer</Text>
                            <Text className="text-violet-600 text-xs font-bold uppercase tracking-tight">Active Supporter</Text>
                        </View>
                        <Pressable
                            onPress={() => router.push('/settings/account')}
                            className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm"
                        >
                            <Text className="font-bold text-xs text-gray-900">Edit</Text>
                        </Pressable>
                    </View>
                </View>

                <View className="px-6 py-8">
                    {/* Preferences */}
                    <View className="mb-8">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Volunteer Preferences</Text>
                        <View className="bg-white rounded-[32px] px-6 shadow-sm border border-gray-100">
                            <Pressable
                                className="flex-row items-center justify-between py-4"
                                onPress={() => router.push('/settings/notifications')}
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-violet-50">
                                        <Bell size={20} color="#8B5CF6" />
                                    </View>
                                    <Text className="font-semibold text-base text-gray-900">Notification Settings</Text>
                                </View>
                                <ChevronRight size={20} color="#cbd5e1" />
                            </Pressable>
                            <View className="h-[1px] bg-gray-50" />
                            <View className="flex-row items-center justify-between py-4">
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-violet-50">
                                        <Smartphone size={20} color="#8B5CF6" />
                                    </View>
                                    <Text className="font-semibold text-base text-gray-900">Call/SMS Available</Text>
                                </View>
                                <Switch
                                    trackColor={{ false: '#e2e8f0', true: '#8B5CF6' }}
                                    thumbColor="#fff"
                                    onValueChange={setAvailabilityEnabled}
                                    value={availabilityEnabled}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Support & Growth */}
                    <View className="mb-8">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Support & Growth</Text>
                        <View className="bg-white rounded-[32px] px-6 shadow-sm border border-gray-100">
                            <Pressable
                                className="flex-row items-center justify-between py-4"
                                onPress={() => router.push('/settings/training')}
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-amber-50">
                                        <BookOpen size={20} color="#F59E0B" />
                                    </View>
                                    <Text className="font-semibold text-base text-gray-900">Training Modules</Text>
                                </View>
                                <ChevronRight size={20} color="#cbd5e1" />
                            </Pressable>
                            <View className="h-[1px] bg-gray-50" />
                            <Pressable
                                className="flex-row items-center justify-between py-4"
                                onPress={() => router.push('/settings/training')}
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-amber-50">
                                        <Award size={20} color="#F59E0B" />
                                    </View>
                                    <Text className="font-semibold text-base text-gray-900">Certifications</Text>
                                </View>
                                <ChevronRight size={20} color="#cbd5e1" />
                            </Pressable>
                            <View className="h-[1px] bg-gray-50" />
                            <Pressable
                                className="flex-row items-center justify-between py-4"
                                onPress={() => router.push('/settings/volunteer-forms')}
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-amber-50">
                                        <FileText size={20} color="#F59E0B" />
                                    </View>
                                    <Text className="font-semibold text-base text-gray-900">Volunteer Forms</Text>
                                </View>
                                <ChevronRight size={20} color="#cbd5e1" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Account Security */}
                    <View className="mb-8">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Account Security</Text>
                        <View className="bg-white rounded-[32px] px-6 shadow-sm border border-gray-100">
                            <Pressable
                                className="flex-row items-center justify-between py-4"
                                onPress={() => router.push('/settings/account')}
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-gray-100">
                                        <User size={20} color="#6B7280" />
                                    </View>
                                    <Text className="font-semibold text-base text-gray-900">Account Details</Text>
                                </View>
                                <ChevronRight size={20} color="#cbd5e1" />
                            </Pressable>
                            <View className="h-[1px] bg-gray-50" />
                            <Pressable
                                className="flex-row items-center justify-between py-4"
                                onPress={() => router.push('/settings/security')}
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-gray-100">
                                        <Shield size={20} color="#6B7280" />
                                    </View>
                                    <Text className="font-semibold text-base text-gray-900">Privacy & Security</Text>
                                </View>
                                <ChevronRight size={20} color="#cbd5e1" />
                            </Pressable>
                            <View className="h-[1px] bg-gray-50" />
                            <Pressable
                                className="flex-row items-center justify-between py-4"
                                onPress={() => router.push('/settings/help')}
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-gray-100">
                                        <HelpCircle size={20} color="#6B7280" />
                                    </View>
                                    <Text className="font-semibold text-base text-gray-900">Help & Support</Text>
                                </View>
                                <ChevronRight size={20} color="#cbd5e1" />
                            </Pressable>
                            <View className="h-[1px] bg-gray-50" />
                            <Pressable className="flex-row items-center justify-between py-4" onPress={() => alert('Logout')}>
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-red-50">
                                        <LogOut size={20} color="#EF4444" />
                                    </View>
                                    <Text className="font-semibold text-base text-red-500">Log Out</Text>
                                </View>
                            </Pressable>
                        </View>
                    </View>

                    <Text className="text-center text-gray-300 text-[10px] font-bold mt-6 uppercase tracking-widest">
                        Volunteer Network v1.0 • Build 8
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}
