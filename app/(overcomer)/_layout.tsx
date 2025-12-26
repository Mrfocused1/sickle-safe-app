import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Pressable, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import AddMenuModal from '../../components/AddMenuModal';

export default function OvercomerLayout() {
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
      <AddMenuModal visible={showAddMenu} onClose={() => setShowAddMenu(false)} fabRotation={rotation} />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderTopWidth: 1,
            borderTopColor: '#e5e7eb',
            paddingBottom: 24,
            paddingTop: 12,
            paddingHorizontal: 24,
            height: 88,
          },
          tabBarActiveTintColor: '#b91c1c',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '500',
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <MaterialIcons name="home" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="log"
          options={{
            title: 'Log',
            tabBarIcon: ({ color }) => <MaterialIcons name="insights" size={24} color={color} />,
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
            tabBarIcon: ({ color }) => <MaterialIcons name="forum" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
