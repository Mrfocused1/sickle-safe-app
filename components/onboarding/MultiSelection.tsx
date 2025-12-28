import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
    interpolateColor,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';

interface Option {
    value: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
}

interface MultiSelectionProps {
    label: string;
    options: Option[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    color?: string;
    variant?: 'default' | 'aura';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function MultiOption({
    option,
    isSelected,
    onToggle,
    color,
    variant = 'default',
}: {
    option: Option;
    isSelected: boolean;
    onToggle: () => void;
    color: string;
    variant?: 'default' | 'aura';
}) {
    const scale = useSharedValue(1);
    const selected = useSharedValue(isSelected ? 1 : 0);

    React.useEffect(() => {
        selected.value = withSpring(isSelected ? 1 : 0);
    }, [isSelected]);

    const isAura = variant === 'aura';

    const containerStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        borderColor: interpolateColor(
            selected.value,
            [0, 1],
            [isAura ? 'rgba(255,255,255,0.15)' : '#E5E7EB', color]
        ),
        backgroundColor: interpolateColor(
            selected.value,
            [0, 1],
            [isAura ? 'rgba(255,255,255,0.08)' : '#FFFFFF', isAura ? 'rgba(239,68,68,0.15)' : `${color}08`]
        ),
        borderWidth: isAura ? 1 : 2,
    }));

    const indicatorStyle = useAnimatedStyle(() => ({
        borderColor: interpolateColor(
            selected.value,
            [0, 1],
            [isAura ? 'rgba(255,255,255,0.3)' : '#D1D5DB', color]
        ),
        backgroundColor: interpolateColor(
            selected.value,
            [0, 1],
            ['transparent', isAura && !isSelected ? 'transparent' : color]
        ),
        borderWidth: isAura ? 1 : 2,
    }));

    const checkStyle = useAnimatedStyle(() => ({
        transform: [{ scale: selected.value }],
        opacity: selected.value,
    }));

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        scale.value = withSpring(0.97, { damping: 15 }, () => {
            scale.value = withSpring(1);
        });
        onToggle();
    };

    return (
        <AnimatedPressable
            onPress={handlePress}
            style={[styles.option, isAura && styles.optionAura, containerStyle]}
        >
            <View style={styles.optionContent}>
                {option.icon && <View style={styles.iconContainer}>{option.icon}</View>}
                <View style={styles.textContainer}>
                    <Text style={[
                        styles.optionLabel,
                        isAura && styles.optionLabelAura,
                        isSelected && { color: isAura ? '#FFF' : color }
                    ]}>
                        {option.label}
                    </Text>
                    {option.description && (
                        <Text style={[
                            styles.optionDescription,
                            isAura && styles.optionDescriptionAura
                        ]}>
                            {option.description}
                        </Text>
                    )}
                </View>
            </View>
            <Animated.View style={[
                styles.indicator,
                isAura && styles.indicatorAura,
                indicatorStyle
            ]}>
                <Animated.View style={checkStyle}>
                    <Check size={14} color={isAura ? "#FFF" : "#FFF"} strokeWidth={3} />
                </Animated.View>
            </Animated.View>
        </AnimatedPressable>
    );
}

export default function MultiSelection({
    label,
    options,
    selectedValues,
    onChange,
    color = '#EF4444',
    variant = 'default',
}: MultiSelectionProps) {
    const handleToggle = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter((v) => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    return (
        <View style={styles.container}>
            {label ? <Text style={[styles.label, variant === 'aura' && { color: '#FFF' }]}>{label}</Text> : null}
            <View style={styles.optionsContainer}>
                {options.map((option) => (
                    <MultiOption
                        key={option.value}
                        option={option}
                        isSelected={selectedValues.includes(option.value)}
                        onToggle={() => handleToggle(option.value)}
                        color={color}
                        variant={variant}
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
    indicator: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    indicatorAura: {
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    optionAura: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1,
    },
    optionLabelAura: {
        color: '#E5E7EB',
    },
    optionDescriptionAura: {
        color: '#9CA3AF',
    },
});
