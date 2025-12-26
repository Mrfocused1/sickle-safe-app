import React from 'react';
import { View, Text, Pressable, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Hospital, ShieldCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

export default function SafetyNetScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

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
        colors={['rgba(255,255,255,0.7)', 'rgba(255,255,255,0.3)', 'rgba(255,255,255,0.95)']}
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
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-gray-500">Step 2 of 4</Text>
            <Pressable onPress={() => router.push('/(onboarding)/overcomer/red-alert')}>
              <Text className="text-[10px] font-black uppercase tracking-[2px] text-red-500">Skip</Text>
            </Pressable>
          </View>
          <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full w-2/4 bg-red-600 rounded-full" />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-8 items-center">
          {/* Title Section */}
          <View className="w-full mb-8">
            <Text className="text-[42px] font-black text-gray-900 leading-[1] tracking-tighter mb-2">
              The Safety{'\n'}
              <Text className="text-red-600">Net.</Text>
            </Text>
            <Text className="text-base text-gray-700 font-bold leading-relaxed">
              Your crisis protocol, defined.
            </Text>
          </View>

          {/* Icon Group */}
          <View className="relative w-64 h-64 items-center justify-center mb-12">
            <View className="absolute inset-0 bg-red-100/50 rounded-full blur-[80px]" />
            <View className="w-48 h-48 bg-white/80 rounded-[50px] border border-gray-100 items-center justify-center shadow-2xl">
              <Hospital size={80} color="#EF4444" strokeWidth={1.5} />
            </View>

            {/* Floating Elements */}
            <View className="absolute -top-4 right-4 bg-red-600 px-3 py-1.5 rounded-2xl shadow-xl shadow-red-900/40 rotate-12">
              <Text className="text-white font-black text-[10px] uppercase tracking-widest">Crisis</Text>
            </View>
            <View className="absolute -bottom-2 -left-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-xl -rotate-6">
              <ShieldCheck size={24} color="#10B981" />
            </View>
          </View>

          <Text className="text-base text-gray-700 font-bold leading-relaxed text-center px-4">
            Pre-set your emergency instructions. If a crisis hits, your helpers won't have to guess—they'll know exactly where to go.
          </Text>
        </View>

        {/* Bottom Actions */}
        <View className="px-8 pb-10">
          <Pressable
            onPress={() => router.push('/(onboarding)/overcomer/red-alert')}
            className="w-full bg-red-600 py-6 rounded-[24px] shadow-xl shadow-red-900/20 active:scale-[0.98] relative overflow-hidden"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white font-black text-xl tracking-wide">Build My Protocol</Text>
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
