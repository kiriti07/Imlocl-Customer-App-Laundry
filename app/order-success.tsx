// app/order-success.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import Colors from '@/constants/colors';

export default function OrderSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ amount?: string; paymentMethod?: string }>();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Order Success' }} />

      <Text style={styles.icon}>✅</Text>
      <Text style={styles.title}>Order placed successfully</Text>
      <Text style={styles.subtitle}>Payment Method: {params.paymentMethod || 'N/A'}</Text>
      <Text style={styles.subtitle}>Paid Amount: ₹{params.amount || '0.00'}</Text>

      <Pressable style={styles.btn} onPress={() => router.replace('/(tabs)/(home)' as any)}>
        <Text style={styles.btnText}>Back to Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 52,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  btn: {
    marginTop: 20,
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
  },
  btnText: {
    color: '#fff',
    fontWeight: '800',
  },
});