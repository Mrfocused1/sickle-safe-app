import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { ArrowRight } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

export default function RedAlertScreen() {
  const router = useRouter();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const pingAnim = useRef(new Animated.Value(1)).current;
  const bounceAnim1 = useRef(new Animated.Value(0)).current;
  const bounceAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation (3s)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ping animation (3s)
    Animated.loop(
      Animated.sequence([
        Animated.timing(pingAnim, {
          toValue: 1.3,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pingAnim, {
          toValue: 1,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Bounce animation for badges
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim1, {
          toValue: -10,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim1, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim2, {
          toValue: -10,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim2, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

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
        colors={['rgba(0,0,0,0.85)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.95)']}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        {/* Logo at Top (Triple Size, No BG) */}
        <View className="items-center mt-2">
          <Image
            source={require('../../../assets/logo.png')}
            style={{ width: width * 0.45, height: 80 }}
            resizeMode="contain"
          />
        </View>

        {/* Step Progress */}
        <View className="px-8 mt-4 mb-10">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[10px] font-black uppercase tracking-[2px] text-white">Step 3 of 4</Text>
            <Pressable onPress={() => router.replace('/(overcomer)')}>
              <Text className="text-[10px] font-black uppercase tracking-[2px] text-red-500">Skip</Text>
            </Pressable>
          </View>
          <View className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <View className="h-full w-3/4 bg-red-600 rounded-full" />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-8 items-center pt-4">
          {/* Title Section */}
          <View className="w-full mb-8">
            <Text className="text-[42px] font-black text-white leading-[1] tracking-tighter mb-4">
              The Red{'\n'}
              <Text className="text-red-600">Alert.</Text>
            </Text>
            <Text className="text-base text-gray-200 font-medium leading-relaxed">
              Instant crisis response system.
            </Text>
          </View>

          {/* Alert Visual Container */}
          <View className="flex-1 w-full items-center justify-center relative mb-12">
            {/* Pulse Rings */}
            <Animated.View
              className="absolute w-56 h-56 bg-red-600/10 rounded-full"
              style={{ transform: [{ scale: pulseAnim }] }}
            />
            <Animated.View
              className="absolute w-56 h-56 border border-red-600/20 rounded-full"
              style={{
                transform: [{ scale: pingAnim }],
                opacity: pingAnim.interpolate({
                  inputRange: [1, 1.3],
                  outputRange: [0.3, 0]
                })
              }}
            />

            {/* Main SOS Button Visual */}
            <View className="w-44 h-44 rounded-full bg-red-600 shadow-2xl items-center justify-center border-8 border-red-900/30">
              <Text className="text-white font-black text-5xl">SOS</Text>
            </View>

            {/* Floating Indicators */}
            <Animated.View
              className="absolute top-12 right-0 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-xl"
              style={{ transform: [{ translateY: bounceAnim1 }] }}
            >
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="near-me" size={16} color="#3B82F6" />
                <Text className="text-white font-bold text-[10px] uppercase">Location Active</Text>
              </View>
            </Animated.View>

            <Animated.View
              className="absolute bottom-12 left-0 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-xl"
              style={{ transform: [{ translateY: bounceAnim2 }] }}
            >
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="medical-services" size={16} color="#10B981" />
                <Text className="text-white font-bold text-[10px] uppercase">Medical ID Linked</Text>
              </View>
            </Animated.View>
          </View>

          <Text className="text-base text-gray-400 font-medium leading-relaxed text-center px-4 mb-8">
            In an emergency, one tap instantly notifies your <Text className="text-white font-bold">Circle of Care</Text> with your live location and medical profile.
          </Text>
        </View>

        {/* Bottom Actions */}
        <View className="px-8 pb-10">
          <Pressable
            onPress={() => router.replace('/(overcomer)')}
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
