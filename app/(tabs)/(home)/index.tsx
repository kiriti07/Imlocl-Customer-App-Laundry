import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  WashingMachine,
  Scissors,
  MapPin,
  Bell,
  Search,
  Star,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { laundryStores } from '@/mocks/laundryStores';
import { stitchingRequests } from '@/mocks/stitchingRequests';

const SERVICES = [
  {
    id: 'laundry',
    title: 'Laundry',
    subtitle: 'Wash & Dry Clean',
    icon: WashingMachine,
    color: Colors.laundry,
    bgColor: Colors.laundryLight,
    route: '/laundry-stores' as const,
  },
  {
    id: 'stitching',
    title: 'Stitching',
    subtitle: 'Design & Tailor',
    icon: Scissors,
    color: Colors.stitching,
    bgColor: Colors.stitchingLight,
    route: '/(tabs)/stitching' as const,
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.locationRow}>
              <MapPin size={18} color={Colors.primary} />
              <Text style={styles.locationLabel}>Deliver to</Text>
            </View>
            <Text style={styles.locationText}>Hyderabad, Telangana</Text>
          </View>
          <View style={styles.headerRight}>
            <Pressable style={styles.iconBtn} testID="search-btn">
              <Search size={20} color={Colors.text} />
            </Pressable>
            <Pressable style={styles.iconBtn} testID="notification-btn">
              <Bell size={20} color={Colors.text} />
              <View style={styles.notifDot} />
            </Pressable>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.heroBanner}>
            <View style={styles.heroContent}>
              <View style={styles.heroTextWrap}>
                <Text style={styles.heroTitle}>Your One-Stop{'\n'}Service Hub</Text>
                <Text style={styles.heroSubtitle}>
                  Laundry & Custom Tailoring — all in one place
                </Text>
              </View>
              <Sparkles size={48} color="rgba(255,255,255,0.3)" />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Services</Text>
          <View style={styles.servicesRow}>
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <Pressable
                  key={service.id}
                  style={({ pressed }) => [styles.serviceCard, pressed && styles.servicePressed]}
                  onPress={() => router.push(service.route)}
                  testID={`service-${service.id}`}
                >
                  <View style={[styles.serviceIcon, { backgroundColor: service.bgColor }]}>
                    <Icon size={28} color={service.color} />
                  </View>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Laundry</Text>
            <Pressable onPress={() => router.push('/laundry-stores')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScroll}>
            {laundryStores.filter(s => s.isOpen).slice(0, 3).map((store) => (
              <Pressable
                key={store.id}
                style={({ pressed }) => [styles.miniCard, pressed && { opacity: 0.9 }]}
                onPress={() => router.push(`/laundry-store/${store.id}`)}
              >
                <Image source={{ uri: store.image }} style={styles.miniImage} />
                <View style={styles.miniContent}>
                  <Text style={styles.miniName} numberOfLines={1}>{store.name}</Text>
                  <View style={styles.miniMeta}>
                    <Star size={12} color={Colors.warm} fill={Colors.warm} />
                    <Text style={styles.miniRating}>{store.rating}</Text>
                    <Text style={styles.miniDot}>·</Text>
                    <Clock size={12} color={Colors.textSecondary} />
                    <Text style={styles.miniTime}>{store.deliveryTime}</Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>


          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Stitching Requests</Text>
            <Pressable onPress={() => router.push('/(tabs)/stitching')}>
              <Text style={styles.seeAll}>See All</Text>
            </Pressable>
          </View>
          {stitchingRequests.filter(r => r.status === 'open').slice(0, 2).map((req) => (
            <Pressable
              key={req.id}
              style={({ pressed }) => [styles.stitchCard, pressed && { opacity: 0.9 }]}
              onPress={() => router.push(`/stitching-request/${req.id}`)}
            >
              <View style={styles.stitchHeader}>
                <View style={styles.stitchBadge}>
                  <Scissors size={14} color={Colors.stitching} />
                  <Text style={styles.stitchType}>{req.outfitType}</Text>
                </View>
                <Text style={styles.stitchBudget}>₹{req.budget.toLocaleString()}</Text>
              </View>
              <Text style={styles.stitchTitle} numberOfLines={1}>{req.title}</Text>
              <View style={styles.stitchFooter}>
                <Text style={styles.stitchBids}>{req.bids.length} bids</Text>
                <ChevronRight size={16} color={Colors.textLight} />
              </View>
            </Pressable>
          ))}

          <View style={styles.bottomSpacer} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeTop: {
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
  },
  headerLeft: {
    gap: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginLeft: 22,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    borderWidth: 1.5,
    borderColor: Colors.surface,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  heroBanner: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextWrap: {
    flex: 1,
    marginRight: 16,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#FFF',
    lineHeight: 28,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    marginTop: 8,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  servicesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  servicePressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 2,
  },
  serviceSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  horizontalScroll: {
    paddingBottom: 16,
    gap: 12,
  },
  miniCard: {
    width: 180,
    backgroundColor: Colors.card,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  miniImage: {
    width: '100%',
    height: 100,
  },
  miniContent: {
    padding: 10,
    gap: 4,
  },
  miniName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  miniMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniRating: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  miniDot: {
    color: Colors.textLight,
    fontSize: 12,
  },
  miniTime: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  stitchCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  stitchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stitchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.stitchingLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stitchType: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.stitching,
  },
  stitchBudget: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.primary,
  },
  stitchTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  stitchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stitchBids: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bottomSpacer: {
    height: 20,
  },
});
