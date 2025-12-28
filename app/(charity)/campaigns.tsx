import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Plus, Target, TrendingUp, Calendar, Users, DollarSign, MoreVertical } from 'lucide-react-native';

export default function CampaignsScreen() {
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');

    const campaigns = [
        {
            id: 1,
            title: 'Emergency Medical Fund',
            description: 'Supporting urgent medical needs for sickle cell patients',
            raised: 45000,
            goal: 100000,
            donors: 248,
            daysLeft: 45,
            status: 'active',
            color: '#10B981',
        },
        {
            id: 2,
            title: 'Education Scholarship Program',
            description: 'Providing educational opportunities for affected families',
            raised: 78000,
            goal: 80000,
            donors: 156,
            daysLeft: 12,
            status: 'active',
            color: '#3B82F6',
        },
        {
            id: 3,
            title: 'Research Initiative 2024',
            description: 'Funding breakthrough research in sickle cell treatment',
            raised: 120000,
            goal: 120000,
            donors: 342,
            daysLeft: 0,
            status: 'completed',
            color: '#6B7280',
        },
        {
            id: 4,
            title: 'Community Awareness Drive',
            description: 'Raising awareness and providing resources to communities',
            raised: 23000,
            goal: 50000,
            donors: 89,
            daysLeft: 60,
            status: 'active',
            color: '#F59E0B',
        },
    ];

    const filteredCampaigns = campaigns.filter(campaign => {
        if (activeFilter === 'all') return true;
        return campaign.status === activeFilter;
    });

    const calculateProgress = (raised: number, goal: number) => {
        return Math.min((raised / goal) * 100, 100);
    };

    const formatCurrency = (amount: number) => {
        if (amount >= 1000) {
            return `£${(amount / 1000).toFixed(0)}K`;
        }
        return `£${amount}`;
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Campaigns</Text>
                        <Text style={styles.headerSubtitle}>Manage your fundraising efforts</Text>
                    </View>
                    <Pressable style={styles.addButton}>
                        <Plus size={20} color="#fff" />
                    </Pressable>
                </View>

                {/* Stats Overview */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <View style={styles.statIconContainer}>
                            <Target size={16} color="#374151" />
                        </View>
                        <Text style={styles.statValue}>£266K</Text>
                        <Text style={styles.statLabel}>Total Raised</Text>
                    </View>

                    <View style={styles.statBox}>
                        <View style={styles.statIconContainer}>
                            <Users size={16} color="#374151" />
                        </View>
                        <Text style={styles.statValue}>835</Text>
                        <Text style={styles.statLabel}>Total Donors</Text>
                    </View>

                    <View style={styles.statBox}>
                        <View style={styles.statIconContainer}>
                            <TrendingUp size={16} color="#374151" />
                        </View>
                        <Text style={styles.statValue}>4</Text>
                        <Text style={styles.statLabel}>Active</Text>
                    </View>
                </View>

                {/* Filter Tabs */}
                <View style={styles.filterContainer}>
                    <Pressable
                        style={[styles.filterTab, activeFilter === 'all' && styles.activeFilterTab]}
                        onPress={() => setActiveFilter('all')}
                    >
                        <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
                            All
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.filterTab, activeFilter === 'active' && styles.activeFilterTab]}
                        onPress={() => setActiveFilter('active')}
                    >
                        <Text style={[styles.filterText, activeFilter === 'active' && styles.activeFilterText]}>
                            Active
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.filterTab, activeFilter === 'completed' && styles.activeFilterTab]}
                        onPress={() => setActiveFilter('completed')}
                    >
                        <Text style={[styles.filterText, activeFilter === 'completed' && styles.activeFilterText]}>
                            Completed
                        </Text>
                    </Pressable>
                </View>

                {/* Campaigns List */}
                <ScrollView
                    style={styles.campaignsList}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.campaignsContent}
                >
                    {filteredCampaigns.map((campaign) => (
                        <View key={campaign.id} style={styles.campaignCard}>
                            {/* Card Header */}
                            <View style={styles.campaignHeader}>
                                <View style={styles.campaignTitleRow}>
                                    <View style={[styles.statusDot, { backgroundColor: campaign.color }]} />
                                    <Text style={styles.campaignTitle}>{campaign.title}</Text>
                                </View>
                                <Pressable style={styles.moreButton}>
                                    <MoreVertical size={18} color="#6B7280" />
                                </Pressable>
                            </View>

                            <Text style={styles.campaignDescription}>{campaign.description}</Text>

                            {/* Progress Bar */}
                            <View style={styles.progressSection}>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[
                                            styles.progressFill,
                                            {
                                                width: `${calculateProgress(campaign.raised, campaign.goal)}%`,
                                                backgroundColor: campaign.status === 'completed' ? '#10B981' : '#374151'
                                            }
                                        ]}
                                    />
                                </View>
                                <View style={styles.progressStats}>
                                    <Text style={styles.progressText}>
                                        <Text style={styles.progressBold}>{formatCurrency(campaign.raised)}</Text>
                                        {' '}raised of {formatCurrency(campaign.goal)} goal
                                    </Text>
                                    <Text style={styles.progressPercentage}>
                                        {calculateProgress(campaign.raised, campaign.goal).toFixed(0)}%
                                    </Text>
                                </View>
                            </View>

                            {/* Campaign Meta */}
                            <View style={styles.campaignMeta}>
                                <View style={styles.metaItem}>
                                    <Users size={14} color="#6B7280" />
                                    <Text style={styles.metaText}>{campaign.donors} donors</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Calendar size={14} color="#6B7280" />
                                    <Text style={styles.metaText}>
                                        {campaign.daysLeft > 0 ? `${campaign.daysLeft} days left` : 'Completed'}
                                    </Text>
                                </View>
                            </View>

                            {/* Action Button */}
                            <Pressable style={styles.viewButton}>
                                <Text style={styles.viewButtonText}>View Details</Text>
                            </Pressable>
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#374151',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 12,
        marginBottom: 24,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        alignItems: 'center',
    },
    statIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 10,
        color: '#6B7280',
        fontWeight: '600',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginBottom: 20,
        gap: 8,
    },
    filterTab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    activeFilterTab: {
        backgroundColor: '#374151',
    },
    filterText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6B7280',
    },
    activeFilterText: {
        color: '#ffffff',
    },
    campaignsList: {
        flex: 1,
    },
    campaignsContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    campaignCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    campaignHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    campaignTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 10,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    campaignTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111827',
        flex: 1,
    },
    moreButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    campaignDescription: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
        lineHeight: 18,
        marginBottom: 16,
    },
    progressSection: {
        marginBottom: 16,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    progressStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    progressText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    progressBold: {
        fontWeight: '900',
        color: '#111827',
    },
    progressPercentage: {
        fontSize: 14,
        fontWeight: '900',
        color: '#374151',
    },
    campaignMeta: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    viewButton: {
        backgroundColor: '#374151',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    viewButtonText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#ffffff',
    },
});
