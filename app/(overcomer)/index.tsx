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
  Extrapolate,
  useAnimatedReaction,
  MeasuredDimensions,
  measure,
  useAnimatedRef,
  Layout,
  FadeIn,
  FadeOut,
  SequencedTransition
} from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import AddCarePlanModal from '../../components/AddCarePlanModal';
import AppBottomSheet from '../../components/AppBottomSheet';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const [isAddCarePlanVisible, setIsAddCarePlanVisible] = React.useState(false); // Force reload
  const [activeTask, setActiveTask] = React.useState<any>(null);
  const [activeType, setActiveType] = React.useState<any>('task');
  const [showWellnessSummary, setShowWellnessSummary] = React.useState(false);
  const [tasks, setTasks] = React.useState([
    {
      id: '1',
      title: "Emergency Bag Check",
      description: "Ensure hospital bag has updated insurance card and warm clothes.",
      priority: "critical",
      assignedTo: "Marcus",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      comments: [
        { author: 'Marcus', text: 'Just checked, we need more warm socks.', time: '2h ago' },
        { author: 'Maya', text: 'I added some to the laundry pile.', time: '1h ago' }
      ]
    },
    {
      id: '2',
      title: "Prescription Refill",
      description: "Hydroxyurea supply running low.",
      priority: "needs_help",
      assignedTo: "Sarah",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
      comments: [
        { author: 'Sarah', text: 'I can pick this up tomorrow after work.', time: '3h ago' }
      ]
    },
    {
      id: '3',
      title: "Evening Walk",
      description: "Light 15 min walk if pain level is below 4.",
      priority: "personal"
    }
  ]);

  const handleAddTask = (newTask: { title: string, description: string, priority: string }) => {
    const taskWithId = {
      ...newTask,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTasks(prev => [taskWithId, ...prev]);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  };

  const handleOrderChange = (from: number, to: number) => {
    const newTo = Math.max(0, Math.min(to, tasks.length - 1));
    if (from === newTo) return;

    setTasks(prev => {
      const result = [...prev];
      const [removed] = result.splice(from, 1);
      result.splice(newTo, 0, removed);
      return result;
    });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

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

  const SwippableDraggableItem = ({ item, index, onIdDelete, onOrderChange, allTasksLength }: any) => {
    const { title, description, priority, assignedTo, avatar } = item;
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const isDragging = useSharedValue(false);
    const isSwipping = useSharedValue(false);
    const context = useSharedValue({ y: 0 });

    const borderColor = priority === 'critical' ? '#ef4444' : priority === 'needs_help' ? '#f59e0b' : '#10b981';
    const bgColor = priority === 'critical' ? '#fee2e2' : priority === 'needs_help' ? '#fef3c7' : '#d1fae5';
    const textColor = priority === 'critical' ? '#b91c1c' : priority === 'needs_help' ? '#92400e' : '#065f46';

    const swipeGesture = Gesture.Pan()
      .activeOffsetX([-10, 10])
      .failOffsetY([-10, 10])
      .onUpdate((event) => {
        if (!isDragging.value) {
          // Strictly horizontal and only to the left
          translateX.value = Math.max(-100, Math.min(0, event.translationX));
        }
      })
      .onEnd((event) => {
        if (translateX.value < -60) {
          translateX.value = withSpring(-100);
        } else {
          translateX.value = withSpring(0);
        }
      });

    const dragGesture = Gesture.Pan()
      .activateAfterLongPress(400)
      .activeOffsetY([-10, 10])
      .failOffsetX([-10, 10])
      .onBegin(() => {
        isDragging.value = true;
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Heavy);
      })
      .onUpdate((event) => {
        // Strictly vertical
        translateY.value = event.translationY;
      })
      .onEnd(() => {
        const threshold = 80; // Adjusted for better stability
        const shift = Math.round(translateY.value / threshold);
        if (shift !== 0) {
          runOnJS(onOrderChange)(index, index + shift);
        }
        translateY.value = withSpring(0);
        isDragging.value = false;
      })
      .onFinalize(() => {
        isDragging.value = false;
      });


    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: isDragging.value ? 1.05 : 1 },
      ],
      zIndex: isDragging.value ? 1000 : 1,
      borderRadius: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowRadius: 15,
      shadowOpacity: withSpring(isDragging.value ? 0.15 : 0),
      backgroundColor: isDragging.value ? '#fff' : 'transparent',
    }));


    const deleteButtonStyle = useAnimatedStyle(() => ({
      opacity: interpolate(translateX.value, [-20, 0], [1, 0], Extrapolate.CLAMP),
      pointerEvents: translateX.value < -20 ? 'auto' : 'none',
    }));
    return (
      <View style={{ marginBottom: 16 }}>
        {/* Delete Background */}
        <Animated.View
          style={deleteButtonStyle}
          className="absolute right-0 top-0 bottom-0 w-24 bg-red-500 rounded-[24px] items-center justify-center"
        >
          <Pressable onPress={() => onIdDelete(item.id)}>
            <MaterialIcons name="delete-outline" size={28} color="white" />
          </Pressable>
        </Animated.View>


        <GestureDetector gesture={Gesture.Exclusive(dragGesture, swipeGesture)}>
          <Animated.View
            layout={Layout.springify().damping(15)}
            exiting={FadeOut}
            style={animatedStyle}
          >

            <Pressable
              onPress={() => {
                if (translateX.value === 0) {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setActiveTask(item);
                  setActiveType('manage_task');
                } else {
                  translateX.value = withSpring(0);
                }
              }}
              className="bg-white rounded-[24px] p-5 border-l-[6px] shadow-sm border-gray-100"
              style={{ borderLeftColor: borderColor }}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: bgColor + '40' }}>
                  <MaterialIcons name={priority === 'critical' ? 'priority-high' : 'assignment'} size={20} color={textColor} />
                </View>
                <View className="flex-1">
                  <Text className="text-brand-label text-brand-dark">{title}</Text>
                </View>

                {/* Comment Count Badge */}
                {item.comments && item.comments.length > 0 && (
                  <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full">
                    <MaterialIcons name="chat-bubble-outline" size={14} color="#64748b" />
                    <Text className="text-xs font-bold text-gray-500 ml-1.5">{item.comments.length}</Text>
                  </View>
                )}
              </View>
            </Pressable>
          </Animated.View>
        </GestureDetector>
      </View>
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
                <Text className="text-brand-sub text-brand-muted">Good Morning,</Text>
                <Text className="text-brand-title text-brand-dark">Maya</Text>
              </View>
              <Pressable
                onPress={() => router.push('/profile')}
                className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden shadow-sm active:scale-95"
              >
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCORMa38YShjxWXHcbH-MfY1UZF9LvIjHefqm4MnmpLYEROxwh8VpTJetiR_BPF_Kt4A676WuCNDwR6TmAHY5CN6SnaFzheHF0M5FtIlw80jCm2wH4NOcOa-IqaDBUomapbokmokeLN4wPVLAKg_jiKNzkeDzcjGH0r2qvVI1wF9rSlEq-KXsGO67Ujocu1a-guDc9qfSpuY_B_7PiQhy4P-zUFKocITqdWQuKu6QB8e9zr2Z-7vDyE00NRn5JxUXrBpBU36ttjbSZi' }}
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

                    <Text className="text-brand-title text-white mb-1">Crisis Alert</Text>
                    <Text className="text-red-100/80 text-brand-sub mb-8 text-center px-6 leading-5">
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
                <Text className="text-brand-title text-brand-dark">Daily Wellness</Text>
                <Text className="text-brand-sub font-bold text-blue-600">3/5 tasks</Text>
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
              <View className="flex-row justify-between items-center mb-4 px-1">
                <Text className="text-brand-muted text-brand-section">Active Care Plan</Text>
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
                {tasks.map((task, index) => (
                  <SwippableDraggableItem
                    key={task.id}
                    item={task}
                    index={index}
                    allTasksLength={tasks.length}
                    onIdDelete={handleDeleteTask}
                    onOrderChange={handleOrderChange}
                  />
                ))}
              </View>

            </View>
          </ScrollView>
        </SafeAreaView>

        <AddCarePlanModal
          visible={isAddCarePlanVisible}
          onClose={() => setIsAddCarePlanVisible(false)}
          onAdd={handleAddTask}
        />

        <AppBottomSheet
          visible={activeTask !== null}
          onClose={() => setActiveTask(null)}
          type={activeType}
          task={activeTask}
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
