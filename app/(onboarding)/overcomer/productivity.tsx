import React from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Calendar, Droplet, Activity, CheckSquare } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

export default function ProductivityFirstScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Video Background */}
      <Video
        source={{ uri: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-working-at-a-laptop-outside-41314-large.mp4' }}
        rate={1.0}
        volume={0}
        isMuted={true}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.9)']}
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
        <View className="px-8 mt-4 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-gray-500">Step 1 of 4</Text>
            <Pressable onPress={() => router.push('/(overcomer)')}>
              <Text className="text-[10px] font-black uppercase tracking-[2px] text-red-500">Skip</Text>
            </Pressable>
          </View>
          <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full w-1/4 bg-red-600 rounded-full" />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-8">
          {/* Title Section */}
          <View className="mb-4">
            <Text className="text-[42px] font-black text-gray-900 leading-[1] tracking-tighter mb-4">
              Productivity{'\n'}
              <Text className="text-red-600">Design.</Text>
            </Text>
            <Text className="text-base text-gray-700 font-bold leading-relaxed">
              Organize your life and health in one place.
            </Text>
          </View>

          {/* High-Fidelity Mockup Container */}
          <View className="flex-1 py-2">
            <View className="w-full bg-white/90 rounded-[40px] p-6 border border-gray-100 shadow-2xl relative overflow-hidden">
              <View className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full -mr-16 -mt-16" />

              {/* Card Title Content */}
              <View className="flex-row justify-between items-center mb-6">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 rounded-2xl bg-red-50 items-center justify-center shadow-sm mr-4">
                    <Calendar size={20} color="#EF4444" />
                  </View>
                  <View>
                    <Text className="text-gray-900 font-black text-base">Daily Log</Text>
                    <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Dec 26, 2025</Text>
                  </View>
                </View>
              </View>

              {/* Status Pills */}
              <View className="flex-row gap-3 mb-6">
                <View className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-md">
                  <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center mb-2">
                    <Droplet size={16} color="#3B82F6" />
                  </View>
                  <View className="h-2 w-12 bg-gray-200 rounded-full mb-1" />
                  <View className="h-1.5 w-8 bg-gray-300 rounded-full" />
                </View>
                <View className="flex-1 bg-white p-4 rounded-3xl border border-gray-100 shadow-md">
                  <View className="w-8 h-8 rounded-full bg-red-50 items-center justify-center mb-2">
                    <Activity size={16} color="#EF4444" />
                  </View>
                  <View className="h-2 w-12 bg-gray-200 rounded-full mb-1" />
                  <View className="h-1.5 w-8 bg-gray-300 rounded-full" />
                </View>
              </View>

              {/* Checklist Items */}
              <View className="space-y-3">
                <View className="flex-row items-center p-4 rounded-[20px] bg-white border border-gray-100 shadow-sm">
                  <View className="w-6 h-6 rounded-lg bg-red-600 items-center justify-center mr-4">
                    <CheckSquare size={14} color="#FFF" />
                  </View>
                  <View className="h-2 w-32 bg-gray-300 rounded-full" />
                </View>
                <View className="flex-row items-center p-4 rounded-[20px] bg-gray-50/50 border border-gray-100 opacity-60">
                  <View className="w-6 h-6 rounded-lg border-2 border-gray-300 mr-4" />
                  <View className="h-2 w-24 bg-gray-400 rounded-full" />
                </View>
              </View>

              {/* Floating Verified Badge */}
              <View className="absolute -right-2 top-[45%] bg-emerald-500 px-3 py-1.5 rounded-xl shadow-lg rotate-12 border-2 border-white">
                <Text className="text-white font-black text-[10px] uppercase">Control</Text>
              </View>
            </View>
          </View>

          {/* Navigation Action */}
          <View className="mb-10 mt-6">
            <Pressable
              onPress={() => router.push('/(onboarding)/overcomer/safety-net')}
              className="w-full bg-red-600 py-6 rounded-[24px] shadow-xl shadow-red-900/20 active:scale-[0.98] relative overflow-hidden"
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-white font-black text-xl tracking-wide">Next Step</Text>
                <View className="ml-3 bg-white/20 p-1.5 rounded-full">
                  <ArrowRight size={24} color="#ffffff" />
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
