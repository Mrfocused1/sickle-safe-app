import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Heart, Users, HandHeart, ArrowRight } from 'lucide-react-native';

type Role = 'warrior' | 'helper' | 'volunteer';

interface RoleData {
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Heart;
  color: string;
  bgColor: string;
}

const rolesData: Record<Role, RoleData> = {
  warrior: {
    title: 'The Warrior (Patient/Self-Manager)',
    subtitle: 'I am living with Sickle Cell',
    description: 'Track pain crises, hydration, and manage your health journey with personalized insights and reminders.',
    icon: Heart,
    color: '#2563eb',
    bgColor: '#dbeafe',
  },
  helper: {
    title: 'The Helper (Guardian or Carer)',
    subtitle: 'I am a Caregiver / Guardian',
    description: 'Monitor loved ones, receive alerts, and coordinate care with shared health logs and communication tools.',
    icon: Users,
    color: '#059669',
    bgColor: '#d1fae5',
  },
  volunteer: {
    title: 'The Volunteer (Supporter)',
    subtitle: 'I am a Community Volunteer',
    description: 'Connect with patients and support community events, contributing to a stronger network of care and awareness.',
    icon: HandHeart,
    color: '#ea580c',
    bgColor: '#fed7aa',
  },
};

export default function RoleSelectionScreen() {
  const [selectedRole, setSelectedRole] = useState<Role>('warrior');
  const router = useRouter();

  const handleContinue = () => {
    if (selectedRole === 'warrior') {
      router.push('/(onboarding)/warrior/productivity');
    } else if (selectedRole === 'helper') {
      router.push('/(onboarding)/helper/real-time-alerts');
    } else {
      router.push('/(onboarding)/volunteer/advocacy');
    }
  };

  const currentRoleData = rolesData[selectedRole];

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <SafeAreaView className="flex-1">
        {/* Progress Bar */}
        <View className="px-6 mb-6">
          <View className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <View className="h-full w-1/4 bg-violet-600 rounded-full" />
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold mb-3 tracking-tight text-gray-900">
              Welcome to{'\n'}
              <Text className="text-violet-600">Sickle Safe</Text>
            </Text>
            <Text className="text-lg text-gray-600 leading-relaxed">
              Please select your role to customize your experience.
            </Text>
          </View>

          {/* Role Cards (Horizontal Scroll) */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6 -mx-6 px-6"
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {(Object.keys(rolesData) as Role[]).map((role) => {
              const roleData = rolesData[role];
              const Icon = roleData.icon;
              const isSelected = selectedRole === role;

              return (
                <Pressable
                  key={role}
                  onPress={() => setSelectedRole(role)}
                  className={`w-32 h-36 mr-4 rounded-xl border-2 ${isSelected ? 'border-violet-600 bg-violet-50' : 'border-gray-200 bg-white'
                    } shadow-sm`}
                >
                  <View className="flex-1 items-center justify-center p-4">
                    <View
                      className="w-14 h-14 rounded-full items-center justify-center mb-2"
                      style={{ backgroundColor: roleData.bgColor }}
                    >
                      <Icon size={28} color={roleData.color} />
                    </View>
                    <Text className={`font-bold text-base text-center ${isSelected ? 'text-gray-900' : 'text-gray-600'
                      }`}>
                      {role === 'warrior' ? 'The Warrior' : role === 'helper' ? 'The Helper' : 'The Volunteer'}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Description Panel */}
          <View className="flex-1 bg-white p-6 rounded-2xl shadow-md mb-8">
            <Text className="font-bold text-xl text-gray-900 mb-2">
              {currentRoleData.title}
            </Text>
            <Text className="font-medium text-violet-600 mb-3">
              {currentRoleData.subtitle}
            </Text>
            <Text className="text-base text-gray-600 leading-relaxed">
              {currentRoleData.description}
            </Text>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View className="px-6 pb-6">
          <Pressable
            onPress={handleContinue}
            className="w-full bg-violet-600 py-4 rounded-2xl shadow-lg active:scale-95"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white font-semibold text-lg">Continue</Text>
              <ArrowRight size={20} color="#ffffff" className="ml-2" />
            </View>
          </Pressable>
          <Text className="text-center text-xs text-gray-500 mt-4">
            Your role helps us personalize emergency features.
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
