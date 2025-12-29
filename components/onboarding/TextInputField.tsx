import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { X } from 'lucide-react-native';

interface TextInputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  color?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  maxLength?: number;
  autoFocus?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  variant?: 'default' | 'aura';
}

export default function TextInputField({
  label,
  value,
  onChange,
  placeholder = '',
  color = '#EF4444',
  autoCapitalize = 'words',
  keyboardType = 'default',
  maxLength,
  autoFocus = false,
  multiline = false,
  numberOfLines = 1,
  variant = 'default',
}: TextInputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
  };

  const isAura = variant === 'aura';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, isAura && styles.labelAura]}>{label}</Text>
      <View style={[
        styles.inputContainer,
        isAura && styles.inputContainerAura,
        { borderColor: isFocused ? (isAura ? 'rgba(239, 68, 68, 0.5)' : color) : (isAura ? 'rgba(255,255,255,0.15)' : '#E5E7EB') }
      ]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={isAura ? 'rgba(255,255,255,0.4)' : '#9CA3AF'}
          style={[
            styles.input,
            isAura && styles.inputAura,
            multiline && styles.inputMultiline
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoFocus={autoFocus}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
        {value.length > 0 && (
          <Pressable onPress={handleClear} style={styles.clearButton}>
            <X size={18} color={isAura ? 'rgba(255,255,255,0.4)' : '#9CA3AF'} />
          </Pressable>
        )}
      </View>
      {maxLength && (
        <Text style={[styles.charCount, isAura && styles.charCountAura]}>
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
  labelAura: {
    color: '#FFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  inputContainerAura: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    paddingVertical: 16,
  },
  inputAura: {
    color: '#FFF',
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 16,
    paddingBottom: 16,
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
  charCountAura: {
    color: 'rgba(255,255,255,0.4)',
  },
});
