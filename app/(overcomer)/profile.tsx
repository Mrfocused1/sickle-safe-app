import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Settings,
  User,
  Heart,
  Bell,
  ShieldCheck,
  CircleHelp,
  LogOut,
  ChevronRight,
  Stethoscope,
  FileText,
  Activity,
  Award,
  Users,
  CreditCard,
  Sun
} from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LogoutConfirmSheet } from '@/components/LogoutConfirmSheet';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  subLabel?: string;
  onPress: () => void;
  isLast?: boolean;
  isDestructive?: boolean;
}

const MenuItem = ({ icon, label, subLabel, onPress, isLast, isDestructive }: MenuItemProps) => (
  <Pressable
    onPress={onPress}
    className={`flex-row items-center justify-between py-4 ${!isLast ? 'border-b border-gray-100' : ''}`}
  >
    <View className="flex-row items-center flex-1">
      <View className={`w-10 h-10 rounded-xl items-center justify-center ${isDestructive ? 'bg-red-50' : 'bg-gray-50'}`}>
        {icon}
      </View>
      <View className="ml-4 flex-1">
        <Text className={`text-brand-label ${isDestructive ? 'text-red-500' : 'text-brand-dark'}`}>{label}</Text>
        {subLabel && <Text className="text-brand-muted text-brand-sub mt-0.5">{subLabel}</Text>}
      </View>
    </View>
    {!isDestructive && <ChevronRight size={20} color="#cbd5e1" />}
  </Pressable>
);

