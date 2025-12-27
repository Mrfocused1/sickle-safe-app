import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { glmService } from '../../services/glm';

const { width } = Dimensions.get('window');

type Category = 'News' | 'Education' | 'Quiz' | 'Resources';

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

interface QuizItem {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
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
    const [news, setNews] = useState<NewsItem[]>([]);
    const [trials, setTrials] = useState<TrialItem[]>([]);
    const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
    const [educationalTips, setEducationalTips] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Quiz State
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([
            fetchNewsAndEducation(),
            fetchClinicalTrials(),
            fetchQuizzes()
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

    const fetchQuizzes = async () => {
        try {
            const quizData = await glmService.fetchStructuredData('quiz');
            if (quizData) setQuizzes(quizData);
        } catch (error) {
            console.error('Error fetching Quiz data:', error);
        }
    };

    const handleQuizAnswer = (optionIndex: number) => {
        const isCorrect = quizzes[currentQuestionIndex].answer === quizzes[currentQuestionIndex].options[optionIndex];
        if (isCorrect) setScore(prev => prev + 1);
        const newAnswers = [...quizAnswers, optionIndex];
        setQuizAnswers(newAnswers);
        if (currentQuestionIndex < quizzes.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setShowResults(true);
        }
    };

    const resetQuiz = () => {
        setQuizStarted(false);
        setCurrentQuestionIndex(0);
        setQuizAnswers([]);
        setShowResults(false);
        setScore(0);
        fetchQuizzes();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAllData();
        setRefreshing(false);
    };

    const categories: Category[] = ['News', 'Education', 'Quiz', 'Resources'];

    const renderNews = () => (
        <View className="px-6">
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Latest Research & News</Text>
            {news.map((item) => (
                <Pressable key={item.id} style={shadowSm} className="bg-white rounded-[24px] overflow-hidden mb-4 border border-gray-100 active:scale-[0.98]">
                    <Image source={{ uri: item.image }} className="w-full h-44" />
                    <View className="p-5">
                        <View className="flex-row items-center mb-2">
                            <View className="bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
                                <Text className="text-amber-600 text-[10px] font-bold uppercase">{item.source}</Text>
                            </View>
                            <Text className="text-gray-400 text-[10px] ml-2 font-medium">{item.time}</Text>
                        </View>
                        <Text className="text-lg font-bold text-gray-900 mb-2 leading-6">{item.title}</Text>
                        <Text className="text-gray-500 text-sm leading-5" numberOfLines={3}>{item.content}</Text>
                        <View className="flex-row items-center mt-4 pt-4 border-t border-gray-50">
                            <Text className="text-amber-600 font-bold text-sm flex-1">Read Full Article</Text>
                            <MaterialIcons name="arrow-forward" size={18} color="#D97706" />
                        </View>
                    </View>
                </Pressable>
            ))}
            {trials.length > 0 && (
                <View className="mt-6 mb-8">
                    <View className="flex-row items-center mb-4">
                        <View className="w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-3 border border-blue-100">
                            <MaterialIcons name="science" size={20} color="#3B82F6" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">ClinicalTrials.gov</Text>
                            <Text className="text-gray-900 font-bold">Active Research</Text>
                        </View>
                        <View className="bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                            <Text className="text-green-600 text-[10px] font-bold uppercase">Live</Text>
                        </View>
                    </View>
                    {trials.map((trial) => {
                        const getStatusStyle = (status: string) => {
                            const s = status.toLowerCase();
                            if (s.includes('recruiting') && !s.includes('not')) return { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' };
                            if (s.includes('completed')) return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500' };
                            if (s.includes('active')) return { bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' };
                            return { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' };
                        };
                        const formatStatus = (status: string) => {
                            return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                        };
                        const style = getStatusStyle(trial.status);
                        return (
                            <Pressable key={trial.id} style={shadowSm} className="bg-white rounded-[20px] p-5 border border-gray-100 mb-3 active:scale-[0.98]">
                                <View className="flex-row justify-between items-center mb-3">
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{trial.id}</Text>
                                    <View className={`px-2.5 py-1 rounded-full ${style.bg} ${style.border} border`}>
                                        <Text className={`text-[10px] font-bold uppercase ${style.text}`}>{formatStatus(trial.status)}</Text>
                                    </View>
                                </View>
                                <Text className="text-base font-bold text-gray-900 mb-2 leading-5" numberOfLines={2}>{trial.title}</Text>
                                <Text className="text-gray-500 text-xs leading-4" numberOfLines={2}>{trial.summary}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            )}
        </View>
    );

    const renderEducation = () => (
        <View className="px-6">
            {/* Featured Article Card */}
            <Pressable style={shadowMd} className="mb-6 rounded-[28px] overflow-hidden active:scale-[0.98]">
                <LinearGradient
                    colors={['#dc2626', '#991b1b']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ padding: 24 }}
                >
                    {/* Decorative elements */}
                    <View style={{ position: 'absolute', right: -20, top: -20, opacity: 0.1 }}>
                        <MaterialIcons name="menu-book" size={140} color="#ffffff" />
                    </View>

                    <View className="flex-row items-center mb-5">
                        <View className="bg-white px-3 py-1.5 rounded-full mr-3">
                            <Text className="text-red-600 text-[10px] font-black uppercase tracking-wider">Featured Guide</Text>
                        </View>
                        <View className="flex-row items-center">
                            <MaterialIcons name="star" size={14} color="#fbbf24" />
                            <Text className="text-amber-300 text-xs font-bold ml-1">Essential</Text>
                        </View>
                    </View>

                    <View className="flex-row items-start">
                        <View className="flex-1 pr-5">
                            <Text className="text-2xl font-extrabold text-white mb-3 leading-tight">The Sickle Cell Warrior Manual</Text>
                            <Text className="text-red-100 text-sm mb-6 leading-5">Your comprehensive guide to managing high-altitude travel and cold weather crises safely.</Text>

                            <View className="flex-row items-center">
                                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} className="flex-row items-center px-3 py-2 rounded-xl mr-3">
                                    <Feather name="clock" size={14} color="#ffffff" />
                                    <Text className="text-white text-xs font-semibold ml-1.5">12 min</Text>
                                </View>
                                <View style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} className="flex-row items-center px-3 py-2 rounded-xl">
                                    <MaterialIcons name="bookmark-border" size={14} color="#ffffff" />
                                    <Text className="text-white text-xs font-semibold ml-1">Save</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} className="w-16 h-16 rounded-2xl items-center justify-center">
                            <MaterialIcons name="menu-book" size={32} color="#ffffff" />
                        </View>
                    </View>

                    <Pressable
                        style={{ backgroundColor: '#ffffff', ...shadowSm }}
                        className="mt-6 py-4 rounded-2xl items-center flex-row justify-center active:scale-[0.98]"
                    >
                        <Text className="text-gray-900 font-bold text-base mr-2">Start Reading</Text>
                        <MaterialIcons name="arrow-forward" size={18} color="#1f2937" />
                    </Pressable>
                </LinearGradient>
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

            {/* Learning Modules */}
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-6 mb-4 ml-1">Learning Modules</Text>
            {[
                { title: 'Genetics 101', icon: 'biotech', color: '#3b82f6', bg: '#eff6ff', border: '#dbeafe', modules: '4 Modules', progress: 0.75 },
                { title: 'Pain Management', icon: 'favorite', color: '#f43f5e', bg: '#fff1f2', border: '#fecdd3', modules: '6 Modules', progress: 0.2 },
                { title: 'Hydration Science', icon: 'water-drop', color: '#0ea5e9', bg: '#f0f9ff', border: '#bae6fd', modules: '3 Modules', progress: 0 },
                { title: 'Crisis Prevention', icon: 'shield', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', modules: '5 Modules', progress: 0 },
            ].map((item, idx) => (
                <Pressable key={idx} style={shadowSm} className="bg-white rounded-[20px] p-4 flex-row items-center mb-3 border border-gray-100 active:scale-[0.98]">
                    <View style={{ backgroundColor: item.bg, borderColor: item.border, borderWidth: 1 }} className="w-14 h-14 rounded-2xl items-center justify-center mr-4">
                        <MaterialIcons name={item.icon as any} size={28} color={item.color} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-gray-900 mb-1">{item.title}</Text>
                        <View className="flex-row items-center mb-1">
                            <View className="flex-1 h-1.5 bg-gray-100 rounded-full mr-3 overflow-hidden">
                                <View style={{ width: `${item.progress * 100}%`, backgroundColor: item.color }} className="h-full rounded-full" />
                            </View>
                            <Text className="text-xs font-bold text-gray-400 w-8">{Math.round(item.progress * 100)}%</Text>
                        </View>
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{item.modules}</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
                </Pressable>
            ))}
        </View>
    );

    const renderQuiz = () => {
        if (showResults) {
            return (
                <View className="px-6 items-center pt-8">
                    <View style={shadowMd} className="bg-amber-50 w-28 h-28 rounded-full items-center justify-center mb-6 border border-amber-100">
                        <Feather name="award" size={56} color="#F59E0B" />
                    </View>
                    <Text className="text-2xl font-extrabold text-gray-900 mb-2">Session Complete!</Text>
                    <Text className="text-gray-500 text-center mb-8 px-6">You mastered {score} out of {quizzes.length} questions.</Text>
                    <View style={shadowSm} className="w-full bg-white rounded-[24px] p-6 mb-8 border border-gray-100">
                        <View className="flex-row justify-between mb-4">
                            <Text className="font-bold text-gray-500">Accuracy</Text>
                            <Text className="font-extrabold text-gray-900">{Math.round((score / quizzes.length) * 100)}%</Text>
                        </View>
                        <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                            <View style={{ width: `${(score / quizzes.length) * 100}%` }} className="bg-amber-500 h-full rounded-full" />
                        </View>
                    </View>
                    <Pressable onPress={resetQuiz} style={shadowMd} className="bg-gray-900 w-full py-4 rounded-2xl items-center active:scale-[0.98]">
                        <Text className="text-white font-bold text-base">Try Another Quiz</Text>
                    </Pressable>
                </View>
            );
        }
        if (quizStarted && quizzes[currentQuestionIndex]) {
            const q = quizzes[currentQuestionIndex];
            return (
                <View className="px-6">
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="bg-violet-50 px-3 py-1.5 rounded-full border border-violet-100">
                            <Text className="text-violet-600 font-bold text-xs">Question {currentQuestionIndex + 1}/{quizzes.length}</Text>
                        </View>
                        <Pressable onPress={resetQuiz} className="bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
                            <Text className="text-red-500 font-bold text-xs">End</Text>
                        </Pressable>
                    </View>
                    <View style={shadowMd} className="bg-white rounded-[24px] p-6 border border-gray-100 mb-6">
                        <Text className="text-xl font-bold text-gray-900 mb-6 leading-7">{q.question}</Text>
                        <View className="gap-3">
                            {(q.options || ['True', 'False']).map((opt, i) => (
                                <Pressable key={i} onPress={() => handleQuizAnswer(i)} style={shadowSm} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 active:bg-violet-50 active:border-violet-200">
                                    <Text className="text-gray-700 font-semibold text-base text-center">{opt}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <View className="px-6">
                {/* Quiz Hero Card */}
                <Pressable onPress={() => setQuizStarted(true)} style={shadowMd} className="rounded-[28px] overflow-hidden mb-6 active:scale-[0.98]">
                    <LinearGradient colors={['#7c3aed', '#8b5cf6']} className="p-6">
                        <View className="flex-row justify-between items-center mb-4">
                            <View style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} className="px-3 py-1.5 rounded-full">
                                <Text className="text-white text-[10px] font-bold uppercase tracking-wider">Weekly Challenge</Text>
                            </View>
                            <View className="flex-row items-center bg-amber-400 px-2.5 py-1 rounded-full">
                                <MaterialIcons name="local-fire-department" size={14} color="#ffffff" />
                                <Text className="text-white font-bold text-xs ml-1">5 Day Streak</Text>
                            </View>
                        </View>
                        <Text className="text-2xl font-extrabold text-white mb-2">Myth vs. Reality</Text>
                        <Text style={{ color: 'rgba(255,255,255,0.8)' }} className="text-sm mb-6 leading-5">Test your knowledge on common misconceptions about SCD.</Text>
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} className="py-3.5 rounded-xl items-center">
                            <Text className="text-white font-bold text-base">Start Quiz</Text>
                        </View>
                    </LinearGradient>
                </Pressable>

                {quizzes.length > 0 && (
                    <>
                        <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Practice Questions</Text>
                        {quizzes.map((q, idx) => (
                            <Pressable key={idx} onPress={() => { setCurrentQuestionIndex(idx); setQuizStarted(true); }} style={shadowSm} className="bg-white rounded-[20px] p-4 border border-gray-100 mb-3 flex-row items-center active:scale-[0.98]">
                                <View className="bg-violet-50 w-12 h-12 rounded-2xl items-center justify-center mr-4 border border-violet-100">
                                    <MaterialIcons name="psychology" size={24} color="#8B5CF6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-gray-900 font-semibold mb-1 leading-5" numberOfLines={2}>{q.question}</Text>
                                    <Text className="text-violet-500 text-[10px] font-bold uppercase tracking-wider">Tap to Practice</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
                            </Pressable>
                        ))}
                    </>
                )}
            </View>
        );
    };

    const renderResources = () => (
        <View className="px-6">
            {/* Find Specialist Card */}
            <Pressable style={shadowMd} className="rounded-[28px] overflow-hidden mb-6 active:scale-[0.98]">
                <LinearGradient colors={['#2563eb', '#3b82f6']} className="p-6">
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} className="w-14 h-14 rounded-2xl items-center justify-center mb-4">
                        <Feather name="map-pin" size={28} color="white" />
                    </View>
                    <Text className="text-white text-xl font-extrabold mb-2">Find a Specialist</Text>
                    <Text className="text-blue-100 text-sm mb-6 leading-5">Connect with hematologists specialized in Sickle Cell care near you.</Text>
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} className="py-3.5 rounded-xl items-center">
                        <Text className="text-white font-bold text-base">Search Nearby</Text>
                    </View>
                </LinearGradient>
            </Pressable>

            {/* Quick Resources */}
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-1">Quick Resources</Text>
            <View className="flex-row gap-3 mb-6">
                <Pressable style={shadowSm} className="flex-1 bg-white rounded-[20px] p-5 border border-gray-100 active:scale-[0.98]">
                    <View className="bg-amber-50 w-11 h-11 rounded-xl items-center justify-center mb-3 border border-amber-100">
                        <MaterialIcons name="flight" size={22} color="#F59E0B" />
                    </View>
                    <Text className="text-gray-900 font-bold text-sm mb-1">Travel Docs</Text>
                    <Text className="text-gray-400 text-[10px]">ER Letters</Text>
                </Pressable>
                <Pressable style={shadowSm} className="flex-1 bg-white rounded-[20px] p-5 border border-gray-100 active:scale-[0.98]">
                    <View className="bg-emerald-50 w-11 h-11 rounded-xl items-center justify-center mb-3 border border-emerald-100">
                        <MaterialIcons name="medication" size={22} color="#10B981" />
                    </View>
                    <Text className="text-gray-900 font-bold text-sm mb-1">Medication</Text>
                    <Text className="text-gray-400 text-[10px]">Assistance</Text>
                </Pressable>
            </View>

            {/* Digital Vault */}
            <Pressable style={shadowSm} className="bg-gray-900 rounded-[24px] p-6 mb-4 active:scale-[0.98]">
                <View className="flex-row items-center mb-4">
                    <View style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} className="w-11 h-11 rounded-xl items-center justify-center mr-3">
                        <MaterialIcons name="folder" size={22} color="#ffffff" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-white text-lg font-bold">Digital Vault</Text>
                        <Text className="text-gray-400 text-xs">Secure medical records</Text>
                    </View>
                    <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
                </View>
                <Text className="text-gray-400 text-sm leading-5">Store and export your records for new doctors securely.</Text>
            </Pressable>
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
                {/* Header */}
                <View className="bg-white pb-4 border-b border-gray-100" style={{ paddingTop: insets.top + 10 }}>
                    <View className="px-6 flex-row items-center justify-between mb-6">
                        <View>
                            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Knowledge Hub</Text>
                            <Text className="text-3xl font-extrabold text-gray-900">Library</Text>
                        </View>
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center border border-gray-200 active:scale-95"
                        >
                            <MaterialIcons name="close" size={22} color="#6b7280" />
                        </Pressable>
                    </View>

                    {/* Search Bar */}
                    <View className="px-6 mb-4">
                        <View className="bg-gray-50 rounded-2xl flex-row items-center px-4 py-3 border border-gray-100">
                            <Feather name="search" size={18} color="#9ca3af" />
                            <TextInput
                                placeholder="Search articles, modules..."
                                placeholderTextColor="#9ca3af"
                                className="flex-1 ml-3 text-gray-900 font-medium text-sm"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>
                    </View>

                    {/* Category Tabs */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 24 }}
                    >
                        {categories.map((cat) => (
                            <Pressable
                                key={cat}
                                onPress={() => setActiveCategory(cat)}
                                style={activeCategory === cat ? shadowSm : undefined}
                                className={`mr-2 px-5 py-2.5 rounded-xl ${activeCategory === cat ? 'bg-amber-500' : 'bg-gray-100 border border-gray-200'}`}
                            >
                                <Text className={`font-bold text-sm ${activeCategory === cat ? 'text-white' : 'text-gray-500'}`}>{cat}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>

                {/* Content */}
                <View className="pt-6">
                    {loading && !refreshing ? (
                        <View className="flex-1 items-center justify-center py-20">
                            <ActivityIndicator color="#F59E0B" size="large" />
                            <Text className="text-gray-400 font-medium mt-4 text-center">Loading content...</Text>
                        </View>
                    ) : (
                        <>
                            {activeCategory === 'News' && renderNews()}
                            {activeCategory === 'Education' && renderEducation()}
                            {activeCategory === 'Quiz' && renderQuiz()}
                            {activeCategory === 'Resources' && renderResources()}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
