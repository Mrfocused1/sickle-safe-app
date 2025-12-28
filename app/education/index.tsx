import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { glmService } from '../../services/glm';
import AppBottomSheet from '../../components/AppBottomSheet';
import { modules } from '../../data/education_content';
import { quizzes, Quiz } from '../../data/quiz_content';

const { width } = Dimensions.get('window');

type Category = 'News' | 'Education' | 'Quiz';

interface NewsItem {
    id: string;
    title: string;
    source: string;
    time: string;
    image: string;
    content: string;
}

interface TrialItem {
    id: string;
    title: string;
    status: string;
    summary: string;
}


// Shadow styles defined outside component to avoid NativeWind race condition
const shadowSm = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
};

const shadowMd = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
};

const shadowLg = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
};

export default function EducationScreen() {
    const insets = useSafeAreaInsets();
    const [activeCategory, setActiveCategory] = useState<Category>('News');
    const [news, setNews] = useState<NewsItem[]>([
        {
            id: '1',
            title: 'Breakthrough: New Gene Therapy for SCD Approved',
            source: 'Health News',
            time: '2h ago',
            image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800',
            content: 'The FDA has recently approved a groundbreaking gene therapy that aims to significantly reduce pain crises in patients with Sickle Cell Disease.'
        },
        {
            id: '2',
            title: 'The Importance of Winter Hydration for Warriors',
            source: 'SCD Daily',
            time: '5h ago',
            image: 'https://images.unsplash.com/photo-1548834181-edc5836270f4?w=800',
            content: 'Experts discuss why staying hydrated during colder months is just as critical as in the summer for managing viscosity in sickle cell populations.'
        }
    ]);
    const [trials, setTrials] = useState<TrialItem[]>([]);
    const [educationalTips, setEducationalTips] = useState<any[]>([
        {
            id: 'tip1',
            title: 'Heat Therapy',
            content: 'Apply warm compresses to painful areas to improve circulation and soothe muscles.',
            icon: 'wb-sunny'
        },
        {
            id: 'tip2',
            title: 'Gentle Stretching',
            content: 'Regular, light movement can prevent stiffness and improve overall mobility.',
            icon: 'fitness-center'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedModule, setSelectedModule] = useState<any>(null);
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
    const [activeSheetType, setActiveSheetType] = useState<any>('learning_module');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([
            fetchNewsAndEducation(),
            fetchClinicalTrials(),
            // fetchQuizzes() // Quizzes are now static, no need to fetch
        ]);
        setLoading(false);
    };

    const fetchNewsAndEducation = async () => {
        try {
            const newsData = await glmService.fetchStructuredData('news');
            if (newsData) setNews(newsData);
            const educationData = await glmService.fetchStructuredData('education');
            if (educationData) setEducationalTips(educationData);
        } catch (error) {
            console.error('Error fetching GLM data:', error);
        }
    };

    const fetchClinicalTrials = async () => {
        try {
            const response = await fetch('https://clinicaltrials.gov/api/v2/studies?query.term=Sickle+Cell+Disease&pageSize=5&sort=LastUpdatePostDate:desc');
            const data = await response.json();
            if (data.studies) {
                const formattedTrials = data.studies.map((s: any) => ({
                    id: s.protocolSection?.identificationModule?.nctId || Math.random().toString(),
                    title: s.protocolSection?.identificationModule?.officialTitle || 'Clinical Study',
                    status: s.protocolSection?.statusModule?.overallStatus || 'Active',
                    summary: s.protocolSection?.descriptionModule?.briefSummary || 'No summary available.'
                }));
                setTrials(formattedTrials);
            }
        } catch (error) {
            console.error('Error fetching ClinicalTrials.gov:', error);
        }
    };


    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAllData();
        setRefreshing(false);
    };

    const categories: Category[] = ['News', 'Education', 'Quiz'];

    const renderNews = () => (
        <View className="px-6">
            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px] mb-5 ml-1">Latest Research & News</Text>
            {news.map((item) => (
                <Pressable
                    key={item.id}
                    style={shadowMd}
                    className="bg-white rounded-[32px] overflow-hidden mb-6 border border-gray-100 active:scale-[0.98]"
                >
                    <Image source={{ uri: item.image }} className="w-full h-48" />
                    <View className="p-6">
                        <View className="flex-row items-center mb-3">
                            <View className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                                <Text className="text-blue-600 text-[10px] font-black uppercase tracking-wider">{item.source}</Text>
                            </View>
                            <Text className="text-gray-400 text-[10px] ml-3 font-bold uppercase">{item.time}</Text>
                        </View>
                        <Text className="text-xl font-black text-gray-900 mb-2 leading-tight">{item.title}</Text>
                        <Text className="text-gray-500 text-sm leading-6 mb-4" numberOfLines={3}>{item.content}</Text>
                        <View className="flex-row items-center py-4 border-t border-gray-50 justify-between">
                            <Text className="text-blue-600 font-black text-sm">Read Full Perspective</Text>
                            <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center">
                                <MaterialIcons name="arrow-forward" size={16} color="#2563EB" />
                            </View>
                        </View>
                    </View>
                </Pressable>
            ))}
            {trials.length > 0 && (
                <View className="mt-8 mb-10">
                    <View className="flex-row items-center mb-6">
                        <View className="w-12 h-12 bg-blue-50/50 rounded-2xl items-center justify-center mr-4 border border-blue-100/30">
                            <MaterialIcons name="science" size={24} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px]">CLINICALTRIALS.GOV</Text>
                            <Text className="text-gray-900 font-black text-lg">Active Research</Text>
                        </View>
                        <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                            <Text className="text-emerald-600 text-[10px] font-black uppercase tracking-wider">LIVE</Text>
                        </View>
                    </View>
                    {trials.map((trial) => {
                        const getStatusStyle = (status: string) => {
                            const s = status.toLowerCase();
                            if (s.includes('recruiting') && !s.includes('not')) return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' };
                            if (s.includes('completed')) return { bg: 'bg-slate-50/50', border: 'border-slate-100', text: 'text-slate-500' };
                            if (s.includes('active')) return { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' };
                            return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' };
                        };
                        const formatStatus = (status: string) => {
                            return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                        };
                        const style = getStatusStyle(trial.status);
                        return (
                            <Pressable key={trial.id} style={shadowMd} className="bg-white rounded-[28px] p-6 border border-gray-100 mb-4 active:scale-[0.98]">
                                <View className="flex-row justify-between items-center mb-4">
                                    <View className="bg-slate-50 px-2 py-0.5 rounded-md">
                                        <Text className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{trial.id}</Text>
                                    </View>
                                    <View className={`px-3 py-1 rounded-full ${style.bg} ${style.border} border`}>
                                        <Text className={`text-[10px] font-black uppercase ${style.text}`}>{formatStatus(trial.status)}</Text>
                                    </View>
                                </View>
                                <Text className="text-lg font-black text-gray-900 mb-2 leading-tight" numberOfLines={2}>{trial.title}</Text>
                                <Text className="text-gray-500 text-sm leading-5" numberOfLines={2}>{trial.summary}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            )}
        </View>
    );

    const renderEducation = () => (
        <View className="px-6">
            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px] mb-5 ml-1">Learning Pathways</Text>
            {/* Featured Article Card - Premium Style */}
            <Pressable
                onPress={() => router.push('/education/guide')}
                style={shadowLg}
                className="bg-white rounded-[32px] p-6 flex-row items-center mb-8 border border-gray-100 active:scale-[0.98]"
            >
                <View style={{ backgroundColor: '#fef2f2', borderColor: '#fee2e2', borderWidth: 1 }} className="w-16 h-16 rounded-[22px] items-center justify-center mr-5">
                    <MaterialIcons name="menu-book" size={32} color="#dc2626" />
                </View>
                <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                        <View className="bg-red-50 px-2 py-0.5 rounded-md mr-2">
                            <Text className="text-red-600 text-[10px] font-black uppercase tracking-wider">Expert Guide</Text>
                        </View>
                        <View className="flex-row items-center">
                            <MaterialIcons name="verified" size={14} color="#3b82f6" />
                            <Text className="text-blue-500 text-[10px] font-black ml-1 uppercase">SCD Board Verified</Text>
                        </View>
                    </View>
                    <Text className="text-lg font-black text-gray-900 mb-2 leading-tight">The Sickle Cell Warrior Manual</Text>
                    <View className="flex-row items-center mb-2">
                        <View className="flex-1 h-2 bg-gray-100 rounded-full mr-3 overflow-hidden">
                            <View style={{ width: '45%', backgroundColor: '#dc2626' }} className="h-full rounded-full" />
                        </View>
                        <Text className="text-xs font-black text-gray-400 w-8">45%</Text>
                    </View>
                    <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">12 min Reading • Chapter 3/6</Text>
                </View>
            </Pressable>

            {/* Daily Tips Section */}
            {educationalTips.length > 0 && (
                <>
                    <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Daily Care Tips</Text>
                    {educationalTips.map((item, idx) => (
                        <Pressable key={idx} style={shadowSm} className="bg-white rounded-[20px] p-4 flex-row items-center mb-3 border border-gray-100 active:scale-[0.98]">
                            <View className="w-12 h-12 bg-amber-50 rounded-2xl items-center justify-center mr-4 border border-amber-100">
                                <MaterialIcons name={item.icon || 'lightbulb'} size={24} color="#F59E0B" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-base font-bold text-gray-900 mb-0.5">{item.title}</Text>
                                <Text className="text-gray-500 text-xs leading-4" numberOfLines={2}>{item.content}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
                        </Pressable>
                    ))}
                </>
            )}

            {/* Library Modules */}
            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[2px] mt-6 mb-5 ml-1">Expert Led Modules</Text>
            {modules.map((item, idx) => (
                <Pressable
                    key={idx}
                    style={shadowMd}
                    onPress={() => {
                        setSelectedModule(item);
                        setActiveSheetType('learning_module');
                        setBottomSheetVisible(true);
                    }}
                    className="bg-white rounded-[28px] p-5 flex-row items-center mb-4 border border-gray-100 active:scale-[0.98]"
                >
                    <View style={{ backgroundColor: item.bg, borderColor: item.border, borderWidth: 1 }} className="w-16 h-16 rounded-[20px] items-center justify-center mr-5">
                        <MaterialIcons name={item.icon as any} size={30} color={item.color} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-lg font-black text-gray-900 mb-1">{item.title}</Text>
                        <View className="flex-row items-center mb-2">
                            <View className="flex-1 h-1.5 bg-gray-100 rounded-full mr-3 overflow-hidden">
                                <View style={{ width: `75%`, backgroundColor: item.color }} className="h-full rounded-full" />
                            </View>
                            <Text className="text-[10px] font-black text-gray-400 w-8 uppercase">75%</Text>
                        </View>
                        <Text className="text-gray-400 text-[10px] font-black uppercase tracking-widest">{item.lessons.length} Learning Sessions</Text>
                    </View>
                    <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center">
                        <MaterialIcons name="chevron-right" size={24} color="#CBD5E1" />
                    </View>
                </Pressable>
            ))}
        </View>
    );

    const renderQuiz = () => (
        <View className="px-6">
            {/* Weekly Challenge Card */}
            <Pressable
                style={shadowMd}
                onPress={() => {
                    setSelectedQuiz(quizzes[0]);
                    setActiveSheetType('quiz_start');
                    setBottomSheetVisible(true);
                }}
                className="mb-8 rounded-[28px] overflow-hidden active:scale-[0.98]"
            >
                <LinearGradient
                    colors={[quizzes[0].color, '#d97706']}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    style={{ padding: 24 }}
                >
                    <View className="flex-row items-center justify-between mb-4">
                        <View className="bg-white/20 px-3 py-1 rounded-full">
                            <Text className="text-white text-[10px] font-black uppercase tracking-wider">Weekly Challenge</Text>
                        </View>
                        <View className="flex-row items-center bg-amber-400/20 px-3 py-1 rounded-full">
                            <Text className="text-amber-300 text-[10px] font-black mr-1">🔥 5 Day Streak</Text>
                        </View>
                    </View>

                    <Text className="text-2xl font-black text-white mb-2">{quizzes[0].title}</Text>
                    <Text className="text-amber-50 text-sm mb-6 leading-5">{quizzes[0].description}</Text>

                    <View className="bg-white py-4 rounded-2xl items-center">
                        <Text className="text-amber-600 font-extrabold text-base">Start Quiz</Text>
                    </View>
                </LinearGradient>
            </Pressable>

            {/* Quick Shelf Quiz */}
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Knowledge Shelf</Text>
            {quizzes.slice(1).map((item, idx) => (
                <Pressable
                    key={idx}
                    style={shadowSm}
                    onPress={() => {
                        setSelectedQuiz(item);
                        setActiveSheetType('quiz_start');
                        setBottomSheetVisible(true);
                    }}
                    className="bg-white rounded-[24px] p-4 flex-row items-center mb-3 border border-gray-100 active:scale-[0.98]"
                >
                    <View style={{ backgroundColor: item.color + '10', borderColor: item.color + '20', borderWidth: 1 }} className="w-12 h-12 rounded-xl items-center justify-center mr-4">
                        <MaterialIcons name={item.icon as any} size={24} color={item.color} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-gray-900 font-extrabold text-base mb-0.5">{item.title}</Text>
                        <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider">{item.questions.length} Questions • {item.subtitle}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
                </Pressable>
            ))}
        </View>
    );


    return (
        <View className="flex-1 bg-gray-50">
            <StatusBar style="dark" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F59E0B" />}
            >
                {/* Header Styling Upgrade */}
                <View className="bg-white pb-6 px-1" style={{ paddingTop: insets.top + 10 }}>
                    <View className="px-6 flex-row items-center justify-between mb-8">
                        <View>
                            <Text className="text-gray-400 text-[10px] font-black uppercase tracking-[3px] mb-1">Knowledge Hub</Text>
                            <Text className="text-4xl font-black text-gray-900 tracking-tighter">Library</Text>
                        </View>
                        <Pressable
                            onPress={() => router.back()}
                            className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center"
                        >
                            <MaterialIcons name="close" size={28} color="#94A3B8" />
                        </Pressable>
                    </View>

                    <View className="px-5 mb-8">
                        <View
                            style={shadowSm}
                            className="bg-slate-50/80 rounded-[28px] px-5 py-4 flex-row items-center border border-slate-100"
                        >
                            <Feather name="search" size={20} color="#94A3B8" />
                            <TextInput
                                className="flex-1 ml-4 text-gray-800 text-lg font-bold"
                                placeholder="Search articles, modules..."
                                placeholderTextColor="#94A3B8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {/* Premium Segmented Controls */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12, paddingHorizontal: 24, paddingRight: 40 }}
                    >
                        {categories.map((category) => {
                            const isActive = activeCategory === category;
                            const getCatColors = (): [string, string] => {
                                if (category === 'News') return ['#3B82F6', '#2563EB'];
                                if (category === 'Education') return ['#3B82F6', '#2563EB'];
                                if (category === 'Quiz') return ['#8B5CF6', '#7C3AED'];
                                return ['#64748B', '#475569'];
                            };

                            return (
                                <Pressable
                                    key={category}
                                    onPress={() => {
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                        setActiveCategory(category);
                                    }}
                                    className="active:scale-[0.95]"
                                >
                                    {isActive ? (
                                        <LinearGradient
                                            colors={getCatColors()}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 1 }}
                                            style={{ paddingHorizontal: 32, paddingVertical: 14, borderRadius: 18 }}
                                        >
                                            <Text className="text-white font-black text-base">{category}</Text>
                                        </LinearGradient>
                                    ) : (
                                        <View
                                            style={{ paddingHorizontal: 32, paddingVertical: 14, borderRadius: 18 }}
                                            className="bg-slate-50 border border-slate-100"
                                        >
                                            <Text className="text-slate-400 font-black text-base">{category}</Text>
                                        </View>
                                    )}
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Content Area */}
                <View className="pt-8">
                    {loading && !refreshing ? (
                        <View className="flex-1 items-center justify-center py-20">
                            <ActivityIndicator color="#3B82F6" size="large" />
                            <Text className="text-gray-400 font-medium mt-4 text-center">Loading content...</Text>
                        </View>
                    ) : (
                        <>
                            {activeCategory === 'News' && renderNews()}
                            {activeCategory === 'Education' && renderEducation()}
                            {activeCategory === 'Quiz' && renderQuiz()}
                        </>
                    )}
                </View>
            </ScrollView>

            <AppBottomSheet
                visible={bottomSheetVisible}
                onClose={() => setBottomSheetVisible(false)}
                type={activeSheetType}
                educationModule={selectedModule}
                quizItem={selectedQuiz}
            />
        </View>
    );
}
