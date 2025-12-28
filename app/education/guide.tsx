import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { featuredGuide } from '../../data/education_content';

const { width } = Dimensions.get('window');

export default function GuideScreen() {
    const insets = useSafeAreaInsets();
    const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
    const chapter = featuredGuide.chapters[currentChapterIndex];

    const handleNext = () => {
        if (currentChapterIndex < featuredGuide.chapters.length - 1) {
            setCurrentChapterIndex(prev => prev + 1);
        } else {
            router.back();
        }
    };

    const handleBack = () => {
        if (currentChapterIndex > 0) {
            setCurrentChapterIndex(prev => prev - 1);
        } else {
            router.back();
        }
    };

    const progress = ((currentChapterIndex + 1) / featuredGuide.chapters.length) * 100;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <LinearGradient
                colors={['#dc2626', '#991b1b']}
                style={[styles.header, { paddingTop: insets.top + 20 }]}
            >
                <View style={[styles.headerContent, { marginTop: insets.top }]}>
                    <Pressable onPress={() => router.back()} style={styles.closeButton}>
                        <MaterialIcons name="close" size={24} color="#ffffff" />
                    </Pressable>
                    <View style={styles.titleContainer}>
                        <Text style={styles.headerSubtitle}>CHAPTER {currentChapterIndex + 1}</Text>
                        <Text style={styles.headerTitle}>{chapter.title}</Text>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${progress}%` }]} />
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.contentScroll}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.chapterCard}>
                    <View style={styles.metaRow}>
                        <View style={styles.badge}>
                            <Feather name="clock" size={12} color="#dc2626" />
                            <Text style={styles.badgeText}>{chapter.readingTime} read</Text>
                        </View>
                        <View style={styles.badge}>
                            <MaterialIcons name="bookmark-border" size={12} color="#dc2626" />
                            <Text style={styles.badgeText}>Save</Text>
                        </View>
                    </View>

                    <Text style={styles.chapterContent}>{chapter.content}</Text>

                    <View style={styles.guideNote}>
                        <MaterialIcons name="info-outline" size={20} color="#991b1b" />
                        <Text style={styles.guideNoteText}>
                            Always keep a copy of your personal emergency plan in your physical travel documents.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable onPress={handleBack} style={styles.secondaryButton}>
                    <Text style={styles.secondaryButtonText}>
                        {currentChapterIndex === 0 ? 'Exit Guide' : 'Previous'}
                    </Text>
                </Pressable>
                <Pressable onPress={handleNext} style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>
                        {currentChapterIndex === featuredGuide.chapters.length - 1 ? 'Finish Guide' : 'Next Chapter'}
                    </Text>
                    <MaterialIcons name="arrow-forward" size={18} color="#ffffff" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        paddingHorizontal: 24,
        paddingBottom: 30,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleContainer: {
        marginLeft: 16,
        flex: 1,
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    headerTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '800',
    },
    progressContainer: {
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 2,
    },
    contentScroll: {
        flex: 1,
        marginTop: -20,
    },
    contentContainer: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    chapterCard: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    metaRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fef2f2',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        gap: 6,
    },
    badgeText: {
        color: '#dc2626',
        fontSize: 11,
        fontWeight: '700',
    },
    chapterContent: {
        fontSize: 16,
        color: '#334155',
        lineHeight: 26,
        fontWeight: '500',
    },
    guideNote: {
        marginTop: 30,
        backgroundColor: '#fff1f2',
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        gap: 12,
    },
    guideNoteText: {
        flex: 1,
        fontSize: 13,
        color: '#991b1b',
        fontWeight: '600',
        lineHeight: 18,
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 20,
        flexDirection: 'row',
        gap: 12,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
    },
    primaryButton: {
        flex: 2,
        backgroundColor: '#dc2626',
        height: 56,
        borderRadius: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: '#f8fafc',
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    secondaryButtonText: {
        color: '#64748b',
        fontSize: 15,
        fontWeight: '600',
    },
});
