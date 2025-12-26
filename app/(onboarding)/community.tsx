import React from 'react';
import { View, Text, Pressable, Image, Dimensions, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Sparkles } from 'lucide-react-native';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

const communityImages = [
  { uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200', size: 90, top: '5%', left: '5%', zIndex: 1 },
  { uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200', size: 110, top: '15%', right: '8%', zIndex: 2 },
  { uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200', size: 130, top: '25%', left: '15%', zIndex: 10 },
  { uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200', size: 95, top: '45%', right: '5%', zIndex: 3 },
  { uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200', size: 140, top: '48%', left: '45%', zIndex: 20 },
  { uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200', size: 100, top: '68%', left: '5%', zIndex: 4 },
  { uri: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200', size: 115, top: '72%', right: '12%', zIndex: 5 },
];

export default function CommunityScreen() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      {/* Video Background */}
      <Video
        source={{ uri: 'https://assets.mixkit.co/videos/preview/mixkit-friends-sitting-on-a-couch-at-home-41312-large.mp4' }}
        rate={1.0}
        volume={0}
        isMuted={true}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={StyleSheet.absoluteFill}
      />

      <LinearGradient
        colors={['rgba(255,255,255,0.4)', 'rgba(255,255,255,0.1)', 'rgba(255,255,255,0.8)']}
        className="absolute inset-0"
      />

      <SafeAreaView className="flex-1">
        {/* Logo at Top (Triple Size, No BG) */}
        <View className="items-center mt-2">
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: width * 0.6, height: 100 }}
            resizeMode="contain"
          />
        </View>

        {/* Community Collage Section */}
        <View className="flex-1 relative overflow-visible">
          {communityImages.map((image, index) => (
            <View
              key={index}
              className="absolute rounded-full border-[6px] border-white shadow-xl overflow-hidden"
              style={{
                width: image.size,
                height: image.size,
                top: image.top as any,
                left: image.left as any,
                right: image.right as any,
                zIndex: image.zIndex,
                transform: [{ rotate: `${index % 2 === 0 ? '-5deg' : '5deg'}` }]
              }}
            >
              <Image
                source={{ uri: image.uri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
          ))}

          {/* Floating Badge */}
          <View
            className="absolute top-[38%] left-[10%] bg-red-600 px-4 py-2 rounded-2xl shadow-lg flex-row items-center gap-2 border border-red-500"
            style={{ zIndex: 30 }}
          >
            <Sparkles size={16} color="#FFF" />
            <Text className="text-[10px] font-black uppercase tracking-widest text-white">Stronger Together</Text>
          </View>
        </View>

        {/* Content Section */}
        <View className="px-8 pb-10">
          <View className="mb-12">
            <Text className="text-4xl font-black text-gray-900 leading-[1.1] tracking-tighter mb-4">
              Join the{'\n'}
              <Text className="text-red-500">Sickle Safe{'\n'}</Text>
              Community
            </Text>
            <Text className="text-base text-gray-700 font-bold leading-relaxed">
              Connect with a supportive network of <Text className="text-gray-900">Overcomers</Text>, <Text className="text-gray-900">Helpers</Text>, and <Text className="text-gray-900">Volunteers</Text>.
            </Text>
          </View>

          {/* Action Area */}
          <View className="w-full space-y-6">
            <View className="flex-row items-center justify-between">
              {/* Custom Pagination */}
              <View className="flex-row gap-1.5">
                <View className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <View className="w-8 h-2.5 rounded-full bg-red-600" />
                <View className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              </View>

              <Pressable className="active:opacity-60">
                <Text className="text-gray-600 font-bold text-sm">
                  Existing account? <Text className="text-gray-900 underline font-black">Log in</Text>
                </Text>
              </Pressable>
            </View>

            <Link href="/(onboarding)/role-selection" asChild>
              <Pressable className="w-full bg-red-600 py-6 rounded-[24px] shadow-xl shadow-red-900/20 active:scale-[0.98] overflow-hidden">
                <View className="flex-row items-center justify-center">
                  <Text className="text-white font-black text-xl tracking-wide">Get Started</Text>
                  <View className="ml-3 bg-white/20 p-1.5 rounded-full">
                    <ArrowRight size={24} color="#ffffff" />
                  </View>
                </View>
              </Pressable>
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
