import React from 'react';
import { View, Text, Pressable } from 'react-native';

import * as Haptics from 'expo-haptics';

interface CircleMemberAvatarProps {
    name: string;
    isOnline?: boolean;
    onPress?: () => void;
}

export function CircleMemberAvatar({ name, isOnline, onPress }: CircleMemberAvatarProps) {
    const handlePress = async () => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
    };

    return (
        <Pressable onPress={handlePress} className="items-center mr-6 active:opacity-70">
            <View className="relative">
                <View className="w-14 h-14 bg-white rounded-full border-2 border-blue-500 p-0.5">
                    <View className="w-full h-full bg-blue-100 rounded-full items-center justify-center">
                        <Text className="text-blue-700 font-bold text-xl">{name[0]}</Text>
                    </View>
                </View>
                {isOnline && (
                    <View className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                )}
            </View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#0f172a' }} className="mt-2" numberOfLines={1}>
                {name.split(' ')[0]}
            </Text>
        </Pressable>
    );
}
