import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AddScreen() {
  const router = useRouter();

  // Animation values
  const scaleAnim1 = useRef(new Animated.Value(0)).current;
  const scaleAnim2 = useRef(new Animated.Value(0)).current;
  const scaleAnim3 = useRef(new Animated.Value(0)).current;
  const fabRotation = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate backdrop
    Animated.timing(backdropOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Rotate FAB to X
    Animated.timing(fabRotation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Staggered bounce animations for items
    Animated.stagger(80, [
      Animated.spring(scaleAnim1, {
        toValue: 1,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim2, {
        toValue: 1,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim3, {
        toValue: 1,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim1, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim2, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim3, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.back();
    });
  };

  const rotation = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <View style={styles.container}>
      {/* Blurred Background */}
      <Animated.View
        style={[
          styles.blurContainer,
          {
            opacity: backdropOpacity,
          },
        ]}
      >
        <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
      </Animated.View>

      {/* Radial Menu */}
      <View style={styles.menuContainer}>
        {/* Item 1 - Left Up - New Task */}
        <Animated.View
          style={[
            styles.menuItem,
            styles.item1Position,
            {
              transform: [{ scale: scaleAnim1 }],
            },
          ]}
        >
          <Pressable
            onPress={() => {
              // Handle new task
              handleClose();
            }}
            style={styles.actionButton}
          >
            <View style={[styles.iconContainer, styles.blueIcon]}>
              <MaterialIcons name="assignment-add" size={32} color="#ffffff" />
            </View>
            <Text style={styles.label}>New Task</Text>
          </Pressable>
        </Animated.View>

        {/* Item 2 - Center Up - Log Wellness */}
        <Animated.View
          style={[
            styles.menuItem,
            styles.item2Position,
            {
              transform: [{ scale: scaleAnim2 }],
            },
          ]}
        >
          <Pressable
            onPress={() => {
              // Handle log wellness
              handleClose();
            }}
            style={styles.actionButton}
          >
            <View style={[styles.iconContainer, styles.greenIcon]}>
              <MaterialIcons name="monitor-heart" size={32} color="#ffffff" />
            </View>
            <Text style={styles.label}>Log Wellness</Text>
          </Pressable>
        </Animated.View>

        {/* Item 3 - Right Up - Add Contact */}
        <Animated.View
          style={[
            styles.menuItem,
            styles.item3Position,
            {
              transform: [{ scale: scaleAnim3 }],
            },
          ]}
        >
          <Pressable
            onPress={() => {
              // Handle add contact
              handleClose();
            }}
            style={styles.actionButton}
          >
            <View style={[styles.iconContainer, styles.pinkIcon]}>
              <MaterialIcons name="person-add" size={32} color="#ffffff" />
            </View>
            <Text style={styles.label}>Add Contact</Text>
          </Pressable>
        </Animated.View>

        {/* FAB Close Button */}
        <Animated.View
          style={[
            styles.fab,
            {
              transform: [{ rotate: rotation }],
            },
          ]}
        >
          <Pressable
            onPress={handleClose}
            style={styles.fabButton}
          >
            <MaterialIcons name="add" size={40} color="#8B5CF6" />
          </Pressable>
        </Animated.View>
      </View>

      {/* Bottom hint */}
      <Animated.View
        style={[
          styles.hintContainer,
          {
            opacity: backdropOpacity,
          },
        ]}
      >
        <Text style={styles.hintText}>Tap 'x' to close</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 2,
  },
  menuItem: {
    position: 'absolute',
  },
  item1Position: {
    bottom: 200,
    left: 50,
  },
  item2Position: {
    bottom: 280,
    left: width / 2 - 32,
  },
  item3Position: {
    bottom: 200,
    right: 50,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  blueIcon: {
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: '#93C5FD',
  },
  greenIcon: {
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#6EE7B7',
  },
  pinkIcon: {
    backgroundColor: '#EC4899',
    borderWidth: 2,
    borderColor: '#F9A8D4',
  },
  label: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    width: 64,
    height: 64,
    zIndex: 10,
  },
  fabButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  hintContainer: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    zIndex: 2,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontWeight: '500',
  },
});
