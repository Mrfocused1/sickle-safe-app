import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Share, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { CommunityPostCard } from '@/components/CommunityPostCard';
import { CircleMemberAvatar } from '@/components/CircleMemberAvatar';
import { PostDetailSheet } from '@/components/PostDetailSheet';
import { ComposePostSheet } from '@/components/ComposePostSheet';
import { UserProfileSheet } from '@/components/UserProfileSheet';
import AppBottomSheet from '@/components/AppBottomSheet';
import { ConversationListSheet, ContactPicker, GroupCreator, ChatSheet } from '@/components/messaging';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { messagingStorage } from '@/services/messagingStorage';
import { CurrentUser, Conversation } from '@/types/messaging';

const CATEGORIES = ['All', 'Stories', 'Tips', 'Events', 'General'];

const CIRCLE_MEMBERS = [
  { id: '1', name: 'Dr. Sarah', role: 'Hematologist', isOnline: true, location: 'Guy\'s Hospital', bio: 'Specialize in sickle cell disease management and crisis prevention strategies.' },
  { id: '2', name: 'Marcus', role: 'Caregiver', isOnline: true, location: 'London, UK', bio: 'Supporting my brother through his journey. Here to connect with other caregivers.' },
  { id: '3', name: 'Linda', role: 'Overcomer', isOnline: false, location: 'Birmingham, UK', bio: 'Living my best life despite the challenges. Advocate for mental health in SC.' },
  { id: '4', name: 'Nurse Joy', role: 'Nurse Practitioner', isOnline: true, location: 'Evelina London', bio: 'Helping patients navigate their healthcare journey with compassion.' },
  { id: '5', name: 'Patient Group', role: 'Support Group', isOnline: false, location: 'Online', bio: 'Weekly check-ins and support for all community members.' },
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
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [showComposeSheet, setShowComposeSheet] = useState(false);
  const [selectedMember, setSelectedMember] = useState<typeof CIRCLE_MEMBERS[0] | null>(null);
  const [showProfileSheet, setShowProfileSheet] = useState(false);
  const [showInviteSheet, setShowInviteSheet] = useState(false);

  // Messaging state
  const [showMessageSelection, setShowMessageSelection] = useState(false);
  const [showConversationList, setShowConversationList] = useState(false);
  const [conversationFilterType, setConversationFilterType] = useState<'all' | 'direct' | 'group'>('all');
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [showGroupCreator, setShowGroupCreator] = useState(false);
  const [showChatSheet, setShowChatSheet] = useState(false);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [totalUnreadCount, setTotalUnreadCount] = useState(0);
  const [currentUser] = useState<CurrentUser>({
    id: 'current_user',
    name: 'Maya',
    role: 'overcomer',
  });

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    try {
      await messagingStorage.initializeWithMockData();
      const count = await messagingStorage.getTotalUnreadCount();
      setTotalUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

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

  const handleOpenProfile = (member: typeof CIRCLE_MEMBERS[0]) => {
    setSelectedMember(member);
    setShowProfileSheet(true);
  };

  const filteredPosts = COMMUNITY_POSTS.filter(
    post => activeCategory === 'All' || post.category === activeCategory
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Clean White Header - Mirrored from Log Screen */}
      <View
        style={{ paddingTop: Math.max(insets.top, 20) + 12 }}
        className="bg-white pb-6 px-6 border-b border-gray-100"
      >
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text style={{ fontSize: 13, fontWeight: '500', color: '#64748b' }} className="mb-0.5">Connect & Support</Text>
            <Text style={{ fontSize: 28, fontWeight: '800', color: '#0f172a', letterSpacing: -0.5 }}>Community</Text>
          </View>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowMessageSelection(true);
            }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#10B981',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 6,
              position: 'relative',
            }}
          >
            <MaterialIcons name="chat-bubble" size={22} color="#ffffff" />
            {totalUnreadCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  minWidth: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: '#EF4444',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 4,
                  borderWidth: 2,
                  borderColor: '#fff',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '800', color: '#fff' }}>
                  {totalUnreadCount > 9 ? '9+' : totalUnreadCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#8B5CF6"
          />
        }
      >
        {/* Your Circle Section */}
        <View className="mt-8 mb-6">
          <View className="px-6 flex-row items-center justify-between mb-4">
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a' }}>Your Circle</Text>
            <Pressable
              onPress={() => router.push('/circle')}
              className="active:opacity-70"
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#3b82f6' }}>Manage</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-6"
            contentContainerStyle={{ paddingRight: 24, paddingVertical: 10 }}
          >
            {CIRCLE_MEMBERS.map((member) => (
              <CircleMemberAvatar
                key={member.id}
                name={member.name}
                isOnline={member.isOnline}
                onPress={() => handleOpenProfile(member)}
              />
            ))}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowInviteSheet(true);
              }}
              className="items-center mr-6 active:opacity-70"
            >
              <View className="w-14 h-14 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 items-center justify-center">
                <Plus size={24} color="#94a3b8" />
              </View>
              <Text className="text-gray-500 text-xs font-medium mt-2">Add</Text>
            </Pressable>
          </ScrollView>
        </View>

        {/* Global Feed Section */}
        <View className="px-6 mb-4 flex-row items-center justify-between">
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#0f172a' }}>Community Feed</Text>
          <Pressable
            onPress={() => setShowComposeSheet(true)}
            className="flex-row items-center px-4 py-2 bg-blue-50 border border-blue-100 rounded-2xl active:bg-blue-100"
          >
            <Plus size={16} color="#3b82f6" />
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#3b82f6' }} className="ml-2">New Post</Text>
          </Pressable>
        </View>

        {/* Categories Horizontal Scroll */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="pl-6 mb-6"
          contentContainerStyle={{ paddingRight: 24, paddingVertical: 8 }}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => handleCategoryPress(cat)}
              style={{
                backgroundColor: activeCategory === cat ? '#3b82f6' : '#ffffff',
                borderColor: activeCategory === cat ? '#3b82f6' : '#e2e8f0',
                borderWidth: 1,
                borderRadius: 20,
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginRight: 10,
              }}
              className="shadow-sm active:scale-95"
            >
              <Text
                style={{
                  color: activeCategory === cat ? '#ffffff' : '#64748b',
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Feed List */}
        <View className="px-6">
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
              <Text className="text-gray-400 text-center font-medium">No posts in this category yet.</Text>
              <Pressable
                onPress={() => setShowComposeSheet(true)}
                className="mt-4 px-8 py-4 bg-blue-600 rounded-2xl shadow-sm active:scale-95"
              >
                <Text className="text-white font-extrabold">Be the first to post!</Text>
              </Pressable>
            </View>
          )}

          {filteredPosts.length > 0 && (
            <Pressable className="py-8 items-center active:opacity-70">
              <Text className="text-gray-400 font-bold text-sm">View more conversations</Text>
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

      <ComposePostSheet
        visible={showComposeSheet}
        onClose={() => setShowComposeSheet(false)}
      />

      <UserProfileSheet
        visible={showProfileSheet}
        onClose={() => setShowProfileSheet(false)}
        member={selectedMember}
      />

      <AppBottomSheet
        visible={showInviteSheet}
        onClose={() => setShowInviteSheet(false)}
        type="invite_member"
      />

      {/* Message Selection Sheet */}
      <AppBottomSheet
        visible={showMessageSelection}
        onClose={() => setShowMessageSelection(false)}
        type="message_selection"
        onNewDM={() => {
          setShowMessageSelection(false);
          setShowContactPicker(true);
        }}
        onNewGroup={() => {
          setShowMessageSelection(false);
          setShowGroupCreator(true);
        }}
        onOpenDMInbox={() => {
          setShowMessageSelection(false);
          setConversationFilterType('direct');
          setShowConversationList(true);
        }}
        onOpenGroupInbox={() => {
          setShowMessageSelection(false);
          setConversationFilterType('group');
          setShowConversationList(true);
        }}
      />

      {/* Messaging Sheets */}
      <ConversationListSheet
        visible={showConversationList}
        onClose={() => {
          setShowConversationList(false);
          setConversationFilterType('all');
          loadUnreadCount();
        }}
        filterType={conversationFilterType}
        currentUser={currentUser}
        onNewDM={() => setShowContactPicker(true)}
        onNewGroup={() => setShowGroupCreator(true)}
        onOpenChat={(conversation) => {
          setActiveConversation(conversation);
          setShowChatSheet(true);
        }}
      />

      <ContactPicker
        visible={showContactPicker}
        onClose={() => setShowContactPicker(false)}
        onSelect={(conversation: Conversation) => {
          setShowContactPicker(false);
          setActiveConversation(conversation);
          setShowChatSheet(true);
          loadUnreadCount();
        }}
        currentUser={currentUser}
      />

      <GroupCreator
        visible={showGroupCreator}
        onClose={() => setShowGroupCreator(false)}
        onCreate={(conversation: Conversation) => {
          setShowGroupCreator(false);
          setActiveConversation(conversation);
          setShowChatSheet(true);
          loadUnreadCount();
        }}
        currentUser={currentUser}
      />

      <ChatSheet
        visible={showChatSheet}
        onClose={() => {
          setShowChatSheet(false);
          setActiveConversation(null);
          loadUnreadCount();
        }}
        onBack={() => {
          setShowChatSheet(false);
          setActiveConversation(null);
          setShowConversationList(true);
          loadUnreadCount();
        }}
        conversation={activeConversation}
        currentUser={currentUser}
      />
    </View>
  );
}
