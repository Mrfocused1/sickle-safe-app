import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Pressable, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';

import VolunteerAddMenuModal from '../../components/VolunteerAddMenuModal';

export default function VolunteerLayout() {
    const [showAddMenu, setShowAddMenu] = useState(false);
    const rotation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(rotation, {
            toValue: showAddMenu ? 1 : 0,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [showAddMenu]);

    const rotateInterpolate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '45deg'],
    });

    const handleAddPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setShowAddMenu(!showAddMenu);
    };

    return (
        <>
            <VolunteerAddMenuModal
                visible={showAddMenu}
                onClose={() => setShowAddMenu(false)}
                fabRotation={rotation}
            />
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#ffffff',
                        borderTopWidth: 1,
                        borderTopColor: '#f3f4f6',
                        height: 85,
                        paddingTop: 10,
                    },
                    tabBarActiveTintColor: '#8B5CF6',
                    tabBarInactiveTintColor: '#9ca3af',
                    tabBarLabelStyle: {
                        fontSize: 10,
                        fontWeight: '600',
                        marginBottom: 5,
                    },
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color }) => <MaterialIcons name="home-filled" size={26} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="events"
                    options={{
                        title: 'Events',
                        tabBarIcon: ({ color }) => <MaterialIcons name="event" size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="add"
                    options={{
                        title: '',
                        tabBarIcon: ({ focused }) => (
                            <Pressable onPress={handleAddPress}>
                                <View className="bg-gray-900 w-14 h-14 rounded-full items-center justify-center shadow-lg" style={{ marginTop: -20 }}>
                                    <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                                        <MaterialIcons name="add" size={28} color="#ffffff" />
                                    </Animated.View>
                                </View>
                            </Pressable>
                        ),
                        tabBarLabel: () => null,
                    }}
                    listeners={() => ({
                        tabPress: (e) => {
                            e.preventDefault();
                            handleAddPress();
                        },
                    })}
                />
                <Tabs.Screen
                    name="community"
                    options={{
                        title: 'Community',
                        tabBarIcon: ({ color }) => <MaterialIcons name="groups" size={24} color={color} />,
                    }}
                />
                <Tabs.Screen
                    name="settings"
                    options={{
                        title: 'Settings',
                        tabBarIcon: ({ color }) => <MaterialIcons name="settings" size={24} color={color} />,
                    }}
                />
            </Tabs>
        </>
    );
}
