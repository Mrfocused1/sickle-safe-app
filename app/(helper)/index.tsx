import React from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
    HeartPulse,
    Phone,
    Calendar,
    Pill,
    ChevronRight,
    Activity,
    Droplets
} from 'lucide-react-native';
import AppBottomSheet from '../../components/AppBottomSheet';

const QUICK_ACTIONS = [
    { id: 'log', label: 'Log Incident', icon: 'edit-calendar', color: '#8B5CF6' },
    { id: 'meds', label: 'Meds', icon: 'medication', color: '#10B981' },
    { id: 'doctor', label: 'Contact', icon: 'call', color: '#3B82F6' },
];

const RECENT_ACTIVITY = [
    { id: 1, type: 'check-in', title: 'Daily Check-in', time: '10:00 AM', detail: 'Pain Level: 2/10', icon: 'check-circle', color: '#10B981' },
    { id: 2, type: 'meds', title: 'Hydroxyurea', time: '8:00 AM', detail: 'Taken on time', icon: 'medication', color: '#6366F1' },
    { id: 3, type: 'pain', title: 'Mild Discomfort', time: 'Yesterday', detail: 'Knee pain reported', icon: 'warning', color: '#F59E0B' },
];

const MAYA_MEMBER = {
    name: 'Maya Thompson',
    role: 'Overcomer',
    priority: 'Primary',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCORMa38YShjxWXHcbH-MfY1UZF9LvIjHefqm4MnmpLYEROxwh8VpTJetiR_BPF_Kt4A676WuCNDwR6TmAHY5CN6SnaFzheHF0M5FtIlw80jCm2wH4NOcOa-IqaDBuomapbokmokeLN4wPVLAKg_jiKNzkeDzcjGH0r2qvVI1wF9rSlEq-KXsGO67Ujocu1a-guDc9qfSpuY_B_7PiQhy4P-zUFKocITN DWQuKu6QB8e9zr2Z-7vDyE00NRn5JxUXrBpBU36ttjbSZi',
    status: 'Stable',
    isEmergency: false
};

