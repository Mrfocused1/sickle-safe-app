import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Share, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, MessageSquare, Plus, Search, Users } from 'lucide-react-native';
import { CommunityPostCard } from '@/components/CommunityPostCard';
import { CircleMemberAvatar } from '@/components/CircleMemberAvatar';
import { PostDetailSheet } from '@/components/PostDetailSheet';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const CATEGORIES = ['All', 'Stories', 'Tips', 'Events', 'General'];

const CIRCLE_MEMBERS = [
  { id: '1', name: 'Dr. Sarah', isOnline: true },
  { id: '2', name: 'Marcus', isOnline: true },
  { id: '3', name: 'Linda', isOnline: false },
  { id: '4', name: 'Nurse Joy', isOnline: true },
  { id: '5', name: 'Patient Group', isOnline: false },
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
    content: "Has anyone tried the new support group in Central London? Thinking of joining next week. Would love to hear your experiences!",
    supportCount: 12,
    commentCount: 24,
  },
  {
    id: '4',
    user: 'Maria L.',
    role: 'Caregiver',
    time: '1d ago',
    category: 'Tips',
    content: "Reminder for caregivers: It's okay to take breaks. Self-care isn't selfish - you can't pour from an empty cup. Join our caregiver support chat every Thursday at 7pm.",
    supportCount: 56,
    commentCount: 18,
  },
  {
    id: '5',
    user: 'SickleCell Org',
    role: 'Volunteer',
    time: '2d ago',
    category: 'Events',
    content: "🎉 Annual Sickle Cell Awareness Walk is happening next month! Register now and help us raise awareness. Early bird registration ends this Friday. Link in bio!",
    supportCount: 89,
    commentCount: 32,
  },
  {
    id: '6',
    user: 'Nurse Angela',
    role: 'Nurse',
    time: '2d ago',
    category: 'Tips',
    content: "Pain management tip: Keep a detailed log of your pain episodes. Note triggers, duration, and what helped. This info is invaluable for your healthcare team.",
    supportCount: 67,
    commentCount: 21,
  },
  {
    id: '7',
    user: 'James T.',
    role: 'Overcomer',
    time: '3d ago',
    category: 'Stories',
    content: "6 months crisis-free today! 🎊 Consistent hydration, regular check-ups, and this amazing community have made all the difference. Thank you all for your support!",
    supportCount: 134,
    commentCount: 45,
  },
];

type Post = typeof COMMUNITY_POSTS[0];

export default function CommunityScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);

  const handleCategoryPress = async (cat: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveCategory(cat);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleShare = async (content: string) => {
    try {
      await Share.share({
        message: content,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleOpenPost = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const filteredPosts = COMMUNITY_POSTS.filter(
    post => activeCategory === 'All' || post.category === activeCategory
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Custom Header */}
      <View className="px-6 py-4 flex-row items-center justify-between bg-white border-b border-gray-100">
        <View>
          <Text className="text-brand-title text-brand-dark">Community</Text>
          <Text className="text-brand-muted text-brand-sub">Connect & Support</Text>
        </View>
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.push('/community/groups')}
            className="p-2 bg-gray-50 rounded-full mr-2 active:bg-gray-100"
          >
            <Users size={20} color="#64748b" />
          </Pressable>
          <Pressable className="p-2 bg-gray-50 rounded-full mr-2 active:bg-gray-100">
            <Search size={20} color="#64748b" />
          </Pressable>
          <Pressable className="p-2 bg-gray-50 rounded-full relative active:bg-gray-100">
            <Bell size={20} color="#64748b" />
            <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#8B5CF6"
          />
        }
      >
        {/* Your Circle Section */}
        <View className="mt-6 mb-6">
          <View className="px-6 flex-row items-center justify-between mb-4">
            <Text className="text-brand-title text-brand-dark">Your Circle</Text>
            <Pressable
              onPress={() => router.push('/circle')}
              className="active:opacity-70"
            >
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
            <Pressable className="items-center mr-6 active:opacity-70">
              <View className="w-14 h-14 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 items-center justify-center">
                <Plus size={24} color="#94a3b8" />
              </View>
              <Text className="text-gray-500 text-xs font-medium mt-2">Add</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Global Feed Section */}
        <View className="px-6 mb-4 flex-row items-center justify-between">
          <Text className="text-brand-title text-brand-dark">Community Feed</Text>
          <Pressable
            onPress={() => router.push('/community/compose')}
            className="flex-row items-center px-3 py-1.5 bg-violet-50 rounded-full active:bg-violet-100"
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
              onPress={() => handleCategoryPress(cat)}
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
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <CommunityPostCard
                key={post.id}
                {...post}
                onCardPress={() => handleOpenPost(post)}
                onCommentPress={() => handleOpenPost(post)}
                onSharePress={() => handleShare(post.content)}
              />
            ))
          ) : (
            <View className="py-12 items-center">
              <Text className="text-gray-400 text-center">No posts in this category yet.</Text>
              <Pressable
                onPress={() => router.push('/community/compose')}
                className="mt-4 px-6 py-3 bg-violet-600 rounded-full"
              >
                <Text className="text-white font-bold">Be the first to post!</Text>
              </Pressable>
            </View>
          )}

          {filteredPosts.length > 0 && (
            <Pressable className="py-4 items-center active:opacity-70">
              <Text className="text-gray-400 font-medium text-sm">View more conversations</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Post Detail Sheet */}
      <PostDetailSheet
        visible={showPostDetail}
        onClose={() => setShowPostDetail(false)}
        post={selectedPost}
      />
    </SafeAreaView>
  );
}
