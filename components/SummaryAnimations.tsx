import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface CountUpProps {
    to: number;
    duration?: number;
    suffix?: string;
    decimals?: number;
    style?: any;
}

export const CountUp = ({ to, duration = 1500, suffix = '', decimals = 0, style }: CountUpProps) => {
    const [count, setCount] = useState(0);
    const animatedValue = new Animated.Value(0);

    useEffect(() => {
        animatedValue.setValue(0);
        Animated.timing(animatedValue, {
            toValue: to,
            duration: duration,
            useNativeDriver: false, // Must be false for listener
        }).start();

        const listenerId = animatedValue.addListener(({ value }) => {
            setCount(value);
        });

        return () => {
            animatedValue.removeListener(listenerId);
        };
    }, [to]);

    return (
        <Text style={style}>
            {count.toFixed(decimals)}
            {suffix}
        </Text>
    );
};

interface AnimatedProgressProps {
    progress: number; // 0 to 1
    color: string;
    delay?: number;
}

export const AnimatedProgress = ({ progress, color, delay = 0 }: AnimatedProgressProps) => {
    const widthAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.sequence([
            Animated.delay(delay),
            Animated.spring(widthAnim, {
                toValue: progress,
                tension: 20,
                friction: 7,
                useNativeDriver: false,
            })
        ]).start();
    }, [progress]);

    return (
        <View style={styles.track}>
            <Animated.View
                style={[
                    styles.fill,
                    {
                        backgroundColor: color,
                        width: widthAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%']
                        })
                    }
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    track: {
        height: 4,
        width: 60,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 2,
        marginTop: 8,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 2,
    },
});
