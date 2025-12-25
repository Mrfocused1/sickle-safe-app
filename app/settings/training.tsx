import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Award, BookOpen, CheckCircle2, Play, ChevronRight, Clock, Star } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function VolunteerTrainingScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const MODULES = [
        { id: 1, title: 'Sickle Cell 101: The Basics', duration: '45 mins', status: 'Completed', progress: 100, icon: BookOpen, color: '#10B981', bgColor: 'bg-emerald-50' },
        { id: 2, title: 'Advocacy & Patient Support', duration: '1.5 hours', status: 'In Progress', progress: 65, icon: Star, color: '#8B5CF6', bgColor: 'bg-violet-50' },
        { id: 3, title: 'Event Management Essentials', duration: '1 hour', status: 'Locked', progress: 0, icon: Play, color: '#9CA3AF', bgColor: 'bg-gray-100' },
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
                    className="px-6 pb-6 border-b border-gray-50 bg-white"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <View className="flex-row items-center justify-between mb-8">
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                        >
                            <ArrowLeft size={20} color="#1f2937" />
                        </Pressable>
                        <Text className="text-xl font-bold text-gray-900">Training & Certs</Text>
                        <View className="w-10" />
                    </View>

                    {/* Progress Summary */}
                    <View className="bg-gray-900 rounded-[32px] p-6 shadow-xl flex-row items-center overflow-hidden">
                        <View className="flex-1">
                            <Text className="text-white/60 text-[10px] font-bold uppercase tracking-widest mb-1">Your Progress</Text>
                            <Text className="text-white text-2xl font-extrabold mb-3">75% Certified</Text>
                            <View className="h-2 bg-white/10 rounded-full w-full overflow-hidden">
                                <View className="h-full bg-emerald-400 w-3/4" />
                            </View>
                            <Text className="text-emerald-400 text-[10px] font-bold mt-2">Almost there! 1 module left.</Text>
                        </View>
                        <View className="ml-6">
                            <Award size={48} color="#FFF" opacity={0.2} />
                        </View>
                    </View>
                </View>

                <View className="px-6 py-8">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">Learning Path</Text>

                    {MODULES.map((module) => {
                        const Icon = module.icon;
                        return (
                            <Pressable key={module.id} className="bg-gray-50 rounded-[32px] p-5 border border-gray-100 shadow-sm mb-6">
                                <View className="flex-row items-center mb-4">
                                    <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${module.bgColor}`}>
                                        <Icon size={24} color={module.color} />
                                    </View>
                                    <View className="flex-1">
                                        <View className="flex-row items-center gap-2 mb-1">
                                            <Text className={`text-[9px] font-bold uppercase ${module.status === 'Completed' ? 'text-emerald-500' :
                                                    module.status === 'In Progress' ? 'text-violet-600' : 'text-gray-400'
                                                }`}>{module.status}</Text>
                                        </View>
                                        <Text className="text-gray-900 font-bold text-sm mb-1">{module.title}</Text>
                                        <View className="flex-row items-center">
                                            <Clock size={10} color="#9CA3AF" />
                                            <Text className="text-gray-400 text-xs ml-1">{module.duration}</Text>
                                        </View>
                                    </View>
                                    {module.status === 'Completed' ? (
                                        <CheckCircle2 size={24} color="#10B981" />
                                    ) : (
                                        <ChevronRight size={18} color="#D1D5DB" />
                                    )}
                                </View>
                                {module.status === 'In Progress' && (
                                    <View className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <View className="h-full bg-violet-600 w-2/3" />
                                    </View>
                                )}
                            </Pressable>
                        );
                    })}

                    <View className="mt-4 p-8 bg-violet-50 rounded-[40px] border border-violet-100 items-center justify-center min-h-[160px]">
                        <Award size={40} color="#8B5CF6" />
                        <Text className="text-gray-900 font-bold text-base mt-4 text-center">Certified Advocacy Ambassador</Text>
                        <Text className="text-gray-500 text-xs mt-1 text-center">Complete all modules to unlock your digital badge and official certificate.</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
