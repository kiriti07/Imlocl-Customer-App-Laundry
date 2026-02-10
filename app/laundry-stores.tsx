import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { WashingMachine } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { laundryStores } from '@/mocks/laundryStores';
import StoreCard from '@/components/StoreCard';

export default function LaundryStoresScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Laundry Stores',
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <WashingMachine size={28} color={Colors.laundry} />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>{laundryStores.length} Stores Near You</Text>
            <Text style={styles.bannerSubtitle}>Wash, dry clean, iron and more</Text>
          </View>
        </View>

        {laundryStores.map((store) => (
          <StoreCard
            key={store.id}
            name={store.name}
            image={store.image}
            rating={store.rating}
            reviewCount={store.reviewCount}
            distance={store.distance}
            deliveryTime={store.deliveryTime}
            tags={store.tags}
            isOpen={store.isOpen}
            accentColor={Colors.laundry}
            onPress={() => router.push(`/laundry-store/${store.id}`)}
          />
        ))}
        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.laundryLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  bannerText: {
    gap: 2,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