export default function CaregiverDashboard() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [activeActivity, setActiveActivity] = React.useState<any>(null);
    const [activeType, setActiveType] = React.useState<any>(null);
    const [activeTask, setActiveTask] = React.useState<any>(null);

    const handleAction = (id: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (id === 'log') setActiveType('log_selection');
        else if (id === 'meds') setActiveType('meds');
        else if (id === 'doctor') setActiveType('member');
        else if (id === 'Maya') setActiveType('member');
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1">

                {/* Header Section */}
                <View className="bg-white px-6 pb-6 rounded-b-[40px]" style={{ paddingTop: insets.top + 10 }}>
                    <View className="flex-row justify-between items-center mb-6">
                        <View>
                            <Text className="text-gray-500 text-sm font-medium mb-1">Good Morning,</Text>
                            <Text className="text-3xl font-bold text-gray-900">Marcus</Text>
                        </View>
                        <Pressable className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center border border-gray-200">
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200' }}
                                className="w-full h-full rounded-full"
                            />
                        </Pressable>
                    </View>

                    {/* Overcomer Status Card - Clean Light Theme */}
                    <View className="bg-white rounded-[32px] p-6 shadow-sm">

                        <View className="flex-row items-center mb-6">
                            <View className="w-14 h-14 rounded-2xl border border-gray-100 overflow-hidden mr-4 bg-gray-50">
                                <Image
                                    source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200' }}
                                    className="w-full h-full"
                                />
                            </View>
                            <View className="flex-1">
                                <Text className="text-gray-900 font-bold text-xl">Maya Thompson</Text>
                                <View className="flex-row items-center mt-1">
                                    <View className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                                    <Text className="text-gray-500 text-xs font-medium">Stable • Last update 2h ago</Text>
                                </View>
                            </View>
                            <Pressable
                                onPress={() => handleAction('Maya')}
                                className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100 active:bg-gray-100 ml-2"
                            >
                                <Phone size={18} color="#4B5563" />
                            </Pressable>
                        </View>

                        <View className="flex-row">
                            <View className="flex-1 bg-gray-50 rounded-2xl p-3 border border-gray-100 mr-2">
                                <View className="flex-row items-center mb-2">
                                    <Activity size={14} color="#EF4444" style={{ marginRight: 6 }} />
                                    <Text className="text-gray-400 text-[9px] font-bold uppercase" numberOfLines={1}>Pain Lvl</Text>
                                </View>
                                <Text className="text-gray-900 text-xl font-bold">2<Text className="text-sm text-gray-400 font-normal">/10</Text></Text>
                            </View>

                            <View className="flex-1 bg-gray-50 rounded-2xl p-3 border border-gray-100 mx-1">
                                <View className="flex-row items-center mb-2">
                                    <Droplets size={14} color="#3B82F6" style={{ marginRight: 6 }} />
                                    <Text className="text-gray-400 text-[9px] font-bold uppercase" numberOfLines={1}>Hydration</Text>
                                </View>
                                <Text className="text-gray-900 text-xl font-bold">85<Text className="text-sm text-gray-400 font-normal">%</Text></Text>
                            </View>

                            <View className="flex-1 bg-gray-50 rounded-2xl p-3 border border-gray-100 ml-2">
                                <View className="flex-row items-center mb-2">
                                    <HeartPulse size={14} color="#8B5CF6" style={{ marginRight: 6 }} />
                                    <Text className="text-gray-400 text-[9px] font-bold uppercase" numberOfLines={1}>Vitals</Text>
                                </View>
                                <Text className="text-gray-900 text-xl font-bold">98<Text className="text-sm text-gray-400 font-normal">bpm</Text></Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="px-6 py-6">
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Quick Actions</Text>
                    <View className="flex-row gap-4">
                        {QUICK_ACTIONS.map((action) => (
                            <Pressable
                                key={action.id}
                                onPress={() => handleAction(action.id)}
                                className="flex-1 bg-white p-4 rounded-3xl shadow-sm border border-gray-100 items-center active:bg-gray-50"
                            >

                                <View
                                    className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
                                    style={{ backgroundColor: `${action.color}15` }}
                                >
                                    <MaterialIcons name={action.icon as any} size={24} color={action.color} />
                                </View>
                                <Text className="text-gray-900 font-bold text-xs text-center">{action.label}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>

                <View className="px-6 mb-8">
                    <View className="flex-row items-center justify-between mb-4 px-1">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Help Requested</Text>
                        <Pressable onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setActiveType('view_care_plan');
                        }}>
                            <Text className="text-violet-600 font-bold text-xs">See Full Plan</Text>
                        </Pressable>
                    </View>

                    <Pressable
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setActiveType('request_task');
                            setActiveTask({
                                title: 'Prescription Refill',
                                description: 'Hydroxyurea supply is low. Needs to be picked up from the downtown pharmacy.'
                            });
                        }}
                        className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 flex-row items-center active:bg-gray-50 active:scale-[0.98]"
                    >
                        <View className="w-12 h-12 rounded-2xl bg-amber-50 items-center justify-center border border-amber-100 mr-4">
                            <MaterialIcons name="shopping-basket" size={24} color="#f59e0b" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-900 font-bold text-base">Prescription Refill</Text>
                            <Text className="text-gray-500 text-xs">Downtown Pharmacy • Needs pickup</Text>
                        </View>
                        <View className="bg-amber-500 px-3 py-1.5 rounded-xl shadow-sm">
                            <Text className="text-white font-bold text-[10px] uppercase">Claim</Text>
                        </View>
                    </Pressable>
                </View>

                {/* Activity Feed */}
                <View className="px-6 mb-8">
                    <View className="flex-row items-center justify-between mb-4 px-1">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Recent Updates</Text>
                        <Pressable onPress={() => handleAction('View All History')}>
                            <Text className="text-violet-600 text-xs font-bold">View History</Text>
                        </Pressable>
                    </View>

                    <View>
                        {RECENT_ACTIVITY.map((item) => (
                            <Pressable
                                key={item.id}
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    setActiveActivity(item);
                                }}
                                className="bg-white rounded-[24px] p-5 mb-4 shadow-sm border border-gray-100 flex-row items-center active:bg-gray-50 active:scale-[0.98]"
                            >
                                <View
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                    style={{ backgroundColor: `${item.color}10` }}
                                >
                                    <MaterialIcons name={item.icon as any} size={24} color={item.color} />
                                </View>
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-center mb-1">
                                        <Text className="text-gray-900 font-bold text-base">{item.title}</Text>
                                        <Text className="text-gray-400 text-[10px] font-bold">{item.time}</Text>
                                    </View>
                                    <Text className="text-gray-500 text-xs font-medium">{item.detail}</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                </View>


                {/* Caregiver Tip */}
                <View className="px-6 mb-12">
                    <View className="bg-blue-50 p-5 rounded-[24px] border border-blue-100 flex-row items-center gap-4">
                        <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm">
                            <MaterialIcons name="lightbulb" size={20} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-blue-900 font-bold text-sm mb-1">Care Tip</Text>
                            <Text className="text-blue-700 text-xs leading-4">Keeping track of hydration levels helps prevent future crises effectively.</Text>
                        </View>
                    </View>
                </View>

            </ScrollView>

            <AppBottomSheet
                visible={activeActivity !== null}
                onClose={() => setActiveActivity(null)}
                type="activity_detail"
                activity={activeActivity}
            />

            <AppBottomSheet
                visible={activeType !== null}
                onClose={() => {
                    setActiveType(null);
                    setActiveTask(null);
                }}
                type={activeType}
                activity={activeActivity}
                member={MAYA_MEMBER}
                task={activeTask}
            />
        </View>
    );
}
