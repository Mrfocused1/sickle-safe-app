import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, Megaphone, PenTool, X } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

function ActionButton({ icon: Icon, label, color, onPress }: { icon: any, label: string, color: string, onPress: () => void }) {
    return (
        <Pressable
            onPress={onPress}
            className="items-center justify-center gap-3 p-4 rounded-3xl bg-white border border-gray-100 shadow-sm active:scale-95 transition-all"
            style={{ width: width * 0.4, height: width * 0.4 }}
        >
            <View className={`w-14 h-14 rounded-2xl items-center justify-center`} style={{ backgroundColor: `${color}15` }}>
                <Icon size={28} color={color} />
            </View>
            <Text className="text-gray-900 font-bold text-center text-sm">{label}</Text>
        </Pressable>
    );
}

export default function AddActionModal() {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-end bg-black/40">
            <View className="w-full bg-white rounded-t-[40px] p-8 pb-12">
                <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-8" />

                <Text className="text-2xl font-black text-gray-900 text-center mb-2">Make an Impact</Text>
                <Text className="text-gray-500 font-medium text-center mb-8">Choose how you want to contribute today.</Text>

                <View className="flex-row flex-wrap justify-center gap-4 mb-8">
                    <ActionButton
                        icon={Calendar}
                        label="Host Event"
                        color="#8B5CF6"
                        onPress={() => { router.back(); alert('Host Event Flow'); }}
                    />
                    <ActionButton
                        icon={Megaphone}
                        label="Share Update"
                        color="#EF4444"
                        onPress={() => { router.back(); router.push('/community/compose'); }}
                    />
                    <ActionButton
                        icon={PenTool}
                        label="Write Post"
                        color="#F59E0B"
                        onPress={() => { router.back(); router.push('/community/compose'); }}
                    />
                    <ActionButton
                        icon={Calendar}
                        label="Log Hours"
                        color="#10B981"
                        onPress={() => { router.back(); alert('Log Hours Flow'); }}
                    />
                </View>

                <Pressable
                    onPress={() => router.back()}
                    className="w-14 h-14 rounded-full bg-gray-100 items-center justify-center self-center"
                >
                    <X size={24} color="#6B7280" />
                </Pressable>
            </View>
        </View>
    );
}
