import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';

interface Option {
  value: string;
  label: string;
  emoji?: string;
}

interface ChipSelectionProps {
  label: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  color?: string;
  maxSelections?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function Chip({
  option,
  isSelected,
  onToggle,
  color,
  disabled,
}: {
  option: Option;
  isSelected: boolean;
  onToggle: () => void;
  color: string;
  disabled: boolean;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled && !isSelected) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.9, { damping: 15 }, () => {
      scale.value = withSpring(1);
    });
    onToggle();
  };

  return (
    <AnimatedPressable
      onPress={handlePress}
      style={[
        styles.chip,
        animatedStyle,
        isSelected && { backgroundColor: color, borderColor: color },
        disabled && !isSelected && styles.chipDisabled,
      ]}
    >
      {option.emoji && <Text style={styles.emoji}>{option.emoji}</Text>}
      <Text
        style={[
          styles.chipLabel,
          isSelected && styles.chipLabelSelected,
          disabled && !isSelected && styles.chipLabelDisabled,
        ]}
      >
        {option.label}
      </Text>
    </AnimatedPressable>
  );
}

export default function ChipSelection({
  label,
  options,
  selectedValues,
  onChange,
  color = '#EF4444',
  maxSelections,
}: ChipSelectionProps) {
  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((v) => v !== value));
    } else {
      if (maxSelections && selectedValues.length >= maxSelections) {
        // Replace the first selected item
        onChange([...selectedValues.slice(1), value]);
      } else {
        onChange([...selectedValues, value]);
      }
    }
  };

  const isMaxReached = maxSelections ? selectedValues.length >= maxSelections : false;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        {maxSelections && (
          <Text style={styles.counter}>
            {selectedValues.length}/{maxSelections}
          </Text>
        )}
      </View>
      <View style={styles.chipsContainer}>
        {options.map((option) => (
          <Chip
            key={option.value}
            option={option}
            isSelected={selectedValues.includes(option.value)}
            onToggle={() => handleToggle(option.value)}
            color={color}
            disabled={isMaxReached}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  counter: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  chipDisabled: {
    opacity: 0.5,
  },
  emoji: {
    fontSize: 16,
    marginRight: 6,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  chipLabelSelected: {
    color: '#FFFFFF',
  },
  chipLabelDisabled: {
    color: '#9CA3AF',
  },
});
