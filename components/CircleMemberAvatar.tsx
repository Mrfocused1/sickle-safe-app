import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface CircleMemberAvatarProps {
    name: string;
    isOnline?: boolean;
}

export function CircleMemberAvatar({ name, isOnline }: CircleMemberAvatarProps) {
    return (
        <Pressable className="items-center mr-6">
            <View className="relative">
                <View className="w-14 h-14 bg-white rounded-full border-2 border-violet-500 p-0.5">
                    <View className="w-full h-full bg-violet-100 rounded-full items-center justify-center">
                        <Text className="text-violet-700 font-bold text-xl">{name[0]}</Text>
                    </View>
                </View>
                {isOnline && (
                    <View className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
                )}
            </View>
            <Text className="text-brand-dark text-brand-sub mt-2" numberOfLines={1}>
                {name.split(' ')[0]}
            </Text>
        </Pressable>
    );
}
