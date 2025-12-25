import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Hospital, ShieldCheck } from 'lucide-react-native';

export default function SafetyNetScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <SafeAreaView className="flex-1">
        {/* Progress Bar */}
        <View className="px-6 mb-6">
          <View className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full w-2/4 bg-violet-600 rounded-full" />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 items-center px-6">
          {/* Icon Section */}
          <View className="w-full items-center justify-center mt-4 mb-8">
            <View className="relative w-64 h-64 bg-violet-100 rounded-full items-center justify-center">
              <View className="absolute inset-0 bg-violet-200 rounded-full blur-2xl opacity-50" />
              <Hospital size={144} color="#8b5cf6" className="relative" />

              {/* Floating Icons */}
              <View className="absolute top-4 right-8 bg-white p-2 rounded-xl shadow-lg border border-gray-100">
                <View className="w-6 h-6 bg-red-500 rounded items-center justify-center">
                  <Text className="text-white text-xs font-bold">!</Text>
                </View>
              </View>
              <View className="absolute bottom-6 left-6 bg-white p-2 rounded-xl shadow-lg border border-gray-100">
                <Hospital size={24} color="#3b82f6" />
              </View>
            </View>
          </View>

          {/* Text Content */}
          <View className="mb-4">
            <Text className="text-3xl font-bold mb-2 tracking-tight text-gray-900 text-center">
              The <Text className="text-violet-600">Safety Net</Text>
            </Text>
            <Text className="text-xl font-semibold text-gray-600 text-center mb-6">
              Your Crisis Protocol
            </Text>
            <Text className="text-lg text-gray-600 leading-relaxed text-center">
              Pre-set your emergency instructions. If a crisis hits, your helpers won't have to guess—they'll know exactly which hospital you prefer and what your immediate needs are.
            </Text>
          </View>

          {/* Info Card */}
          <View className="w-full bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-6 mt-2">
            <View className="flex-row items-start">
              <View className="p-2 bg-green-100 rounded-lg mr-4">
                <ShieldCheck size={20} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-sm mb-1 text-gray-900">
                  Proactive Care
                </Text>
                <Text className="text-xs text-gray-600">
                  Crisis plans are shared automatically when you trigger an alert.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Actions */}
        <View className="px-6 pb-6">
          <Pressable
            onPress={() => router.push('/(onboarding)/warrior/red-alert')}
            className="w-full bg-violet-600 py-4 rounded-2xl shadow-lg active:scale-95 mb-4"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white font-semibold text-lg">Set Up My Net</Text>
              <ArrowRight size={20} color="#ffffff" className="ml-2" />
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(onboarding)/warrior/red-alert')}
            className="w-full py-2"
          >
            <Text className="text-violet-600 font-medium text-sm text-center">
              Skip for now
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
