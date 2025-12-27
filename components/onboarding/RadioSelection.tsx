import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolateColor,
} from 'react-native-reanimated';

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
}

interface RadioSelectionProps {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  color?: string;
  columns?: 1 | 2;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function RadioOption({
  option,
  isSelected,
  onSelect,
  color,
}: {
  option: Option;
  isSelected: boolean;
  onSelect: () => void;
  color: string;
}) {
  const scale = useSharedValue(1);
  const selected = useSharedValue(isSelected ? 1 : 0);

  React.useEffect(() => {
    selected.value = withSpring(isSelected ? 1 : 0);
  }, [isSelected]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: interpolateColor(
      selected.value,
      [0, 1],
      ['#E5E7EB', color]
    ),
    backgroundColor: interpolateColor(
      selected.value,
      [0, 1],
      ['#FFFFFF', `${color}08`]
    ),
  }));

  const radioStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      selected.value,
      [0, 1],
      ['#D1D5DB', color]
    ),
  }));

  const radioInnerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: selected.value }],
    backgroundColor: color,
  }));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    scale.value = withSpring(0.97, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    onSelect();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[styles.option, containerStyle]}
    >
      <View style={styles.optionContent}>
        {option.icon && <View style={styles.iconContainer}>{option.icon}</View>}
        <View style={styles.textContainer}>
          <Text style={[styles.optionLabel, isSelected && { color }]}>
            {option.label}
          </Text>
          {option.description && (
            <Text style={styles.optionDescription}>{option.description}</Text>
          )}
        </View>
      </View>
      <Animated.View style={[styles.radio, radioStyle]}>
        <Animated.View style={[styles.radioInner, radioInnerStyle]} />
      </Animated.View>
    </AnimatedPressable>
  );
}

export default function RadioSelection({
  label,
  options,
  value,
  onChange,
  color = '#EF4444',
  columns = 1,
}: RadioSelectionProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.optionsContainer, columns === 2 && styles.twoColumns]}>
        {options.map((option) => (
          <RadioOption
            key={option.value}
            option={option}
            isSelected={value === option.value}
            onSelect={() => onChange(option.value)}
            color={color}
          />
        ))}
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
  },
  optionsContainer: {
    gap: 12,
  },
  twoColumns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  optionDescription: {
    fontSize: 13,
    fontWeight: '500',
    color: '#9CA3AF',
    marginTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
