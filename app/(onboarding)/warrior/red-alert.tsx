import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';

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

    // Bounce animation for badges (3s and 4s)
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
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Progress Bar */}
        <View className="px-7 mt-4 mb-2">
          <View className="h-1.5 w-full bg-gray-300 rounded-full overflow-hidden">
            <View className="h-full w-3/4 bg-violet-600 rounded-full" style={{ backgroundColor: '#8B5CF6' }} />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 items-center px-7 pt-8">
          {/* Badge */}
          <View className="mb-3">
            <View className="bg-red-50 py-1.5 px-4 rounded-full border border-red-200">
              <Text className="text-red-600 font-bold tracking-widest text-xs uppercase" style={{ color: '#EF4444' }}>
                Instant Alert System
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-4xl font-bold mb-2 tracking-tight text-gray-900 text-center">
            The <Text className="text-red-500" style={{ color: '#EF4444' }}>Red Alert</Text>
          </Text>

          {/* Alert Button Visual */}
          <View className="flex-1 w-full items-center justify-center relative my-4">
            {/* Background Glow */}
            <View className="absolute w-64 h-64 bg-red-500 rounded-full opacity-20" style={{ backgroundColor: '#EF4444' }} />

            {/* Pulse Ring */}
            <Animated.View
              className="absolute w-48 h-48 bg-red-100 rounded-full"
              style={{
                transform: [{ scale: pulseAnim }],
                backgroundColor: 'rgba(239, 68, 68, 0.1)'
              }}
            />

            {/* Ping Ring */}
            <Animated.View
              className="absolute w-48 h-48 border border-red-300 rounded-full"
              style={{
                transform: [{ scale: pingAnim }],
                opacity: pingAnim.interpolate({
                  inputRange: [1, 1.3],
                  outputRange: [0.3, 0]
                }),
                borderColor: 'rgba(239, 68, 68, 0.3)'
              }}
            />

            {/* Main Button */}
            <View className="relative w-40 h-40 rounded-full shadow-2xl items-center justify-center overflow-hidden">
              <LinearGradient
                colors={['#EF4444', '#991B1B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="absolute inset-0"
              />
              <View className="absolute inset-0 border-[6px] rounded-full" style={{ borderColor: '#7F1D1D' }} />
              <Text className="text-white text-6xl font-bold">SOS</Text>
            </View>

            {/* Floating Info Cards */}
            <Animated.View
              className="absolute bg-white p-2 rounded-xl border border-gray-200 shadow-lg flex-row items-center"
              style={{
                top: '10%',
                right: '10%',
                transform: [{ translateY: bounceAnim1 }]
              }}
            >
              <MaterialIcons name="near-me" size={18} color="#3B82F6" />
              <Text className="text-[10px] font-medium text-gray-600 ml-2">Location Sent</Text>
            </Animated.View>

            <Animated.View
              className="absolute bg-white p-2 rounded-xl border border-gray-200 shadow-lg flex-row items-center"
              style={{
                bottom: '10%',
                left: '5%',
                transform: [{ translateY: bounceAnim2 }]
              }}
            >
              <MaterialIcons name="medical-services" size={18} color="#10B981" />
              <Text className="text-[10px] font-medium text-gray-600 ml-2">Medical ID</Text>
            </Animated.View>
          </View>

          {/* Description */}
          <View className="mb-6 max-w-[90%]">
            <Text className="text-lg text-gray-600 text-center leading-relaxed">
              In an emergency, calling <Text className="text-gray-900 font-medium">999/911</Text> or tapping the{' '}
              <Text className="text-red-500 font-bold" style={{ color: '#EF4444' }}>Crisis Button</Text> instantly notifies your{' '}
              <Text className="text-violet-600 font-medium" style={{ color: '#8B5CF6' }}>'Circle of Care'</Text> with your location and medical ID.
            </Text>
          </View>
        </View>

        {/* Bottom CTA */}
        <View className="px-7 pb-8 mt-auto">
          <Pressable
            onPress={() => router.replace('/(warrior)')}
            className="w-full py-4 rounded-2xl shadow-lg active:scale-95 mb-4 overflow-hidden"
            style={{ backgroundColor: '#8B5CF6' }}
          >
            <View className="flex-row items-center justify-center gap-2">
              <Text className="text-white font-bold text-lg">Set Up Alerts</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#ffffff" />
            </View>
          </Pressable>
          <Text className="text-center text-xs text-gray-500">
            You can configure your emergency contacts in the next step.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
