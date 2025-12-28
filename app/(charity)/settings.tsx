import { View, Text } from 'react-native';

export default function SettingsScreen() {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <Text className="text-xl font-bold">Organization Settings</Text>
            <Text className="text-gray-500 mt-2">Manage your profile and team.</Text>
        </View>
    );
}
