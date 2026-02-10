import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { MessageSquare, IndianRupee, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface RequestCardProps {
  title: string;
  outfitType: string;
  budget: number;
  customerName: string;
  customerAvatar?: string;
  bidCount: number;
  status: string;
  createdAt: string;
  onPress: () => void;
}

export default React.memo(function RequestCard({
  title,
  outfitType,
  budget,
  customerName,
  customerAvatar,
  bidCount,
  status,
  createdAt,
  onPress,
}: RequestCardProps) {
  const statusColor = status === 'open' ? Colors.success : status === 'in_progress' ? Colors.warm : Colors.textLight;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      testID="request-card"
    >
      <View style={styles.header}>
        <View style={styles.avatarRow}>
          {customerAvatar ? (
            <Image source={{ uri: customerAvatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>{customerName[0]}</Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.customerName}>{customerName}</Text>
            <Text style={styles.date}>{createdAt}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status === 'open' ? 'Open' : status === 'in_progress' ? 'In Progress' : status}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>{title}</Text>

      <View style={styles.detailsRow}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>{outfitType}</Text>
        </View>
        <View style={styles.detailItem}>
          <IndianRupee size={14} color={Colors.primary} />
          <Text style={styles.budgetText}>₹{budget.toLocaleString()}</Text>
        </View>
        <View style={styles.detailItem}>
          <MessageSquare size={14} color={Colors.secondaryLight} />
          <Text style={styles.bidText}>{bidCount} bids</Text>
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700' as const,
    fontSize: 15,
  },
  headerInfo: {
    gap: 2,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  date: {
    fontSize: 12,
    color: Colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  title: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 22,
  },
  detailsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 12,
  },
  typeBadge: {
    backgroundColor: Colors.stitchingLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.stitching,
  },
  detailItem: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 4,
  },
  budgetText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  bidText: {
    fontSize: 13,
    color: Colors.secondaryLight,
    fontWeight: '500' as const,
  },
});
