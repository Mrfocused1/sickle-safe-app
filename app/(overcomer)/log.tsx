import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import CrisisLogModal from '../../components/CrisisLogModal';
import { useRouter } from 'expo-router';

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState('Today, 25 Dec');
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const handleAction = (label: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    alert(`${label} (Coming Soon)`);
  };

  const LogItem = ({ icon, label, value, status, color, onPress }: any) => (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100 flex-row items-center active:bg-gray-50 active:scale-[0.98] transition-transform"
    >
      <View className="w-12 h-12 rounded-2xl items-center justify-center shadow-sm" style={{ backgroundColor: `${color}15` }}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-gray-900 font-bold text-base">{label}</Text>
        <Text className="text-gray-500 text-xs mt-0.5">{status}</Text>
      </View>
      <View className="items-end">
        <Text className="text-gray-900 font-bold text-base">{value}</Text>
        <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Clean White Header */}
        <View
          style={{ paddingTop: Math.max(insets.top, 20) + 12 }}
          className="bg-white pb-6 px-6 border-b border-gray-100"
        >
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Daily Tracking</Text>
              <Text className="text-3xl font-extrabold text-gray-900">Health Log</Text>
            </View>
            <Pressable
              onPress={() => router.push('/profile')}
              className="w-12 h-12 rounded-2xl bg-gray-100 items-center justify-center border border-gray-200 overflow-hidden shadow-sm active:scale-95"
            >
              <Image
                source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCORMa38YShjxWXHcbH-MfY1UZF9LvIjHefqm4MnmpLYEROxwh8VpTJetiR_BPF_Kt4A676WuCNDwR6TmAHY5CN6SnaFzheHF0M5FtIlw80jCm2wH4NOcOa-IqaDBuomapbokmokeLN4wPVLAKg_jiKNzkeDzcjGH0r2qvVI1wF9rSlEq-KXsGO67Ujocu1a-guDc9qfSpuY_B_7PiQhy4P-zUFKocITqdWQuKu6QB8e9zr2Z-7vDyE00NRn5JxUXrBpBU36ttjbSZi' }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </Pressable>
          </View>

          {/* Minimal Date Selector */}
          <View className="flex-row items-center justify-between bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            <Pressable
              onPress={() => handleAction('Previous Day')}
              className="w-10 h-10 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm active:bg-gray-50"
            >
              <MaterialIcons name="chevron-left" size={24} color="#6b7280" />
            </Pressable>
            <View className="flex-row items-center gap-2 px-4 py-2">
              <MaterialIcons name="calendar-today" size={16} color="#8B5CF6" />
              <Text className="font-bold text-gray-900">{currentDate}</Text>
            </View>
            <Pressable
              onPress={() => handleAction('Next Day')}
              className="w-10 h-10 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm active:bg-gray-50"
            >
              <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
            </Pressable>
          </View>
        </View>

        <View className="px-6 py-8">
          {/* Summary Stats */}
          <View className="flex-row gap-4 mb-8">
            <View className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 items-center">
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Pain (Avg)</Text>
              <Text className="text-2xl font-bold text-gray-900">2.4</Text>
              <View className="h-1 w-8 bg-amber-500 rounded-full mt-2" />
            </View>
            <View className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 items-center">
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Water</Text>
              <Text className="text-2xl font-bold text-gray-900">1.8L</Text>
              <View className="h-1 w-8 bg-blue-500 rounded-full mt-2" />
            </View>
            <View className="flex-1 bg-white p-5 rounded-3xl shadow-sm border border-gray-100 items-center">
              <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Meds</Text>
              <Text className="text-2xl font-bold text-gray-900">3/4</Text>
              <View className="h-1 w-8 bg-purple-500 rounded-full mt-2" />
            </View>
          </View>

          {/* Log Sections */}
          <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Metrics & Wellness</Text>

          <LogItem
            icon="favorite"
            label="Pain Level"
            value="Moderate"
            status="3 entries recorded"
            color="#f59e0b"
            onPress={() => handleAction('Pain Logs')}
          />

          <LogItem
            icon="water-drop"
            label="Hydration"
            value="1.8L"
            status="72% of daily goal"
            color="#3b82f6"
            onPress={() => handleAction('Water Logs')}
          />

          <LogItem
            icon="medication"
            label="Medications"
            value="On Track"
            status="Last: Hydroxyurea 8:00 AM"
            color="#a855f7"
            onPress={() => handleAction('Meds Logs')}
          />

          <LogItem
            icon="mood"
            label="Mood & Energy"
            value="Good"
            status="Stable energy reported"
            color="#10b981"
            onPress={() => handleAction('Mood Logs')}
          />

          <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-6 mb-4 ml-1">Recorded Incidents</Text>

          <View className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden mb-8">
            <Pressable
              onPress={() => handleAction('Triggers')}
              className="px-5 py-4 flex-row items-center border-b border-gray-50 active:bg-gray-50"
            >
              <View className="w-10 h-10 rounded-xl bg-red-50 items-center justify-center">
                <MaterialIcons name="warning" size={20} color="#f43f5e" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-900 font-bold text-sm">Active Triggers</Text>
                <Text className="text-gray-500 text-[10px]">Cold exposure reported at 11am</Text>
              </View>
              <View className="bg-red-500 px-2 py-0.5 rounded-lg">
                <Text className="text-white text-[10px] font-black">1</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => handleAction('Crisis History')}
              className="px-5 py-4 flex-row items-center active:bg-gray-50"
            >
              <View className="w-10 h-10 rounded-xl bg-orange-50 items-center justify-center">
                <MaterialIcons name="crisis-alert" size={20} color="#ef4444" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-gray-900 font-bold text-sm">Crisis Episodes</Text>
                <Text className="text-gray-500 text-[10px]">No crises reported in 14 days</Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
            </Pressable>
          </View>

          {/* Action Button */}
          <Pressable
            style={{ backgroundColor: '#111827' }}
            className="w-full py-4 rounded-3xl shadow-xl flex-row items-center justify-center gap-3 active:opacity-90 mt-4"
            onPress={() => setShowCrisisModal(true)}
          >
            <View className="bg-red-500 rounded-full w-6 h-6 items-center justify-center">
              <MaterialIcons name="add" size={16} color="#ffffff" />
            </View>
            <Text className="text-white font-bold text-base">New Crisis Report</Text>
          </Pressable>

          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Crisis Log Modal */}
      <CrisisLogModal
        visible={showCrisisModal}
        onClose={() => setShowCrisisModal(false)}
      />
    </View>
  );
}
