import React from 'react';
import { View, Text, Pressable, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Megaphone, Users, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

export default function VolunteerOnboardingScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 bg-black">
            <StatusBar style="light" />

            {/* Video Background */}
            <Video
                source={{ uri: 'https://assets.mixkit.co/videos/preview/mixkit-diverse-group-of-people-talking-and-gesticulating-41310-large.mp4' }}
                rate={1.0}
                volume={0}
                isMuted={true}
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
                style={StyleSheet.absoluteFill}
            />

            <LinearGradient
                colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.95)']}
                className="absolute inset-0"
            />

            <SafeAreaView className="flex-1">
                {/* Logo at Top (Triple Size, No BG) */}
                <View className="items-center mt-2">
                    <Image
                        source={require('../../../assets/logo.png')}
                        style={{ width: width * 0.5, height: 80 }}
                        resizeMode="contain"
                    />
                </View>

                {/* Step Progress */}
                <View className="px-8 mt-4 mb-10">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-[10px] font-black uppercase tracking-[2px] text-white">Volunteer Flow</Text>
                        <Pressable onPress={() => router.replace('/(volunteer)')}>
                            <Text className="text-[10px] font-black uppercase tracking-[2px] text-red-500">Skip</Text>
                        </Pressable>
                    </View>
                    <View className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <View className="h-full w-3/4 bg-red-600 rounded-full" />
                    </View>
                </View>

                {/* Content */}
                <View className="flex-1 px-8">
                    <View className="mb-10">
                        <Text className="text-[42px] font-black text-white leading-[1] tracking-tighter mb-4">
                            Empower the{'\n'}
                            <Text className="text-red-600">Community.</Text>
                        </Text>
                        <Text className="text-base text-gray-200 font-medium leading-relaxed">
                            As a volunteer, you are the backbone of advocacy and support.
                        </Text>
                    </View>

                    {/* Features List */}
                    <View className="space-y-4">
                        <View className="flex-row items-center gap-4 bg-white/5 backdrop-blur-md p-5 rounded-[32px] border border-white/5 active:bg-white/10">
                            <View className="w-12 h-12 bg-red-600/10 rounded-2xl items-center justify-center">
                                <Users size={24} color="#EF4444" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-black text-base">Organize Events</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Host blood drives and awareness sessions.</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4 bg-white/5 backdrop-blur-md p-5 rounded-[32px] border border-white/5 active:bg-white/10">
                            <View className="w-12 h-12 bg-blue-600/10 rounded-2xl items-center justify-center">
                                <Megaphone size={24} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-black text-base">Policy Advocacy</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Stay updated on health policy and take action.</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-4 bg-white/5 backdrop-blur-md p-5 rounded-[32px] border border-white/5 active:bg-white/10">
                            <View className="w-12 h-12 bg-emerald-600/10 rounded-2xl items-center justify-center">
                                <Shield size={24} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-white font-black text-base">Support Network</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">Connect with families and provide local aid.</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bottom CTA */}
                <View className="px-8 pb-10">
                    <Pressable
                        onPress={() => router.replace('/(volunteer)')}
                        className="w-full bg-red-600 py-6 rounded-[24px] shadow-xl shadow-red-900/40 active:scale-[0.98] relative overflow-hidden"
                    >
                        <LinearGradient
                            colors={['rgba(255,255,255,0.1)', 'transparent']}
                            className="absolute inset-0"
                        />
                        <View className="flex-row items-center justify-center">
                            <Text className="text-white font-black text-xl tracking-wide">Enter Dashboard</Text>
                            <View className="ml-3 bg-white/20 p-1.5 rounded-full">
                                <ArrowRight size={24} color="#ffffff" />
                            </View>
                        </View>
                    </Pressable>
                </View>
            </SafeAreaView>
        </View>
    );
}
