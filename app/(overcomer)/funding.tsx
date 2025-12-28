import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

import { FUNDING_OPPORTUNITIES, FundingOpportunity } from '../../data/funding_data';
import AppBottomSheet from '../../components/AppBottomSheet';

export default function FundingDirectoryScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<'all' | 'benefit' | 'grant' | 'emergency_aid'>('all');
    const [selectedOpportunity, setSelectedOpportunity] = useState<FundingOpportunity | null>(null);
    const [showDetailSheet, setShowDetailSheet] = useState(false);

    const filteredOpportunities = FUNDING_OPPORTUNITIES.filter(opp => {
        const matchesSearch = opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            opp.organization.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || opp.type === selectedType;
        return matchesSearch && matchesType;
    });

    const handleOpportunityPress = (opp: FundingOpportunity) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedOpportunity(opp);
        setShowDetailSheet(true);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />
            <LinearGradient
                colors={['#ffffff', '#f8fafc', '#ffffff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} style={styles.backButton}>
                        <MaterialIcons name="arrow-back-ios" size={24} color="#1e293b" />
                    </Pressable>
                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>Funding & Grants</Text>
                        <Text style={styles.headerSubtitle}>UK Support Directory</Text>
                    </View>
                    <View style={{ width: 44 }} />
                </View>

                {/* Search & Filter */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchInputWrapper}>
                        <MaterialIcons name="search" size={20} color="#94a3b8" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search opportunities..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#94a3b8"
                        />
                    </View>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContainer}>
                    {[
                        { id: 'all', label: 'All Support', icon: 'apps' },
                        { id: 'benefit', label: 'Benefits', icon: 'account-balance' },
                        { id: 'grant', label: 'Grants', icon: 'card-giftcard' },
                        { id: 'emergency_aid', label: 'Emergency', icon: 'emergency' }
                    ].map((type) => (
                        <Pressable
                            key={type.id}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setSelectedType(type.id as any);
                            }}
                            style={[
                                styles.filterChip,
                                selectedType === type.id && styles.filterChipActive
                            ]}
                        >
                            <MaterialIcons
                                name={type.icon as any}
                                size={18}
                                color={selectedType === type.id ? '#ffffff' : '#64748b'}
                            />
                            <Text style={[
                                styles.filterChipLabel,
                                selectedType === type.id && styles.filterChipLabelActive
                            ]}>
                                {type.label}
                            </Text>
                        </Pressable>
                    ))}
                </ScrollView>

                {/* Opportunity List */}
                <ScrollView
                    style={styles.listScroll}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredOpportunities.length > 0 ? (
                        filteredOpportunities.map((opp) => (
                            <Pressable
                                key={opp.id}
                                onPress={() => handleOpportunityPress(opp)}
                                style={styles.oppCard}
                            >
                                <View style={[styles.oppIconBg, { backgroundColor: opp.color + '10' }]}>
                                    <MaterialIcons name={opp.icon as any} size={22} color={opp.color} />
                                </View>

                                <View style={styles.oppContent}>
                                    <View style={{ marginBottom: 10 }}>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.oppTitle}>{opp.title}</Text>
                                                <Text style={styles.oppOrg}>{opp.organization}</Text>
                                            </View>
                                            {opp.amount && (
                                                <Text style={styles.amountText}>{opp.amount}</Text>
                                            )}
                                        </View>
                                    </View>

                                    {/* Small Design element inspired by learning modules progress bar */}
                                    <View style={styles.progressContainer}>
                                        <View style={[styles.progressBar, { width: opp.amount ? '75%' : '40%', backgroundColor: opp.color || '#cbd5e1' }]} />
                                    </View>

                                    <View style={styles.cardFooter}>
                                        <Text style={styles.oppCategory}>{opp.category} • {opp.requiresAIHelper ? 'AI Supported' : 'Manual Apply'}</Text>
                                        <MaterialIcons name="chevron-right" size={18} color="#CBD5E1" />
                                    </View>
                                </View>
                            </Pressable>
                        ))
                    ) : (
                        <View style={styles.emptyState}>
                            <MaterialIcons name="search-off" size={64} color="#e2e8f0" />
                            <Text style={styles.emptyTitle}>No results found</Text>
                            <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>

            <AppBottomSheet
                visible={showDetailSheet}
                onClose={() => setShowDetailSheet(false)}
                type="funding_detail"
                fundingItem={selectedOpportunity || undefined}
            />
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
    },
    headerTitleContainer: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
        letterSpacing: -0.5,
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        marginTop: 2,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    searchInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    filterScroll: {
        marginTop: 16,
        maxHeight: 44,
    },
    filterContainer: {
        paddingHorizontal: 20,
        gap: 8,
        flexDirection: 'row',
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        gap: 6,
    },
    filterChipActive: {
        backgroundColor: '#1F2937',
        borderColor: '#1F2937',
    },
    filterChipLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
    },
    filterChipLabelActive: {
        color: '#ffffff',
    },
    listScroll: {
        flex: 1,
        marginTop: 16,
    },
    listContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: 12,
    },
    oppCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 16,
        paddingRight: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        shadowColor: '#64748b',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    oppIconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    oppContent: {
        flex: 1,
        marginLeft: 16,
    },
    oppHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    oppCategory: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94a3b8',
    },
    aiBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f3ff',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        gap: 3,
    },
    aiBadgeText: {
        fontSize: 9,
        fontWeight: '700',
        color: '#8b5cf6',
    },
    oppTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1e293b',
        marginBottom: 2,
    },
    oppOrg: {
        fontSize: 12,
        fontWeight: '700',
        color: '#94a3b8',
    },
    progressContainer: {
        height: 4,
        width: '100%',
        backgroundColor: '#f1f5f9',
        borderRadius: 2,
        marginBottom: 8,
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    amountText: {
        fontSize: 12,
        fontWeight: '800',
        color: '#94a3b8',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#475569',
        marginTop: 16,
    },
    emptySubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#94a3b8',
        marginTop: 4,
    }
});
