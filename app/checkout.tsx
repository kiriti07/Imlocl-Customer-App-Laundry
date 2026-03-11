// app/checkout.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

function money(n: number) {
  if (!Number.isFinite(n)) return '0.00';
  return Number(n).toFixed(2);
}

export default function CheckoutScreen() {
  const router = useRouter();
  const {
    checkoutSummary,
    fetchCheckoutSummary,
    couponCode,
    cartCount,
  } = useApp() as any;

  const [loading, setLoading] = useState(false);
  const [careNote] = useState('Customer Care: +91 90000 00000');
  const [subscriptionCode] = useState('ImLocl Plus available soon');

  useEffect(() => {
    (async () => {
      if (checkoutSummary) return;
      try {
        setLoading(true);
        await fetchCheckoutSummary('LAUNDRY', couponCode);
      } finally {
        setLoading(false);
      }
    })();
  }, [checkoutSummary, fetchCheckoutSummary, couponCode]);

  if (loading || !checkoutSummary) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.accent} />
        <Text style={styles.muted}>Loading checkout...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack.Screen options={{ title: 'Checkout' }} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Order Summary</Text>
          <Text style={styles.muted}>{cartCount} item(s)</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₹{money(checkoutSummary.subtotal)}</Text>
          </View>

          {!!checkoutSummary.packagingFee && (
            <View style={styles.row}>
              <Text style={styles.label}>Packaging Charges</Text>
              <Text style={styles.value}>₹{money(checkoutSummary.packagingFee)}</Text>
            </View>
          )}

          {!!checkoutSummary.deliveryFee && (
            <View style={styles.row}>
              <Text style={styles.label}>Delivery Fee</Text>
              <Text style={styles.value}>₹{money(checkoutSummary.deliveryFee)}</Text>
            </View>
          )}

          {!!checkoutSummary.platformFee && (
            <View style={styles.row}>
              <Text style={styles.label}>Platform Fee</Text>
              <Text style={styles.value}>₹{money(checkoutSummary.platformFee)}</Text>
            </View>
          )}

          {!!checkoutSummary.handlingFee && (
            <View style={styles.row}>
              <Text style={styles.label}>Handling Fee</Text>
              <Text style={styles.value}>₹{money(checkoutSummary.handlingFee)}</Text>
            </View>
          )}

          {!!checkoutSummary.lateNightFee && (
            <View style={styles.row}>
              <Text style={styles.label}>Late Night Fee</Text>
              <Text style={styles.value}>₹{money(checkoutSummary.lateNightFee)}</Text>
            </View>
          )}

          {!!checkoutSummary.discountAmount && (
            <View style={styles.row}>
              <Text style={[styles.label, { color: '#16a34a' }]}>
                Coupon ({checkoutSummary.couponCode || couponCode})
              </Text>
              <Text style={[styles.value, { color: '#16a34a' }]}>
                -₹{money(checkoutSummary.discountAmount)}
              </Text>
            </View>
          )}

          {!!checkoutSummary.gstAmount && (
            <View style={styles.row}>
              <Text style={styles.label}>
                GST {checkoutSummary.gstPercent ? `(${checkoutSummary.gstPercent}%)` : ''}
              </Text>
              <Text style={styles.value}>₹{money(checkoutSummary.gstAmount)}</Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Payable</Text>
            <Text style={styles.totalValue}>₹{money(checkoutSummary.totalPayable)}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Apply Coupon</Text>
          <TextInput
            value={couponCode || ''}
            editable={false}
            placeholder="Apply coupon from cart"
            style={styles.input}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Customer Care</Text>
          <Text style={styles.infoText}>{careNote}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <Text style={styles.infoText}>{subscriptionCode}</Text>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.primaryBtn} onPress={() => router.push('/payment' as any)}>
          <Text style={styles.primaryBtnText}>Continue to Payment</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.background,
  },
  muted: { color: Colors.textSecondary },

  card: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  title: { fontSize: 18, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: 10 },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  label: { color: Colors.textSecondary, fontWeight: '600' },
  value: { color: Colors.text, fontWeight: '700' },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  totalLabel: { color: Colors.text, fontWeight: '900', fontSize: 16 },
  totalValue: { color: Colors.text, fontWeight: '900', fontSize: 16 },

  infoText: { color: Colors.textSecondary, lineHeight: 20 },

  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: Colors.text,
  },

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    padding: 16,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
});