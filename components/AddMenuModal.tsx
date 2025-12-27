import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Dimensions, Modal } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

import * as Haptics from 'expo-haptics';
import { CountUp, AnimatedProgress } from './SummaryAnimations';

const { width, height } = Dimensions.get('window');

interface AddMenuModalProps {
  visible: boolean;
  onClose: () => void;
  fabRotation: Animated.Value;
}

export default function AddMenuModal({ visible, onClose, fabRotation }: AddMenuModalProps) {
  const scaleAnim1 = useRef(new Animated.Value(0)).current;
  const scaleAnim2 = useRef(new Animated.Value(0)).current;
  const scaleAnim3 = useRef(new Animated.Value(0)).current;
  const scaleAnim4 = useRef(new Animated.Value(0)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      // Animate menu items immediately with stagger
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
        Animated.spring(scaleAnim4, {
          toValue: 1,
          tension: 100,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      backdropOpacity.setValue(0);
      scaleAnim1.setValue(0);
      scaleAnim2.setValue(0);
      scaleAnim3.setValue(0);
      scaleAnim4.setValue(0);
    }
  }, [visible]);

  const handleClose = (callback?: () => void) => {
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
      Animated.timing(scaleAnim4, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
      if (callback) {
        setTimeout(callback, 50);
      }
    });
  };

  if (!visible) return null;

  const rotation = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: backdropOpacity }]} pointerEvents={visible ? 'auto' : 'none'}>
      {/* Blurred Background */}
      <View style={styles.blurContainer}>
        <BlurView intensity={32} tint="light" style={StyleSheet.absoluteFill} />
      </View>

      {/* At a Glance Summary - iOS Dashboard Style */}
      <Animated.View
        style={[
          styles.summaryContainer,
          {
            opacity: backdropOpacity,
            transform: [{
              translateY: backdropOpacity.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0]
              })
            }]
          }
        ]}
      >
        <View style={styles.headerRow}>
          <Text style={styles.greetingText}>Good Morning, Paul</Text>
          <Text style={styles.dateText}>Friday, December 26</Text>
        </View>

        <View style={styles.widgetContainer}>
          {/* Hero Widget - Primary Focus */}
          <View style={[styles.widget, styles.heroWidget]}>
            <View style={styles.widgetHeader}>
              <View style={[styles.inlineIcon, { backgroundColor: '#DBEAFE' }]}>
                <Feather name="droplet" size={14} color="#2563EB" />
              </View>
              <Text style={styles.widgetTitle}>Water Intake</Text>
            </View>
            <View style={styles.heroContent}>
              <CountUp to={64} suffix="%" style={styles.heroValue} />
              <AnimatedProgress progress={0.64} color="#2563EB" delay={400} />
              <Text style={styles.heroSubtext}>Goal: 100oz today</Text>
            </View>
          </View>

          {/* Secondary Widgets Row */}
          <View style={styles.sideBySideRow}>
            <View style={[styles.widget, styles.smallWidget]}>
              <View style={styles.widgetHeader}>
                <View style={[styles.inlineIcon, { backgroundColor: '#DCFCE7' }]}>
                  <Feather name="check" size={12} color="#10B981" />
                </View>
                <Text style={styles.smallWidgetTitle}>Progress</Text>
              </View>
              <CountUp to={3} suffix="/5" style={styles.smallWidgetValue} />
              <Text style={styles.smallWidgetSubtext}>Tasks Done</Text>
            </View>

            <View style={[styles.widget, styles.smallWidget]}>
              <View style={styles.widgetHeader}>
                <View style={[styles.inlineIcon, { backgroundColor: '#FEF9C3' }]}>
                  <Feather name="zap" size={12} color="#CA8A04" />
                </View>
                <Text style={styles.smallWidgetTitle}>Energy</Text>
              </View>
              <Text style={styles.smallWidgetValue}>Good</Text>
              <Text style={styles.smallWidgetSubtext}>Stable Flow</Text>
            </View>
          </View>
        </View>
      </Animated.View>

      {/* Radial Menu */}
      <View style={styles.menuContainer}>
        {/* Item 1 - Left - New Task */}
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
              alert('New Task (Coming Soon)');
              handleClose();
            }}
            style={styles.actionButton}
          >
            <View style={[styles.iconContainer, styles.blueIcon]}>
              <Feather name="plus-square" size={32} color="#ffffff" />
            </View>
            <Text style={styles.label}>New Task</Text>
          </Pressable>
        </Animated.View>

        {/* Item 2 - Center Up-Left - Log Wellness */}
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
              alert('Log Wellness (Coming Soon)');
              handleClose();
            }}
            style={styles.actionButton}
          >
            <View style={[styles.iconContainer, styles.greenIcon]}>
              <Feather name="activity" size={32} color="#ffffff" />
            </View>
            <Text style={styles.label}>Wellness</Text>
          </Pressable>
        </Animated.View>

        {/* Item 3 - Center Up-Right - Education */}
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
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleClose(() => {
                router.push('/education');
              });
            }}
            style={styles.actionButton}
          >
            <View style={[styles.iconContainer, styles.orangeIcon]}>
              <Feather name="book-open" size={32} color="#ffffff" />
            </View>
            <Text style={styles.label}>Education</Text>
          </Pressable>
        </Animated.View>

        {/* Item 4 - Far Right - New Post */}
        <Animated.View
          style={[
            styles.menuItem,
            styles.item4Position,
            {
              transform: [{ scale: scaleAnim4 }],
            },
          ]}
        >
          <Pressable
            onPress={() => {
              alert('Create New Post (Coming Soon)');
              handleClose();
            }}
            style={styles.actionButton}
          >
            <View style={[styles.iconContainer, styles.violetIcon]}>
              <Feather name="edit-3" size={32} color="#ffffff" />
            </View>
            <Text style={styles.label}>New Post</Text>
          </Pressable>
        </Animated.View>
      </View>

      {/* Clear Black Button (not blurred) */}
      <Animated.View
        style={[
          styles.clearButton,
          {
            transform: [{ rotate: rotation }],
          },
        ]}
      >
        <Pressable
          onPress={handleClose}
          style={styles.clearButtonInner}
        >
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
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 3,
  },
  menuItem: {
    position: 'absolute',
  },
  item1Position: {
    bottom: 100,
    left: width / 2 - 140,
  },
  item2Position: {
    bottom: 210,
    left: width / 2 - 100,
  },
  item3Position: {
    bottom: 210,
    left: width / 2 + 36,
  },
  item4Position: {
    bottom: 100,
    left: width / 2 + 76,
  },
  actionButton: {
    alignItems: 'center',
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
  violetIcon: {
    backgroundColor: '#8B5CF6',
    borderWidth: 2,
    borderColor: '#C4B5FD',
  },
  orangeIcon: {
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#FDE68A',
  },
  label: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
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
    backgroundColor: '#1f2937',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  summaryContainer: {
    position: 'absolute',
    top: height * 0.12,
    left: 16,
    right: 16,
    zIndex: 2,
  },
  headerRow: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  greetingText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -1.2,
  },
  dateText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginTop: 2,
    letterSpacing: -0.2,
  },
  widgetContainer: {
    gap: 12,
  },
  widget: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  heroWidget: {
    width: '100%',
    paddingBottom: 24,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  inlineIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4b5563',
    letterSpacing: -0.3,
  },
  heroContent: {
    alignItems: 'center',
    marginTop: 8,
  },
  heroValue: {
    fontSize: 72,
    fontWeight: '900',
    color: '#111827',
    letterSpacing: -3,
    marginBottom: 4,
  },
  heroSubtext: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6b7280',
    marginTop: 12,
  },
  sideBySideRow: {
    flexDirection: 'row',
    gap: 12,
  },
  smallWidget: {
    flex: 1,
    padding: 18,
  },
  smallWidgetTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4b5563',
    letterSpacing: -0.2,
  },
  smallWidgetValue: {
    fontSize: 26,
    fontWeight: '900',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.8,
  },
  smallWidgetSubtext: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
  },
});
