import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  interpolateColor,
} from 'react-native-reanimated';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  color?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  maxLength?: number;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function TextInputField({
  label,
  value,
  onChange,
  placeholder = '',
  color = '#EF4444',
  autoCapitalize = 'words',
  keyboardType = 'default',
  maxLength,
}: TextInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const focus = useSharedValue(0);

  const containerStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focus.value,
      [0, 1],
      ['#E5E7EB', color]
    ),
  }));

  const handleFocus = () => {
    setIsFocused(true);
    focus.value = withSpring(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    focus.value = withSpring(0);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <AnimatedView style={[styles.inputContainer, containerStyle]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          maxLength={maxLength}
        />
        {value.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <X size={18} color="#9CA3AF" />
          </Pressable>
        )}
      </AnimatedView>
      {maxLength && (
        <Text style={styles.charCount}>
          {value.length}/{maxLength}
        </Text>
      )}
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
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingVertical: 16,
  },
  clearButton: {
    padding: 4,
  },
  charCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 8,
  },
});
