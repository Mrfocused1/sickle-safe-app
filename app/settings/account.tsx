import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, User, Mail, Phone, MapPin } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function AccountDetailsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [form, setForm] = useState({
        name: 'Maya Thompson',
        email: 'maya.t@example.com',
        phone: '+1 (555) 123-4567',
        location: 'Atlanta, GA',
    });

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
                    className="px-6 pb-6 flex-row items-center justify-between"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                    >
                        <ArrowLeft size={20} color="#1f2937" />
                    </Pressable>
                    <Text className="text-xl font-bold text-gray-900">Account Details</Text>
                    <Pressable
                        onPress={() => alert('Saved')}
                        className="px-4 py-2 bg-violet-600 rounded-full"
                    >
                        <Text className="text-white font-bold text-xs">Save</Text>
                    </Pressable>
                </View>

                {/* Profile Photo */}
                <View className="items-center py-8">
                    <View className="relative">
                        <View className="w-28 h-28 rounded-full border-4 border-gray-50 overflow-hidden shadow-sm">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }}
                                className="w-full h-full"
                            />
                        </View>
                        <Pressable className="absolute bottom-0 right-0 w-8 h-8 bg-violet-600 rounded-full items-center justify-center border-2 border-white shadow-lg">
                            <Camera size={14} color="#fff" />
                        </Pressable>
                    </View>
                    <Text className="text-gray-900 font-bold text-xl mt-4">{form.name}</Text>
                    <Text className="text-gray-500 text-sm">Member since October 2023</Text>
                </View>

                {/* Form Sections */}
                <View className="px-6 space-y-6">
                    <View>
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Personal Info</Text>
                        <View className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
                            <View className="flex-row items-center mb-6">
                                <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-4 shadow-sm">
                                    <User size={18} color="#6B7280" />
                                </View>
                                <View className="flex-1 border-b border-gray-200 pb-2">
                                    <Text className="text-xs text-gray-400 font-bold uppercase mb-1">Full Name</Text>
                                    <TextInput
                                        value={form.name}
                                        onChangeText={(v) => setForm({ ...form, name: v })}
                                        className="text-gray-900 font-semibold text-base"
                                    />
                                </View>
                            </View>

                            <View className="flex-row items-center mb-6">
                                <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-4 shadow-sm">
                                    <Mail size={18} color="#6B7280" />
                                </View>
                                <View className="flex-1 border-b border-gray-200 pb-2">
                                    <Text className="text-xs text-gray-400 font-bold uppercase mb-1">Email Address</Text>
                                    <TextInput
                                        value={form.email}
                                        onChangeText={(v) => setForm({ ...form, email: v })}
                                        className="text-gray-900 font-semibold text-base"
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            <View className="flex-row items-center mb-6">
                                <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-4 shadow-sm">
                                    <Phone size={18} color="#6B7280" />
                                </View>
                                <View className="flex-1 border-b border-gray-200 pb-2">
                                    <Text className="text-xs text-gray-400 font-bold uppercase mb-1">Phone Number</Text>
                                    <TextInput
                                        value={form.phone}
                                        onChangeText={(v) => setForm({ ...form, phone: v })}
                                        className="text-gray-900 font-semibold text-base"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <View className="flex-row items-center">
                                <View className="w-10 h-10 bg-white rounded-xl items-center justify-center mr-4 shadow-sm">
                                    <MapPin size={18} color="#6B7280" />
                                </View>
                                <View className="flex-1 pb-2">
                                    <Text className="text-xs text-gray-400 font-bold uppercase mb-1">Location</Text>
                                    <TextInput
                                        value={form.location}
                                        onChangeText={(v) => setForm({ ...form, location: v })}
                                        className="text-gray-900 font-semibold text-base"
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3 ml-1">Account Management</Text>
                        <View className="bg-gray-50 rounded-3xl p-5 border border-gray-100">
                            <Pressable className="flex-row items-center justify-between py-2 border-b border-gray-200 mb-4">
                                <Text className="text-gray-900 font-semibold">Verification Badge</Text>
                                <View className="bg-violet-100 px-3 py-1 rounded-full">
                                    <Text className="text-violet-600 font-bold text-[10px]">Verified</Text>
                                </View>
                            </Pressable>
                            <Pressable className="flex-row items-center justify-between py-2">
                                <Text className="text-red-500 font-semibold">Delete Account</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
