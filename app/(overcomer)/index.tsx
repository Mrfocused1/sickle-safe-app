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
import AddCarePlanModal from '../../components/AddCarePlanModal';
import AppBottomSheet from '../../components/AppBottomSheet';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const [isAddCarePlanVisible, setIsAddCarePlanVisible] = React.useState(false); // Force reload
  const [activeTask, setActiveTask] = React.useState<{ title: string; description: string; priority: string } | null>(null);
  const [showWellnessSummary, setShowWellnessSummary] = React.useState(false);

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

  const TaskItem = ({ title, description, priority }: { title: string; description: string; priority: string }) => {
    const borderColor = priority === 'critical' ? '#ef4444' : priority === 'needs_help' ? '#f59e0b' : '#10b981';
    const bgColor = priority === 'critical' ? '#fee2e2' : priority === 'needs_help' ? '#fef3c7' : '#d1fae5';
    const textColor = priority === 'critical' ? '#b91c1c' : priority === 'needs_help' ? '#92400e' : '#065f46';

    return (
      <Pressable
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          setActiveTask({ title, description, priority });
        }}
        className="bg-white rounded-[24px] p-5 border-l-[6px] shadow-sm mb-4 active:bg-gray-50 active:scale-[0.98] border-gray-100"
        style={{ borderLeftColor: borderColor }}
      >
        <View className="flex-row items-start">
          <View className="mt-1 mr-3">
            <View className="w-5 h-5 rounded border-2 border-gray-300" />
          </View>
          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-1">
              <Text className="text-base font-medium text-gray-900 flex-1">{title}</Text>
              <View className="px-2 py-1 rounded" style={{ backgroundColor: bgColor }}>
                <Text className="text-[10px] font-bold uppercase tracking-wide" style={{ color: textColor }}>
                  {priority.replace('_', ' ')}
                </Text>
              </View>
            </View>
            <Text className="text-xs text-gray-500" numberOfLines={1}>
              {description}
            </Text>
          </View>
        </View>
      </Pressable>
    );
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

              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setShowWellnessSummary(true);
                }}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 active:bg-gray-50 active:scale-[0.99]"
              >
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
                <View className="flex-row gap-3">
                  <Pressable className="flex-1 flex-row items-center px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-2xl active:bg-blue-100">
                    <View className="w-8 h-8 bg-blue-100 rounded-xl items-center justify-center mr-2">
                      <MaterialIcons name="water-drop" size={16} color="#2563eb" />
                    </View>
                    <Text className="text-sm font-bold text-blue-700">Water</Text>
                  </Pressable>
                  <Pressable className="flex-1 flex-row items-center px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl active:bg-purple-100">
                    <View className="w-8 h-8 bg-purple-100 rounded-xl items-center justify-center mr-2">
                      <MaterialIcons name="medication" size={16} color="#7c3aed" />
                    </View>
                    <Text className="text-sm font-bold text-purple-700">Meds</Text>
                  </Pressable>
                  <Pressable className="flex-1 flex-row items-center px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl opacity-50">
                    <View className="w-8 h-8 bg-white rounded-xl items-center justify-center mr-2">
                      <MaterialIcons name="mood" size={16} color="#6b7280" />
                    </View>
                    <Text className="text-sm font-bold text-gray-500">Mood</Text>
                  </Pressable>
                </View>
              </Pressable>
            </View>

            {/* Care Plan */}
            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-semibold text-gray-900">Care Plan</Text>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setIsAddCarePlanVisible(true);
                  }}
                  hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                >
                  <MaterialIcons name="add-circle-outline" size={24} color="#6b7280" />
                </Pressable>
              </View>

              {/* Task Items */}
              <View>
                <TaskItem
                  title="Emergency Bag Check"
                  description="Ensure hospital bag has updated insurance card and warm clothes."
                  priority="critical"
                />
                <TaskItem
                  title="Prescription Refill"
                  description="Hydroxyurea supply running low."
                  priority="needs_help"
                />
                <TaskItem
                  title="Evening Walk"
                  description="Light 15 min walk if pain level is below 4."
                  priority="personal"
                />
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>

        <AddCarePlanModal
          visible={isAddCarePlanVisible}
          onClose={() => setIsAddCarePlanVisible(false)}
          onAdd={(task) => {
            console.log('New Task:', task);
            // Here you would typically update the state or call an API
            alert(`New Task Added: ${task.title}`);
          }}
        />

        <AppBottomSheet
          visible={activeTask !== null}
          onClose={() => setActiveTask(null)}
          type="task"
          task={activeTask || undefined}
        />

        <AppBottomSheet
          visible={showWellnessSummary}
          onClose={() => setShowWellnessSummary(false)}
          type="wellness_summary"
        />
      </View>
    </GestureHandlerRootView >
  );
}
