// app/designer/[id].tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, ActivityIndicator, FlatList,
  Dimensions, Animated,
} from 'react-native';
import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft, Share2, CheckCircle, MapPin,
  Scissors, ArrowUpRight, Heart, Zap, ChevronRight,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { config } from '@/config';

const { width } = Dimensions.get('window');
const ITEM_W = (width - 48) / 2;

// ── Helpers ──────────────────────────────────────────────────────────────────

const COVER_PALETTES = [
  { bg: '#1C1C1E', accent: '#3C3C3E' },
  { bg: '#1A1F2E', accent: '#2A2F4E' },
  { bg: '#1E1A14', accent: '#3E3428' },
  { bg: '#14201A', accent: '#243830' },
  { bg: '#1E1420', accent: '#3E2840' },
  { bg: '#201414', accent: '#402828' },
];
const AVATAR_SWATCHES = [
  { bg: '#FDF6E3', fg: '#9B6914' },
  { bg: '#E8F5E9', fg: '#2E7D32' },
  { bg: '#EDE7F6', fg: '#512DA8' },
  { bg: '#FCE4EC', fg: '#AD1457' },
  { bg: '#E3F2FD', fg: '#1565C0' },
  { bg: '#FFF8E1', fg: '#F57F17' },
];

function hashStr(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  return Math.abs(h);
}
function initials(name: string) {
  const p = name.trim().split(/\s+/);
  return p.length === 1 ? p[0].slice(0, 2).toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
}
function isReal(uri?: string) {
  return !!uri && uri.startsWith('http') && !uri.includes('ui-avatars.com');
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function AvatarView({ uri, name, size }: { uri: string; name: string; size: number }) {
  const sw = AVATAR_SWATCHES[hashStr(name) % AVATAR_SWATCHES.length];
  if (isReal(uri)) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: sw.bg, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: size * 0.32, fontWeight: '700', color: sw.fg }}>{initials(name)}</Text>
    </View>
  );
}

// ── Cover ─────────────────────────────────────────────────────────────────────
function CoverView({ uri, name, height }: { uri?: string; name: string; height: number }) {
  const pal = COVER_PALETTES[hashStr(name) % COVER_PALETTES.length];
  if (isReal(uri)) {
    return (
      <View style={{ width: '100%', height }}>
        <Image source={{ uri }} style={{ width: '100%', height }} contentFit="cover" transition={300} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.5, backgroundColor: 'rgba(0,0,0,0.45)' }} />
      </View>
    );
  }
  return (
    <View style={{ width: '100%', height, backgroundColor: pal.bg, overflow: 'hidden' }}>
      {[0.3, 0.6].map(f => (
        <View key={`h${f}`} style={{ position: 'absolute', left: 0, right: 0, top: height * f, height: 0.5, backgroundColor: pal.accent }} />
      ))}
      {[0.35, 0.7].map(f => (
        <View key={`v${f}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${f * 100}%` as any, width: 0.5, backgroundColor: pal.accent }} />
      ))}
      <Text style={{ position: 'absolute', right: 16, bottom: 8, fontSize: 80, fontWeight: '900', color: 'rgba(255,255,255,0.06)', letterSpacing: -6 }}>{initials(name)}</Text>
      <Text style={{ position: 'absolute', left: 16, top: 14, fontSize: 8, fontWeight: '800', color: 'rgba(255,255,255,0.35)', letterSpacing: 3.5 }}>IMLOCL</Text>
      <View style={{ position: 'absolute', left: 16, top: 27, width: 20, height: 1, backgroundColor: 'rgba(255,255,255,0.25)' }} />
    </View>
  );
}

