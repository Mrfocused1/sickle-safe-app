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
import { healthLogStorage } from '../../services/healthLogStorage';
import { DailyHealthLog, DailyLogSummary } from '../../types/healthLog';
import { useFocusEffect } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DashboardScreen() {
  const router = useRouter();
  const [isAddCarePlanVisible, setIsAddCarePlanVisible] = React.useState(false); // Force reload
  const [activeTask, setActiveTask] = React.useState<any>(null);
  const [activeType, setActiveType] = React.useState<any>('task');
  const [showWellnessSummary, setShowWellnessSummary] = React.useState(false);

  // Progress circle animation
  const progressValue = useSharedValue(0);

  // Health Log State
  const [dailyLog, setDailyLog] = React.useState<DailyHealthLog | null>(null);
  const [summary, setSummary] = React.useState<DailyLogSummary | null>(null);
  const [wellnessProgress, setWellnessProgress] = React.useState(0);
  const [completedTasks, setCompletedTasks] = React.useState(0);

  // Load health data on focus
  useFocusEffect(
    React.useCallback(() => {
      loadHealthData();
    }, [])
  );

  const loadHealthData = async () => {
    try {
      const today = new Date();
      const log = await healthLogStorage.getDailyLog(today);
      const logSummary = healthLogStorage.computeSummary(log);

      setDailyLog(log);
      setSummary(logSummary);

      // Calculate progress (Meds + Water + Mood + Pain + Triggers)
      let completed = 0;
      const total = 5;

      if (log.pain.length > 0) completed++;
      if (log.hydration.length > 0) completed++;
      if (log.medications.checked.length > 0) completed++;
      if (log.mood.length > 0) completed++;
      if (log.triggers.length > 0) completed++;

      setCompletedTasks(completed);
      const progress = completed / total;
      setWellnessProgress(progress);
      progressValue.value = withTiming(progress, { duration: 1000 });
    } catch (error) {
      console.error('Failed to load health data:', error);
    }
  };

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
              className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100"
            >
              <View className="flex-row items-center">
                <View
                  className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                  style={{ backgroundColor: bgColor }}
                >
                  <MaterialIcons
                    name={
                      title.includes('Emergency') || title.includes('Bag') ? 'medical-services' :
                        title.includes('Prescription') || title.includes('Refill') ? 'medication' :
                          title.includes('Walk') || title.includes('Exercise') ? 'directions-walk' :
                            'assignment'
                    }
                    size={24}
                    color={textColor}
                  />
                </View>
                <View className="flex-1">
                  <Text style={{ fontSize: 17, fontWeight: '700', color: '#1e293b' }}>{title}</Text>
                </View>

                {/* Comment Count Badge */}
                {item.comments && item.comments.length > 0 && (
                  <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full">
                    <MaterialIcons name="message" size={14} color="#64748b" />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#64748b', marginLeft: 6 }}>{item.comments.length}</Text>
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

                    <Text style={{ fontSize: 24, fontWeight: '800', color: '#ffffff', marginBottom: 4 }}>Crisis Alert</Text>
                    {summary?.crisisCount !== undefined && summary.crisisCount > 0 && (
                      <View className="bg-white/20 px-3 py-1 rounded-full mb-4">
                        <Text style={{ fontSize: 13, fontWeight: '700', color: '#ffffff' }}>
                          {summary.crisisCount} episode{summary.crisisCount === 1 ? '' : 's'} recorded today
                        </Text>
                      </View>
                    )}
                    <Text style={{ fontSize: 15, fontWeight: '500', color: 'rgba(255, 255, 255, 0.9)', lineHeight: 22, textAlign: 'center', paddingHorizontal: 24 }}>
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
                        <Text style={{ color: '#ffffff', fontSize: 16, fontWeight: '700' }}>
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
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a' }}>Daily Wellness</Text>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#3b82f6' }}>{completedTasks}/5 tasks</Text>
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
                    {/* Background Circle */}
                    <View className="absolute inset-0 rounded-full border-4 border-gray-200" />

                    {/* Animated Progress Arc */}
                    <Animated.View
                      style={[
                        {
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: 32,
                          borderWidth: 4,
                          borderColor: '#3b82f6',
                          borderRightColor: 'transparent',
                          borderBottomColor: 'transparent',
                        },
                        useAnimatedStyle(() => ({
                          transform: [
                            { rotate: `${interpolate(progressValue.value, [0, 1], [0, 360])}deg` }
                          ],
                          opacity: interpolate(progressValue.value, [0, 0.1], [0, 1])
                        }))
                      ]}
                    />

                    <View className="absolute inset-0 items-center justify-center">
                      <Animated.Text
                        style={[
                          { fontSize: 14, fontWeight: '700', color: '#1e293b' },
                          useAnimatedStyle(() => ({
                            opacity: interpolate(progressValue.value, [0, 0.1], [0, 1])
                          }))
                        ]}
                      >
                        {Math.round(wellnessProgress * 100)}%
                      </Animated.Text>
                    </View>
                  </View>

                  <View className="flex-1">
                    <Text style={{ fontSize: 15, fontWeight: '500', color: '#64748b', lineHeight: 22, marginBottom: 4 }}>
                      Keep hydrated and track your pain levels regularly.
                    </Text>
                    <Pressable>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: '#3b82f6' }}>View Details</Text>
                    </Pressable>
                  </View>
                </View>

                {/* Quick Actions */}
                <View className="flex-row gap-3">
                  <Pressable
                    onPress={() => router.push({ pathname: '/log', params: { type: 'hydration' } })}
                    className={`flex-1 flex-row items-center px-4 py-3 rounded-2xl border ${dailyLog?.hydration && dailyLog.hydration.length > 0 ? 'bg-blue-50/50 border-blue-100' : 'bg-gray-50 border-gray-200 opacity-50'}`}
                  >
                    <View className={`w-8 h-8 rounded-xl items-center justify-center mr-2 ${dailyLog?.hydration && dailyLog.hydration.length > 0 ? 'bg-blue-100' : 'bg-white'}`}>
                      <MaterialIcons name="water-drop" size={16} color={dailyLog?.hydration && dailyLog.hydration.length > 0 ? '#2563eb' : '#6b7280'} />
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: dailyLog?.hydration && dailyLog.hydration.length > 0 ? '#1d4ed8' : '#64748b' }}>Water</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => router.push({ pathname: '/log', params: { type: 'meds' } })}
                    className={`flex-1 flex-row items-center px-4 py-3 rounded-2xl border ${dailyLog?.medications && dailyLog.medications.checked.length > 0 ? 'bg-purple-50/50 border-purple-100' : 'bg-gray-50 border-gray-200 opacity-50'}`}
                  >
                    <View className={`w-8 h-8 rounded-xl items-center justify-center mr-2 ${dailyLog?.medications && dailyLog.medications.checked.length > 0 ? 'bg-purple-100' : 'bg-white'}`}>
                      <MaterialIcons name="medication" size={16} color={dailyLog?.medications && dailyLog.medications.checked.length > 0 ? '#7c3aed' : '#6b7280'} />
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: dailyLog?.medications && dailyLog.medications.checked.length > 0 ? '#6d28d9' : '#64748b' }}>Meds</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => router.push({ pathname: '/log', params: { type: 'mood' } })}
                    className={`flex-1 flex-row items-center px-4 py-3 rounded-2xl border ${dailyLog?.mood && dailyLog.mood.length > 0 ? 'bg-green-50/50 border-green-100' : 'bg-gray-50 border-gray-200 opacity-50'}`}
                  >
                    <View className={`w-8 h-8 rounded-xl items-center justify-center mr-2 ${dailyLog?.mood && dailyLog.mood.length > 0 ? 'bg-green-100' : 'bg-white'}`}>
                      <MaterialIcons name="mood" size={16} color={dailyLog?.mood && dailyLog.mood.length > 0 ? '#10b981' : '#6b7280'} />
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: dailyLog?.mood && dailyLog.mood.length > 0 ? '#059669' : '#64748b' }}>Mood</Text>
                  </Pressable>
                </View>
              </Pressable>
            </View>

            {/* Care Plan */}
            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4 px-1">
                <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a' }}>Active Care Plan</Text>
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
