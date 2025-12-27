import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import CrisisLogModal from '../../components/CrisisLogModal';
import AppBottomSheet from '../../components/AppBottomSheet';
import { useRouter } from 'expo-router';
import { healthLogStorage } from '../../services/healthLogStorage';
import { DailyHealthLog, DailyLogSummary, PainEntry, HydrationEntry, MoodEntry, TriggerEntry, CrisisEpisode, MoodLevel } from '../../types/healthLog';

export default function LogScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [activeSheetType, setActiveSheetType] = useState<'pain' | 'hydration' | 'meds' | 'mood' | 'triggers' | 'crisis' | null>(null);
  const [dailyLog, setDailyLog] = useState<DailyHealthLog | null>(null);
  const [summary, setSummary] = useState<DailyLogSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Derived state for medications (for backward compatibility)
  const medications = dailyLog?.medications.list ?? [];
  const checkedMeds = dailyLog?.medications.checked ?? [];
  const medsProgress = medications.length > 0 ? Math.round((checkedMeds.length / medications.length) * 100) : 0;

  // Load daily log when date changes
  useEffect(() => {
    loadDailyLog();
  }, [selectedDate]);

  const loadDailyLog = async () => {
    setIsLoading(true);
    try {
      const log = await healthLogStorage.getDailyLog(selectedDate);
      setDailyLog(log);
      setSummary(healthLogStorage.computeSummary(log));
    } catch (error) {
      console.error('Failed to load daily log:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Callback handlers for each metric
  const handlePainUpdate = async (level: number, notes?: string) => {
    if (!dailyLog) return;
    const entry: PainEntry = {
      level,
      timestamp: new Date().toISOString(),
      notes,
    };
    const updatedLog = { ...dailyLog, pain: [...dailyLog.pain, entry] };
    await healthLogStorage.saveDailyLog(updatedLog);
    setDailyLog(updatedLog);
    setSummary(healthLogStorage.computeSummary(updatedLog));
  };

  const handleHydrationUpdate = async (amount: string, notes?: string) => {
    if (!dailyLog) return;
    const entry: HydrationEntry = {
      amount,
      timestamp: new Date().toISOString(),
      notes,
    };
    const updatedLog = { ...dailyLog, hydration: [...dailyLog.hydration, entry] };
    await healthLogStorage.saveDailyLog(updatedLog);
    setDailyLog(updatedLog);
    setSummary(healthLogStorage.computeSummary(updatedLog));
  };

  const handleMedsUpdate = async (list: string[], checked: string[]) => {
    if (!dailyLog) return;
    const updatedLog = { ...dailyLog, medications: { list, checked } };
    await healthLogStorage.saveDailyLog(updatedLog);
    await healthLogStorage.saveDefaultMedications(list);
    setDailyLog(updatedLog);
    setSummary(healthLogStorage.computeSummary(updatedLog));
  };

  const handleMoodUpdate = async (level: MoodLevel, notes?: string) => {
    if (!dailyLog) return;
    const entry: MoodEntry = {
      level,
      timestamp: new Date().toISOString(),
      notes,
    };
    const updatedLog = { ...dailyLog, mood: [...dailyLog.mood, entry] };
    await healthLogStorage.saveDailyLog(updatedLog);
    setDailyLog(updatedLog);
    setSummary(healthLogStorage.computeSummary(updatedLog));
  };

  const handleTriggersUpdate = async (triggers: string[], notes?: string) => {
    if (!dailyLog) return;
    const entry: TriggerEntry = {
      triggers,
      timestamp: new Date().toISOString(),
      notes,
    };
    const updatedLog = { ...dailyLog, triggers: [...dailyLog.triggers, entry] };
    await healthLogStorage.saveDailyLog(updatedLog);
    setDailyLog(updatedLog);
    setSummary(healthLogStorage.computeSummary(updatedLog));
  };

  const handleCrisisUpdate = async (episode: CrisisEpisode) => {
    if (!dailyLog) return;
    const updatedLog = { ...dailyLog, crisisEpisodes: [...dailyLog.crisisEpisodes, episode] };
    await healthLogStorage.saveDailyLog(updatedLog);
    setDailyLog(updatedLog);
    setSummary(healthLogStorage.computeSummary(updatedLog));
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayNum = date.getDate();
    const month = monthNames[date.getMonth()];

    if (isToday) return `Today, ${dayNum} ${month}`;
    if (isYesterday) return `Yesterday, ${dayNum} ${month}`;
    return `${dayNum} ${month}`;
  };

  const handlePreviousDay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      return; // Can't go to future
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  const LogItem = ({ icon, label, value, status, color, onPress }: any) => (
    <Pressable
      onPress={onPress}
      className="bg-white rounded-[24px] p-5 mb-4 shadow-sm border border-gray-100 flex-row items-center active:bg-gray-50 active:scale-[0.98] transition-transform"
    >
      <View className="w-14 h-14 rounded-2xl items-center justify-center shadow-sm" style={{ backgroundColor: `${color}15` }}>
        <MaterialIcons name={icon} size={28} color={color} />
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-gray-900 font-bold text-base">{label}</Text>
        <Text className="text-gray-500 text-xs mt-0.5 font-medium">{status}</Text>
      </View>
      <View className="items-end gap-1">
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
              onPress={handlePreviousDay}
              className="w-10 h-10 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm active:bg-gray-50"
            >
              <MaterialIcons name="chevron-left" size={24} color="#6b7280" />
            </Pressable>
            <View className="flex-row items-center gap-2 px-4 py-2">
              <MaterialIcons name="calendar-today" size={16} color="#8B5CF6" />
              <Text className="font-bold text-gray-900">{formatDate(selectedDate)}</Text>
            </View>
            <Pressable
              onPress={handleNextDay}
              className={`w-10 h-10 items-center justify-center rounded-xl bg-white border border-gray-100 shadow-sm ${isToday ? 'opacity-40' : 'active:bg-gray-50'}`}
              disabled={isToday}
            >
              <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
            </Pressable>
          </View>
        </View>

        <View className="px-6 py-8">
          <View className="flex-row gap-3 mb-8">
            <View className="flex-1 bg-white p-5 rounded-[24px] border border-gray-100 items-center shadow-sm">
              <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-2">Avg Pain</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {summary?.avgPain !== null ? summary?.avgPain.toFixed(1) : '--'}
              </Text>
              <View className="h-1 w-8 bg-amber-500/20 rounded-full mt-3 overflow-hidden">
                <View className="h-full bg-amber-500" style={{ width: `${(summary?.avgPain ?? 0) * 10}%` }} />
              </View>
            </View>
            <View className="flex-1 bg-white p-5 rounded-[24px] border border-gray-100 items-center shadow-sm">
              <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-2">Water</Text>
              <Text className="text-2xl font-bold text-gray-900">
                {((summary?.totalHydration ?? 0) / 1000).toFixed(1)}L
              </Text>
              <View className="h-1 w-8 bg-blue-500/20 rounded-full mt-3 overflow-hidden">
                <View className="h-full bg-blue-500" style={{ width: `${Math.min(((summary?.totalHydration ?? 0) / (summary?.hydrationGoal ?? 2500)) * 100, 100)}%` }} />
              </View>
            </View>
            <View className="flex-1 bg-white p-5 rounded-[24px] border border-gray-100 items-center shadow-sm">
              <Text className="text-gray-400 text-[9px] font-bold uppercase tracking-widest mb-2">Meds</Text>
              <Text className="text-2xl font-bold text-gray-900">{checkedMeds.length}/{medications.length}</Text>
              <View className="h-1 w-8 bg-purple-500/20 rounded-full mt-3 overflow-hidden">
                <View className="h-full bg-purple-500" style={{ width: `${medsProgress}%` }} />
              </View>
            </View>
          </View>


          {/* Log Sections */}
          <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Metrics & Wellness</Text>

          <LogItem
            icon="favorite"
            label="Pain Level"
            value={summary?.avgPain !== null ? (summary.avgPain <= 3 ? 'Low' : summary.avgPain <= 6 ? 'Moderate' : 'High') : '--'}
            status={dailyLog?.pain.length ? `${dailyLog.pain.length} ${dailyLog.pain.length === 1 ? 'entry' : 'entries'} recorded` : 'No entries yet'}
            color="#f59e0b"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveSheetType('pain');
            }}
          />

          <LogItem
            icon="water-drop"
            label="Hydration"
            value={`${((summary?.totalHydration ?? 0) / 1000).toFixed(1)}L`}
            status={`${Math.round(((summary?.totalHydration ?? 0) / (summary?.hydrationGoal ?? 2500)) * 100)}% of daily goal`}
            color="#3b82f6"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveSheetType('hydration');
            }}
          />

          <LogItem
            icon="medication"
            label="Medications"
            value={`${checkedMeds.length}/${medications.length}`}
            status={checkedMeds.length === medications.length ? "All taken!" : `${medications.length - checkedMeds.length} remaining`}
            color="#a855f7"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveSheetType('meds');
            }}
          />

          <LogItem
            icon="mood"
            label="Mood & Energy"
            value={summary?.latestMood ?? '--'}
            status={dailyLog?.mood.length ? `${dailyLog.mood.length} ${dailyLog.mood.length === 1 ? 'entry' : 'entries'} today` : 'No entries yet'}
            color="#10b981"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveSheetType('mood');
            }}
          />

          <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-6 mb-4 ml-1">Recorded Incidents</Text>

          <LogItem
            icon="warning"
            label="Active Triggers"
            value={(summary?.triggerCount ?? 0).toString()}
            status={summary?.triggerCount ? `${summary.triggerCount} trigger${summary.triggerCount === 1 ? '' : 's'} reported` : 'No triggers reported'}
            color="#f43f5e"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveSheetType('triggers');
            }}
          />

          <LogItem
            icon="crisis-alert"
            label="Crisis Episodes"
            value={(summary?.crisisCount ?? 0) === 0 ? 'None' : (summary?.crisisCount ?? 0).toString()}
            status={(summary?.crisisCount ?? 0) === 0 ? 'No crises reported today' : `${summary?.crisisCount} episode${(summary?.crisisCount ?? 0) === 1 ? '' : 's'} today`}
            color="#ef4444"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setActiveSheetType('crisis');
            }}
          />

          {/* Action Button */}
          <Pressable
            style={{
              backgroundColor: '#dc2626',
              shadowColor: '#dc2626',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 16,
              elevation: 12,
            }}
            className="w-full py-5 rounded-2xl flex-row items-center justify-center gap-3 active:opacity-90 mt-6"
            onPress={() => setShowCrisisModal(true)}
          >
            <View className="bg-white/20 rounded-full w-8 h-8 items-center justify-center">
              <MaterialIcons name="add" size={22} color="#ffffff" />
            </View>
            <Text className="text-white font-black text-lg tracking-wide">New Crisis Report</Text>
          </Pressable>

          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Crisis Log Modal */}
      <CrisisLogModal
        visible={showCrisisModal}
        onClose={() => setShowCrisisModal(false)}
        onSave={handleCrisisUpdate}
      />

      <AppBottomSheet
        visible={activeSheetType !== null}
        onClose={() => setActiveSheetType(null)}
        type={activeSheetType}
        medsData={{ list: medications, checked: checkedMeds }}
        onMedsUpdate={handleMedsUpdate}
        onPainUpdate={handlePainUpdate}
        onHydrationUpdate={handleHydrationUpdate}
        onMoodUpdate={handleMoodUpdate}
        onTriggersUpdate={handleTriggersUpdate}
      />
    </View>
  );
}
