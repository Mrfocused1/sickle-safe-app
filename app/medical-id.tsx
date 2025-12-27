import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Share2,
  Hospital,
  Pill,
  AlertTriangle,
  Stethoscope,
  CreditCard,
  ChevronRight,
  AlertCircle
} from 'lucide-react-native';
import QRCode from 'react-native-qrcode-svg';

export default function MedicalIDScreen() {
  const router = useRouter();

  const medicalData = JSON.stringify({
    name: 'Marcus Johnson',
    dob: '1998-08-14',
    bloodType: 'O+',
    allergies: ['Penicillin (severe)'],
    condition: 'Sickle Cell SS',
    emergencyContact: '+15550123456',
    protocol: 'IV Hydration + Morphine, Avoid Demerol'
  });

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />

      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center px-5 mb-6">
          <Pressable
            onPress={() => router.back()}
            className="p-2 rounded-full active:bg-gray-200"
          >
            <ArrowLeft size={24} color="#1f2937" />
          </Pressable>
          <Text className="text-brand-title text-brand-dark">Medical ID</Text>
          <Pressable className="p-2 rounded-full active:bg-gray-200">
            <Share2 size={24} color="#1f2937" />
          </Pressable>
        </View>

        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {/* Main Medical ID Card */}
          <View className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 relative overflow-hidden mb-5">
            {/* Red Top Bar */}
            <View className="absolute top-0 left-0 right-0 h-2 bg-red-700" />

            {/* Header Section */}
            <View className="flex-row items-center justify-between mb-6 mt-2">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-red-100 rounded-full items-center justify-center mr-2">
                  <Hospital size={20} color="#b91c1c" />
                </View>
                <View>
                  <Text className="text-brand-muted text-brand-section text-red-700">
                    Sickle Cell Disease
                  </Text>
                  <Text className="text-xs text-gray-600">Type SS (Severe)</Text>
                </View>
              </View>
              <View className="flex-row items-center px-3 py-1 bg-green-100 border border-green-200 rounded-full">
                <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
                <Text className="text-xs font-semibold text-green-700">Active</Text>
              </View>
            </View>

            {/* Patient Info & QR Code */}
            <View className="flex-row items-start mb-6">
              <View className="flex-1">
                <Text className="text-brand-title text-brand-dark text-2xl mb-1">Marcus Johnson</Text>
                <Text className="text-brand-muted text-[13px] mb-3">DOB: Aug 14, 1998 (25y)</Text>
                <View className="flex-row flex-wrap gap-2">
                  <View className="px-2 py-1 bg-blue-50 border border-blue-100 rounded-md">
                    <Text className="text-xs font-medium text-blue-700">Blood Type: O+</Text>
                  </View>
                  <View className="px-2 py-1 bg-orange-50 border border-orange-100 rounded-md">
                    <Text className="text-xs font-medium text-orange-700">Organ Donor</Text>
                  </View>
                </View>
              </View>

              {/* QR Code */}
              <View className="items-center ml-4">
                <View className="bg-white p-2 border border-gray-200 rounded-lg shadow-sm">
                  <QRCode value={medicalData} size={80} />
                </View>
                <Text className="text-[10px] text-gray-500 font-medium mt-2 text-center">
                  Scan for full records
                </Text>
              </View>
            </View>

            {/* Emergency Contacts */}
            <View className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">
              <View>
                <Text className="text-xs text-gray-500 mb-1">Emergency Contact</Text>
                <Text className="text-brand-label text-brand-dark">Sarah Johnson</Text>
                <Text className="text-xs text-red-600 font-medium">+1 (555) 012-3456</Text>
              </View>
              <View>
                <Text className="text-xs text-gray-500 mb-1">Primary Physician</Text>
                <Text className="text-sm font-semibold text-gray-900">Dr. Emily Chen</Text>
                <Text className="text-xs text-gray-600">City General Hematology</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="flex-row gap-4 mb-5">
            <Pressable className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center active:bg-gray-50">
              <View className="w-12 h-12 rounded-full bg-red-50 items-center justify-center mb-2">
                <Hospital size={24} color="#b91c1c" />
              </View>
              <Text className="text-sm font-semibold text-gray-900">Find Hospital</Text>
            </Pressable>

            <Pressable className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-center active:bg-gray-50">
              <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center mb-2">
                <Pill size={24} color="#3b82f6" />
              </View>
              <Text className="text-sm font-semibold text-gray-900">Current Meds</Text>
            </Pressable>
          </View>

          {/* Medical Profile Sections */}
          <Text className="text-brand-muted text-brand-section mb-4 px-1">Medical Profile</Text>

          {/* Allergies */}
          <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
            <View className="flex-row items-center mb-3">
              <AlertTriangle size={20} color="#f97316" />
              <Text className="ml-3 text-brand-label text-brand-dark">Allergies & Reactions</Text>
            </View>
            <View className="space-y-2">
              <View className="flex-row items-start">
                <View className="w-1.5 h-1.5 rounded-full bg-red-700 mt-1.5 mr-2" />
                <Text className="flex-1 text-sm text-gray-700">
                  <Text className="font-medium">Penicillin:</Text> Severe anaphylaxis
                </Text>
              </View>
              <View className="flex-row items-start">
                <View className="w-1.5 h-1.5 rounded-full bg-red-700 mt-1.5 mr-2" />
                <Text className="flex-1 text-sm text-gray-700">
                  <Text className="font-medium">Latex:</Text> Mild skin irritation
                </Text>
              </View>
            </View>
          </View>

          {/* Crisis Protocol */}
          <View className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <Stethoscope size={20} color="#3b82f6" />
                <Text className="ml-3 text-brand-label text-brand-dark">Crisis Protocol</Text>
              </View>
              <Pressable>
                <Text className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                  View Full
                </Text>
              </Pressable>
            </View>
            <Text className="text-sm text-gray-600 leading-relaxed">
              Patient responds well to <Text className="text-gray-900 font-medium">IV Hydration</Text> and{' '}
              <Text className="text-gray-900 font-medium">Morphine</Text>. Avoid Demerol (previous adverse
              reaction). Target SpO2 {'>'} 95%.
            </Text>
          </View>

          {/* Insurance */}
          <Pressable className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex-row items-center justify-between mb-4 active:bg-gray-50">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-100 rounded-lg items-center justify-center mr-3">
                <CreditCard size={20} color="#6b7280" />
              </View>
              <View>
                <Text className="text-sm font-semibold text-gray-900">Blue Cross Shield</Text>
                <Text className="text-xs text-gray-600">ID: XJ92839102</Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9ca3af" />
          </Pressable>
        </ScrollView>

        {/* Emergency Button (Fixed) */}
        <View className="absolute bottom-6 left-5 right-5">
          <Pressable className="w-full bg-red-700 py-4 rounded-xl shadow-lg active:scale-95">
            <View className="flex-row items-center justify-center">
              <AlertCircle size={20} color="#ffffff" />
              <Text className="ml-3 text-white font-bold text-lg">Activate Emergency Mode</Text>
            </View>
          </Pressable>
        </View>

        {/* Background Accents */}
        <View className="absolute top-0 right-0 w-64 h-64 rounded-full bg-red-500/5 blur-3xl" style={{ pointerEvents: 'none' }} />
        <View className="absolute bottom-20 left-0 w-72 h-72 rounded-full bg-blue-500/5 blur-3xl" style={{ pointerEvents: 'none' }} />
      </SafeAreaView>
    </View>
  );
}
