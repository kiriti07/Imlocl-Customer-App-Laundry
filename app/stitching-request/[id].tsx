import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import {
  Star,
  Clock,
  Check,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  Scissors,
  IndianRupee,
  Lock,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { stitchingRequests } from '@/mocks/stitchingRequests';

// Generate stable masked code per bid index
function maskedCode(idx: number): string {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  return `Tailor #${letters[idx % 6]}${Math.floor(idx / 6) + 1}`;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((s) => (
        <View
          key={s}
          style={[
            styles.starShape,
            { backgroundColor: s <= Math.round(rating) ? Colors.star : Colors.border },
          ]}
        />
      ))}
      <Text style={styles.ratingNum}>{rating}</Text>
    </View>
  );
}

export default function StitchingRequestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [contactBlocked, setContactBlocked] = useState(false);

  const request = useMemo(() => stitchingRequests.find((r) => r.id === id), [id]);

  if (!request) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Request not found</Text>
        </View>
      </View>
    );
  }

  const handleAcceptBid = (bidId: string) => {
    Alert.alert(
      'Connect with tailor?',
      'Accepting this bid will initiate payment. Their identity will be revealed after payment is complete.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept & Pay',
          style: 'default',
          onPress: () => console.log('Bid accepted:', bidId),
        },
      ]
    );
  };

  const isOpen = request.status === 'open';

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Request details',
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '700', fontSize: 16 },
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Top meta ── */}
        <View style={styles.topMeta}>
          <View style={styles.outfitPill}>
            <Scissors size={11} color={Colors.maskedText} />
            <Text style={styles.outfitPillText}>{request.outfitType}</Text>
          </View>
          <View style={[styles.statusPill, isOpen ? styles.statusOpen : styles.statusProg]}>
            <Text style={[styles.statusPillText, isOpen ? styles.statusOpenText : styles.statusProgText]}>
              {isOpen ? 'Open' : 'In progress'}
            </Text>
          </View>
        </View>

        {/* ── Title & description ── */}
        <Text style={styles.title}>{request.title}</Text>
        <Text style={styles.description}>{request.description}</Text>

        {/* ── Details grid ── */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCell}>
            <Text style={styles.detailLabel}>Budget</Text>
            <Text style={[styles.detailValue, styles.detailValueBudget]}>
              ₹{request.budget.toLocaleString()}
            </Text>
          </View>
          {request.deadline && (
            <View style={styles.detailCell}>
              <Text style={styles.detailLabel}>Deadline</Text>
              <Text style={styles.detailValue}>{request.deadline}</Text>
            </View>
          )}
          <View style={styles.detailCell}>
            <Text style={styles.detailLabel}>Bids received</Text>
            <Text style={styles.detailValue}>{request.bids.length}</Text>
          </View>
        </View>

        {/* ── Reference images ── */}
        {request.images?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reference images</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesRow}
            >
              {request.images.map((img: string, i: number) => (
                <Image key={i} source={{ uri: img }} style={styles.refImage} />
              ))}
            </ScrollView>
          </View>
        )}

        {/* ── Masked identity notice ── */}
        <View style={styles.maskedNotice}>
          <ShieldCheck size={15} color={Colors.maskedText} />
          <View style={styles.maskedNoticeText}>
            <Text style={styles.maskedNoticeTitle}>Identities are protected</Text>
            <Text style={styles.maskedNoticeBody}>
              Tailors appear as coded names (e.g. Tailor #A1). Their real name and contact are revealed only after you accept a bid and complete payment.
            </Text>
          </View>
        </View>

        {/* ── Bids ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Bids ({request.bids.length})
          </Text>

          {request.bids.length === 0 ? (
            <View style={styles.noBids}>
              <MessageSquare size={32} color={Colors.border} />
              <Text style={styles.noBidsTitle}>No bids yet</Text>
              <Text style={styles.noBidsBody}>Tailors and designers will respond soon</Text>
            </View>
          ) : (
            request.bids.map((bid: any, idx: number) => {
              const code = maskedCode(idx);
              const isAccepted = bid.isAccepted;
              return (
                <View
                  key={bid.id}
                  style={[
                    styles.bidCard,
                    isAccepted && styles.bidCardAccepted,
                    idx === 0 && styles.bidCardTop,
                  ]}
                >
                  {/* Top bid badge */}
                  {idx === 0 && !isAccepted && (
                    <View style={styles.topBidBadge}>
                      <Text style={styles.topBidBadgeText}>Top bid</Text>
                    </View>
                  )}

                  {/* Bid header */}
                  <View style={styles.bidHeader}>
                    <View style={styles.maskedAvatar}>
                      <Text style={styles.maskedAvatarText}>
                        {code.slice(-2)}
                      </Text>
                    </View>
                    <View style={styles.bidHeaderInfo}>
                      <Text style={styles.bidCode}>{code}</Text>
                      <StarRow rating={bid.partnerRating ?? 4.5} />
                    </View>
                    {isAccepted && (
                      <View style={styles.acceptedPill}>
                        <Check size={12} color={Colors.successText} />
                        <Text style={styles.acceptedPillText}>Accepted</Text>
                      </View>
                    )}
                  </View>

                  {/* Message */}
                  <Text style={styles.bidMessage}>{bid.message}</Text>

                  {/* Price + days */}
                  <View style={styles.bidMeta}>
                    <View style={styles.bidMetaItem}>
                      <IndianRupee size={13} color={Colors.text} />
                      <Text style={styles.bidPrice}>₹{bid.price.toLocaleString()}</Text>
                    </View>
                    <View style={styles.bidMetaDivider} />
                    <View style={styles.bidMetaItem}>
                      <Clock size={13} color={Colors.textLight} />
                      <Text style={styles.bidDays}>{bid.daysToComplete} days</Text>
                    </View>
                  </View>

                  {/* Contact block warning */}
                  {contactBlocked && (
                    <View style={styles.contactBlockWarn}>
                      <AlertCircle size={13} color={Colors.warnText} />
                      <Text style={styles.contactBlockText}>
                        Contact sharing is not allowed before payment. Accept this bid to unlock contact details.
                      </Text>
                    </View>
                  )}

                  {/* Accept CTA */}
                  {!isAccepted && isOpen && (
                    <View style={styles.bidActions}>
                      <View style={styles.lockHint}>
                        <Lock size={11} color={Colors.textLight} />
                        <Text style={styles.lockHintText}>Identity revealed after payment</Text>
                      </View>
                      <Pressable
                        style={({ pressed }) => [styles.acceptBtn, pressed && { opacity: 0.88 }]}
                        onPress={() => handleAcceptBid(bid.id)}
                      >
                        <Text style={styles.acceptBtnText}>Accept & pay</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  scroll: {
    padding: 20,
  },

  // ── Top meta ──
  topMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  outfitPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.maskedBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  outfitPillText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.maskedText,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusOpen: { backgroundColor: Colors.successBg },
  statusProg: { backgroundColor: Colors.warnBg },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  statusOpenText: { color: Colors.successText },
  statusProgText: { color: Colors.warnText },

  // ── Title / desc ──
  title: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.4,
    lineHeight: 28,
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
    marginBottom: 20,
  },

  // ── Details grid ──
  detailsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  detailCell: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: 4,
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.2,
  },
  detailValueBudget: {
    color: Colors.text,
  },

  // ── Section ──
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    letterSpacing: -0.2,
    marginBottom: 12,
  },
  imagesRow: {
    gap: 10,
  },
  refImage: {
    width: 140,
    height: 180,
    borderRadius: 12,
  },

  // ── Masked notice ──
  maskedNotice: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: Colors.maskedBg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: Colors.maskedBorder,
  },
  maskedNoticeText: { flex: 1, gap: 4 },
  maskedNoticeTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.maskedText,
  },
  maskedNoticeBody: {
    fontSize: 12,
    color: Colors.maskedText,
    lineHeight: 17,
    opacity: 0.8,
  },

  // ── No bids ──
  noBids: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  noBidsTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  noBidsBody: {
    fontSize: 13,
    color: Colors.textSecondary,
  },

  // ── Bid card ──
  bidCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: 12,
  },
  bidCardTop: {
    borderWidth: 1.5,
    borderColor: Colors.ink,
  },
  bidCardAccepted: {
    borderColor: Colors.successMid,
    backgroundColor: Colors.successBg,
  },
  topBidBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.ink,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  topBidBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.textInverse,
  },
  bidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  maskedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maskedAvatarText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.textLight,
  },
  bidHeaderInfo: { flex: 1, gap: 4 },
  bidCode: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  starRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  starShape: {
    width: 10,
    height: 10,
    // star via clip-path not available in RN; use filled squares as proxy
    borderRadius: 2,
  },
  ratingNum: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginLeft: 4,
  },
  acceptedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  acceptedPillText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.successText,
  },
  bidMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  bidMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bidMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  bidMetaDivider: {
    width: 1,
    height: 14,
    backgroundColor: Colors.border,
  },
  bidPrice: {
    fontSize: 17,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  bidDays: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },

  // ── Contact block warning ──
  contactBlockWarn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: Colors.warnBg,
    borderRadius: 10,
    padding: 10,
    borderWidth: 0.5,
    borderColor: Colors.warnMid,
  },
  contactBlockText: {
    flex: 1,
    fontSize: 12,
    color: Colors.warnText,
    lineHeight: 17,
  },

  // ── Bid actions ──
  bidActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  lockHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  lockHintText: {
    fontSize: 11,
    color: Colors.textLight,
  },
  acceptBtn: {
    backgroundColor: Colors.ink,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  acceptBtnText: {
    color: Colors.textInverse,
    fontSize: 14,
    fontWeight: '700' as const,
  },
});