import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Scissors, Clock, ShieldCheck } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface RequestCardProps {
  title: string;
  outfitType: string;
  budget: number;
  customerName: string;          // kept in props but NOT rendered (masked)
  customerAvatar?: string;       // kept in props but NOT rendered (masked)
  bidCount: number;
  status: string;
  createdAt: string;
  maskedCode?: string;           // e.g. "T·A1" — shown instead of real name
  onPress: () => void;
  onBid?: () => void;
}

export default React.memo(function RequestCard({
  title,
  outfitType,
  budget,
  bidCount,
  status,
  createdAt,
  maskedCode = 'Customer',
  onPress,
  onBid,
}: RequestCardProps) {
  const isOpen = status === 'open';

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      testID="request-card"
    >
      {/* Top row — type pill + status */}
      <View style={styles.topRow}>
        <View style={styles.typePill}>
          <Scissors size={11} color={Colors.maskedText} />
          <Text style={styles.typePillText}>{outfitType}</Text>
        </View>
        <View style={[styles.statusPill, isOpen ? styles.statusOpen : styles.statusProg]}>
          <Text style={[styles.statusText, isOpen ? styles.statusOpenText : styles.statusProgText]}>
            {isOpen ? 'Open' : 'In progress'}
          </Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>{title}</Text>

      {/* Masked poster info */}
      <View style={styles.posterRow}>
        <View style={styles.maskedDot} />
        <Text style={styles.posterText}>Anonymous customer</Text>
        <Text style={styles.dotSep}>·</Text>
        <Clock size={11} color={Colors.textLight} />
        <Text style={styles.posterDate}>{createdAt}</Text>
      </View>

      {/* Footer — budget + bids + CTA */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.budget}>₹{budget.toLocaleString()}</Text>
          <Text style={styles.bidCount}>{bidCount} bid{bidCount !== 1 ? 's' : ''}</Text>
        </View>
        {onBid && isOpen && (
          <Pressable
            style={({ pressed }) => [styles.bidBtn, pressed && { opacity: 0.85 }]}
            onPress={onBid}
          >
            <Text style={styles.bidBtnText}>Place bid</Text>
          </Pressable>
        )}
      </View>

      {/* Masked shield hint */}
      <View style={styles.shieldHint}>
        <ShieldCheck size={11} color={Colors.maskedText} />
        <Text style={styles.shieldText}>Identity hidden until connection</Text>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: 10,
  },
  pressed: {
    opacity: 0.93,
    transform: [{ scale: 0.985 }],
  },

  // ── Top row ──
  topRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typePill: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.maskedBg,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typePillText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: Colors.maskedText,
  },
  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusOpen: { backgroundColor: Colors.successBg },
  statusProg: { backgroundColor: Colors.warnBg },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  statusOpenText: { color: Colors.successText },
  statusProgText: { color: Colors.warnText },

  // ── Title ──
  title: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    lineHeight: 21,
    letterSpacing: -0.2,
  },

  // ── Masked poster ──
  posterRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 5,
  },
  maskedDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  posterText: {
    fontSize: 12,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  dotSep: {
    fontSize: 12,
    color: Colors.border,
  },
  posterDate: {
    fontSize: 12,
    color: Colors.textLight,
  },

  // ── Footer ──
  footer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  budget: {
    fontSize: 17,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  bidCount: {
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 2,
  },
  bidBtn: {
    backgroundColor: Colors.ink,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
  },
  bidBtnText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '700' as const,
  },

  // ── Shield hint ──
  shieldHint: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 5,
  },
  shieldText: {
    fontSize: 11,
    color: Colors.maskedText,
    fontWeight: '500' as const,
  },
});