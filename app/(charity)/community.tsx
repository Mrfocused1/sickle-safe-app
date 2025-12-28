import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Users, Heart, MessageCircle, TrendingUp, Search, Filter, UserPlus, Mail, Phone } from 'lucide-react-native';

export default function CommunityScreen() {
    const [activeTab, setActiveTab] = useState<'donors' | 'beneficiaries'>('donors');
    const [searchQuery, setSearchQuery] = useState('');

    const donors = [
        { id: 1, name: 'Sarah Johnson', amount: '£5,000', frequency: 'Monthly', since: '2023', avatar: 'SJ' },
        { id: 2, name: 'Michael Chen', amount: '£2,500', frequency: 'Quarterly', since: '2024', avatar: 'MC' },
        { id: 3, name: 'Emma Williams', amount: '£10,000', frequency: 'Annual', since: '2022', avatar: 'EW' },
        { id: 4, name: 'David Brown', amount: '£1,000', frequency: 'One-time', since: '2024', avatar: 'DB' },
    ];

    const beneficiaries = [
        { id: 1, name: 'James Anderson', program: 'Medical Support', status: 'Active', since: '2023', avatar: 'JA' },
        { id: 2, name: 'Lisa Martinez', program: 'Education Fund', status: 'Active', since: '2024', avatar: 'LM' },
        { id: 3, name: 'Robert Taylor', program: 'Emergency Aid', status: 'Completed', since: '2023', avatar: 'RT' },
        { id: 4, name: 'Maria Garcia', program: 'Medical Support', status: 'Active', since: '2024', avatar: 'MG' },
    ];

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Community</Text>
                        <Text style={styles.headerSubtitle}>Connect with your network</Text>
                    </View>
                    <Pressable style={styles.addButton}>
                        <UserPlus size={20} color="#fff" />
                    </Pressable>
                </View>

                {/* Stats Cards */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.statsContainer}
                    contentContainerStyle={styles.statsContent}
                >
                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#f1f5f9' }]}>
                            <Heart size={18} color="#374151" />
                        </View>
                        <Text style={styles.statValue}>248</Text>
                        <Text style={styles.statLabel}>Active Donors</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#f1f5f9' }]}>
                            <Users size={18} color="#374151" />
                        </View>
                        <Text style={styles.statValue}>1,247</Text>
                        <Text style={styles.statLabel}>Beneficiaries</Text>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIcon, { backgroundColor: '#f1f5f9' }]}>
                            <TrendingUp size={18} color="#374151" />
                        </View>
                        <Text style={styles.statValue}>32%</Text>
                        <Text style={styles.statLabel}>Growth Rate</Text>
                    </View>
                </ScrollView>

                {/* Tab Selector */}
                <View style={styles.tabContainer}>
                    <Pressable
                        style={[styles.tab, activeTab === 'donors' && styles.activeTab]}
                        onPress={() => setActiveTab('donors')}
                    >
                        <Text style={[styles.tabText, activeTab === 'donors' && styles.activeTabText]}>
                            Donors
                        </Text>
                    </Pressable>
                    <Pressable
                        style={[styles.tab, activeTab === 'beneficiaries' && styles.activeTab]}
                        onPress={() => setActiveTab('beneficiaries')}
                    >
                        <Text style={[styles.tabText, activeTab === 'beneficiaries' && styles.activeTabText]}>
                            Beneficiaries
                        </Text>
                    </Pressable>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Search size={18} color="#9CA3AF" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder={`Search ${activeTab}...`}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <Pressable style={styles.filterButton}>
                        <Filter size={18} color="#374151" />
                    </Pressable>
                </View>

                {/* List */}
                <ScrollView
                    style={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                >
                    {activeTab === 'donors' ? (
                        donors.map((donor) => (
                            <Pressable key={donor.id} style={styles.listItem}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{donor.avatar}</Text>
                                </View>
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemName}>{donor.name}</Text>
                                    <Text style={styles.itemMeta}>
                                        {donor.frequency} • Since {donor.since}
                                    </Text>
                                </View>
                                <View style={styles.itemRight}>
                                    <Text style={styles.itemAmount}>{donor.amount}</Text>
                                    <View style={styles.actionButtons}>
                                        <Pressable style={styles.actionButton}>
                                            <Mail size={16} color="#6B7280" />
                                        </Pressable>
                                        <Pressable style={styles.actionButton}>
                                            <MessageCircle size={16} color="#6B7280" />
                                        </Pressable>
                                    </View>
                                </View>
                            </Pressable>
                        ))
                    ) : (
                        beneficiaries.map((beneficiary) => (
                            <Pressable key={beneficiary.id} style={styles.listItem}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>{beneficiary.avatar}</Text>
                                </View>
                                <View style={styles.itemContent}>
                                    <Text style={styles.itemName}>{beneficiary.name}</Text>
                                    <Text style={styles.itemMeta}>
                                        {beneficiary.program} • Since {beneficiary.since}
                                    </Text>
                                </View>
                                <View style={styles.itemRight}>
                                    <View style={[
                                        styles.statusBadge,
                                        beneficiary.status === 'Active' ? styles.statusActive : styles.statusCompleted
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            beneficiary.status === 'Active' ? styles.statusActiveText : styles.statusCompletedText
                                        ]}>
                                            {beneficiary.status}
                                        </Text>
                                    </View>
                                    <View style={styles.actionButtons}>
                                        <Pressable style={styles.actionButton}>
                                            <Phone size={16} color="#6B7280" />
                                        </Pressable>
                                        <Pressable style={styles.actionButton}>
                                            <MessageCircle size={16} color="#6B7280" />
                                        </Pressable>
                                    </View>
                                </View>
                            </Pressable>
                        ))
                    )}
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
        paddingBottom: 24,
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
    statsContainer: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    statsContent: {
        gap: 12,
    },
    statCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 12,
        width: 120,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    statIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '900',
        color: '#111827',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 11,
        color: '#6B7280',
        fontWeight: '600',
    },
    tabContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginBottom: 20,
        gap: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    activeTab: {
        backgroundColor: '#374151',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#6B7280',
    },
    activeTabText: {
        color: '#ffffff',
    },
    searchContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        marginBottom: 20,
        gap: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#374151',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#ffffff',
    },
    itemContent: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
    },
    itemMeta: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '600',
    },
    itemRight: {
        alignItems: 'flex-end',
    },
    itemAmount: {
        fontSize: 16,
        fontWeight: '900',
        color: '#374151',
        marginBottom: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
    },
    statusActive: {
        backgroundColor: '#D1FAE5',
    },
    statusCompleted: {
        backgroundColor: '#E5E7EB',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statusActiveText: {
        color: '#059669',
    },
    statusCompletedText: {
        color: '#6B7280',
    },
});
