import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    SafeAreaView,
    Dimensions,
    Animated,
    Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
    TrendingUp,
    Users,
    ArrowRight,
    HandHeart,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Dashboard = () => {
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <View style={styles.statusContainer}>
                            <Animated.View style={[styles.statusDot, { transform: [{ scale: pulseAnim }] }]} />
                            <Text style={styles.statusText}>Executive Portal • Live</Text>
                        </View>
                        <Text style={styles.greetingTitle}>Organization Hub</Text>
                        <Text style={styles.greetingSubtitle}>{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
                    </View>
                    <Pressable style={styles.profileButton}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' }}
                            style={styles.avatar}
                        />
                    </Pressable>
                </View>

                {/* Elite Funding Card */}
                <View style={styles.cardContainer}>
                    <LinearGradient
                        colors={['#1e293b', '#0f172a']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.mainCard}
                    >
                        {/* Background Pattern */}
                        <View style={styles.cardPattern}>
                            <View style={styles.patternCircle} />
                            <View style={[styles.patternCircle, { top: -50, right: -50, opacity: 0.1 }]} />
                        </View>

                        <View style={styles.cardHeader}>
                            <View style={styles.premiumBadge}>
                                <Text style={styles.premiumBadgeText}>Current Campaign</Text>
                            </View>
                            <Text style={styles.cardUpdateText}>Updated 2m ago</Text>
                        </View>

                        <Text style={styles.cardTitle}>Year-End Impact Fund</Text>

                        <View style={styles.fundingStats}>
                            <View>
                                <Text style={styles.amountLabel}>Raised</Text>
                                <Text style={styles.amountValue}>$184,250</Text>
                            </View>
                            <View style={styles.divider} />
                            <View>
                                <Text style={styles.amountLabel}>Goal</Text>
                                <Text style={styles.amountValue}>$250,000</Text>
                            </View>
                        </View>

                        <View style={styles.progressSection}>
                            <View style={styles.progressTrack}>
                                <LinearGradient
                                    colors={['#fbbf24', '#d97706']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.progressBar, { width: '74%' }]}
                                />
                            </View>
                            <View style={styles.progressLabels}>
                                <Text style={styles.progressPercent}>74% Completed</Text>
                                <Text style={styles.progressDays}>12 Days Left</Text>
                            </View>
                        </View>

                        <Pressable style={styles.launchButton}>
                            <Text style={styles.launchButtonText}>Launch New Campaign</Text>
                            <ArrowRight size={18} color="#0f172a" />
                        </Pressable>
                    </LinearGradient>
                </View>

                {/* Executive Stats Grid */}
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#f1f5f9' }]}>
                            <Users size={20} color="#d97706" />
                        </View>
                        <Text style={styles.statNumber}>12.4k</Text>
                        <Text style={styles.statLabel}>Active Reach</Text>
                        <View style={styles.trendRow}>
                            <TrendingUp size={12} color="#059669" />
                            <Text style={styles.trendText}>+12.5%</Text>
                        </View>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#f0f9ff' }]}>
                            <HandHeart size={20} color="#0284c7" />
                        </View>
                        <Text style={styles.statNumber}>842</Text>
                        <Text style={styles.statLabel}>Total Partners</Text>
                        <View style={styles.trendRow}>
                            <TrendingUp size={12} color="#059669" />
                            <Text style={styles.trendText}>+4.2%</Text>
                        </View>
                    </View>
                </View>

                {/* Impact Spotlight Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Impact Snapshot</Text>
                    <Pressable>
                        <Text style={styles.viewAllText}>Full Report</Text>
                    </Pressable>
                </View>

                <View style={styles.impactCard}>
                    <View style={styles.impactContent}>
                        <View style={styles.impactHighlight}>
                            <Text style={styles.impactBigNumber}>92%</Text>
                            <Text style={styles.impactHighlightLabel}>Direct-to-Need Efficiency</Text>
                        </View>
                        <View style={styles.verticalDivider} />
                        <View style={styles.impactDetails}>
                            <Text style={styles.impactQuote}>"Changing lives through sustainable intervention."</Text>
                            <View style={styles.tagRow}>
                                <View style={styles.impactTag}>
                                    <Text style={styles.impactTagText}>Medical Support</Text>
                                </View>
                                <View style={[styles.impactTag, { backgroundColor: '#f0fdf4' }]}>
                                    <Text style={[styles.impactTagText, { color: '#166534' }]}>Verified</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        paddingBottom: 24,
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    greetingTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -1,
    },
    greetingSubtitle: {
        fontSize: 14,
        color: '#64748b',
        fontWeight: '500',
        marginTop: 2,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
        marginBottom: 8,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#d97706',
        marginRight: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#475569',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    profileButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#e2e8f0',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    cardContainer: {
        paddingHorizontal: 24,
        marginBottom: 32,
    },
    mainCard: {
        borderRadius: 32,
        padding: 24,
        overflow: 'hidden',
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 10,
    },
    cardPattern: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.05,
    },
    patternCircle: {
        position: 'absolute',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: '#fff',
        top: -100,
        right: -100,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        zIndex: 1,
    },
    premiumBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    premiumBadgeText: {
        color: '#fbbf24',
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    cardUpdateText: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 11,
        fontWeight: '600',
    },
    cardTitle: {
        fontSize: 26,
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: 24,
        zIndex: 1,
        letterSpacing: -0.5,
    },
    fundingStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
        zIndex: 1,
    },
    amountLabel: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    amountValue: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '800',
    },
    divider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        marginHorizontal: 24,
    },
    progressSection: {
        marginBottom: 24,
    },
    progressTrack: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 4,
        marginBottom: 12,
    },
    progressBar: {
        height: '100%',
        borderRadius: 4,
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        zIndex: 1,
    },
    progressPercent: {
        color: '#ffffff',
        fontSize: 13,
        fontWeight: '700',
    },
    progressDays: {
        color: '#fbbf24',
        fontSize: 13,
        fontWeight: '700',
    },
    launchButton: {
        backgroundColor: '#ffffff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 24,
        zIndex: 1,
    },
    launchButtonText: {
        color: '#0f172a',
        fontSize: 15,
        fontWeight: '800',
        marginRight: 8,
    },
    statsGrid: {
        paddingHorizontal: 24,
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    statIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '800',
        color: '#0f172a',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        marginBottom: 8,
    },
    trendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ecfdf5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    trendText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#059669',
        marginLeft: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    viewAllText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#d97706',
    },
    impactCard: {
        marginHorizontal: 24,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    impactContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    impactHighlight: {
        paddingRight: 20,
        alignItems: 'center',
        width: 100,
    },
    impactBigNumber: {
        fontSize: 32,
        fontWeight: '800',
        color: '#d97706',
    },
    impactHighlightLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748b',
        textAlign: 'center',
        textTransform: 'uppercase',
        marginTop: 4,
    },
    verticalDivider: {
        width: 1,
        height: 60,
        backgroundColor: '#f1f5f9',
    },
    impactDetails: {
        flex: 1,
        paddingLeft: 20,
    },
    impactQuote: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        lineHeight: 20,
        marginBottom: 12,
    },
    tagRow: {
        flexDirection: 'row',
        gap: 8,
    },
    impactTag: {
        backgroundColor: '#f1f5f9',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    impactTagText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#d97706',
    },
});

export default Dashboard;
