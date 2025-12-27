import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import * as Haptics from 'expo-haptics';
import { CountUp, AnimatedProgress } from './SummaryAnimations';

const { width, height } = Dimensions.get('window');

interface AddMenuModalProps {
  visible: boolean;
  onClose: () => void;
  fabRotation: Animated.Value;
}

// Mini Sparkline component
const Sparkline = ({ data, color, width: w, height: h }: { data: number[], color: string, width: number, height: number }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: h, width: w, gap: 2 }}>
      {data.map((value, index) => {
        const barHeight = ((value - min) / range) * h * 0.8 + h * 0.2;
        return (
          <View
            key={index}
            style={{
              flex: 1,
              height: barHeight,
              backgroundColor: index === data.length - 1 ? color : `${color}50`,
              borderRadius: 2,
            }}
          />
        );
      })}
    </View>
  );
};

// Get dynamic greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// Get formatted date
const getFormattedDate = () => {
  const now = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
};

export default function AddMenuModal({ visible, onClose, fabRotation }: AddMenuModalProps) {
  // Animation values
  const scaleAnim1 = useRef(new Animated.Value(0)).current;
  const scaleAnim2 = useRef(new Animated.Value(0)).current;
  const scaleAnim3 = useRef(new Animated.Value(0)).current;
  const scaleAnim4 = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Widget animation values
  const widgetAnim1 = useRef(new Animated.Value(0)).current;
  const widgetAnim2 = useRef(new Animated.Value(0)).current;
  const widgetAnim3 = useRef(new Animated.Value(0)).current;

  // Mock data
  const waterPercent = 64;
  const streakDays = 7;
  const crisisFreeDays = 32;
  const weeklyWaterData = [45, 60, 72, 55, 80, 64, 64];

  useEffect(() => {
    if (visible) {
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Animate widgets with stagger
      Animated.stagger(80, [
        Animated.spring(widgetAnim1, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
        Animated.spring(widgetAnim2, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
        Animated.spring(widgetAnim3, { toValue: 1, tension: 80, friction: 8, useNativeDriver: true }),
      ]).start();

      // Animate menu items
      Animated.stagger(80, [
        Animated.spring(scaleAnim1, { toValue: 1, tension: 100, friction: 7, useNativeDriver: true }),
        Animated.spring(scaleAnim2, { toValue: 1, tension: 100, friction: 7, useNativeDriver: true }),
        Animated.spring(scaleAnim3, { toValue: 1, tension: 100, friction: 7, useNativeDriver: true }),
        Animated.spring(scaleAnim4, { toValue: 1, tension: 100, friction: 7, useNativeDriver: true }),
      ]).start();
    } else {
      backdropOpacity.setValue(0);
      scaleAnim1.setValue(0);
      scaleAnim2.setValue(0);
      scaleAnim3.setValue(0);
      scaleAnim4.setValue(0);
      widgetAnim1.setValue(0);
      widgetAnim2.setValue(0);
      widgetAnim3.setValue(0);
    }
  }, [visible]);

  const handleClose = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(backdropOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim1, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim2, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim3, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim4, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(widgetAnim1, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(widgetAnim2, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(widgetAnim3, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      onClose();
      if (callback) setTimeout(callback, 50);
    });
  };

  if (!visible) return null;

  const rotation = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const greeting = getGreeting();
  const formattedDate = getFormattedDate();

  return (
    <Animated.View style={[styles.container, { opacity: backdropOpacity }]} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Blurred Background */}
      <View style={styles.blurContainer}>
        <BlurView intensity={50} tint="light" style={StyleSheet.absoluteFill} />
      </View>

      {/* Dashboard Content - Upper Half Only */}
      <View style={styles.summaryContainer}>
        {/* Header with Dynamic Greeting */}
        <Animated.View style={[styles.headerRow, {
          opacity: backdropOpacity,
          transform: [{ translateY: backdropOpacity.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }]
        }]}>
          <Text style={styles.greetingText}>{greeting}, Paul</Text>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </Animated.View>

        {/* Streak & Crisis-Free Row */}
        <Animated.View style={[styles.statsRow, {
          opacity: widgetAnim1,
          transform: [{ scale: widgetAnim1 }]
        }]}>
          <View style={styles.statBadge}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{streakDays}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={[styles.statBadge, styles.statBadgeGreen]}>
            <Text style={styles.statEmoji}>💪</Text>
            <Text style={[styles.statValue, { color: '#10B981' }]}>{crisisFreeDays}</Text>
            <Text style={styles.statLabel}>Crisis-Free</Text>
          </View>
        </Animated.View>

        {/* Main Water Widget with Sparkline */}
        <Animated.View style={[styles.widget, styles.glassWidget, {
          opacity: widgetAnim2,
          transform: [{ scale: widgetAnim2 }]
        }]}>
          <View style={styles.widgetHeader}>
            <View style={[styles.inlineIcon, { backgroundColor: '#DBEAFE' }]}>
              <Feather name="droplet" size={14} color="#2563EB" />
            </View>
            <Text style={styles.widgetTitle}>Water Intake</Text>
            <View style={{ flex: 1 }} />
            <Sparkline data={weeklyWaterData} color="#2563EB" width={60} height={20} />
          </View>
          <View style={styles.heroContent}>
            <CountUp to={waterPercent} suffix="%" style={styles.heroValue} />
            <AnimatedProgress progress={waterPercent / 100} color="#2563EB" delay={400} />
            <Text style={styles.heroSubtext}>Goal: 100oz today</Text>
          </View>
        </Animated.View>

        {/* Progress & Energy Row */}
        <Animated.View style={[styles.sideBySideRow, {
          opacity: widgetAnim3,
          transform: [{ scale: widgetAnim3 }]
        }]}>
          <View style={[styles.widget, styles.smallWidget, styles.glassWidget]}>
            <View style={styles.widgetHeader}>
              <View style={[styles.inlineIcon, { backgroundColor: '#DCFCE7' }]}>
                <Feather name="check" size={12} color="#10B981" />
              </View>
              <Text style={styles.smallWidgetTitle}>Progress</Text>
            </View>
            <CountUp to={3} suffix="/5" style={styles.smallWidgetValue} />
            <Text style={styles.smallWidgetSubtext}>Tasks Done</Text>
          </View>

          <View style={[styles.widget, styles.smallWidget, styles.glassWidget]}>
            <View style={styles.widgetHeader}>
              <View style={[styles.inlineIcon, { backgroundColor: '#FEF9C3' }]}>
                <Feather name="zap" size={12} color="#CA8A04" />
              </View>
              <Text style={styles.smallWidgetTitle}>Energy</Text>
            </View>
            <Text style={styles.smallWidgetValue}>Good</Text>
            <Text style={styles.smallWidgetSubtext}>Stable Flow</Text>
          </View>
        </Animated.View>
      </View>

      {/* Radial Menu - Positioned in Clear Area */}
      <View style={styles.menuContainer}>
        <Animated.View style={[styles.menuItem, styles.item1Position, { transform: [{ scale: scaleAnim1 }] }]}>
          <Pressable onPress={() => { alert('New Task (Coming Soon)'); handleClose(); }} style={styles.actionButton}>
            <View style={[styles.iconContainer, styles.blueIcon]}>
              <Feather name="plus-square" size={28} color="#ffffff" />
            </View>
            <Text style={styles.label}>New Task</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.menuItem, styles.item2Position, { transform: [{ scale: scaleAnim2 }] }]}>
          <Pressable onPress={() => { alert('Log Wellness (Coming Soon)'); handleClose(); }} style={styles.actionButton}>
            <View style={[styles.iconContainer, styles.greenIcon]}>
              <Feather name="activity" size={28} color="#ffffff" />
            </View>
            <Text style={styles.label}>Wellness</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.menuItem, styles.item3Position, { transform: [{ scale: scaleAnim3 }] }]}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleClose(() => router.push('/education'));
            }}
            style={styles.actionButton}
          >
            <View style={[styles.iconContainer, styles.orangeIcon]}>
              <Feather name="book-open" size={28} color="#ffffff" />
            </View>
            <Text style={styles.label}>Education</Text>
          </Pressable>
        </Animated.View>

        <Animated.View style={[styles.menuItem, styles.item4Position, { transform: [{ scale: scaleAnim4 }] }]}>
          <Pressable onPress={() => { alert('Create New Post (Coming Soon)'); handleClose(); }} style={styles.actionButton}>
            <View style={[styles.iconContainer, styles.violetIcon]}>
              <Feather name="edit-3" size={28} color="#ffffff" />
            </View>
            <Text style={styles.label}>New Post</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Close Button */}
      <Animated.View style={[styles.clearButton, { transform: [{ rotate: rotation }] }]}>
        <Pressable onPress={() => handleClose()} style={styles.clearButtonInner}>
          <Feather name="plus" size={28} color="#ffffff" />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 999,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  summaryContainer: {
    position: 'absolute',
    top: height * 0.08,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  headerRow: {
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  greetingText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -1,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  statBadge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 243, 199, 0.9)',
    borderRadius: 14,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
  },
  statBadgeGreen: {
    backgroundColor: 'rgba(209, 250, 229, 0.9)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statEmoji: {
    fontSize: 18,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#F59E0B',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  widget: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
  },
  glassWidget: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  inlineIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
  },
  heroContent: {
    alignItems: 'center',
  },
  heroValue: {
    fontSize: 56,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -2,
  },
  heroSubtext: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    marginTop: 6,
  },
  sideBySideRow: {
    flexDirection: 'row',
    gap: 10,
  },
  smallWidget: {
    flex: 1,
    padding: 14,
  },
  smallWidgetTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B7280',
  },
  smallWidgetValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#111827',
    marginTop: 6,
    marginBottom: 2,
  },
  smallWidgetSubtext: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 280,
    zIndex: 3,
  },
  menuItem: {
    position: 'absolute',
  },
  item1Position: {
    bottom: 110,
    left: width / 2 - 135,
  },
  item2Position: {
    bottom: 200,
    left: width / 2 - 90,
  },
  item3Position: {
    bottom: 200,
    right: width / 2 - 90,
  },
  item4Position: {
    bottom: 110,
    right: width / 2 - 135,
  },
  actionButton: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  blueIcon: {
    backgroundColor: '#2563EB',
  },
  greenIcon: {
    backgroundColor: '#10B981',
  },
  violetIcon: {
    backgroundColor: '#8B5CF6',
  },
  orangeIcon: {
    backgroundColor: '#F59E0B',
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  clearButton: {
    position: 'absolute',
    bottom: 44,
    alignSelf: 'center',
    width: 56,
    height: 56,
    zIndex: 10,
  },
  clearButtonInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
});
