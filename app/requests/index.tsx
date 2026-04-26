// app/requests/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Search,
  SlidersHorizontal,
  Clock,
  Send,
  X,
  ShieldCheck,
  Star,
  ChevronRight,
  Scissors,
} from 'lucide-react-native';

import Colors from '@/constants/colors';
import { stitchingRequests } from '@/mocks/stitchingRequests';

const STATUS_FILTERS = ['All', 'Open', 'In progress', 'Completed'];

// Deterministic masked code per request+index so it's stable
function getMaskedCode(idx: number): string {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  return `T·${letters[idx % letters.length]}${Math.floor(idx / letters.length) + 1}`;
}

export default function RequestsScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('All');
  const [selected, setSelected]     = useState<any>(null);
  const [bidModal, setBidModal]     = useState(false);
  const [bidPrice, setBidPrice]     = useState('');
  const [bidDays, setBidDays]       = useState('');
  const [bidMessage, setBidMessage] = useState('');

  const filtered = stitchingRequests.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.outfitType.toLowerCase().includes(q);
    const matchFilter =
      filter === 'All' || r.status.toLowerCase() === filter.toLowerCase().replace(' ', '_');
    return matchSearch && matchFilter;
  });

  const handleSubmitBid = () => {
    if (!bidPrice || !bidDays || !bidMessage) {
      Alert.alert('Missing fields', 'Please fill in all fields before submitting.');
      return;
    }
    Alert.alert('Bid submitted!', 'The customer will review your bid shortly.', [
      {
        text: 'OK',
        onPress: () => {
          setBidModal(false);
          setBidPrice('');
          setBidDays('');
          setBidMessage('');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Customer requests</Text>
            <Text style={styles.subtitle}>Find your next project</Text>
          </View>
          <Pressable style={styles.filterIconBtn}>
            <SlidersHorizontal size={16} color={Colors.text} />
          </Pressable>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Search size={16} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search requests…"
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <X size={15} color={Colors.textLight} />
            </Pressable>
          )}
        </View>
      </View>

      {/* ── Status filters ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {STATUS_FILTERS.map((f) => (
          <Pressable
            key={f}
            style={[styles.filterPill, filter === f && styles.filterPillActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* ── Masked identity notice ── */}
      <View style={styles.maskedNotice}>
        <ShieldCheck size={14} color={Colors.maskedText} />
        <Text style={styles.maskedNoticeText}>
          Your identity as a tailor is shown as a code (e.g. T·A1) until the customer connects with you.
        </Text>
      </View>

      {/* ── List ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        <Text style={styles.resultLabel}>
          {filtered.length} request{filtered.length !== 1 ? 's' : ''}
        </Text>

        {filtered.map((req, idx) => {
          const code = getMaskedCode(idx);
          const isOpen = req.status === 'open';
          return (
            <Pressable
              key={req.id}
              style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
              onPress={() => setSelected(req)}
            >
              {/* Card top row */}
              <View style={styles.cardTop}>
                <View style={styles.cardTypePill}>
                  <Scissors size={11} color={Colors.maskedText} />
                  <Text style={styles.cardTypeText}>{req.outfitType}</Text>
                </View>
                <View style={[styles.statusPill, isOpen ? styles.statusOpen : styles.statusProgress]}>
                  <Text style={[styles.statusText, isOpen ? styles.statusTextOpen : styles.statusTextProgress]}>
                    {isOpen ? 'Open' : 'In progress'}
                  </Text>
                </View>
              </View>

              {/* Title + description */}
              <Text style={styles.cardTitle}>{req.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{req.description}</Text>

              {/* Reference images */}
              {req.images?.length > 0 && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbRow}>
                  {req.images.map((img: string, i: number) => (
                    <Image key={i} source={{ uri: img }} style={styles.thumb} />
                  ))}
                </ScrollView>
              )}

              {/* Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.cardFooterLeft}>
                  <Text style={styles.cardBudget}>₹{req.budget.toLocaleString()}</Text>
                  {req.deadline && (
                    <View style={styles.deadlineRow}>
                      <Clock size={11} color={Colors.textLight} />
                      <Text style={styles.deadlineText}>{req.deadline}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardFooterRight}>
                  <Text style={styles.bidCountText}>{req.bids.length} bids</Text>
                  <Pressable
                    style={styles.bidBtn}
                    onPress={() => { setSelected(req); setBidModal(true); }}
                  >
                    <Text style={styles.bidBtnText}>Place bid</Text>
                  </Pressable>
                </View>
              </View>
            </Pressable>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Scissors size={40} color={Colors.border} />
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptyBody}>Try adjusting your search or filter</Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Bid submission modal ── */}
      <Modal
        animationType="slide"
        transparent
        visible={bidModal}
        onRequestClose={() => setBidModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Handle */}
            <View style={styles.modalHandle} />

            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>Place your bid</Text>
              <Pressable onPress={() => setBidModal(false)} style={styles.modalClose}>
                <X size={18} color={Colors.text} />
              </Pressable>
            </View>

            {selected && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Request summary */}
                <View style={styles.modalSummary}>
                  <View style={styles.modalSummaryPill}>
                    <Scissors size={11} color={Colors.maskedText} />
                    <Text style={styles.modalSummaryType}>{selected.outfitType}</Text>
                  </View>
                  <Text style={styles.modalSummaryTitle}>{selected.title}</Text>
                  <Text style={styles.modalSummaryBudget}>
                    Customer budget: ₹{selected.budget.toLocaleString()}
                  </Text>
                </View>

                {/* Masked identity reminder */}
                <View style={styles.maskedReminder}>
                  <ShieldCheck size={13} color={Colors.maskedText} />
                  <Text style={styles.maskedReminderText}>
                    You'll appear as a masked code (e.g. T·A1) to the customer until they accept your bid.
                  </Text>
                </View>

                <Text style={styles.fieldLabel}>Your bid amount (₹)</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="e.g. 1200"
                  placeholderTextColor={Colors.textLight}
                  value={bidPrice}
                  onChangeText={setBidPrice}
                  keyboardType="numeric"
                />

                <Text style={styles.fieldLabel}>Days to complete</Text>
                <TextInput
                  style={styles.fieldInput}
                  placeholder="e.g. 7"
                  placeholderTextColor={Colors.textLight}
                  value={bidDays}
                  onChangeText={setBidDays}
                  keyboardType="numeric"
                />

                <Text style={styles.fieldLabel}>Message to customer</Text>
                <TextInput
                  style={[styles.fieldInput, styles.fieldTextarea]}
                  placeholder="Describe your approach, experience with this outfit type, materials you'll use…"
                  placeholderTextColor={Colors.textLight}
                  value={bidMessage}
                  onChangeText={setBidMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Pressable
                  style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.88 }]}
                  onPress={handleSubmitBid}
                >
                  <Send size={16} color={Colors.textInverse} />
                  <Text style={styles.submitBtnText}>Submit bid</Text>
                </Pressable>

                <View style={{ height: 32 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Header ──
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    gap: 12,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filterIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 0.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },

  // ── Filters ──
  filtersRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.ink,
    borderColor: Colors.ink,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.textInverse,
  },

  // ── Masked notice ──
  maskedNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: Colors.maskedBg,
    borderRadius: 10,
    padding: 10,
    borderWidth: 0.5,
    borderColor: Colors.maskedBorder,
  },
  maskedNoticeText: {
    flex: 1,
    fontSize: 12,
    color: Colors.maskedText,
    lineHeight: 17,
    fontWeight: '500' as const,
  },

  // ── List ──
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  resultLabel: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500' as const,
    marginBottom: 10,
  },

  // ── Request card ──
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: 8,
  },
  cardPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.99 }],
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTypePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.maskedBg,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardTypeText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.maskedText,
  },
  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusOpen: {
    backgroundColor: Colors.successBg,
  },
  statusProgress: {
    backgroundColor: Colors.warnBg,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  statusTextOpen: {
    color: Colors.successText,
  },
  statusTextProgress: {
    color: Colors.warnText,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.2,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  thumbRow: {
    marginTop: 4,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    marginTop: 2,
  },
  cardFooterLeft: { gap: 4 },
  cardBudget: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadlineText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  cardFooterRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bidCountText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  bidBtn: {
    backgroundColor: Colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bidBtnText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '700' as const,
  },

  // ── Empty ──
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  emptyBody: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    maxHeight: '88%',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.4,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSummary: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    gap: 6,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  modalSummaryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: Colors.maskedBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  modalSummaryType: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.maskedText,
  },
  modalSummaryTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  modalSummaryBudget: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  maskedReminder: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.maskedBg,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: Colors.maskedBorder,
  },
  maskedReminderText: {
    flex: 1,
    fontSize: 12,
    color: Colors.maskedText,
    lineHeight: 17,
    fontWeight: '500' as const,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    marginTop: 4,
  },
  fieldInput: {
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 0.5,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  fieldTextarea: {
    height: 100,
    paddingTop: 12,
  },
  submitBtn: {
    backgroundColor: Colors.ink,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  submitBtnText: {
    color: Colors.textInverse,
    fontSize: 16,
    fontWeight: '700' as const,
  },
});