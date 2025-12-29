import { Tabs, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Pressable, Animated } from 'react-native';
import { useState, useRef, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import AddMenuModal from '../../components/AddMenuModal';
import { userProfileStorage } from '../../services/userProfileStorage';
import { healthLogStorage } from '../../services/healthLogStorage';
import { messagingStorage } from '../../services/messagingStorage';

export default function OvercomerLayout() {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: showAddMenu ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [showAddMenu]);

  // Load unread message count
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        await messagingStorage.initializeWithMockData();
        const count = await messagingStorage.getTotalUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Error loading unread count:', error);
      }
    };
    loadUnreadCount();
  }, [showAddMenu]); // Refresh when menu closes

  // Auto-populate medications based on sickle cell type from onboarding
  useEffect(() => {
    const initializeMedications = async () => {
      try {
        // Check if medications have already been initialized
        const isInitialized = await userProfileStorage.isMedicationsInitialized();
        if (isInitialized) return;

        // Get user's sickle cell types from onboarding
        const sickleCellTypes = await userProfileStorage.getSickleCellTypes();
        if (sickleCellTypes.length === 0) return;

        // Initialize medications based on sickle cell type
        await healthLogStorage.initializeMedicationsForSickleCellType(sickleCellTypes);

        // Mark as initialized so we don't re-populate
        await userProfileStorage.setMedicationsInitialized();

        console.log('Medications auto-populated for types:', sickleCellTypes);
      } catch (error) {
        console.error('Error initializing medications:', error);
      }
    };

    initializeMedications();
  }, []);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowAddMenu(!showAddMenu);
  };

  const handleOpenMessages = () => {
    router.push({ pathname: '/(overcomer)', params: { openMessages: 'true' } });
  };

  return (
    <>
      <AddMenuModal
        visible={showAddMenu}
        onClose={() => setShowAddMenu(false)}
        fabRotation={rotation}
        onOpenMessages={handleOpenMessages}
        unreadCount={unreadCount}
      />
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
          tabBarActiveTintColor: '#8B5CF6',
          tabBarInactiveTintColor: '#9ca3af',
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
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
            tabBarIcon: ({ color }) => <MaterialIcons name="groups" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => <MaterialIcons name="person" size={24} color={color} />,
          }}
        />
        <Tabs.Screen
          name="funding"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  );
}
