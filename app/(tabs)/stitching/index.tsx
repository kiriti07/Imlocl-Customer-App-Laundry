import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Scissors, Filter } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { stitchingRequests } from '@/mocks/stitchingRequests';
import RequestCard from '@/components/RequestCard';

const FILTERS = ['All', 'Open', 'In Progress', 'Completed'];

export default function StitchingScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('All');

  const filteredRequests = stitchingRequests.filter((req) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Open') return req.status === 'open';
    if (activeFilter === 'In Progress') return req.status === 'in_progress';
    if (activeFilter === 'Completed') return req.status === 'completed';
    return true;
  });

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Scissors size={22} color={Colors.primary} />
            <Text style={styles.headerTitle}>Stitching & Design</Text>
          </View>
          <Pressable style={styles.filterBtn}>
            <Filter size={18} color={Colors.textSecondary} />
          </Pressable>
        </View>
      </SafeAreaView>

      <View style={styles.filtersRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {FILTERS.map((filter) => (
            <Pressable
              key={filter}
              style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoBanner}>
          <Text style={styles.infoTitle}>How it works</Text>
          <Text style={styles.infoText}>
            Post your outfit requirements with your budget. Registered tailors and designers will bid with their quotes. Choose the best offer!
          </Text>
        </View>

        {filteredRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <Scissors size={48} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>No requests yet</Text>
            <Text style={styles.emptyText}>Be the first to post a stitching request!</Text>
          </View>
        ) : (
          filteredRequests.map((req) => (
            <RequestCard
              key={req.id}
              title={req.title}
              outfitType={req.outfitType}
              budget={req.budget}
              customerName={req.customerName}
              customerAvatar={req.customerAvatar}
              bidCount={req.bids.length}
              status={req.status}
              createdAt={req.createdAt}
              onPress={() => router.push(`/stitching-request/${req.id}`)}
            />
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      <Pressable
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
        onPress={() => router.push('/post-request')}
        testID="post-request-fab"
      >
        <Plus size={24} color="#FFF" />
        <Text style={styles.fabText}>Post Request</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeTop: {
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filtersRow: {
    backgroundColor: Colors.surface,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: '#FFF',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  infoBanner: {
    backgroundColor: Colors.stitchingLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.stitching,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
    gap: 8,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }],
  },
  fabText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700' as const,
  },
});
