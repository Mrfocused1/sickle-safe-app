import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, Pressable, Dimensions, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import OnboardingProgress from '../../components/OnboardingProgress';

const { width, height } = Dimensions.get('window');

// Video sources
const VIDEO_1 = require('../../assets/intro video 1.mp4');
const VIDEO_2 = require('../../assets/intro vid v2.mp4');
const VIDEO_3 = require('../../assets/intro video 3.mp4');
const VIDEO_4 = require('../../assets/intro video 4.mp4');

export default function WelcomeScreen() {
  // Video state
  const [currentVideo, setCurrentVideo] = useState(1); // 1, 2, 3, or 4
  const video1Ref = useRef<Video>(null);
  const video2Ref = useRef<Video>(null);
  const video3Ref = useRef<Video>(null);
  const video4Ref = useRef<Video>(null);

  // Animation values
  const initialOverlayOpacity = useRef(new Animated.Value(1)).current;
  const video1Opacity = useRef(new Animated.Value(1)).current;
  const video2Opacity = useRef(new Animated.Value(0)).current;
  const video3Opacity = useRef(new Animated.Value(0)).current;
  const video4Opacity = useRef(new Animated.Value(0)).current;
  const textAnim1 = useRef(new Animated.Value(0)).current;
  const textAnim2 = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const loginAnim = useRef(new Animated.Value(0)).current;
  const dotsAnim = useRef(new Animated.Value(0)).current;

  // Track if initial animation has played
  const hasAnimatedIn = useRef(false);
  const isTransitioning = useRef(false);

  // Initial entrance animation
  useEffect(() => {
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(initialOverlayOpacity, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.stagger(150, [
        Animated.spring(textAnim1, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
        Animated.spring(textAnim2, { toValue: 1, tension: 50, friction: 8, useNativeDriver: true }),
        Animated.spring(buttonAnim, { toValue: 1, tension: 60, friction: 9, useNativeDriver: true }),
        Animated.spring(loginAnim, { toValue: 1, tension: 60, friction: 9, useNativeDriver: true }),
        Animated.spring(dotsAnim, { toValue: 1, tension: 60, friction: 9, useNativeDriver: true }),
      ]),
    ]).start(() => {
      hasAnimatedIn.current = true;
    });
  }, []);

  // Handle video transition - smooth crossfade
  const transitionToNextVideo = useCallback(async () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;

    // Cycle through 1 -> 2 -> 3 -> 4 -> 1
    const nextVideo = currentVideo === 1 ? 2 : currentVideo === 2 ? 3 : currentVideo === 3 ? 4 : 1;

    const videoRefs = { 1: video1Ref, 2: video2Ref, 3: video3Ref, 4: video4Ref };
    const videoOpacities = { 1: video1Opacity, 2: video2Opacity, 3: video3Opacity, 4: video4Opacity };

    const nextVideoRef = videoRefs[nextVideo as 1 | 2 | 3 | 4];
    const currentOpacity = videoOpacities[currentVideo as 1 | 2 | 3 | 4];
    const nextOpacity = videoOpacities[nextVideo as 1 | 2 | 3 | 4];

    // Reset and start playing the next video before crossfade
    if (nextVideoRef.current) {
      try {
        await nextVideoRef.current.setPositionAsync(0);
        await nextVideoRef.current.playAsync();
      } catch (error) {
        console.log('Video playback error:', error);
        isTransitioning.current = false;
        return;
      }
    } else {
      // Video ref not ready, abort transition
      isTransitioning.current = false;
      return;
    }

    // Crossfade: fade out current, fade in next simultaneously
    Animated.parallel([
      Animated.timing(currentOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(nextOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCurrentVideo(nextVideo);
      isTransitioning.current = false;
    });
  }, [currentVideo, video1Opacity, video2Opacity, video3Opacity, video4Opacity]);

  // Handle playback status updates
  const handlePlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;

    // Start crossfade 1.5 seconds before video ends for seamless transition
    const timeRemaining = (status.durationMillis || 0) - (status.positionMillis || 0);

    if (timeRemaining <= 1500 && timeRemaining > 0 && hasAnimatedIn.current && !isTransitioning.current) {
      transitionToNextVideo();
    }
  }, [transitionToNextVideo]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Video 1 Background */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: video1Opacity }]}>
        <Video
          ref={video1Ref}
          source={VIDEO_1}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay={currentVideo === 1}
          isMuted
          onPlaybackStatusUpdate={currentVideo === 1 ? handlePlaybackStatusUpdate : undefined}
        />
      </Animated.View>

      {/* Video 2 Background */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: video2Opacity }]}>
        <Video
          ref={video2Ref}
          source={VIDEO_2}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay={currentVideo === 2}
          isMuted
          onPlaybackStatusUpdate={currentVideo === 2 ? handlePlaybackStatusUpdate : undefined}
        />
      </Animated.View>

      {/* Video 3 Background */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: video3Opacity }]}>
        <Video
          ref={video3Ref}
          source={VIDEO_3}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay={currentVideo === 3}
          isMuted
          onPlaybackStatusUpdate={currentVideo === 3 ? handlePlaybackStatusUpdate : undefined}
        />
      </Animated.View>

      {/* Video 4 Background */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: video4Opacity }]}>
        <Video
          ref={video4Ref}
          source={VIDEO_4}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          shouldPlay={currentVideo === 4}
          isMuted
          onPlaybackStatusUpdate={currentVideo === 4 ? handlePlaybackStatusUpdate : undefined}
        />
      </Animated.View>

      {/* Initial Dark Overlay (entrance animation) */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.overlay,
          { opacity: initialOverlayOpacity }
        ]}
        pointerEvents="none"
      />

      {/* Gradient overlay at bottom for text readability */}
      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.6)', 'rgba(0, 0, 0, 0.9)']}
        locations={[0, 0.5, 1]}
        style={styles.bottomGradient}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Spacer to push content down */}
        <View style={styles.spacer} />

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Animated.Text
            style={[
              styles.heroTitle,
              {
                opacity: textAnim1,
                transform: [{
                  translateY: textAnim1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [30, 0]
                  })
                }]
              }
            ]}
          >
            Live{'\n'}
            <Text style={styles.heroAccent}>With{'\n'}</Text>
            Confidence.
          </Animated.Text>

          <Animated.Text
            style={[
              styles.heroSubtitle,
              {
                opacity: textAnim2,
                transform: [{
                  translateY: textAnim2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0]
                  })
                }]
              }
            ]}
          >
            Your premium companion for daily wellness and instant emergency response.
          </Animated.Text>
        </View>

        {/* Action Section */}
        <View style={styles.actionSection}>
          <Animated.View
            style={{
              opacity: buttonAnim,
              transform: [{
                scale: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }]
            }}
          >
            <Link href="/(onboarding)/community" asChild>
              <Pressable style={styles.primaryButton}>
                <Text style={styles.buttonText}>Continue Journey</Text>
              </Pressable>
            </Link>
          </Animated.View>

          <Animated.View
            style={[
              styles.loginContainer,
              {
                opacity: loginAnim,
                transform: [{
                  translateY: loginAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [15, 0]
                  })
                }]
              }
            ]}
          >
            <Text style={styles.loginText}>
              Existing account? <Text style={styles.loginLink}>Log in</Text>
            </Text>
          </Animated.View>

          {/* Custom Progress Indicator */}
          <Animated.View
            style={[
              styles.dotsContainer,
              {
                opacity: dotsAnim,
                transform: [{
                  translateY: dotsAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0]
                  })
                }]
              }
            ]}
          >
            <OnboardingProgress currentStep={1} variant="dark" />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    backgroundColor: '#000',
  },
  bottomGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.75,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 32,
    paddingVertical: 24,
    justifyContent: 'space-between',
  },
  spacer: {
    flex: 1,
  },
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 52,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 52,
    letterSpacing: -2,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroAccent: {
    color: '#EF4444',
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 26,
    maxWidth: 300,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  actionSection: {
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7f1d1d',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 0.5,
  },
  loginContainer: {
    alignItems: 'center',
    paddingTop: 16,
  },
  loginText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
    fontSize: 14,
  },
  loginLink: {
    color: '#ffffff',
    textDecorationLine: 'underline',
    fontWeight: '900',
  },
  dotsContainer: {
    marginTop: 32,
  },
});
