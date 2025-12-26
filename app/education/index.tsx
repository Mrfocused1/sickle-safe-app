import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, Image, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

export default function EducationScreen() {
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
        <View className="px-5">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-black text-slate-900">Latest Research & News</Text>
                <Feather name="rss" size={16} color="#94a3b8" />
            </View>
            {news.map((item) => (
                <Pressable key={item.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm mb-6 border border-slate-100">
                    <Image source={{ uri: item.image }} className="w-full h-48" />
                    <View className="p-5">
                        <View className="flex-row items-center mb-2">
                            <View className="bg-amber-100 px-2 py-0.5 rounded-md">
                                <Text className="text-amber-700 text-[10px] font-bold uppercase">{item.source}</Text>
                            </View>
                            <Text className="text-slate-400 text-[10px] ml-2 font-bold">{item.time}</Text>
                        </View>
                        <Text className="text-lg font-bold text-slate-900 mb-2 leading-6">{item.title}</Text>
                        <Text className="text-slate-500 text-sm leading-5">{item.content}</Text>
                        <View className="flex-row items-center mt-4 pt-4 border-t border-slate-50">
                            <Text className="text-amber-600 font-bold text-sm flex-1">Read Full Perspective</Text>
                            <MaterialIcons name="chevron-right" size={18} color="#D97706" />
                        </View>
                    </View>
                </Pressable>
            ))}
            {trials.length > 0 && (
                <View className="mt-4 mb-8">
                    <View className="flex-row items-center mb-4 bg-blue-50 p-4 rounded-2xl">
                        <View className="bg-blue-600 p-2 rounded-xl mr-3">
                            <MaterialIcons name="science" size={20} color="white" />
                        </View>
                        <View>
                            <Text className="text-xs font-bold text-blue-700 uppercase tracking-wider">ClinicalTrials.gov LIVE</Text>
                            <Text className="text-blue-900 font-black">Active Clinical Research</Text>
                        </View>
                    </View>
                    {trials.map((trial) => {
                        const getStatusStyle = (status: string) => {
                            const s = status.toLowerCase();
                            if (s.includes('recruiting') && !s.includes('not')) return { bg: '#ecfdf5', text: '#059669' };
                            if (s.includes('completed')) return { bg: '#f1f5f9', text: '#475569' };
                            if (s.includes('active')) return { bg: '#eff6ff', text: '#2563eb' };
                            return { bg: '#fff7ed', text: '#d97706' };
                        };
                        const formatStatus = (status: string) => {
                            return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                        };
                        const style = getStatusStyle(trial.status);
                        return (
                            <View key={trial.id} className="bg-white rounded-3xl p-5 border border-blue-50 mb-3 shadow-sm">
                                <View className="flex-row justify-between items-center mb-2">
                                    <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Study Ref: {trial.id}</Text>
                                    <View style={{ backgroundColor: style.bg }} className="px-2 py-0.5 rounded-md">
                                        <Text style={{ color: style.text }} className="text-[9px] font-black uppercase text-center">{formatStatus(trial.status)}</Text>
                                    </View>
                                </View>
                                <Text className="text-base font-bold text-slate-900 mb-2 leading-5">{trial.title}</Text>
                                <Text className="text-slate-500 text-xs leading-4" numberOfLines={3}>{trial.summary}</Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );

    const renderEducation = () => (
        <View className="px-5">
            <Pressable className="mb-8 rounded-[40px] overflow-hidden">
                <LinearGradient colors={['#0f172a', '#334155']} className="p-8">
                    <View className="bg-amber-500 px-3 py-1 rounded-full self-start mb-4">
                        <Text className="text-white text-[10px] font-black uppercase tracking-wider">Must Read</Text>
                    </View>
                    <Text className="text-2xl font-black text-white mb-2">The Sickle Cell Warrior Manual</Text>
                    <Text className="text-slate-300 text-sm mb-6 leading-5">A comprehensive guide on managing high-altitude travel and cold weather crises.</Text>
                    <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                            <Feather name="clock" size={14} color="#94a3b8" />
                            <Text className="text-slate-400 text-xs ml-2 font-bold">12 min read</Text>
                        </View>
                        <View className="bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                            <Text className="text-white font-bold text-xs">Begin Reading</Text>
                        </View>
                    </View>
                </LinearGradient>
            </Pressable>
            <Text className="text-xl font-black text-slate-900 mb-4">Daily Care & Tips</Text>
            {educationalTips.map((item, idx) => (
                <Pressable key={idx} className="bg-white rounded-[24px] p-5 flex-row items-center mb-4 shadow-sm border border-slate-50">
                    <View className="w-14 h-14 bg-amber-50 rounded-2xl items-center justify-center mr-4">
                        <MaterialIcons name={item.icon || 'info'} size={28} color="#F59E0B" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-slate-900 mb-1">{item.title}</Text>
                        <Text className="text-slate-500 text-xs leading-4">{item.content}</Text>
                    </View>
                </Pressable>
            ))}
            <Text className="text-xl font-black text-slate-900 mb-4 mt-6">Learning Modules</Text>
            {[
                { title: 'Genetics 101', icon: 'dna', color: '#3b82f6', bg: '#eff6ff', modules: '4 Modules', progress: 0.75 },
                { title: 'Pain Management', icon: 'favorite', color: '#f43f5e', bg: '#fff1f2', modules: '6 Modules', progress: 0.2 },
                { title: 'Hydration Science', icon: 'opacity', color: '#0ea5e9', bg: '#f0f9ff', modules: '3 Modules', progress: 0 },
                { title: 'Crisis Prevention', icon: 'shield', color: '#10b981', bg: '#f0fdf4', modules: '5 Modules', progress: 0 },
            ].map((item, idx) => (
                <Pressable key={idx} className="bg-slate-50 rounded-[32px] p-5 flex-row items-center mb-4 border border-slate-100">
                    <View style={{ backgroundColor: item.bg }} className="w-16 h-16 rounded-2xl items-center justify-center mr-4">
                        <MaterialIcons name={item.icon as any} size={32} color={item.color} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-black text-slate-900 mb-1">{item.title}</Text>
                        <View className="flex-row items-center">
                            <View className="flex-1 h-1.5 bg-slate-200 rounded-full mr-3 overflow-hidden">
                                <View style={{ width: `${item.progress * 100}%`, backgroundColor: item.color }} className="h-full" />
                            </View>
                            <Text className="text-[10px] font-bold text-slate-400">{Math.round(item.progress * 100)}%</Text>
                        </View>
                        <Text className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">{item.modules}</Text>
                    </View>
                </Pressable>
            ))}
        </View>
    );

    const renderQuiz = () => {
        if (showResults) {
            return (
                <View className="px-5 items-center pt-10">
                    <View className="bg-amber-100 w-32 h-32 rounded-full items-center justify-center mb-6">
                        <Feather name="award" size={64} color="#F59E0B" />
                    </View>
                    <Text className="text-3xl font-black text-slate-900 mb-2">Session Complete!</Text>
                    <Text className="text-slate-500 text-center mb-8 px-10">You've mastered {score} out of {quizzes.length} knowledge blocks in this session.</Text>
                    <View className="w-full bg-slate-50 rounded-3xl p-6 mb-10 border border-slate-100">
                        <View className="flex-row justify-between mb-4">
                            <Text className="font-bold text-slate-400">Accuracy</Text>
                            <Text className="font-black text-slate-900">{Math.round((score / quizzes.length) * 100)}%</Text>
                        </View>
                        <View className="h-2 bg-slate-200 rounded-full overflow-hidden">
                            <View style={{ width: `${(score / quizzes.length) * 100}%` }} className="bg-amber-500 h-full" />
                        </View>
                    </View>
                    <Pressable onPress={resetQuiz} className="bg-slate-900 w-full py-5 rounded-2xl items-center shadow-lg"><Text className="text-white font-black text-lg">Next Session</Text></Pressable>
                </View>
            );
        }
        if (quizStarted && quizzes[currentQuestionIndex]) {
            const q = quizzes[currentQuestionIndex];
            return (
                <View className="px-5">
                    <View className="flex-row justify-between items-center mb-8">
                        <Text className="text-slate-400 font-bold uppercase tracking-widest">Question {currentQuestionIndex + 1}/{quizzes.length}</Text>
                        <Pressable onPress={resetQuiz}><Text className="text-red-500 font-bold">End Session</Text></Pressable>
                    </View>
                    <View className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-200 border border-slate-50 mb-8">
                        <Text className="text-xl font-black text-slate-900 mb-8 leading-7">{q.question}</Text>
                        <View className="gap-3">
                            {(q.options || ['True', 'False']).map((opt, i) => (
                                <Pressable key={i} onPress={() => handleQuizAnswer(i)} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 active:bg-amber-50 active:border-amber-200">
                                    <Text className="text-slate-700 font-bold text-base text-center">{opt}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </View>
            );
        }
        return (
            <View className="px-5">
                <LinearGradient colors={['#4F46E5', '#7C3AED']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="rounded-[32px] p-8 mb-8">
                    <View className="flex-row justify-between items-center mb-6">
                        <View className="bg-white/20 px-3 py-1 rounded-full"><Text className="text-white text-[10px] font-bold uppercase tracking-wider">Weekly Challenge</Text></View>
                        <View className="flex-row items-center"><MaterialIcons name="local-fire-department" size={16} color="#FCD34D" /><Text className="text-white font-bold text-xs ml-1">5 Day Streak</Text></View>
                    </View>
                    <Text className="text-3xl font-black text-white mb-2">Myth vs. Reality</Text>
                    <Text className="text-white/80 text-sm mb-8 leading-5">Test your knowledge on common misconceptions about SCD and earn points!</Text>
                    <Pressable onPress={() => setQuizStarted(true)} className="bg-white py-4 rounded-2xl items-center shadow-lg active:scale-95"><Text className="text-indigo-600 font-black text-lg">Start Quiz Now</Text></Pressable>
                </LinearGradient>
                {quizzes.length > 0 && (
                    <View>
                        <Text className="text-xl font-black text-slate-800 mb-4 px-1">AI-Generated Practice</Text>
                        {quizzes.map((q, idx) => (
                            <Pressable key={idx} onPress={() => { setCurrentQuestionIndex(idx); setQuizStarted(true); }} className="bg-white rounded-[28px] p-6 border border-indigo-50 mb-4 shadow-sm flex-row items-center">
                                <View className="bg-indigo-50 w-12 h-12 rounded-2xl items-center justify-center mr-4"><MaterialIcons name="psychology" size={24} color="#4F46E5" /></View>
                                <View className="flex-1">
                                    <Text className="text-slate-800 font-bold mb-1 leading-5" numberOfLines={2}>{q.question}</Text>
                                    <Text className="text-indigo-600/60 text-[10px] font-black uppercase tracking-widest">Self Practice</Text>
                                </View>
                            </Pressable>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <SafeAreaView className="flex-1" edges={['top']}>
                <View className="px-5 pt-4 pb-2">
                    <View className="flex-row justify-between items-end mb-6">
                        <View>
                            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">Safe Knowledge</Text>
                            <Text className="text-3xl font-black text-slate-900 letter-tight">Library</Text>
                        </View>
                        <Pressable onPress={() => router.back()} className="bg-slate-50 w-10 h-10 rounded-full items-center justify-center border border-slate-100"><MaterialIcons name="close" size={24} color="#64748b" /></Pressable>
                    </View>
                    <View className="bg-slate-50 rounded-2xl flex-row items-center px-4 py-3 border border-slate-100">
                        <Feather name="search" size={20} color="#94a3b8" />
                        <TextInput placeholder="Search research, modules, news..." placeholderTextColor="#94a3b8" className="flex-1 ml-3 text-slate-900 font-medium" value={searchQuery} onChangeText={setSearchQuery} />
                    </View>
                </View>
                <View style={{ zIndex: 10, backgroundColor: 'white' }} className="pb-4">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 }}>
                        {categories.map((cat) => (
                            <Pressable key={cat} onPress={() => setActiveCategory(cat)} className={`mr-3 px-6 py-3 rounded-2xl ${activeCategory === cat ? 'bg-amber-500 shadow-md' : 'bg-slate-50 border border-slate-100'}`}>
                                <Text className={`font-bold ${activeCategory === cat ? 'text-white' : 'text-slate-500'}`}>{cat}</Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
                {loading && !refreshing ? (
                    <View className="flex-1 items-center justify-center p-20">
                        <ActivityIndicator color="#F59E0B" size="large" />
                        <Text className="text-slate-400 font-bold mt-4 text-center">Curating latest sickle cell knowledge...</Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F59E0B" />}>
                        {activeCategory === 'News' && renderNews()}
                        {activeCategory === 'Education' && renderEducation()}
                        {activeCategory === 'Quiz' && renderQuiz()}
                        {activeCategory === 'Resources' && (
                            <View className="px-5">
                                <Text className="text-xl font-black text-slate-900 mb-4">Patient Resources</Text>
                                <View className="bg-blue-600 rounded-[40px] p-8 mb-6 shadow-xl shadow-blue-200">
                                    <View className="bg-white/20 w-16 h-16 rounded-3xl items-center justify-center mb-6 border border-white/30"><Feather name="map-pin" size={32} color="white" /></View>
                                    <Text className="text-white text-2xl font-black mb-2">Find a Specialist</Text>
                                    <Text className="text-blue-100 text-sm mb-8 leading-5">Connect with hematologists and clinics specialized in Sickle Cell care near you.</Text>
                                    <Pressable className="bg-white py-4 rounded-2xl items-center shadow-lg"><Text className="text-blue-600 font-black">Search Clinics Near Me</Text></Pressable>
                                </View>
                                <View className="flex-row gap-4 mb-6">
                                    <View className="flex-1 bg-amber-50 rounded-[32px] p-5 border border-amber-100">
                                        <View className="bg-amber-500 w-10 h-10 rounded-2xl items-center justify-center mb-4"><MaterialIcons name="flight" size={20} color="white" /></View>
                                        <Text className="text-slate-900 font-black text-sm mb-1">Travel Docs</Text>
                                        <Text className="text-slate-500 text-[10px]">Printable ER letters</Text>
                                    </View>
                                    <View className="flex-1 bg-emerald-50 rounded-[32px] p-5 border border-emerald-100">
                                        <View className="bg-emerald-500 w-10 h-10 rounded-2xl items-center justify-center mb-4"><MaterialIcons name="local-pharmacy" size={20} color="white" /></View>
                                        <Text className="text-slate-900 font-black text-sm mb-1">Medication</Text>
                                        <Text className="text-slate-500 text-[10px]">Patient assistance</Text>
                                    </View>
                                </View>
                                <View className="bg-slate-900 rounded-[40px] p-8 mb-4">
                                    <Text className="text-white text-xl font-black mb-2">Digital Vault</Text>
                                    <Text className="text-slate-400 text-sm mb-6">Securely store and export your medical records for new doctors.</Text>
                                    <Pressable className="bg-white/10 py-4 rounded-2xl items-center border border-white/20"><Text className="text-white font-bold">Open Vault</Text></Pressable>
                                </View>
                            </View>
                        )}
                    </ScrollView>
                )}
            </SafeAreaView>
        </View>
    );
}
