import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Plus, Phone, Mail, MapPin, ChevronRight, Stethoscope } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function HealthcareTeamScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const TEAM = [
        {
            id: 1,
            name: 'Dr. Sarah Wilson',
            specialty: 'Hematologist / Oncologist',
            hospital: 'City General Hospital',
            image: 'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=200',
        },
        {
            id: 2,
            name: 'Dr. Michael Chen',
            specialty: 'Primary Physician',
            hospital: 'Metro Health Clinic',
            image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200',
        }
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
                    className="px-6 pb-6 flex-row items-center justify-between"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                    >
                        <ArrowLeft size={20} color="#1f2937" />
                    </Pressable>
                    <Text className="text-xl font-bold text-gray-900">Healthcare Team</Text>
                    <Pressable
                        onPress={() => alert('Add Member')}
                        className="w-10 h-10 bg-violet-600 rounded-full items-center justify-center shadow-lg"
                    >
                        <Plus size={20} color="#fff" />
                    </Pressable>
                </View>

                <View className="px-6 py-8">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">Your Specialists</Text>

                    {TEAM.map((doctor) => (
                        <View key={doctor.id} className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 shadow-sm mb-6">
                            <View className="flex-row items-center mb-6">
                                <View className="w-16 h-16 rounded-2xl overflow-hidden mr-4 border border-white shadow-sm">
                                    <Image source={{ uri: doctor.image }} className="w-full h-full" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-bold text-lg">{doctor.name}</Text>
                                    <Text className="text-violet-600 font-semibold text-xs mt-0.5">{doctor.specialty}</Text>
                                    <Text className="text-gray-400 text-[10px] mt-1">{doctor.hospital}</Text>
                                </View>
                            </View>

                            <View className="flex-row gap-3">
                                <Pressable className="flex-1 bg-white py-3 rounded-2xl border border-gray-100 flex-row items-center justify-center gap-2">
                                    <Phone size={14} color="#6B7280" />
                                    <Text className="text-gray-700 font-bold text-xs">Call</Text>
                                </Pressable>
                                <Pressable className="flex-1 bg-white py-3 rounded-2xl border border-gray-100 flex-row items-center justify-center gap-2">
                                    <Mail size={14} color="#6B7280" />
                                    <Text className="text-gray-700 font-bold text-xs">Email</Text>
                                </Pressable>
                            </View>

                            <Pressable className="mt-4 py-3 flex-row items-center justify-center border-t border-gray-200">
                                <Text className="text-gray-400 text-xs font-semibold">View Practice Details</Text>
                                <ChevronRight size={14} color="#D1D5DB" />
                            </Pressable>
                        </View>
                    ))}

                    {/* Quick Add Practice */}
                    <Pressable className="bg-white border-2 border-dashed border-gray-200 rounded-[32px] p-8 items-center justify-center">
                        <View className="w-12 h-12 bg-gray-50 rounded-full items-center justify-center mb-3">
                            <Stethoscope size={24} color="#9CA3AF" />
                        </View>
                        <Text className="text-gray-500 font-bold text-sm">Add New Specialist</Text>
                        <Text className="text-gray-400 text-xs mt-1">Connect your medical circle</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}