const ImpactStat = ({ value, label, icon: Icon, isLast }: { value: string; label: string; icon: any; isLast?: boolean }) => (
  <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}>
    <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={20} color="#3b82f6" />
    </View>
    <View style={{ marginLeft: 12, flex: 1 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: '#0f172a' }}>{value}</Text>
      <Text style={{ fontSize: 10, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.3 }} numberOfLines={1}>{label}</Text>
    </View>
    {!isLast && <View style={{ width: 1, height: '60%', backgroundColor: '#f1f5f9', marginLeft: 12 }} />}
  </View>
);

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showLogoutSheet, setShowLogoutSheet] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Clean White Profile Header */}
        <View
          style={{ paddingTop: Math.max(insets.top, 20) + 12 }}
          className="bg-white pb-6 px-6 border-b border-gray-100"
        >
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748b' }} className="mb-0.5">Your Dashboard</Text>
              <Text style={{ fontSize: 28, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 }}>Profile</Text>
            </View>
            <Pressable
              onPress={() => router.push('/settings/account')}
              className="px-4 py-2 rounded-full border border-gray-200 bg-gray-50 active:bg-gray-100"
            >
              <Text className="text-gray-700 font-semibold text-xs">Edit</Text>
            </Pressable>
          </View>

          <View className="flex-row items-center">
            <View className="relative">
              <View className="w-20 h-20 rounded-full border-2 border-gray-100 overflow-hidden bg-gray-50">
                <Image
                  source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCORMa38YShjxWXHcbH-MfY1UZF9LvIjHefqm4MnmpLYEROxwh8VpTJetiR_BPF_Kt4A676WuCNDwR6TmAHY5CN6SnaFzheHF0M5FtIlw80jCm2wH4NOcOa-IqaDBuomapbokmokeLN4wPVLAKg_jiKNzkeDzcjGH0r2qvVI1wF9rSlEq-KXsGO67Ujocu1a-guDc9qfSpuY_B_7PiQhy4P-zUFKocITqdWQuKu6QB8e9zr2Z-7vDyE00NRn5JxUXrBpBU36ttjbSZi' }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="absolute bottom-0 right-0 w-6 h-6 bg-white rounded-full items-center justify-center shadow-sm border border-gray-100">
                <MaterialIcons name="verified" size={16} color="#3b82f6" />
              </View>
            </View>
            <View className="ml-5 flex-1">
              <Text style={{ fontSize: 20, fontWeight: '800', color: '#0f172a' }}>Maya Thompson</Text>
              <View className="flex-row items-center mt-1.5 flex-wrap gap-2">
                <View className="bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                  <Text className="text-blue-700 text-brand-section text-[10px]">Overcomer</Text>
                </View>
                <Text className="text-brand-muted text-brand-sub">Member since Oct 2023</Text>
              </View>
            </View>
          </View>

          {/* Integrated Impact Dashboard */}
          <View className="bg-white rounded-3xl shadow-sm border border-slate-50 mt-8 px-5 py-2 flex-row items-center">
            <ImpactStat value="12" label="Pain Free" icon={Activity} />
            <ImpactStat value="5" label="Circle" icon={Users} isLast />
          </View>
        </View>

        {/* Content Section */}
        <View className="px-6 py-8">

          {/* Medical Section */}
          <View className="mb-8">
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a' }} className="mb-4">Medical Identity</Text>
            <View className="bg-white rounded-3xl shadow-sm border border-gray-100 px-4 overflow-hidden">
              <MenuItem
                icon={<CreditCard size={20} color="#3b82f6" />}
                label="Digital Medical ID"
                subLabel="Essential info for emergency responders"
                onPress={() => router.push('/medical-id')}
              />
              <MenuItem
                icon={<Stethoscope size={20} color="#3b82f6" />}
                label="Healthcare Team"
                subLabel="Doctors, clinics, and specialists"
                onPress={() => router.push('/settings/medical-team')}
              />
              <MenuItem
                icon={<FileText size={20} color="#3b82f6" />}
                label="Medical Records"
                subLabel="Lab results and care plans"
                onPress={() => router.push('/settings/medical-records')}
                isLast
              />
            </View>
          </View>

          {/* Community Section */}
          <View className="mb-8">
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a' }} className="mb-4">Connectivity</Text>
            <View className="bg-white rounded-3xl shadow-sm border border-gray-100 px-4 overflow-hidden">
              <MenuItem
                icon={<Users size={20} color="#3b82f6" />}
                label="My Circle of Care"
                subLabel="Manage friends and family contacts"
                onPress={() => router.push('/circle')}
              />
              <MenuItem
                icon={<Heart size={20} color="#3b82f6" />}
                label="Community Contributions"
                subLabel="Your posts and support history"
                onPress={() => router.push('/community/history')}
                isLast
              />
            </View>
          </View>

          {/* Settings Section */}
          <View className="mb-8">
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a' }} className="mb-4">App Settings</Text>
            <View className="bg-white rounded-3xl shadow-sm border border-gray-100 px-4 overflow-hidden">
              <MenuItem
                icon={<Bell size={20} color="#64748b" />}
                label="Notifications"
                onPress={() => router.push('/settings/notifications')}
              />
              <MenuItem
                icon={<ShieldCheck size={20} color="#64748b" />}
                label="Privacy & Security"
                onPress={() => router.push('/settings/security')}
              />
              <MenuItem
                icon={<CircleHelp size={20} color="#64748b" />}
                label="Help & Support"
                onPress={() => router.push('/settings/help')}
                isLast
              />
            </View>
          </View>

          {/* Destructive Actions */}
          <View className="mb-12">
            <View className="bg-white rounded-3xl shadow-sm border border-gray-100 px-4 overflow-hidden">
              <MenuItem
                icon={<LogOut size={20} color="#EF4444" />}
                label="Logout"
                onPress={() => setShowLogoutSheet(true)}
                isLast
                isDestructive
              />
            </View>
            <Text className="text-center text-gray-400 text-[10px] mt-6 font-medium">
              SickleSafe v1.0.2 (Build 42)
            </Text>
          </View>

        </View>
      </ScrollView>

      <LogoutConfirmSheet
        visible={showLogoutSheet}
        onClose={() => setShowLogoutSheet(false)}
      />
    </View>
  );
}
