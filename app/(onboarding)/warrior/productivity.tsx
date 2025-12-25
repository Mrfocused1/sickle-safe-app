import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, Calendar, Droplet, Activity, CheckSquare } from 'lucide-react-native';

export default function ProductivityFirstScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <SafeAreaView className="flex-1">
        {/* Progress Header */}
        <View className="px-6 mb-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Step 1 of 4
            </Text>
            <Pressable onPress={() => router.push('/(warrior)')}>
              <Text className="text-sm font-semibold text-violet-600">Skip</Text>
            </Pressable>
          </View>
          <View className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full w-1/4 bg-violet-600 rounded-full" />
          </View>
        </View>

        {/* Content */}
        <View className="flex-1 px-6">
          {/* Title */}
          <View className="mt-4 mb-6">
            <Text className="text-4xl font-extrabold tracking-tight text-gray-900">
              Productivity <Text className="text-violet-600">First</Text>
            </Text>
            <Text className="text-xl font-medium text-gray-600 mt-2">
              Manage Your Day
            </Text>
          </View>

          {/* Mockup Card */}
          <View className="flex-1 items-center justify-center py-4">
            <View className="w-full border border-gray-200 rounded-lg shadow-md bg-white p-4">
              {/* Card Header */}
              <View className="flex-row justify-between items-center pb-3 border-b border-gray-200 mb-4">
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-md bg-gray-100 items-center justify-center border border-gray-200 mr-3">
                    <Calendar size={16} color="#6b7280" />
                  </View>
                  <View>
                    <View className="h-3 w-20 bg-gray-200 rounded mb-1" />
                    <View className="h-2 w-14 bg-gray-100 rounded" />
                  </View>
                </View>
                <View className="h-7 w-7 rounded-md bg-violet-100 items-center justify-center border border-violet-200">
                  <View className="w-3 h-3 rounded-full bg-violet-600" />
                </View>
              </View>

              {/* Wellness Cards */}
              <View className="flex-row mb-4 space-x-4">
                <View className="flex-1 bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Droplet size={20} color="#3b82f6" />
                  <View className="h-3 w-16 bg-blue-200 rounded mt-2" />
                  <View className="h-2 w-10 bg-blue-100 rounded mt-1" />
                </View>
                <View className="flex-1 bg-rose-50 p-4 rounded-lg border border-rose-200">
                  <Activity size={20} color="#f43f5e" />
                  <View className="h-3 w-16 bg-rose-200 rounded mt-2" />
                  <View className="h-2 w-10 bg-rose-100 rounded mt-1" />
                </View>
              </View>

              {/* Task List */}
              <View className="space-y-3">
                <View className="flex-row items-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <View className="w-5 h-5 rounded-sm border-2 border-violet-600 bg-violet-600 mr-3" />
                  <View className="h-3 w-36 bg-gray-200 rounded" />
                </View>
                <View className="flex-row items-center p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <View className="w-5 h-5 rounded-sm border-2 border-gray-300 mr-3" />
                  <View className="h-3 w-28 bg-gray-200 rounded" />
                </View>
              </View>

              {/* Check Badge */}
              <View className="absolute -right-3 top-8 bg-emerald-500 p-3 rounded-lg shadow-md border-4 border-white transform rotate-6">
                <CheckSquare size={20} color="#ffffff" strokeWidth={3} />
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="text-lg text-gray-600 leading-relaxed">
              Organize your daily life and health needs in one place. Track your hydration, log your pain levels, and keep your to-do list updated so you're always in control.
            </Text>
          </View>

          {/* CTA Button */}
          <View className="mb-6">
            <Pressable
              onPress={() => router.push('/(onboarding)/warrior/safety-net')}
              className="w-full bg-violet-600 py-4 rounded-lg shadow-md active:scale-95"
            >
              <View className="flex-row items-center justify-center">
                <Text className="text-white font-semibold text-lg">Continue</Text>
                <ArrowRight size={20} color="#ffffff" className="ml-2" />
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