// ── Item card (design/item) ───────────────────────────────────────────────────
function ItemCard({ item, onPress }: { item: any; onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.96, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => onPress());
  };

  const imgH = ITEM_W * 1.35;

  return (
    <Pressable onPress={press}>
      <Animated.View style={[s.itemCard, { transform: [{ scale }] }]}>
        <View style={[s.itemImgWrap, { height: imgH }]}>
          <Image
            source={{ uri: item.images?.[0] }}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            transition={200}
          />
          {/* Price overlay */}
          <View style={s.itemPriceOverlay}>
            <Text style={s.itemPriceOverlayTxt}>₹{item.price?.toLocaleString()}</Text>
          </View>
          {/* Availability badge */}
          <View style={[s.itemAvailBadge, item.availability === 'READY_MADE' && s.itemAvailBadgeReady]}>
            <Text style={[s.itemAvailTxt, item.availability === 'READY_MADE' && s.itemAvailTxtReady]}>
              {item.availability === 'READY_MADE' ? 'Ready' : 'Custom'}
            </Text>
          </View>
        </View>
        <View style={s.itemCaption}>
          <Text style={s.itemTitle} numberOfLines={1}>{item.title ?? item.name}</Text>
          <View style={s.itemMeta}>
            <Text style={s.itemSubcat} numberOfLines={1}>{item.subcategoryName ?? ''}</Text>
            <View style={s.itemLikes}>
              <Heart size={9} color={Colors.textLight} />
              <Text style={s.itemLikesTxt}>{item.views ?? 0}</Text>
            </View>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function DesignerProfileScreen() {
  const { id }   = useLocalSearchParams<{ id: string }>();
  const router   = useRouter();
  const insets   = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [designer,  setDesigner]  = useState<any>(null);
  const [loading,   setLoading]   = useState(true);
  const [selCat,    setSelCat]    = useState<any>(null);
  const [selSub,    setSelSub]    = useState<any>(null);

  useEffect(() => {
    fetch(`${config.apiUrl}/public/designers/${id}`)
      .then(r => r.json())
      .then(data => {
        setDesigner(data.designer);
        if (data.designer?.categories?.length > 0) {
          setSelCat(data.designer.categories[0]);
        }
      })
      .catch(e => console.error(e))
      .finally(() => {
        setLoading(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();
      });
  }, [id]);

  // Flatten ALL items across all categories for the "top designs" section
  const allItems: any[] = [];
  designer?.categories?.forEach((cat: any) => {
    cat.subcategories?.forEach((sub: any) => {
      sub.items?.forEach((item: any) => {
        allItems.push({ ...item, subcategoryName: sub.name, categoryName: cat.name });
      });
    });
  });
  // Sort by views desc, take top 10
  const topItems = [...allItems].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 10);

  // Items for currently selected subcategory
  const subItems: any[] = selSub?.items?.map((item: any) => ({
    ...item,
    subcategoryName: selSub.name,
  })) ?? [];

  if (loading) return (
    <View style={s.centered}>
      <Stack.Screen options={{ headerShown: false }} />
      <ActivityIndicator size="large" color={Colors.ink} />
    </View>
  );

  if (!designer) return (
    <View style={s.centered}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={s.errTxt}>Designer not found</Text>
      <Pressable style={s.retryBtn} onPress={() => router.back()}>
        <Text style={s.retryTxt}>Go back</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={s.root}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* ── Floating header ── */}
      <View style={[s.header, { paddingTop: insets.top }]}>
        <View style={s.headerInner}>
          <Pressable style={s.headerBtn} onPress={() => {
            if (selSub) { setSelSub(null); } else { router.back(); }
          }}>
            <ArrowLeft size={20} color={Colors.text} />
          </Pressable>

          <View style={s.headerCenter}>
            {selSub ? (
              <>
                <Text style={s.headerSub}>{selCat?.name}</Text>
                <Text style={s.headerTitle}>{selSub.name}</Text>
              </>
            ) : (
              <Text style={s.headerTitle} numberOfLines={1}>{designer.name}</Text>
            )}
          </View>

          <Pressable style={s.headerBtn}>
            <Share2 size={18} color={Colors.text} />
          </Pressable>
        </View>
        <View style={s.headerRule} />
      </View>

      <Animated.ScrollView style={{ opacity: fadeAnim }} showsVerticalScrollIndicator={false}>

        {/* ── Cover + identity ── */}
        <View style={s.heroWrap}>
          <CoverView uri={designer.coverImage} name={designer.name} height={200} />

          {/* Avatar overlapping cover */}
          <View style={s.identityRow}>
            <View style={s.avatarRing}>
              <AvatarView uri={designer.avatar} name={designer.name} size={64} />
            </View>
            <View style={s.identityInfo}>
              <View style={s.nameRow}>
                <Text style={s.designerName} numberOfLines={1}>{designer.name}</Text>
                {designer.verified && <CheckCircle size={16} color={Colors.successText} />}
              </View>
              <View style={s.specRow}>
                <Scissors size={12} color={Colors.textSecondary} />
                <Text style={s.specTxt}>{designer.speciality}</Text>
              </View>
              <View style={s.locRow}>
                <MapPin size={11} color={Colors.textLight} />
                <Text style={s.locTxt}>{designer.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Stats band ── */}
        <View style={s.statsBand}>
          <View style={s.stat}>
            <Text style={s.statVal}>★ {designer.rating?.toFixed(1)}</Text>
            <Text style={s.statKey}>RATING</Text>
          </View>
          <View style={s.statSep} />
          <View style={s.stat}>
            <Text style={s.statVal}>{allItems.length}</Text>
            <Text style={s.statKey}>DESIGNS</Text>
          </View>
          <View style={s.statSep} />
          <View style={s.stat}>
            <Text style={s.statVal}>{designer.experience ?? '—'}</Text>
            <Text style={s.statKey}>EXP.</Text>
          </View>
          <View style={s.statSep} />
          <View style={s.stat}>
            <Text style={s.statVal}>{designer.categories?.length ?? 0}</Text>
            <Text style={s.statKey}>CATEGORIES</Text>
          </View>
        </View>

        {/* ── Bio ── */}
        {designer.bio && (
          <View style={s.bioSection}>
            <Text style={s.bioTxt}>{designer.bio}</Text>
          </View>
        )}

        {/* ── Tags ── */}
        {(designer.tags ?? []).length > 0 && (
          <View style={s.tagsRow}>
            {(designer.tags ?? []).map((tag: string, i: number) => (
              <View key={i} style={[s.tag, i === 0 && s.tagFirst]}>
                <Text style={[s.tagTxt, i === 0 && s.tagTxtFirst]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Top designs — inline grid ── */}
        {topItems.length > 0 && !selSub && (
          <View style={s.section}>
            <View style={s.sectionHead}>
              <View style={s.sectionHeadLeft}>
                <Zap size={14} color="#E24B4A" fill="#E24B4A" />
                <Text style={s.sectionTitle}>Top designs</Text>
              </View>
              <Text style={s.sectionCount}>{topItems.length} items</Text>
            </View>

            {/* 2-col grid */}
            <View style={s.gridWrap}>
              {topItems.map((item, i) => (
                <ItemCard
                  key={item.id ?? i}
                  item={item}
                  onPress={() => router.push(`/design/${item.id}`)}
                />
              ))}
              {/* Fill last row if odd count */}
              {topItems.length % 2 !== 0 && <View style={{ width: ITEM_W }} />}
            </View>
          </View>
        )}

        {/* ── Category selector ── */}
        {!selSub && designer.categories?.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHead}>
              <View style={s.sectionHeadLeft}>
                <Text style={s.rule}>——</Text>
                <Text style={s.sectionLabel}>BROWSE BY CATEGORY</Text>
              </View>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.catRow}>
              {designer.categories.map((cat: any) => (
                <Pressable
                  key={cat.id}
                  style={[s.catPill, selCat?.id === cat.id && s.catPillActive]}
                  onPress={() => { setSelCat(cat); setSelSub(null); }}
                >
                  <Text style={[s.catPillTxt, selCat?.id === cat.id && s.catPillTxtActive]}>{cat.name}</Text>
                  <View style={[s.catCount, selCat?.id === cat.id && s.catCountActive]}>
                    <Text style={[s.catCountTxt, selCat?.id === cat.id && s.catCountTxtActive]}>
                      {cat.subcategories?.length ?? 0}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* Subcategories for selected category */}
            {selCat && (
              <View style={s.subList}>
                <Text style={s.subListLabel}>{selCat.name} subcategories</Text>
                {(selCat.subcategories ?? []).map((sub: any) => (
                  <Pressable
                    key={sub.id}
                    style={({ pressed }) => [s.subRow, pressed && { opacity: 0.88 }]}
                    onPress={() => setSelSub(sub)}
                  >
                    <View style={s.subRowLeft}>
                      <View style={s.subDot} />
                      <Text style={s.subName}>{sub.name}</Text>
                    </View>
                    <View style={s.subRight}>
                      <Text style={s.subCount}>{sub.items?.length ?? 0} items</Text>
                      <ChevronRight size={14} color={Colors.textLight} />
                    </View>
                  </Pressable>
                ))}
                {(selCat.subcategories ?? []).length === 0 && (
                  <Text style={s.emptySubTxt}>No subcategories yet</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* ── Subcategory items view ── */}
        {selSub && (
          <View style={s.section}>
            <View style={s.sectionHead}>
              <View style={s.sectionHeadLeft}>
                <Text style={s.sectionTitle}>{selSub.name}</Text>
              </View>
              <Text style={s.sectionCount}>{subItems.length} items</Text>
            </View>

            {subItems.length === 0 ? (
              <View style={s.emptyItems}>
                <Scissors size={36} color={Colors.border} />
                <Text style={s.emptyItemsTxt}>No items in this subcategory yet</Text>
              </View>
            ) : (
              <View style={s.gridWrap}>
                {subItems.map((item, i) => (
                  <ItemCard
                    key={item.id ?? i}
                    item={item}
                    onPress={() => router.push(`/design/${item.id}`)}
                  />
                ))}
                {subItems.length % 2 !== 0 && <View style={{ width: ITEM_W }} />}
              </View>
            )}
          </View>
        )}

        {/* ── Post request CTA ── */}
        <Pressable
          style={({ pressed }) => [s.cta, pressed && { opacity: 0.9 }]}
          onPress={() => router.push('/post-request' as any)}
        >
          <View style={s.ctaLeft}>
            <Text style={s.ctaEyebrow}>COLLABORATE</Text>
            <Text style={s.ctaTitle}>Work with {designer.name.split(' ')[0]}?</Text>
            <Text style={s.ctaBody}>Post a requirement and they'll bid on your project.</Text>
          </View>
          <View style={s.ctaCircle}>
            <ArrowUpRight size={20} color="#fff" />
          </View>
        </Pressable>

        <View style={{ height: 60 }} />
      </Animated.ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    gap: 12, backgroundColor: Colors.background,
  },
  errTxt: { fontSize: 16, fontWeight: '700' as const, color: Colors.text },
  retryBtn: { backgroundColor: Colors.ink, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
  retryTxt: { color: '#fff', fontSize: 14, fontWeight: '700' as const },

  // ── Header ──
  header: { backgroundColor: Colors.surface },
  headerInner: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  headerBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 0.5, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  headerCenter: { flex: 1, alignItems: 'center' as const },
  headerSub: { fontSize: 9, fontWeight: '700' as const, color: Colors.textLight, letterSpacing: 2 },
  headerTitle: { fontSize: 15, fontWeight: '700' as const, color: Colors.text, letterSpacing: -0.2 },
  headerRule: { height: 2, backgroundColor: Colors.ink },

  // ── Hero ──
  heroWrap: { backgroundColor: Colors.surface },
  identityRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end',
    gap: 14,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
    marginTop: -32,
  },
  avatarRing: {
    borderRadius: 36,
    borderWidth: 3,
    borderColor: Colors.surface,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  identityInfo: { flex: 1, paddingBottom: 2, gap: 3 },
  nameRow: { flexDirection: 'row' as const, alignItems: 'center', gap: 7 },
  designerName: { fontSize: 20, fontWeight: '800' as const, color: Colors.text, letterSpacing: -0.4, flex: 1 },
  specRow: { flexDirection: 'row' as const, alignItems: 'center', gap: 5 },
  specTxt: { fontSize: 13, color: Colors.textSecondary },
  locRow: { flexDirection: 'row' as const, alignItems: 'center', gap: 4 },
  locTxt: { fontSize: 12, color: Colors.textLight },

  // ── Stats band ──
  statsBand: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.surface,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    paddingVertical: 14,
  },
  stat: { flex: 1, alignItems: 'center' as const, gap: 3 },
  statVal: { fontSize: 15, fontWeight: '800' as const, color: Colors.text, letterSpacing: -0.3 },
  statKey: { fontSize: 7, fontWeight: '800' as const, color: Colors.textLight, letterSpacing: 1.5 },
  statSep: { width: 0.5, height: 28, backgroundColor: Colors.border, alignSelf: 'center' as const },

  // ── Bio + tags ──
  bioSection: {
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4,
  },
  bioTxt: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21 },
  tagsRow: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
  },
  tag: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  tagFirst: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  tagTxt: { fontSize: 12, fontWeight: '600' as const, color: Colors.textSecondary },
  tagTxtFirst: { color: '#fff' },

  // ── Sections ──
  section: { marginTop: 24 },
  sectionHead: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
  },
  sectionHeadLeft: { flexDirection: 'row' as const, alignItems: 'center', gap: 7 },
  sectionTitle: { fontSize: 19, fontWeight: '800' as const, color: Colors.text, letterSpacing: -0.4 },
  sectionCount: { fontSize: 12, color: Colors.textLight, fontWeight: '500' as const },
  rule: { fontSize: 10, color: Colors.border, letterSpacing: 1 },
  sectionLabel: { fontSize: 9, fontWeight: '800' as const, color: Colors.textLight, letterSpacing: 3 },

  // ── Grid ──
  gridWrap: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    paddingHorizontal: 16,
    gap: 16,
  },

  // ── Item card ──
  itemCard: {
    width: ITEM_W,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  itemImgWrap: {
    width: '100%',
    backgroundColor: Colors.surfaceAlt,
    position: 'relative' as const,
  },
  itemPriceOverlay: {
    position: 'absolute' as const,
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(17,17,17,0.6)',
    paddingHorizontal: 10, paddingVertical: 5,
  },
  itemPriceOverlayTxt: {
    fontSize: 13, fontWeight: '800' as const, color: '#fff',
  },
  itemAvailBadge: {
    position: 'absolute' as const, top: 8, right: 8,
    backgroundColor: 'rgba(17,17,17,0.55)',
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 4,
  },
  itemAvailBadgeReady: { backgroundColor: Colors.successBg },
  itemAvailTxt: { fontSize: 9, fontWeight: '700' as const, color: '#fff', letterSpacing: 0.5 },
  itemAvailTxtReady: { color: Colors.successText },
  itemCaption: { padding: 10, gap: 3 },
  itemTitle: { fontSize: 12, fontWeight: '700' as const, color: Colors.text },
  itemMeta: { flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center' },
  itemSubcat: { fontSize: 10, color: Colors.textSecondary, flex: 1 },
  itemLikes: { flexDirection: 'row' as const, alignItems: 'center', gap: 3 },
  itemLikesTxt: { fontSize: 10, color: Colors.textLight },

  // ── Category selector ──
  catRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 4 },
  catPill: {
    flexDirection: 'row' as const, alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, backgroundColor: Colors.surface,
    borderWidth: 0.5, borderColor: Colors.border,
  },
  catPillActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  catPillTxt: { fontSize: 13, fontWeight: '600' as const, color: Colors.textSecondary },
  catPillTxtActive: { color: '#fff', fontWeight: '700' as const },
  catCount: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10,
  },
  catCountActive: { backgroundColor: 'rgba(255,255,255,0.18)' },
  catCountTxt: { fontSize: 11, color: Colors.textLight, fontWeight: '600' as const },
  catCountTxtActive: { color: '#fff' },

  // ── Sub list ──
  subList: { marginTop: 14, paddingHorizontal: 20 },
  subListLabel: {
    fontSize: 9, fontWeight: '800' as const, color: Colors.textLight,
    letterSpacing: 2.5, marginBottom: 10,
  },
  subRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  subRowLeft: { flexDirection: 'row' as const, alignItems: 'center', gap: 10 },
  subDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.maskedText },
  subName: { fontSize: 14, fontWeight: '600' as const, color: Colors.text },
  subRight: { flexDirection: 'row' as const, alignItems: 'center', gap: 8 },
  subCount: { fontSize: 12, color: Colors.textLight },
  emptySubTxt: { fontSize: 13, color: Colors.textLight, paddingVertical: 20, textAlign: 'center' as const },

  emptyItems: { alignItems: 'center' as const, paddingVertical: 48, gap: 10 },
  emptyItemsTxt: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center' as const },

  // ── CTA ──
  cta: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.ink,
    marginHorizontal: 20, marginTop: 24,
    borderRadius: 20, padding: 22,
    alignItems: 'center', gap: 16,
  },
  ctaLeft: { flex: 1, gap: 5 },
  ctaEyebrow: { fontSize: 8, fontWeight: '800' as const, color: 'rgba(255,255,255,0.35)', letterSpacing: 3 },
  ctaTitle: { fontSize: 20, fontWeight: '900' as const, color: '#fff', letterSpacing: -0.4 },
  ctaBody: { fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 16 },
  ctaCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
});