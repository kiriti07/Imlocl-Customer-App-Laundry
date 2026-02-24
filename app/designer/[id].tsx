// app/designer/[id].tsx
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Star,
  MapPin,
  BadgeCheck,
  Scissors,
  Clock,
  MessageCircle,
  Share2,
} from 'lucide-react-native';

import Colors from '@/constants/colors';
import { designers } from '@/mocks/designers';
import { designs } from '@/mocks/designs';
// Fix this import path - add 'designer/' folder
import DesignCard from '@/components/designer/DesignCard';

export default function DesignerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const designer = useMemo(() => designers.find((d) => d.id === id), [id]);
  const designerDesigns = useMemo(
    () => designs.filter((d) => d.designerId === id),
    [id]
  );

  if (!designer) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Designer not found</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.coverSection}>
          <Image source={{ uri: designer.coverImage }} style={styles.coverImage} />
          <View style={styles.coverOverlay} />
          <View style={[styles.coverNav, { paddingTop: insets.top + 8 }]}>
            <Pressable style={styles.navButton} onPress={() => router.back()}>
              <ArrowLeft size={20} color={Colors.white} />
            </Pressable>
            <Pressable style={styles.navButton}>
              <Share2 size={20} color={Colors.white} />
            </Pressable>
          </View>
          <View style={styles.coverContent}>
            <Image source={{ uri: designer.avatar }} style={styles.avatar} />
            <View style={styles.nameContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{designer.name}</Text>
                {designer.verified && <BadgeCheck size={20} color={Colors.primary} />}
              </View>
              <View style={styles.specialityRow}>
                <Scissors size={14} color={Colors.primary} />
                <Text style={styles.speciality}>{designer.speciality}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.statsBar}>
            <View style={styles.statItem}>
              <View style={styles.ratingRow}>
                <Star size={16} color={Colors.star} fill={Colors.star} />
                <Text style={styles.statValue}>{designer.rating}</Text>
              </View>
              <Text style={styles.statLabel}>{designer.reviewCount} reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{designer.designCount}</Text>
              <Text style={styles.statLabel}>Designs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.iconRow}>
                <Clock size={14} color={Colors.primary} />
                <Text style={styles.statValue}>{designer.experience}</Text>
              </View>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.iconRow}>
                <MapPin size={14} color={Colors.primary} />
              </View>
              <Text style={styles.statLabel} numberOfLines={1}>{designer.location}</Text>
            </View>
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{designer.bio}</Text>
          </View>

          <View style={styles.tagsSection}>
            {designer.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <Pressable style={styles.contactButton}>
            <MessageCircle size={18} color={Colors.white} />
            <Text style={styles.contactButtonText}>Contact Designer</Text>
          </Pressable>

          <View style={styles.portfolioSection}>
            <View style={styles.portfolioHeader}>
              <Text style={styles.sectionTitle}>Portfolio</Text>
              <Text style={styles.portfolioCount}>{designerDesigns.length} designs</Text>
            </View>
            <View style={styles.designsGrid}>
              {designerDesigns.map((design) => (
                <DesignCard key={design.id} design={design} />
              ))}
            </View>
            {designerDesigns.length === 0 && (
              <View style={styles.emptyPortfolio}>
                <Text style={styles.emptyText}>No designs yet</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.white,
  },
  coverSection: {
    height: 280,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.cardAlt,
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  coverNav: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverContent: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 14,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.white,
    backgroundColor: Colors.cardAlt,
  },
  nameContainer: {
    flex: 1,
    marginBottom: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: Colors.white,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  specialityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  speciality: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: Colors.borderLight,
  },
  aboutSection: {
    marginTop: 24,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  bioText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
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
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 24,
    gap: 8,
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  portfolioSection: {
    marginTop: 28,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  portfolioCount: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  designsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emptyPortfolio: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 15,
    color: Colors.textLight,
  },
});