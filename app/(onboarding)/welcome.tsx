import React from 'react';
import { View, Text, Pressable, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, ArrowRight } from 'lucide-react-native';

export default function WelcomeScreen() {
  return (
    <View className="flex-1">
      <StatusBar style="light" />

      {/* Background Image with Overlays */}
      <ImageBackground
        source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDCa3we7tvy_Qu0HlCXwkbjHffe_WwGVhhlVSQgKiddKnL7_Q_opU-EbQQmk4axhPQsVwY8fYRFqGgA1ojE5h-rGzHz8wPZIaRu5cXO-km7oO9ZOSeIP0bUei8Zfevdi7y4ba9m-qRiYOxt8jQ_TleHoxrhKB-x7RfVCd26UNKUK0f7MUpXQXG_3SCfxQRpCFWhKoPvXaf-gZyY5BcWxpyCE2PkIl9fae3EFImzhDDheqY1pUpXUCszOgvxPaWXZQfSnSbOktsNik1O' }}
        className="flex-1 w-full h-full"
        resizeMode="cover"
      >
        {/* Overlays */}
        <View className="absolute inset-0 bg-white/30 dark:bg-slate-900/50" />
        <LinearGradient
          colors={['rgba(255,255,255,0.6)', 'transparent', 'rgba(255,255,255,0.9)']}
          className="absolute inset-0"
        />
        <LinearGradient
          colors={['transparent', 'rgba(239, 68, 68, 0.05)']}
          className="absolute inset-0"
        />

        <SafeAreaView className="flex-1 justify-between px-6 py-8">
          {/* Logo Section */}
          <View className="items-center pt-4 opacity-90">
            <View className="flex-row items-center space-x-2">
              <Shield size={36} color="#1f2937" strokeWidth={2} />
              <Text className="font-bold text-3xl tracking-wide text-slate-900">
                Sickle Safe
              </Text>
            </View>
          </View>

          {/* Main Content */}
          <View className="items-center text-center space-y-6 mb-8">
            <Text className="font-serif text-5xl font-semibold leading-tight text-slate-900 text-center">
              Welcome to{'\n'}
              <Text className="italic text-red-600">Sickle Safe</Text>
            </Text>
            <Text className="text-xl text-slate-700 leading-relaxed max-w-xs text-center">
              Your companion for daily wellness and emergency response. We're here to help you live confidently.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="w-full mb-6">
            <Link href="/(onboarding)/community" asChild>
              <Pressable className="w-full flex-row items-center justify-center py-4 bg-red-500 rounded-full shadow-lg active:scale-95 transition-transform">
                <Text className="text-white font-bold text-lg">Begin</Text>
                <ArrowRight size={20} color="#ffffff" className="ml-2" />
              </Pressable>
            </Link>

            <View className="mt-6 items-center">
              <Text className="text-sm text-slate-600">
                Already have an account?{' '}
                {/* <Link href="/(auth)/login"> */}
                <Text className="font-semibold text-slate-900 underline">
                  Log in
                </Text>
                {/* </Link> */}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
