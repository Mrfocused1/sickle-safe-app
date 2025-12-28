import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';

export default function CharityLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopWidth: 1,
                    borderTopColor: '#f3f4f6',
                    paddingBottom: 24,
                    paddingTop: 12,
                    paddingHorizontal: 12,
                    height: 88,
                },
                tabBarActiveTintColor: '#D97706',
                tabBarInactiveTintColor: '#9ca3af',
                tabBarLabelStyle: {
                    fontSize: 9,
                    fontWeight: '700',
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="campaigns"
                options={{
                    title: 'Campaigns',
                    tabBarIcon: ({ color }) => <MaterialIcons name="campaign" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="impact"
                options={{
                    title: 'Impact',
                    tabBarIcon: ({ color }) => <MaterialIcons name="analytics" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="grants"
                options={{
                    title: 'Grants',
                    tabBarIcon: ({ color }) => <MaterialIcons name="receipt-long" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="community"
                options={{
                    title: 'Community',
                    tabBarIcon: ({ color }) => <MaterialIcons name="groups" size={22} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={22} color={color} />,
                }}
            />
        </Tabs>
    );
}
