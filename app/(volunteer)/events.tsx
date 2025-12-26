import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Calendar as CalendarIcon,
    MapPin,
    Clock,
    Filter,
    Search,
    ChevronRight,
    Users
} from 'lucide-react-native';

const CATEGORIES = ['All', 'Blood Drive', 'Awareness', 'Fundraiser', 'Support'];

const EVENTS = [
    {
        id: 1,
        title: 'Central City Blood Drive',
        category: 'Blood Drive',
        date: 'Dec 28',
        time: '10:00 AM - 4:00 PM',
        location: 'Community Center',
        volunteers: 8,
        needed: 15,
        image: 'https://images.unsplash.com/photo-1615461066841-6116ecaaba30?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 2,
        title: 'Sickle Cell Awareness Walk',
        category: 'Awareness',
        date: 'Jan 05',
        time: '8:00 AM - 12:00 PM',
        location: 'Westside Park',
        volunteers: 45,
        needed: 60,
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 3,
        title: 'Caregiver Support Brunch',
        category: 'Support',
        date: 'Jan 12',
        time: '11:00 AM - 1:00 PM',
        location: 'The Grace Hotel',
        volunteers: 3,
        needed: 5,
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400'
    }
];

export default function VolunteerEvents() {
    const insets = useSafeAreaInsets();
    const [selectedCategory, setSelectedCategory] = useState('All');

    return (
        <View className="flex-1 bg-white">
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                {/* Header */}
                <View
                    className="px-6 pb-6 border-b border-gray-100"
                    style={{ paddingTop: insets.top + 10 }}
                >
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-3xl font-extrabold text-gray-900">Events</Text>
                        <Pressable className="w-10 h-10 bg-gray-50 rounded-xl items-center justify-center border border-gray-100">
                            <CalendarIcon size={20} color="#374151" />
                        </Pressable>
                    </View>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 mb-6">
                        <Search size={20} color="#9CA3AF" />
                        <View className="flex-1 ml-3">
                            <Text className="text-gray-400 text-base">Search events...</Text>
                        </View>
                    </View>

                    {/* Category Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                        <View className="flex-row gap-2">
                            {CATEGORIES.map((cat) => (
                                <Pressable
                                    key={cat}
                                    onPress={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full border ${selectedCategory === cat
                                        ? 'bg-gray-900 border-gray-900'
                                        : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <Text className={`font-semibold text-xs ${selectedCategory === cat ? 'text-white' : 'text-gray-600'
                                        }`}>
                                        {cat}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Events List */}
                <View className="px-6 py-6">
                    {EVENTS.map((event) => (
                        <Pressable
                            key={event.id}
                            className="bg-white rounded-[32px] p-5 shadow-sm border border-gray-100 mb-8 last:mb-0"
                            style={{
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.05,
                                shadowRadius: 8,
                                elevation: 3
                            }}
                        >
                            <View className="h-48 bg-gray-100 rounded-[24px] mb-5 overflow-hidden relative">
                                <Image
                                    source={{ uri: event.image }}
                                    className="w-full h-full"
                                    resizeMode="cover"
                                />
                                <View className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                                    <Text className="text-gray-900 font-bold text-[10px] uppercase tracking-wider">{event.category}</Text>
                                </View>
                            </View>

                            <View className="flex-row justify-between items-start mb-3">
                                <View className="flex-1 pr-4">
                                    <Text className="text-gray-900 font-black text-xl mb-1.5 leading-tight">{event.title}</Text>
                                    <View className="flex-row items-center">
                                        <MapPin size={14} color="#9CA3AF" />
                                        <Text className="text-gray-500 text-sm font-medium ml-1.5">{event.location}</Text>
                                    </View>
                                </View>
                                <View className="bg-violet-50 w-14 h-16 rounded-2xl items-center justify-center border border-violet-100 shadow-sm">
                                    <Text className="text-violet-600 font-black text-lg">{event.date.split(' ')[1]}</Text>
                                    <Text className="text-violet-400 font-bold text-[10px] uppercase">{event.date.split(' ')[0]}</Text>
                                </View>
                            </View>

                            <View className="flex-row items-center justify-between mt-3 pt-4 border-t border-gray-50">
                                <View className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full">
                                    <Clock size={14} color="#6B7280" />
                                    <Text className="text-gray-600 text-xs font-semibold ml-1.5">{event.time}</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <Users size={16} color="#9CA3AF" />
                                    <Text className="text-gray-500 text-xs font-bold">
                                        <Text className="text-gray-900">{event.volunteers}</Text>/{event.needed} Volunteers
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                </View>

            </ScrollView>
        </View>
    );
}
