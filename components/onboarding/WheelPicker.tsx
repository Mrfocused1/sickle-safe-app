import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

interface WheelPickerProps {
  label: string;
  items: { value: string | number; label: string }[];
  selectedValue: string | number;
  onChange: (value: string | number) => void;
  color?: string;
}

function WheelItem({
  item,
  index,
  scrollY,
  color,
}: {
  item: { value: string | number; label: string };
  index: number;
  scrollY: Animated.SharedValue<number>;
  color: string;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
      (index + 2) * ITEM_HEIGHT,
    ];

    const scale = interpolate(
      scrollY.value,
      inputRange,
      [0.7, 0.85, 1, 0.85, 0.7],
      'clamp'
    );

    const opacity = interpolate(
      scrollY.value,
      inputRange,
      [0.3, 0.5, 1, 0.5, 0.3],
      'clamp'
    );

    const rotateX = interpolate(
      scrollY.value,
      inputRange,
      [60, 30, 0, -30, -60],
      'clamp'
    );

    return {
      transform: [
        { scale },
        { perspective: 500 },
        { rotateX: `${rotateX}deg` },
      ],
      opacity,
    };
  });

  const textStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
    ];

    const isSelected = interpolate(
      scrollY.value,
      inputRange,
      [0, 1, 0],
      'clamp'
    );

    return {
      color: isSelected > 0.5 ? color : '#9CA3AF',
      fontWeight: isSelected > 0.5 ? '800' : '600',
    };
  });

  return (
    <Animated.View style={[styles.item, animatedStyle]}>
      <Animated.Text style={[styles.itemText, textStyle]}>
        {item.label}
      </Animated.Text>
    </Animated.View>
  );
}

export default function WheelPicker({
  label,
  items,
  selectedValue,
  onChange,
  color = '#EF4444',
}: WheelPickerProps) {
  const scrollY = useSharedValue(0);
  const lastIndex = useRef(-1);

  const initialIndex = items.findIndex((item) => item.value === selectedValue);
  const initialOffset = initialIndex * ITEM_HEIGHT;

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleChange = useCallback((index: number) => {
    if (items[index]) {
      onChange(items[index].value);
    }
  }, [items, onChange]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      const currentIndex = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      if (currentIndex !== lastIndex.current && currentIndex >= 0 && currentIndex < items.length) {
        lastIndex.current = currentIndex;
        runOnJS(triggerHaptic)();
      }
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.y / ITEM_HEIGHT);
      if (index >= 0 && index < items.length) {
        runOnJS(handleChange)(index);
      }
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.wheelContainer}>
        {/* Selection indicator */}
        <View style={[styles.selectionIndicator, { borderColor: color }]} />

        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 2,
          }}
          contentOffset={{ x: 0, y: initialOffset }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        >
          {items.map((item, index) => (
            <WheelItem
              key={item.value}
              item={item}
              index={index}
              scrollY={scrollY}
              color={color}
            />
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
    textAlign: 'center',
  },
  wheelContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    alignSelf: 'center',
    width: width * 0.6,
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    zIndex: 1,
    pointerEvents: 'none',
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 22,
  },
});
