import React from 'react';
import { View, Text, Pressable, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Zap, Bell, Wifi, Heart } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

export default function RealTimeAlertsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {/* Video Background */}
      <Video
        source={{ uri: 'https://assets.mixkit.co/videos/preview/mixkit-friends-sitting-on-a-couch-at-home-41312-large.mp4' }}
        rate={1.0}
        volume={0}
        isMuted={true}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.95)']}
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
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-white">Helper Flow</Text>
            <Pressable onPress={() => router.replace('/(helper)')}>
              <Text className="text-[10px] font-black uppercase tracking-[2px] text-red-500">Skip</Text>
            </Pressable>
          </View>
          <View className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <View className="h-full w-2/4 bg-red-600 rounded-full" />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-8">
          {/* Title Section */}
          <View className="mb-8">
            <Text className="text-[42px] font-black text-white leading-[1] tracking-tighter mb-4">
              Real-Time{'\n'}
              <Text className="text-red-600">Peace of Mind.</Text>
            </Text>
            <Text className="text-base text-gray-200 font-medium leading-relaxed">
              Get notified immediately during a crisis.
            </Text>
          </View>

          {/* Visual Phone Mockup Section */}
          <View className="flex-1 items-center justify-center relative py-6">
            <View className="absolute inset-0 bg-red-600/5 rounded-full blur-[100px]" />

            {/* Phone Form Factor */}
            <View className="w-48 h-72 bg-black/60 rounded-[40px] border-[6px] border-white/10 items-center justify-center shadow-2xl overflow-hidden relative">
              <View className="absolute top-0 w-20 h-5 bg-white/10 rounded-b-xl" />

              {/* Mock Notification */}
              <View className="w-[85%] bg-white/10 backdrop-blur-xl p-3 rounded-[24px] border border-white/10">
                <View className="w-8 h-8 bg-red-600 rounded-full items-center justify-center mb-1.5 shadow-lg">
                  <Bell size={16} color="#FFF" />
                </View>
                <View className="h-1.5 w-16 bg-white/20 rounded-full mb-1" />
                <View className="h-1 w-10 bg-white/10 rounded-full" />
              </View>

              {/* Status Icons */}
              <View className="absolute bottom-6 right-5 w-10 h-10 bg-emerald-500/20 rounded-xl items-center justify-center border border-emerald-500/30">
                <Wifi size={20} color="#10B981" />
              </View>
              <View className="absolute top-16 left-5 w-8 h-8 bg-red-600/20 rounded-xl items-center justify-center border border-red-600/30">
                <Heart size={16} color="#EF4444" fill="#EF4444" />
              </View>
            </View>
          </View>

          <Text className="text-base text-gray-400 font-medium leading-relaxed mb-10">
            No more missed calls. Stay connected and receive instant alerts when your loved one needs you most.
          </Text>
        </View>

        {/* Bottom Actions */}
        <View className="px-8 pb-10">
          <Pressable
            onPress={() => router.push('/(onboarding)/helper/actionable-support')}
            className="w-full bg-red-600 py-6 rounded-[24px] shadow-xl shadow-red-900/40 active:scale-[0.98] relative overflow-hidden"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white font-black text-xl tracking-wide">Continue Journey</Text>
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
