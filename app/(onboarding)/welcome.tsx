import React from 'react';
import { View, Text, Pressable, Dimensions, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Heart } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Video Background - Brighter & Clearer */}
      <Video
        source={{ uri: 'https://assets.mixkit.co/videos/preview/mixkit-diverse-group-of-friends-cuddling-and-laughing-together-41315-large.mp4' }}
        rate={1.0}
        volume={0}
        isMuted={true}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />

      {/* Very Subtle Light Overlay for "Happy" vibe */}
      <LinearGradient
        colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0.05)', 'rgba(255,255,255,0.6)']}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1 px-8 py-8 justify-between">
        {/* Top Section - Logo (Tripled Size, No BG) */}
        <View className="items-center mt-6">
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: width * 0.8, height: 160 }}
            resizeMode="contain"
          />
        </View>

        {/* Hero Section */}
        <View className="mb-4">
          <View className="relative">
            <Text className="text-[54px] font-black text-gray-900 leading-[0.9] tracking-tighter mb-6">
              Live{'\n'}
              <Text className="text-red-600">With{'\n'}</Text>
              Confidence.
            </Text>
          </View>
          <Text className="text-lg text-gray-700 font-bold leading-relaxed max-w-[280px]">
            Your premium companion for daily wellness and instant emergency response.
          </Text>
        </View>

        {/* Action Section */}
        <View className="w-full">
          <View className="flex-row items-center gap-2 mb-8">
            <Heart size={16} color="#EF4444" fill="#EF4444" />
            <Text className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Designed for the Community</Text>
          </View>

          <View className="space-y-4">
            <Link href="/(onboarding)/community" asChild>
              <Pressable className="w-full bg-red-600 py-6 rounded-[24px] shadow-xl shadow-red-900/20 active:scale-[0.98] relative overflow-hidden">
                <View className="flex-row items-center justify-center">
                  <Text className="text-white font-black text-xl tracking-wide">Continue Journey</Text>
                  <View className="ml-3 bg-white/20 p-1.5 rounded-full">
                    <ArrowRight size={24} color="#ffffff" />
                  </View>
                </View>
              </Pressable>
            </Link>

            <View className="items-center pt-2">
              <Text className="text-gray-600 font-bold text-sm">
                Existing account? <Text className="text-gray-900 underline font-black">Log in</Text>
              </Text>
            </View>
          </View>

          {/* Custom Progress Indicator */}
          <View className="flex-row gap-1.5 mt-10 justify-center">
            <View className="w-8 h-2.5 rounded-full bg-red-600" />
            <View className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <View className="w-2.5 h-2.5 rounded-full bg-gray-300" />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
