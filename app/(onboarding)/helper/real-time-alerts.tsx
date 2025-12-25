import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Zap, Bell, Wifi, Heart } from 'lucide-react-native';

export default function RealTimeAlertsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <SafeAreaView className="flex-1">
        {/* Progress Dots */}
        <View className="px-8 mb-2">
          <View className="flex-row space-x-2">
            <View className="h-1.5 w-8 bg-violet-600 rounded-full" />
            <View className="h-1.5 w-8 bg-gray-200 rounded-full" />
            <View className="h-1.5 w-8 bg-gray-200 rounded-full" />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-8">
          {/* Visual Section */}
          <View className="flex-1 items-center justify-center relative py-8">
            {/* Gradient Background */}
            <LinearGradient
              colors={['rgba(139, 92, 246, 0.1)', 'transparent']}
              className="absolute inset-0 rounded-full"
            />

            {/* Phone Mockup */}
            <View className="relative w-64 h-64 items-center justify-center">
              {/* Outer Circles */}
              <View className="absolute w-64 h-64 rounded-full border border-violet-200" />
              <View className="absolute w-52 h-52 rounded-full border border-violet-300" />

              {/* Phone Card */}
              <View className="relative w-28 h-48 bg-white rounded-3xl border-4 border-gray-100 shadow-xl overflow-hidden">
                {/* Phone Header */}
                <View className="w-full h-6 bg-gray-100 border-b border-gray-200" />

                {/* Notification */}
                <View className="mx-2 mt-2 bg-violet-100 rounded-xl p-2 border border-violet-200">
                  <View className="w-8 h-8 bg-violet-600 rounded-full items-center justify-center shadow-lg mb-1">
                    <Bell size={16} color="#ffffff" />
                  </View>
                  <View className="h-1.5 w-12 bg-violet-200 rounded-full mb-1" />
                  <View className="h-1.5 w-8 bg-violet-200 rounded-full" />
                </View>

                {/* Check Badge */}
                <View className="absolute bottom-4 right-4 bg-green-500 rounded-full p-1 border-2 border-white shadow-sm">
                  <Text className="text-white text-[10px] font-bold">✓</Text>
                </View>
              </View>

              {/* Floating Icons */}
              <View className="absolute top-10 right-4 w-12 h-12 bg-white rounded-2xl shadow-lg border border-gray-100 items-center justify-center">
                <Wifi size={24} color="#10b981" />
              </View>
              <View className="absolute bottom-12 left-2 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-100 items-center justify-center">
                <Heart size={20} color="#ec4899" />
              </View>
            </View>
          </View>

          {/* Text Content */}
          <View className="mb-8">
            <View className="flex-row items-center mb-6 bg-violet-100 border border-violet-200 self-start px-3 py-1 rounded-full">
              <Zap size={14} color="#8b5cf6" />
              <Text className="text-xs font-bold tracking-wide uppercase text-violet-600 ml-2">
                Stay Connected
              </Text>
            </View>

            <Text className="text-4xl font-bold mb-4 tracking-tight text-gray-900 leading-tight">
              Real-Time{'\n'}
              <Text className="text-violet-600">Peace of Mind</Text>
            </Text>

            <Text className="text-lg text-gray-600 leading-relaxed">
              Get notified immediately when your loved one triggers an alert. No more missed calls during a crisis.
            </Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="px-8 pb-8">
          <Pressable
            onPress={() => router.push('/(onboarding)/helper/actionable-support')}
            className="w-full bg-violet-600 py-4 rounded-2xl shadow-lg active:scale-95 mb-6"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white font-semibold text-lg">Continue</Text>
              <ArrowRight size={20} color="#ffffff" className="ml-3" />
            </View>
          </Pressable>

          <Pressable onPress={() => router.push('/(warrior)')}>
            <Text className="text-sm font-medium text-gray-600 text-center">
              Skip onboarding
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
