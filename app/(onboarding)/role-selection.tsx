import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Heart, Users, HandHeart, ArrowRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

type Role = 'overcomer' | 'helper' | 'volunteer';

interface RoleData {
  title: string;
  subtitle: string;
  description: string;
  icon: typeof Heart;
  color: string;
  bgColor: string;
}

// RoleSelectionScreen moved rolesData inside

export default function RoleSelectionScreen() {
  console.log('RoleSelectionScreen rendering...');
  const [selectedRole, setSelectedRole] = useState<Role>('overcomer');

  const rolesData: Record<Role, RoleData> = {
    overcomer: {
      title: 'The Overcomer',
      subtitle: 'Patient / Self-Manager',
      description: 'Track pain crises, hydration, and manage your health journey with personalized insights.',
      icon: Heart,
      color: '#EF4444',
      bgColor: '#FEF2F2',
    },
    helper: {
      title: 'The Helper',
      subtitle: 'Guardian or Carer',
      description: 'Monitor loved ones, receive alerts, and coordinate care with shared health logs.',
      icon: Users,
      color: '#10B981',
      bgColor: '#ECFDF5',
    },
    volunteer: {
      title: 'The Volunteer',
      subtitle: 'Community Supporter',
      description: 'Connect with patients and support community events, contributing to a stronger network of care.',
      icon: HandHeart,
      color: '#3B82F6',
      bgColor: '#EFF6FF',
    },
  };

  const handleContinue = () => {
    if (selectedRole === 'overcomer') {
      router.push('/(onboarding)/overcomer/productivity');
    } else if (selectedRole === 'helper') {
      router.push('/(onboarding)/helper/real-time-alerts');
    } else {
      router.push('/(onboarding)/volunteer/advocacy');
    }
  };

  const currentRoleData = rolesData[selectedRole];

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Video Background */}
      <Video
        source={{ uri: 'https://assets.mixkit.co/videos/preview/mixkit-diverse-group-of-people-talking-and-gesticulating-41310-large.mp4' }}
        rate={1.0}
        volume={0}
        isMuted={true}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={['rgba(255,255,255,0.6)', 'rgba(255,255,255,0.2)', 'rgba(255,255,255,0.9)']}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        {/* Logo at Top (Triple Size, No BG) */}
        <View className="items-center mt-2">
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: width * 0.55, height: 90 }}
            resizeMode="contain"
          />
        </View>

        {/* Sub-Progress - Step 3 of 3 */}
        <View className="px-8 mt-4 mb-4">
          <View className="flex-row gap-1.5 justify-center">
            <View className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <View className="w-2.5 h-2.5 rounded-full bg-gray-300" />
            <View className="w-8 h-2.5 rounded-full bg-red-600" />
          </View>
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-8" showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View className="mb-6">
            <Text className="text-4xl font-black text-gray-900 leading-none tracking-tighter mb-4">
              Step Into Your{'\n'}
              <Text className="text-red-500">New Role</Text>
            </Text>
            <Text className="text-base text-gray-700 font-bold leading-relaxed">
              Select how you'll be participating in the community.
            </Text>
          </View>

          {/* Role Cards */}
          <View className="space-y-4 mb-6">
            {(Object.keys(rolesData) as Role[]).map((role) => {
              const roleData = rolesData[role];
              // Temporarily replace Icon with a simple View to test for context issues
              // const Icon = roleData.icon;
              const isSelected = selectedRole === role;

              return (
                <Pressable
                  key={role}
                  onPress={() => setSelectedRole(role)}
                  className={`p-5 rounded-[32px] border-2 flex-row items-center ${isSelected ? 'border-red-600 bg-white shadow-xl' : 'border-gray-200 bg-white/40'
                    }`}
                >
                  <View
                    className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                    style={{ backgroundColor: roleData.bgColor }}
                  >
                    <View className="w-6 h-6 rounded-full" style={{ backgroundColor: roleData.color }} />
                  </View>
                  <View className="flex-1">
                    <Text className={`font-black text-lg ${isSelected ? 'text-gray-900' : 'text-gray-400'}`}>
                      {roleData.title}
                    </Text>
                    <Text className={`font-bold text-[10px] uppercase tracking-widest mt-0.5 ${isSelected ? 'text-red-600' : 'text-gray-400'}`}>
                      {roleData.subtitle}
                    </Text>
                  </View>
                  <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${isSelected ? 'border-red-600 bg-red-600' : 'border-gray-300'}`}>
                    {isSelected && <View className="w-2 h-2 rounded-full bg-white" />}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Description Panel */}
          <View className="bg-red-50 p-6 rounded-3xl border border-red-100 mb-8">
            <Text className="text-gray-700 text-sm leading-relaxed font-bold">
              {currentRoleData.description}
            </Text>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View className="px-8 pb-10">
          <Pressable
            onPress={handleContinue}
            className="w-full bg-red-600 py-6 rounded-[24px] shadow-xl shadow-red-900/20 active:scale-[0.98] relative overflow-hidden"
          >
            <View className="flex-row items-center justify-center">
              <Text className="text-white font-black text-xl tracking-wide">Enter Dashboard</Text>
              <View className="ml-3 bg-white/20 p-1.5 rounded-full">
                <ArrowRight size={24} color="#ffffff" />
              </View>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}
