// app/payment.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

const paymentMethods = [
  'UPI',
  'Credit Card',
  'Debit Card',
  'NetBanking',
  'Cash on Delivery',
];

export default function PaymentScreen() {
  const router = useRouter();
  const { cartTotal, clearCart } = useApp() as any;
  const [selected, setSelected] = useState('UPI');
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    try {
      setLoading(true);

      // later call backend payment/order API here

      clearCart();
      router.replace({
        pathname: '/order-success' as any,
        params: {
          amount: String(cartTotal || 0),
          paymentMethod: selected,
        },
      });
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Payment' }} />

      <Text style={styles.title}>Choose Payment Method</Text>

      {paymentMethods.map((method) => {
        const active = selected === method;
        return (
          <Pressable
            key={method}
            style={[styles.option, active && styles.optionActive]}
            onPress={() => setSelected(method)}
          >
            <Text style={[styles.optionText, active && styles.optionTextActive]}>
              {method}
            </Text>
          </Pressable>
        );
      })}

      <Pressable style={styles.payBtn} onPress={placeOrder} disabled={loading}>
        <Text style={styles.payBtnText}>
          {loading ? 'Processing...' : `Pay ₹${Number(cartTotal || 0).toFixed(2)}`}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 16,
  },
  option: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  optionActive: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}15`,
  },
  optionText: {
    color: Colors.text,
    fontWeight: '700',
  },
  optionTextActive: {
    color: Colors.accent,
  },
  payBtn: {
    marginTop: 20,
    backgroundColor: Colors.accent,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  payBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
});