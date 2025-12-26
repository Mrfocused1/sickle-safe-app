import React from 'react';
import { View, Text, Pressable, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();

  // Slider Logic
  const translateX = useSharedValue(0);
  const isActivated = useSharedValue(false);
  const SLIDER_WIDTH = (SCREEN_WIDTH - 48) * 0.92;
  const KNOB_WIDTH = 48;
  const MAX_TRANSLATION = SLIDER_WIDTH - KNOB_WIDTH - 16; // 16 is px-2 * 8

  const onTrigger = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    alert('Crisis Alert Triggered! Emergency contacts notified.');
    translateX.value = withTiming(0);
  };

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      if (!isActivated.value) {
        translateX.value = Math.max(0, Math.min(event.translationX, MAX_TRANSLATION));
      }
    })
    .onEnd(() => {
      if (translateX.value > MAX_TRANSLATION * 0.8) {
        translateX.value = withSpring(MAX_TRANSLATION);
        runOnJS(onTrigger)();
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedKnobStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [0, MAX_TRANSLATION * 0.5], [1, 0]),
  }));

  const handleCrisisSlideStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View className="flex-1 bg-gray-100">
        <StatusBar style="dark" />

        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="px-6 pb-4 pt-2">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-sm text-gray-500">Good Morning,</Text>
                <Text className="text-2xl font-bold tracking-tight text-gray-900">Maya</Text>
              </View>
              <Pressable
                onPress={() => router.push('/profile')}
                className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden shadow-sm active:scale-95"
              >
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCORMa38YShjxWXHcbH-MfY1UZF9LvIjHefqm4MnmpLYEROxwh8VpTJetiR_BPF_Kt4A676WuCNDwR6TmAHY5CN6SnaFzheHF0M5FtIlw80jCm2wH4NOcOa-IqaDBuomapbokmokeLN4wPVLAKg_jiKNzkeDzcjGH0r2qvVI1wF9rSlEq-KXsGO67Ujocu1a-guDc9qfSpuY_B_7PiQhy4P-zUFKocITqdWQuKu6QB8e9zr2Z-7vDyE00NRn5JxUXrBpBU36ttjbSZi' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </Pressable>
            </View>
          </View>

          <ScrollView className="flex-1 px-6 pb-24" showsVerticalScrollIndicator={false}>
            {/* Crisis Alert Card */}
            <View className="mb-8 mt-2">
              <View className="overflow-hidden rounded-2xl shadow-lg">
                <LinearGradient
                  colors={['#dc2626', '#991b1b']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="p-6"
                >
                  {/* Pattern Overlay */}
                  <View className="absolute inset-0 opacity-10 bg-white/10" />

                  <View className="relative items-center py-4">
                    {/* Icon */}
                    <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center mb-6">
                      <MaterialIcons name="medical-services" size={44} color="#ffffff" />
                    </View>

                    <Text className="text-2xl font-bold text-white mb-1">Crisis Alert</Text>
                    <Text className="text-red-100/80 text-sm font-medium mb-8 text-center px-6 leading-5">
                      Slide the button below to notify emergency contacts
                    </Text>

                    {/* Slide Track */}
                    <View
                      style={{ width: SLIDER_WIDTH }}
                      className="h-16 bg-red-950/40 rounded-3xl flex-row items-center px-2 mt-2 mb-2 overflow-hidden"
                    >
                      <GestureDetector gesture={gesture}>
                        <Animated.View
                          style={[animatedKnobStyle]}
                          className="h-12 w-12 bg-white rounded-full shadow-lg items-center justify-center z-10"
                        >
                          <MaterialIcons name="chevron-right" size={24} color="#dc2626" />
                        </Animated.View>
                      </GestureDetector>
                      <Animated.View
                        style={[animatedTextStyle, { width: SLIDER_WIDTH }]}
                        className="absolute inset-0 items-center justify-center"
                      >
                        <Text className="text-white text-sm font-bold ml-12">
                          Slide to Trigger
                        </Text>
                      </Animated.View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* Daily Wellness */}
            <View className="mb-8">
              <View className="flex-row justify-between items-end mb-3">
                <Text className="text-lg font-semibold text-gray-900">Daily Wellness</Text>
                <Text className="text-sm font-medium text-blue-600">3/5 tasks</Text>
              </View>

              <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                {/* Progress Circle */}
                <View className="flex-row items-center mb-4">
                  <View className="relative w-16 h-16 mr-4">
                    <View className="absolute inset-0 rounded-full border-4 border-gray-200" />
                    <View
                      className="absolute inset-0 rounded-full border-4 border-blue-500 border-r-transparent border-b-transparent"
                      style={{ transform: [{ rotate: '45deg' }] }}
                    />
                    <View className="absolute inset-0 items-center justify-center">
                      <Text className="text-xs font-bold text-gray-900">60%</Text>
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm text-gray-600 mb-1">
                      Keep hydrated and track your pain levels regularly.
                    </Text>
                    <Pressable>
                      <Text className="text-sm font-semibold text-blue-600">View Details</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Quick Actions */}
                <View className="flex-row">
                  <Pressable className="flex-row items-center px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg mr-2">
                    <MaterialIcons name="water-drop" size={16} color="#2563eb" />
                    <Text className="ml-2 text-sm font-medium text-blue-700">Water</Text>
                  </Pressable>
                  <Pressable className="flex-row items-center px-3 py-2 bg-purple-50 border border-purple-100 rounded-lg mr-2">
                    <MaterialIcons name="medication" size={16} color="#7c3aed" />
                    <Text className="ml-2 text-sm font-medium text-purple-700">Meds</Text>
                  </Pressable>
                  <Pressable className="flex-row items-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg opacity-50">
                    <MaterialIcons name="mood" size={16} color="#6b7280" />
                    <Text className="ml-2 text-sm font-medium text-gray-500">Mood</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Care Plan */}
            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-semibold text-gray-900">Care Plan</Text>
                <Pressable>
                  <MaterialIcons name="add-circle-outline" size={24} color="#6b7280" />
                </Pressable>
              </View>

              {/* Task Items */}
              <View>
                {/* Critical Task */}
                <View className="bg-white rounded-xl p-4 border-l-4 border-l-red-500 shadow-sm mb-3">
                  <View className="flex-row items-start">
                    <View className="mt-1 mr-3">
                      <View className="w-5 h-5 rounded border-2 border-gray-300" />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-base font-medium text-gray-900 flex-1">
                          Emergency Bag Check
                        </Text>
                        <View className="px-2 py-1 rounded bg-red-100 ml-2">
                          <Text className="text-[10px] font-bold uppercase tracking-wide text-red-700">
                            Critical
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs text-gray-500">
                        Ensure hospital bag has updated insurance card and warm clothes.
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Needs Help Task */}
                <View className="bg-white rounded-xl p-4 border-l-4 border-l-amber-500 shadow-sm mb-3">
                  <View className="flex-row items-start">
                    <View className="mt-1 mr-3">
                      <View className="w-5 h-5 rounded border-2 border-gray-300" />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-base font-medium text-gray-900 flex-1">
                          Prescription Refill
                        </Text>
                        <View className="px-2 py-1 rounded bg-amber-100 ml-2">
                          <Text className="text-[10px] font-bold uppercase tracking-wide text-amber-700">
                            Needs Help
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs text-gray-500">
                        Hydroxyurea supply running low.
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Personal Task */}
                <View className="bg-white rounded-xl p-4 border-l-4 border-l-emerald-500 shadow-sm">
                  <View className="flex-row items-start">
                    <View className="mt-1 mr-3">
                      <View className="w-5 h-5 rounded border-2 border-gray-300" />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row justify-between items-start mb-1">
                        <Text className="text-base font-medium text-gray-900 flex-1">
                          Evening Walk
                        </Text>
                        <View className="px-2 py-1 rounded bg-emerald-100 ml-2">
                          <Text className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                            Personal
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs text-gray-500">
                        Light 15 min walk if pain level is below 4.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </GestureHandlerRootView >
  );
}
