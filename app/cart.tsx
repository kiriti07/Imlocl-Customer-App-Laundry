// app/cart.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, TextInput } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

function money(n: number) {
  if (!Number.isFinite(n)) return '0';
  return Number(n).toFixed(2);
}

export default function CartScreen() {
  const router = useRouter();
  const {
    cart,
    cartSubtotal,
    cartTotal,
    cartCount,
    cartStoreName,
    incQty,
    decQty,
    removeFromCart,
    clearCart,
    couponCode,
    setCouponCode,
    checkoutSummary,
    fetchCheckoutSummary,
    applyCoupon,
  } = useApp() as any;

  const [loadingSummary, setLoadingSummary] = useState(false);

  const items = Array.isArray(cart) ? cart : [];

  const handleClear = () => {
    if (!items.length) return;
    Alert.alert('Clear cart?', 'This will remove all items.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCart },
    ]);
  };

  const loadSummary = async () => {
    try {
      setLoadingSummary(true);
      await fetchCheckoutSummary('LAUNDRY');
      router.push('/checkout' as any);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to get checkout summary');
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode?.trim()) {
      Alert.alert('Coupon', 'Please enter coupon code');
      return;
    }

    try {
      setLoadingSummary(true);
      await applyCoupon(couponCode.trim(), 'LAUNDRY');
      Alert.alert('Success', 'Coupon applied');
    } catch (e: any) {
      Alert.alert('Coupon Error', e?.message || 'Failed to apply coupon');
    } finally {
      setLoadingSummary(false);
    }
  };

  const previewTotal = useMemo(() => {
    if (checkoutSummary?.totalPayable != null) return checkoutSummary.totalPayable;
    return cartTotal ?? cartSubtotal;
  }, [checkoutSummary, cartTotal, cartSubtotal]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Stack.Screen options={{ title: 'Cart', headerShown: true }} />

      {items.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.title}>Your cart is empty</Text>
          <Text style={styles.muted}>Add laundry or stitching services to continue.</Text>

          <Pressable style={styles.primaryBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={16} color="#fff" />
            <Text style={styles.primaryBtnText}>Go back</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.topBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.storeTitle}>{cartStoreName || 'Selected Store'}</Text>
              <Text style={styles.muted}>{items.length} item(s)</Text>
            </View>

            <Pressable style={styles.clearBtn} onPress={handleClear}>
              <Ionicons name="trash-outline" size={16} color="#dc2626" />
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
            {items.map((it: any) => {
              const key = String(it.productId ?? `${it.name}-${it.unit}`);

              return (
                <View key={key} style={styles.line}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{it.name}</Text>
                    <Text style={styles.muted}>
                      ₹{money(Number(it.price ?? 0))} / {it.unit || 'unit'}
                    </Text>
                  </View>

                  <View style={styles.qtyBox}>
                    <Pressable style={styles.qtyBtn} onPress={() => decQty?.(it.productId, 1)}>
                      <Ionicons name="remove" size={16} color={Colors.text} />
                    </Pressable>

                    <Text style={styles.qtyText}>{String(it.quantity ?? 0)}</Text>

                    <Pressable style={styles.qtyBtn} onPress={() => incQty?.(it.productId, 1)}>
                      <Ionicons name="add" size={16} color={Colors.text} />
                    </Pressable>
                  </View>

                  <Pressable style={styles.removeBtn} onPress={() => removeFromCart?.(it.productId)}>
                    <MaterialCommunityIcons name="trash-can-outline" size={16} color="#dc2626" />
                  </Pressable>
                </View>
              );
            })}

            <View style={styles.couponCard}>
              <Text style={styles.couponTitle}>Apply Coupon</Text>
              <View style={styles.couponRow}>
                <TextInput
                  value={couponCode}
                  onChangeText={setCouponCode}
                  placeholder="Enter coupon code"
                  style={styles.couponInput}
                  autoCapitalize="characters"
                />
                <Pressable style={styles.applyBtn} onPress={handleApplyCoupon}>
                  <Text style={styles.applyBtnText}>Apply</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{money(Number(cartSubtotal ?? 0))}</Text>
            </View>

            {checkoutSummary?.discountAmount ? (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>
                <Text style={[styles.summaryValue, { color: '#16a34a' }]}>
                  -₹{money(Number(checkoutSummary.discountAmount))}
                </Text>
              </View>
            ) : null}

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Estimated Total</Text>
              <Text style={styles.totalValue}>₹{money(Number(previewTotal ?? 0))}</Text>
            </View>

            <Pressable style={styles.checkoutBtn} onPress={loadSummary} disabled={loadingSummary}>
              <Text style={styles.checkoutText}>
                {loadingSummary ? 'Please wait...' : 'Proceed to Checkout'}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, gap: 10 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  muted: { color: Colors.textSecondary },

  primaryBtn: {
    marginTop: 10,
    backgroundColor: Colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  primaryBtnText: { color: '#fff', fontWeight: '800' },

  topBar: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  storeTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },

  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff1f2',
  },
  clearText: { color: '#dc2626', fontWeight: '800' },

  line: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemName: { fontWeight: '800', color: Colors.text, marginBottom: 2 },

  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
  },
  qtyText: {
    width: 44,
    textAlign: 'center',
    fontWeight: '800',
    color: Colors.text,
  },

  removeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fff1f2',
  },

  couponCard: {
    marginTop: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 12,
  },
  couponTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 10,
  },
  couponRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    color: Colors.text,
  },
  applyBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
  },
  applyBtnText: {
    color: '#fff',
    fontWeight: '800',
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
    gap: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: { color: Colors.textSecondary, fontWeight: '700' },
  summaryValue: { color: Colors.text, fontWeight: '800' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 4 },
  totalLabel: { color: Colors.text, fontWeight: '900', fontSize: 16 },
  totalValue: { color: Colors.text, fontWeight: '900', fontSize: 16 },

  checkoutBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 2,
  },
  checkoutText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});