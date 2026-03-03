// app/design/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Clock,
  Ruler,
  MessageCircle,
  ShoppingBag,
  ChevronRight,
  BadgeCheck,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { config } from '@/config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_BASE_URL = config.apiUrl;

export default function DesignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [liked, setLiked] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesign();
  }, [id]);

  const fetchDesign = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/designs/${id}`);
      const data = await response.json();
      setDesign(data.design);
    } catch (error) {
      console.error('Error fetching design:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = () => {
    setLiked((prev) => !prev);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleScroll = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveImageIndex(index);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!design) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Design not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtnFallback}>
          <Text style={styles.backBtnFallbackText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageCarousel}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
          >
            {design.images.map((img: string, idx: number) => (
              <Image key={idx} source={{ uri: img }} style={styles.carouselImage} />
            ))}
          </ScrollView>

          <View style={[styles.imageNav, { paddingTop: insets.top + 8 }]}>
            <Pressable style={styles.navBtn} onPress={() => router.back()}>
              <ArrowLeft size={20} color={Colors.white} />
            </Pressable>
            <View style={styles.imageNavRight}>
              <Pressable style={styles.navBtn} onPress={handleLike}>
                <Heart
                  size={20}
                  color={liked ? '#FF4D67' : Colors.white}
                  fill={liked ? '#FF4D67' : 'transparent'}
                />
              </Pressable>
              <Pressable style={styles.navBtn}>
                <Share2 size={20} color={Colors.white} />
              </Pressable>
            </View>
          </View>

          {design.images.length > 1 && (
            <View style={styles.pagination}>
              {design.images.map((_: any, idx: number) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    idx === activeImageIndex && styles.dotActive,
                  ]}
                />
              ))}
            </View>
          )}

          {design.isTrending && (
            <View style={styles.trendingFloating}>
              <Text style={styles.trendingFloatingText}>Trending</Text>
            </View>
          )}
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <View style={styles.titleInfo}>
              <Text style={styles.title}>{design.title}</Text>
              <Text style={styles.categoryLabel}>{design.category}</Text>
            </View>
            <Text style={styles.price}>{design.currency}{design.price}</Text>
          </View>

          <Pressable
            style={styles.designerRow}
            onPress={() => router.push(`/designer/${design.designerId}`)}
          >
            <Image source={{ uri: design.designerAvatar }} style={styles.designerAvatar} />
            <View style={styles.designerInfo}>
              <View style={styles.designerNameRow}>
                <Text style={styles.designerName}>{design.designerName}</Text>
                <BadgeCheck size={15} color={Colors.primary} />
              </View>
            </View>
            <ChevronRight size={18} color={Colors.textLight} />
          </Pressable>

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{design.description}</Text>
          </View>

          <View style={styles.detailsGrid}>
            {design.fabricType && (
              <View style={styles.detailItem}>
                <Ruler size={16} color={Colors.primary} />
                <View>
                  <Text style={styles.detailLabel}>Fabric</Text>
                  <Text style={styles.detailValue}>{design.fabricType}</Text>
                </View>
              </View>
            )}
            {design.deliveryTime && (
              <View style={styles.detailItem}>
                <Clock size={16} color={Colors.primary} />
                <View>
                  <Text style={styles.detailLabel}>Delivery</Text>
                  <Text style={styles.detailValue}>{design.deliveryTime}</Text>
                </View>
              </View>
            )}
            <View style={styles.detailItem}>
              <Heart size={16} color={Colors.primary} />
              <View>
                <Text style={styles.detailLabel}>Likes</Text>
                <Text style={styles.detailValue}>{design.likes}</Text>
              </View>
            </View>
          </View>

          <View style={styles.tagsSection}>
            {design.tags.map((tag: string) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={styles.inquiryButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <MessageCircle size={18} color={Colors.primary} />
          <Text style={styles.inquiryButtonText}>Inquire</Text>
        </Pressable>
        <Pressable
          style={styles.orderButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        >
          <ShoppingBag size={18} color={Colors.white} />
          <Text style={styles.orderButtonText}>Order Now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  backBtnFallback: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  backBtnFallbackText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  imageCarousel: {
    position: 'relative',
    height: 420,
    backgroundColor: Colors.cardAlt,
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: 420,
    backgroundColor: Colors.cardAlt,
  },
  imageNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  imageNavRight: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pagination: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: Colors.white,
    width: 20,
  },
  trendingFloating: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  trendingFloatingText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleInfo: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  categoryLabel: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600' as const,
    textTransform: 'capitalize',
    marginTop: 4,
  },
  price: {
    fontSize: 26,
    fontWeight: '800' as const,
    color: Colors.primary,
  },
  designerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 14,
    borderRadius: 16,
    marginTop: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  designerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.cardAlt,
  },
  designerInfo: {
    flex: 1,
    gap: 3,
  },
  designerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  designerName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  descriptionSection: {
    marginTop: 24,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  descriptionText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    minWidth: '30%',
  },
  detailLabel: {
    fontSize: 11,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 20,
  },
  tag: {
    backgroundColor: Colors.cardAlt,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  inquiryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.primary,
    gap: 8,
  },
  inquiryButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  orderButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    gap: 8,
  },
  orderButtonText: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.white,
  },
});