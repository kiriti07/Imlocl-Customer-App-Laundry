// components/designer/DesignCard.tsx
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Heart, Eye, Zap, ArrowUpRight } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface DesignCardProps {
  design: {
    id: string;
    title: string;
    images: string[];
    price: number;
    currency: string;
    designerName: string;
    likes: number;
    views: number;
    isTrending?: boolean;
    isNew?: boolean;
    category?: string;
    deliveryTime?: string;
  };
  variant?: 'featured' | 'newArrival' | 'grid' | 'compact' | 'default';
  cardWidth?: number;
}

function scaleAnim() {
  const scale = useRef(new Animated.Value(1)).current;
  const animate = () => Animated.sequence([
    Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
    Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
  ]).start();
  return { scale, animate };
}

// ── Featured card — tall, full-bleed, editorial overlay ──────────────────────
export function FeaturedCard({ design }: { design: DesignCardProps['design'] }) {
  const router = useRouter();
  const { scale, animate } = scaleAnim();
  return (
    <Pressable onPress={() => { animate(); router.push(`/design/${design.id}`); }} style={s.featWrap}>
      <Animated.View style={[s.featCard, { transform: [{ scale }] }]}>
        <Image source={{ uri: design.images[0] }} style={s.featImg} contentFit="cover" transition={250} />

        {/* Top badges */}
        <View style={s.featTopRow}>
          {design.isTrending && (
            <View style={s.hotBadge}>
              <Zap size={9} fill="#fff" color="#fff" />
              <Text style={s.hotText}>HOT</Text>
            </View>
          )}
        </View>

        {/* Bottom panel */}
        <View style={s.featPanel}>
          <Text style={s.featCategory}>{(design.category ?? 'design').toUpperCase()}</Text>
          <Text style={s.featTitle} numberOfLines={2}>{design.title}</Text>
          <View style={s.featFooter}>
            <View>
              <Text style={s.featDesigner}>{design.designerName}</Text>
              <Text style={s.featPrice}>{design.currency}{design.price.toLocaleString()}</Text>
            </View>
            <View style={s.featArrow}>
              <ArrowUpRight size={14} color="#fff" />
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ── New arrival card — portrait with ink badge ────────────────────────────────
export function NewArrivalCard({ design }: { design: DesignCardProps['design'] }) {
  const router = useRouter();
  const { scale, animate } = scaleAnim();
  return (
    <Pressable onPress={() => { animate(); router.push(`/design/${design.id}`); }} style={s.newWrap}>
      <Animated.View style={[s.newCard, { transform: [{ scale }] }]}>
        <Image source={{ uri: design.images[0] }} style={s.newImg} contentFit="cover" transition={250} />

        {/* Ink stamp badge */}
        <View style={s.newInkBadge}>
          <Text style={s.newInkText}>NEW{'\n'}IN</Text>
        </View>

        {/* White bottom strip */}
        <View style={s.newStrip}>
          <Text style={s.newTitle} numberOfLines={1}>{design.title}</Text>
          <View style={s.newStripRow}>
            <Text style={s.newDesigner} numberOfLines={1}>{design.designerName}</Text>
            <Text style={s.newPrice}>{design.currency}{design.price.toLocaleString()}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ── Grid card — 3:4 portrait, minimal caption below ──────────────────────────
export function GridCard({ design, cardWidth }: { design: DesignCardProps['design']; cardWidth?: number }) {
  const router = useRouter();
  const { scale, animate } = scaleAnim();
  const imgH = cardWidth ? cardWidth * 1.38 : 200;

  return (
    <Pressable onPress={() => { animate(); router.push(`/design/${design.id}`); }}>
      <Animated.View style={[{ width: cardWidth }, { transform: [{ scale }] }]}>
        {/* Image container */}
        <View style={[s.gridImgWrap, { height: imgH }]}>
          <Image source={{ uri: design.images[0] }} style={s.gridImg} contentFit="cover" transition={200} />

          {/* Status dots */}
          {design.isTrending && (
            <View style={s.gridTrend}>
              <Zap size={8} fill="#fff" color="#fff" />
            </View>
          )}
          {design.isNew && !design.isTrending && (
            <View style={s.gridNew}>
              <View style={s.gridNewDot} />
            </View>
          )}

          {/* Hover-style price overlay at bottom */}
          <View style={s.gridPriceOverlay}>
            <Text style={s.gridPriceOverlayText}>{design.currency}{design.price.toLocaleString()}</Text>
          </View>
        </View>

        {/* Caption */}
        <View style={s.gridCaption}>
          <Text style={s.gridTitle} numberOfLines={1}>{design.title}</Text>
          <View style={s.gridMeta}>
            <Text style={s.gridDesigner} numberOfLines={1}>{design.designerName}</Text>
            <View style={s.gridLikes}>
              <Heart size={9} color={Colors.textLight} />
              <Text style={s.gridLikesNum}>{design.likes}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ── Default export ────────────────────────────────────────────────────────────
export default function DesignCard({ design, variant = 'default', cardWidth }: DesignCardProps) {
  const router = useRouter();
  if (variant === 'featured')   return <FeaturedCard design={design} />;
  if (variant === 'newArrival') return <NewArrivalCard design={design} />;
  if (variant === 'grid')       return <GridCard design={design} cardWidth={cardWidth} />;

  return (
    <Pressable
      style={({ pressed }) => [s.defaultCard, pressed && { opacity: 0.9 }]}
      onPress={() => router.push(`/design/${design.id}`)}
    >
      <Image source={{ uri: design.images[0] }} style={s.defaultImg} contentFit="cover" transition={200} />
      <View style={s.defaultInfo}>
        <Text style={s.gridTitle} numberOfLines={1}>{design.title}</Text>
        <Text style={s.gridDesigner}>{design.designerName}</Text>
        <View style={s.defaultFooter}>
          <Text style={s.defaultPrice}>{design.currency}{design.price.toLocaleString()}</Text>
          <View style={s.gridLikes}><Eye size={11} color={Colors.textLight} /><Text style={s.gridLikesNum}>{design.views}</Text></View>
        </View>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  // ── Featured ──
  featWrap: { marginRight: 14 },
  featCard: { width: 230, height: 330, borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.surfaceAlt },
  featImg: { width: '100%', height: '100%', position: 'absolute' as const },
  featTopRow: { flexDirection: 'row' as const, padding: 12 },
  hotBadge: {
    flexDirection: 'row' as const, alignItems: 'center', gap: 3,
    backgroundColor: '#E24B4A', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 3,
  },
  hotText: { fontSize: 9, fontWeight: '800' as const, color: '#fff', letterSpacing: 1 },
  featPanel: {
    position: 'absolute' as const, bottom: 0, left: 0, right: 0,
    padding: 14, paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.65)',
    gap: 3,
  },
  featCategory: { fontSize: 8, fontWeight: '700' as const, color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },
  featTitle: { fontSize: 16, fontWeight: '800' as const, color: '#fff', lineHeight: 21 },
  featFooter: { flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 6 },
  featDesigner: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 2 },
  featPrice: { fontSize: 18, fontWeight: '800' as const, color: '#fff' },
  featArrow: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center', alignItems: 'center',
  },

  // ── New arrival ──
  newWrap: { marginRight: 14 },
  newCard: { width: 195, height: 285, borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.surfaceAlt },
  newImg: { width: '100%', height: '100%', position: 'absolute' as const },
  newInkBadge: {
    position: 'absolute' as const, top: 12, left: 12,
    backgroundColor: Colors.ink,
    paddingHorizontal: 8, paddingVertical: 5,
    borderRadius: 3,
  },
  newInkText: { fontSize: 8, fontWeight: '900' as const, color: '#fff', letterSpacing: 1.5, lineHeight: 12, textAlign: 'center' as const },
  newStrip: {
    position: 'absolute' as const, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 12, gap: 3,
  },
  newTitle: { fontSize: 13, fontWeight: '700' as const, color: Colors.text },
  newStripRow: { flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center' },
  newDesigner: { fontSize: 11, color: Colors.textSecondary, flex: 1 },
  newPrice: { fontSize: 14, fontWeight: '800' as const, color: Colors.text },

  // ── Grid ──
  gridImgWrap: { borderRadius: 12, overflow: 'hidden', backgroundColor: Colors.surfaceAlt },
  gridImg: { width: '100%', height: '100%' },
  gridTrend: {
    position: 'absolute' as const, top: 8, left: 8,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#E24B4A',
    justifyContent: 'center', alignItems: 'center',
  },
  gridNew: { position: 'absolute' as const, top: 10, right: 10 },
  gridNewDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.successMid },
  gridPriceOverlay: {
    position: 'absolute' as const, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(17,17,17,0.55)',
    paddingHorizontal: 8, paddingVertical: 5,
  },
  gridPriceOverlayText: { fontSize: 12, fontWeight: '800' as const, color: '#fff' },
  gridCaption: { paddingTop: 7, gap: 3 },
  gridTitle: { fontSize: 12, fontWeight: '700' as const, color: Colors.text, letterSpacing: -0.1 },
  gridMeta: { flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center' },
  gridDesigner: { fontSize: 11, color: Colors.textSecondary, flex: 1 },
  gridLikes: { flexDirection: 'row' as const, alignItems: 'center', gap: 3 },
  gridLikesNum: { fontSize: 10, color: Colors.textLight },

  // ── Default ──
  defaultCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14, overflow: 'hidden',
    borderWidth: 0.5, borderColor: Colors.border, marginBottom: 12,
  },
  defaultImg: { width: '100%', height: 180, backgroundColor: Colors.surfaceAlt },
  defaultInfo: { padding: 12, gap: 3 },
  defaultFooter: { flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  defaultPrice: { fontSize: 15, fontWeight: '800' as const, color: Colors.text },
});