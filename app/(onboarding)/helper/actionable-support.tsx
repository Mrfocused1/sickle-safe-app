import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowRight, CheckCircle, AlertTriangle, Phone } from 'lucide-react-native';

export default function ActionableSupportScreen() {
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
        <View className="flex-1 px-6">
          {/* Title */}
          <View className="mb-6">
            <Text className="text-3xl font-bold mb-2 tracking-tight text-gray-900">
              Actionable <Text className="text-violet-600">Support</Text>
            </Text>
            <Text className="text-xl font-medium text-violet-600 mb-4">
              Know Exactly What to Do
            </Text>
            <Text className="text-base text-gray-600 leading-relaxed">
              When an alert is triggered, you'll receive a prioritized list of tasks—from picking up siblings to notifying doctors—so you can focus on providing care.
            </Text>
          </View>

          {/* Task Card Mockup */}
          <View className="flex-1 items-center justify-center py-4">
            <View className="relative w-full max-w-[320px]">
              {/* Background Glows */}
              <View className="absolute -top-4 -right-4 w-24 h-24 bg-violet-200 rounded-full blur-2xl opacity-50" />
              <View className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-30" />

              {/* Card */}
              <View className="relative bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
                {/* Card Header */}
                <View className="bg-violet-100 p-4 flex-row items-center justify-between border-b border-gray-200">
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                    <Text className="text-sm font-bold text-violet-700">Crisis Action Plan</Text>
                  </View>
                  <View className="px-2 py-1 bg-white rounded-md shadow-sm">
                    <Text className="text-xs font-medium text-gray-600">Now</Text>
                  </View>
                </View>

                {/* Tasks */}
                <View className="p-5 space-y-4">
                  {/* Completed Task */}
                  <View className="flex-row items-start opacity-50">
                    <View className="mt-0.5 w-5 h-5 rounded-full bg-green-500 items-center justify-center mr-3">
                      <CheckCircle size={14} color="#ffffff" strokeWidth={3} />
                    </View>
                    <Text className="flex-1 text-sm font-medium text-gray-600 line-through">
                      Acknowledge Alert
                    </Text>
                  </View>

                  {/* Active Task */}
                  <View className="flex-row items-start">
                    <View className="mt-0.5 w-5 h-5 rounded-full border-2 border-violet-600 items-center justify-center mr-3">
                      <View className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-bold text-gray-900">Call Dr. Richardson</Text>
                      <Text className="text-xs text-gray-600 mt-0.5">Emergency Line: 555-0123</Text>
                    </View>
                  </View>

                  {/* Pending Tasks */}
                  <View className="flex-row items-start">
                    <View className="mt-0.5 w-5 h-5 rounded-full border-2 border-gray-300 mr-3" />
                    <Text className="flex-1 text-sm font-medium text-gray-600">
                      Pick up siblings from school
                    </Text>
                  </View>

                  <View className="flex-row items-start">
                    <View className="mt-0.5 w-5 h-5 rounded-full border-2 border-gray-300 mr-3" />
                    <Text className="flex-1 text-sm font-medium text-gray-600">
                      Prepare hospital bag
                    </Text>
                  </View>
                </View>
              </View>

              {/* Priority Badge */}
              <View className="absolute -right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-xl shadow-lg border border-gray-200">
                <AlertTriangle size={24} color="#8b5cf6" />
              </View>
            </View>
          </View>
        </View>

        {/* Bottom CTA */}
        <View className="px-6 pb-6">
          <Pressable
            onPress={() => router.replace('/(helper)')}
            className="w-full bg-violet-600 py-4 rounded-2xl shadow-lg active:scale-95"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white font-semibold text-lg">Continue</Text>
              <ArrowRight size={20} color="#ffffff" className="ml-2" />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
