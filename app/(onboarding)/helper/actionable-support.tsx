import React from 'react';
import { View, Text, Pressable, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

export default function ActionableSupportScreen() {
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
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-white">Step 2 of 2</Text>
            <Pressable onPress={() => router.replace('/(helper)')}>
              <Text className="text-[10px] font-black uppercase tracking-[2px] text-red-500">Skip</Text>
            </Pressable>
          </View>
          <View className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <View className="h-full w-full bg-red-600 rounded-full" />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-8">
          {/* Title Section */}
          <View className="mb-6">
            <Text className="text-[42px] font-black text-white leading-[1] tracking-tighter mb-4">
              Actionable{'\n'}
              <Text className="text-red-600">Support.</Text>
            </Text>
            <Text className="text-base text-gray-200 font-medium leading-relaxed">
              Know exactly what to do during a crisis.
            </Text>
          </View>

          {/* Task Checklist Mockup */}
          <View className="flex-1 py-4 justify-center">
            <View className="bg-black/60 rounded-[40px] border border-white/10 p-6 shadow-2xl relative">
              <View className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full -mr-8 -mt-8" />

              <View className="flex-row items-center mb-6">
                <View className="px-3 py-1.5 bg-red-600 rounded-xl">
                  <Text className="text-white font-black text-[10px] uppercase">Active Plan</Text>
                </View>
              </View>

              <View className="space-y-4">
                <View className="flex-row items-center p-4 rounded-[24px] bg-white/5 border border-white/5 opacity-40">
                  <View className="w-6 h-6 rounded-lg bg-emerald-500 items-center justify-center mr-4">
                    <CheckCircle size={14} color="#FFF" />
                  </View>
                  <View className="h-2 w-32 bg-white/20 rounded-full" />
                </View>

                <View className="flex-row items-center p-4 rounded-[24px] bg-white/10 border border-red-600/30">
                  <View className="w-6 h-6 rounded-lg bg-red-600 items-center justify-center mr-4">
                    <AlertTriangle size={14} color="#FFF" />
                  </View>
                  <View className="flex-1">
                    <View className="h-2 w-24 bg-white/40 rounded-full mb-2" />
                    <View className="h-1.5 w-16 bg-white/20 rounded-full" />
                  </View>
                </View>

                <View className="flex-row items-center p-4 rounded-[24px] bg-white/5 border border-white/5">
                  <View className="w-6 h-6 rounded-lg border-2 border-white/10 mr-4" />
                  <View className="h-2 w-36 bg-white/20 rounded-full" />
                </View>
              </View>
            </View>
          </View>

          <Text className="text-base text-gray-400 font-medium leading-relaxed mb-10">
            When an alert is triggered, you'll receive a prioritized list of tasks so you can focus on providing care without hesitation.
          </Text>
        </View>

        {/* Bottom Actions */}
        <View className="px-8 pb-10">
          <Pressable
            onPress={() => router.replace('/(helper)')}
            className="w-full bg-red-600 py-6 rounded-[24px] shadow-xl shadow-red-900/40 active:scale-[0.98] relative overflow-hidden"
          >
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
