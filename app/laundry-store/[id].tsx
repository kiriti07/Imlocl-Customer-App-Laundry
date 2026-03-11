// app/laundry-store/[id].tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import {
  Star,
  Clock,
  MapPin,
  Shirt,
  Sparkles,
  Flame,
  Droplets,
  Eraser,
  Plus,
  Minus,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { laundryStores } from '@/mocks/laundryStores';
import { useApp } from '@/contexts/AppContext';

const iconMap: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  shirt: Shirt,
  sparkles: Sparkles,
  flame: Flame,
  droplets: Droplets,
  eraser: Eraser,
  footprints: Shirt,
};

export default function LaundryStoreDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { addToCart, cart, removeFromCart, cartTotal, cartCount } = useApp();

  const store = useMemo(() => laundryStores.find((s) => s.id === id), [id]);

  if (!store) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Store not found</Text>
        </View>
      </View>
    );
  }

  const handleAddService = (service: (typeof store.services)[0]) => {
    addToCart({
      productId: service.id,
      name: service.name,
      price: service.price,
      quantity: 1,
      unit: service.unit,
      storeId: store.id,
      storeName: store.name,
      serviceType: 'laundry',
    });
  };

  const getCartQuantity = (serviceId: string) => {
    return cart.find((i) => i.productId === serviceId)?.quantity ?? 0;
  };

  const handleDecrease = (serviceId: string, qty: number) => {
    if (qty <= 1) {
      removeFromCart(serviceId);
      return;
    }

    const existing = cart.find((i) => i.productId === serviceId);
    if (!existing) return;

    removeFromCart(serviceId);
    addToCart({
      ...existing,
      quantity: qty - 1,
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: store.name,
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: cartCount > 0 ? 120 : 40,
        }}
      >
        <Image source={{ uri: store.image }} style={styles.heroImage} />

        <View style={styles.content}>
          <View style={styles.storeHeader}>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>{store.name}</Text>
              <View style={styles.metaRow}>
                <View style={styles.ratingBadge}>
                  <Star size={14} color="#FFF" fill="#FFF" />
                  <Text style={styles.ratingText}>{store.rating}</Text>
                </View>
                <Text style={styles.metaText}>{store.reviewCount} reviews</Text>
              </View>
            </View>

            {!store.isOpen && (
              <View style={styles.closedBadge}>
                <Text style={styles.closedText}>Closed</Text>
              </View>
            )}
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MapPin size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>{store.address}</Text>
            </View>

            <View style={styles.infoItem}>
              <Clock size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>Delivery in {store.deliveryTime}</Text>
            </View>
          </View>

          <View style={styles.tagsRow}>
            {store.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Services</Text>

          {store.services.map((service) => {
            const Icon = iconMap[service.icon] ?? Shirt;
            const qty = getCartQuantity(service.id);

            return (
              <View key={service.id} style={styles.serviceItem}>
                <View style={styles.serviceLeft}>
                  <View style={styles.serviceIconWrap}>
                    <Icon size={20} color={Colors.laundry} />
                  </View>

                  <View>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceUnit}>{service.unit}</Text>
                  </View>
                </View>

                <View style={styles.serviceRight}>
                  <Text style={styles.servicePrice}>₹{service.price}</Text>

                  {qty > 0 ? (
                    <View style={styles.qtyControls}>
                      <Pressable
                        style={styles.qtyBtn}
                        onPress={() => handleDecrease(service.id, qty)}
                      >
                        <Minus size={14} color={Colors.primary} />
                      </Pressable>

                      <Text style={styles.qtyText}>{qty}</Text>

                      <Pressable
                        style={styles.qtyBtn}
                        onPress={() => handleAddService(service)}
                      >
                        <Plus size={14} color={Colors.primary} />
                      </Pressable>
                    </View>
                  ) : (
                    <Pressable
                      style={styles.addBtn}
                      onPress={() => handleAddService(service)}
                    >
                      <Text style={styles.addBtnText}>Add</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {cartCount > 0 && (
        <View style={styles.checkoutBar}>
          <View>
            <Text style={styles.checkoutTotal}>₹{cartTotal.toFixed(2)}</Text>
            <Text style={styles.checkoutItems}>{cartCount} item(s)</Text>
          </View>

          <Pressable
            style={styles.checkoutBtn}
            onPress={() => router.push('/checkout' as any)}
          >
            <Text style={styles.checkoutBtnText}>Checkout</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },

  heroImage: {
    width: '100%',
    height: 220,
  },

  content: {
    padding: 20,
  },

  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  storeInfo: {
    flex: 1,
    gap: 8,
  },

  storeName: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.text,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.laundry,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },

  ratingText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700' as const,
  },

  metaText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  closedBadge: {
    backgroundColor: Colors.error + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  closedText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.error,
  },

  infoRow: {
    gap: 10,
    marginBottom: 16,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },

  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
    flexWrap: 'wrap',
  },

  tag: {
    backgroundColor: Colors.laundryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  tagText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.laundry,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 16,
  },

  serviceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
  },

  serviceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  serviceIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.laundryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  serviceName: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
  },

  serviceUnit: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  serviceRight: {
    alignItems: 'flex-end',
    gap: 8,
  },

  servicePrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },

  addBtn: {
    backgroundColor: Colors.laundry + '15',
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.laundry,
  },

  addBtnText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.laundry,
  },

  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.primary + '10',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  qtyBtn: {
    padding: 4,
  },

  qtyText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
    minWidth: 16,
    textAlign: 'center',
  },

  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  checkoutTotal: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },

  checkoutItems: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  checkoutBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },

  checkoutBtnText: {
    color: '#fff',
    fontWeight: '700' as const,
  },
});