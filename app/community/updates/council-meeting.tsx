import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, MapPin, Users, AlertCircle, Check } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function CouncilMeetingScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [isAttending, setIsAttending] = useState(false);

    const AGENDA = [
        'Introduction of Health Access Bill',
        'Patient Stories: Living with Sickle Cell in Atlanta',
        'Budget Allocation for Emergency Care',
        'Closing Remarks & Next Steps',
    ];

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header Image */}
                <View className="h-64 relative">
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800' }}
                        className="w-full h-full"
                    />
                    <View className="absolute inset-0 bg-gray-900/40" />
                    <Pressable
                        onPress={() => router.back()}
                        style={{ top: insets.top + 10 }}
                        className="absolute left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center"
                    >
                        <ArrowLeft size={20} color="#fff" />
                    </Pressable>
                    <View className="absolute bottom-6 left-6 bg-red-500 px-3 py-1 rounded-md flex-row items-center gap-2">
                        <AlertCircle size={14} color="#fff" />
                        <Text className="text-white text-[10px] font-bold uppercase tracking-widest">Urgent Call to Action</Text>
                    </View>
                </View>

                <View className="px-6 py-8">
                    <Text className="text-gray-900 text-3xl font-extrabold leading-tight mb-4">
                        Local Council Meeting: Health Accessibility
                    </Text>

                    {/* Event Details Card */}
                    <View className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 mb-8">
                        <View className="flex-row items-center gap-4 mb-6">
                            <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm">
                                <Calendar size={24} color="#8B5CF6" />
                            </View>
                            <View>
                                <Text className="text-gray-900 font-bold text-base">Tuesday, Dec 12</Text>
                                <Text className="text-gray-400 text-xs text-medium">Tomorrow • Afternoon Session</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4 mb-6">
                            <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm">
                                <Clock size={24} color="#F59E0B" />
                            </View>
                            <View>
                                <Text className="text-gray-900 font-bold text-base">2:00 PM - 4:30 PM</Text>
                                <Text className="text-gray-400 text-xs text-medium">Registration starts at 1:30 PM</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4">
                            <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm">
                                <MapPin size={24} color="#10B981" />
                            </View>
                            <View>
                                <Text className="text-gray-900 font-bold text-base">City Hall, Room 402</Text>
                                <Text className="text-gray-400 text-xs text-medium">55 Trinity Ave SW, Atlanta, GA</Text>
                            </View>
                        </View>
                    </View>

                    <Text className="text-gray-600 text-base leading-relaxed mb-8">
                        There's a crucial hearing tomorrow regarding health accessibility. We need as many volunteers as possible to attend and show our community's support for the new bill. Your presence makes an impact!
                    </Text>

                    {/* Agenda */}
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">Proposed Agenda</Text>
                    <View className="space-y-4 mb-10">
                        {AGENDA.map((item, i) => (
                            <View key={i} className="flex-row items-start gap-4">
                                <View className="w-6 h-6 rounded-full bg-violet-100 items-center justify-center mt-0.5">
                                    <Text className="text-violet-600 font-bold text-[10px]">{i + 1}</Text>
                                </View>
                                <Text className="flex-1 text-gray-700 font-medium text-sm leading-relaxed">{item}</Text>
                            </View>
                        ))}
                    </View>

                    <View className="p-8 bg-gray-900 rounded-[40px] items-center shadow-2xl">
                        <View className="flex-row items-center gap-3 mb-2">
                            <Users size={20} color="#A78BFA" />
                            <Text className="text-white/60 font-bold text-xs">84 Volunteers Attending</Text>
                        </View>
                        <Text className="text-white text-xl font-bold mb-6 text-center">Can you make it?</Text>

                        <Pressable
                            onPress={() => setIsAttending(!isAttending)}
                            className={`w-full py-4 rounded-full flex-row items-center justify-center gap-3 ${isAttending ? 'bg-emerald-500' : 'bg-white'}`}
                        >
                            {isAttending ? (
                                <>
                                    <Check size={20} color="#fff" />
                                    <Text className="text-white font-bold text-lg">I'm Attending</Text>
                                </>
                            ) : (
                                <Text className="text-gray-900 font-bold text-lg">Confirm Attendance</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
