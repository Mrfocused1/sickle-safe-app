import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, MessageSquare, Plus, Search, Users } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CommunityPostCard } from '@/components/CommunityPostCard';
import { CircleMemberAvatar } from '@/components/CircleMemberAvatar';
import { useRouter } from 'expo-router';

const CATEGORIES = ['All', 'Stories', 'Tips', 'Events', 'General'];

const CIRCLE_MEMBERS = [
  { id: '1', name: 'Dr. Sarah', isOnline: true },
  { id: '2', name: 'Marcus (Helper)', isOnline: true },
  { id: '3', name: 'Linda (Mom)', isOnline: false },
  { id: '4', name: 'Nurse Joy', isOnline: true },
  { id: '5', name: 'Patient Support', isOnline: false },
];

const COMMUNITY_POSTS = [
  {
    id: '1',
    user: 'Jasmine W.',
    role: 'Overcomer',
    time: '2h ago',
    category: 'Stories',
    content: "Just completed a 5k walk today! It's been a journey, but staying hydrated and listening to my body made all the difference. Keep pushing, Overcomers! 💜",
    supportCount: 24,
    commentCount: 8,
  },
  {
    id: '2',
    user: 'Dr. Aris',
    role: 'Hematologist',
    time: '5h ago',
    category: 'Tips',
    content: "Quick tip for the heatwave: Freeze some electrolyte-rich drinks into ice lollies. It helps with both hydration and temperature regulation during crisis prevention.",
    supportCount: 42,
    commentCount: 15,
  },
  {
    id: '3',
    user: 'Kevin S.',
    role: 'Overcomer',
    time: '1d ago',
    category: 'General',
    content: "Has anyone tried the new support group in Central London? Thinking of joining next week.",
    supportCount: 12,
    commentCount: 24,
  },
];

export default function CommunityScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Custom Header */}
      <View className="px-6 py-4 flex-row items-center justify-between bg-white border-b border-gray-100">
        <View>
          <Text className="text-2xl font-bold text-gray-900">Community</Text>
          <Text className="text-gray-500 text-xs">Connect & Support</Text>
        </View>
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.push('/community/groups')}
            className="p-2 bg-gray-50 rounded-full mr-2"
          >
            <Users size={20} color="#64748b" />
          </Pressable>
          <Pressable className="p-2 bg-gray-50 rounded-full mr-2">
            <Search size={20} color="#64748b" />
          </Pressable>
          <Pressable className="p-2 bg-gray-50 rounded-full">
            <Bell size={20} color="#64748b" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Your Circle Section */}
        <View className="mt-6 mb-6">
          <View className="px-6 flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Your Circle</Text>
            <Pressable onPress={() => router.push('/circle')}>
              <Text className="text-violet-600 font-semibold text-sm">Manage</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-6"
            contentContainerStyle={{ paddingRight: 24 }}
          >
            {CIRCLE_MEMBERS.map((member) => (
              <CircleMemberAvatar key={member.id} name={member.name} isOnline={member.isOnline} />
            ))}
            <Pressable className="items-center mr-6">
              <View className="w-14 h-14 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 items-center justify-center">
                <Plus size={24} color="#94a3b8" />
              </View>
              <Text className="text-gray-500 text-xs font-medium mt-2">Add</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Global Feed Section */}
        <View className="px-6 mb-4 flex-row items-center justify-between">
          <Text className="text-lg font-bold text-gray-900">Community Feed</Text>
          <Pressable
            onPress={() => router.push('/community/compose')}
            className="flex-row items-center px-3 py-1.5 bg-violet-50 rounded-full"
          >
            <MessageSquare size={16} color="#8B5CF6" />
            <Text className="text-violet-600 font-bold text-xs ml-1.5">New Post</Text>
          </Pressable>
        </View>

        {/* Categories Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pl-6 mb-6"
          contentContainerStyle={{ paddingRight: 24 }}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              className={`mr-3 px-5 py-2.5 rounded-full ${activeCategory === cat ? 'bg-violet-600' : 'bg-white border border-gray-200'
                }`}
            >
              <Text
                className={`font-semibold text-sm ${activeCategory === cat ? 'text-white' : 'text-gray-600'
                  }`}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Feed List */}
        <View className="px-6 pb-24">
          {COMMUNITY_POSTS.filter(post => activeCategory === 'All' || post.category === activeCategory).map((post) => (
            <CommunityPostCard key={post.id} {...post} />
          ))}

          {/* Load More Placeholder */}
          <Pressable className="py-4 items-center">
            <Text className="text-gray-400 font-medium text-sm">View more conversations</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Shared Space Floating Action Button Removed - Handled by _layout.tsx */}
    </SafeAreaView>
  );
}
