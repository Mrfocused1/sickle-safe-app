import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, Smartphone, Mail, Activity, AlertTriangle, Users, HeartHandshake, ShieldCheck } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function NotificationsSettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [settings, setSettings] = useState({
        push: true,
        sms: true,
        email: false,
        health: true,
        crisis: true,
        community: true,
        caregivers: true,
        volunteers: false,
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings({ ...settings, [key]: !settings[key] });
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
            >
                {/* Header */}
                <View
                    className="px-6 pb-6 flex-row items-center justify-between border-b border-gray-50"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
                    >
                        <ArrowLeft size={20} color="#1f2937" />
                    </Pressable>
                    <Text className="text-xl font-bold text-gray-900">Notifications</Text>
                    <View className="w-10" />
                </View>

                <View className="px-6 py-8">
                    <View className="mb-8">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Delivery Methods</Text>
                        <View className="bg-gray-50 rounded-[32px] px-6 py-2 border border-gray-100 shadow-sm">
                            <SettingRow
                                icon={<Bell size={18} color="#6366F1" />}
                                label="Push Notifications"
                                value={settings.push}
                                onValueChange={() => toggle('push')}
                                bgColor="bg-indigo-50"
                            />
                            <SettingRow
                                icon={<Smartphone size={18} color="#10B981" />}
                                label="SMS Alerts"
                                value={settings.sms}
                                onValueChange={() => toggle('sms')}
                                bgColor="bg-emerald-50"
                            />
                            <SettingRow
                                icon={<Mail size={18} color="#F59E0B" />}
                                label="Email Updates"
                                value={settings.email}
                                onValueChange={() => toggle('email')}
                                bgColor="bg-amber-50"
                                isLast
                            />
                        </View>
                    </View>

                    <View className="mb-8">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Activity Alerts</Text>
                        <View className="bg-gray-50 rounded-[32px] px-6 py-2 border border-gray-100 shadow-sm">
                            <SettingRow
                                icon={<Activity size={18} color="#3B82F6" />}
                                label="Health Insights"
                                value={settings.health}
                                onValueChange={() => toggle('health')}
                                bgColor="bg-blue-50"
                            />
                            <SettingRow
                                icon={<HeartHandshake size={18} color="#3B82F6" />}
                                label="Caregiver Updates"
                                value={settings.caregivers}
                                onValueChange={() => toggle('caregivers')}
                                bgColor="bg-blue-50"
                            />
                            <SettingRow
                                icon={<ShieldCheck size={18} color="#3B82F6" />}
                                label="Volunteer Support"
                                value={settings.volunteers}
                                onValueChange={() => toggle('volunteers')}
                                bgColor="bg-blue-50"
                            />
                            <SettingRow
                                icon={<AlertTriangle size={18} color="#EF4444" />}
                                label="Crisis Alerts"
                                value={settings.crisis}
                                onValueChange={() => toggle('crisis')}
                                bgColor="bg-red-50"
                            />
                            <SettingRow
                                icon={<Users size={18} color="#3B82F6" />}
                                label="Community Mentions"
                                value={settings.community}
                                onValueChange={() => toggle('community')}
                                bgColor="bg-blue-50"
                                isLast
                            />
                        </View>
                        <Text className="text-xs text-gray-400 mt-4 leading-relaxed px-4">
                            Crisis alerts are critical and should remain enabled to ensure immediate response from your Circle of Care.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function SettingRow({ icon, label, value, onValueChange, bgColor, isLast }: any) {
    return (
        <View className={`flex-row items-center justify-between py-5 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <View className="flex-row items-center gap-4">
                <View className={`w-10 h-10 rounded-xl items-center justify-center ${bgColor}`}>
                    {icon}
                </View>
                <Text className="font-semibold text-base text-gray-900">{label}</Text>
            </View>
            <Switch
                trackColor={{ false: '#e2e8f0', true: '#3B82F6' }}
                thumbColor="#fff"
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );
}
