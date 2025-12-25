import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Switch } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Lock, Shield, Eye, Smartphone, Database, ChevronRight, Fingerprint } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';

export default function SecuritySettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [settings, setSettings] = useState({
        biometrics: true,
        twoFactor: false,
        shareHealth: true,
        publicProfile: false,
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
                    <Text className="text-xl font-bold text-gray-900">Privacy & Security</Text>
                    <View className="w-10" />
                </View>

                <View className="px-6 py-8">
                    {/* Login Security */}
                    <View className="mb-8">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Login Security</Text>
                        <View className="bg-gray-50 rounded-[32px] px-6 py-2 border border-gray-100 shadow-sm">
                            <SettingRow
                                icon={<Fingerprint size={18} color="#10B981" />}
                                label="FaceID / Fingerprint"
                                description="Use biometrics to unlock the app"
                                value={settings.biometrics}
                                onValueChange={() => toggle('biometrics')}
                                bgColor="bg-emerald-50"
                            />
                            <SettingRow
                                icon={<Smartphone size={18} color="#6366F1" />}
                                label="2-Factor Auth"
                                description="Secure your account with SMS codes"
                                value={settings.twoFactor}
                                onValueChange={() => toggle('twoFactor')}
                                bgColor="bg-indigo-50"
                            />
                            <Pressable
                                className="flex-row items-center justify-between py-5"
                                onPress={() => alert('Change Password')}
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-gray-100">
                                        <Lock size={18} color="#6B7280" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="font-semibold text-base text-gray-900">Change Password</Text>
                                        <Text className="text-gray-400 text-xs mt-0.5">Last updated 6 months ago</Text>
                                    </View>
                                </View>
                                <ChevronRight size={18} color="#cbd5e1" />
                            </Pressable>
                        </View>
                    </View>

                    {/* Data Privacy */}
                    <View className="mb-8">
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Data Privacy</Text>
                        <View className="bg-gray-50 rounded-[32px] px-6 py-2 border border-gray-100 shadow-sm">
                            <SettingRow
                                icon={<Shield size={18} color="#8B5CF6" />}
                                label="Share Health Data"
                                description="Allow Circle of Care to see vitals"
                                value={settings.shareHealth}
                                onValueChange={() => toggle('shareHealth')}
                                bgColor="bg-violet-50"
                            />
                            <SettingRow
                                icon={<Eye size={18} color="#F59E0B" />}
                                label="Public Profile"
                                description="Make your profile visible in Community"
                                value={settings.publicProfile}
                                onValueChange={() => toggle('publicProfile')}
                                bgColor="bg-amber-50"
                            />
                            <Pressable
                                className="flex-row items-center justify-between py-5"
                                onPress={() => alert('Download Data')}
                            >
                                <View className="flex-row items-center gap-4">
                                    <View className="w-10 h-10 rounded-xl items-center justify-center bg-gray-100">
                                        <Database size={18} color="#6B7280" />
                                    </View>
                                    <Text className="font-semibold text-base text-gray-900">Download My Data</Text>
                                </View>
                                <ChevronRight size={18} color="#cbd5e1" />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

function SettingRow({ icon, label, description, value, onValueChange, bgColor, isLast }: any) {
    return (
        <View className={`flex-row items-center justify-between py-5 ${!isLast ? 'border-b border-gray-100' : ''}`}>
            <View className="flex-row items-center gap-4 flex-1">
                <View className={`w-10 h-10 rounded-xl items-center justify-center ${bgColor}`}>
                    {icon}
                </View>
                <View className="flex-1">
                    <Text className="font-semibold text-base text-gray-900">{label}</Text>
                    {description && <Text className="text-gray-400 text-xs mt-0.5">{description}</Text>}
                </View>
            </View>
            <Switch
                trackColor={{ false: '#e2e8f0', true: '#8B5CF6' }}
                thumbColor="#fff"
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );
}
