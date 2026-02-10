import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Order } from '@/types';

interface OrderCardProps {
  order: Order;
  onPress: () => void;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  pending: { color: Colors.textLight, label: 'Pending' },
  confirmed: { color: Colors.secondaryLight, label: 'Confirmed' },
  processing: { color: Colors.warm, label: 'Processing' },
  out_for_delivery: { color: Colors.accent, label: 'Out for Delivery' },
  delivered: { color: Colors.success, label: 'Delivered' },
  cancelled: { color: Colors.error, label: 'Cancelled' },
};

const typeConfig: Record<string, { color: string; label: string }> = {
  laundry: { color: Colors.laundry, label: 'Laundry' },
  stitching: { color: Colors.stitching, label: 'Stitching' },
};

export default React.memo(function OrderCard({ order, onPress }: OrderCardProps) {
  const status = statusConfig[order.status] ?? statusConfig.pending;
  const type = typeConfig[order.type] ?? typeConfig.laundry;

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      testID="order-card"
    >
      <View style={styles.row}>
        <Image source={{ uri: order.storeImage }} style={styles.storeImage} />
        <View style={styles.info}>
          <View style={styles.topRow}>
            <Text style={styles.storeName} numberOfLines={1}>{order.storeName}</Text>
            <View style={[styles.typeBadge, { backgroundColor: type.color + '15' }]}>
              <Text style={[styles.typeText, { color: type.color }]}>{type.label}</Text>
            </View>
          </View>
          <Text style={styles.items} numberOfLines={1}>
            {order.items.map((i) => i.name).join(', ')}
          </Text>
          <View style={styles.bottomRow}>
            <View style={[styles.statusBadge, { backgroundColor: status.color + '20' }]}>
              <View style={[styles.statusDot, { backgroundColor: status.color }]} />
              <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
            </View>
            <Text style={styles.total}>₹{order.total}</Text>
          </View>
        </View>
        <ChevronRight size={18} color={Colors.textLight} />
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  pressed: {
    opacity: 0.95,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 12,
  },
  storeImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  topRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storeName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600' as const,
  },
  items: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bottomRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  total: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
});
