// app/(tabs)/stitching/designs/index.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  FlatList, Pressable, TextInput,
  ActivityIndicator, Dimensions,
  RefreshControl, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search, X, Zap, Sparkles, Crown, Shirt,
  Baby, Heart, GraduationCap, Sun, AlertCircle, SlidersHorizontal,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { FeaturedCard, NewArrivalCard, GridCard } from '@/components/designer/DesignCard';
import { config } from '@/config';

const { width } = Dimensions.get('window');

const CATS = [
  { id: 'all',    label: 'All',      Icon: Sparkles },
  { id: 'women',  label: "Women's",  Icon: Crown },
  { id: 'men',    label: "Men's",    Icon: Shirt },
  { id: 'kids',   label: 'Kids',     Icon: Baby },
  { id: 'bridal', label: 'Bridal',   Icon: Heart },
  { id: 'formal', label: 'Formal',   Icon: GraduationCap },
  { id: 'casual', label: 'Casual',   Icon: Sun },
];

const SORTS = ['Newest', 'Price ↑', 'Price ↓', 'Popular'];

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export default function DesignsScreen() {
  const insets = useSafeAreaInsets();
  const GAP   = 10;
  const HPAD  = 16;
  const cols  = width >= 768 ? 3 : 2;
  const CARD  = (width - HPAD * 2 - GAP * (cols - 1)) / cols;

  const [cat,       setCat]       = useState('all');
  const [search,    setSearch]    = useState('');
  const [sortIdx,   setSortIdx]   = useState(0);
  const [designs,   setDesigns]   = useState<any[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [refreshing,setRefreshing]= useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [meta,      setMeta]      = useState({ total: 0, trending: 0, new: 0 });
  const [focused,   setFocused]   = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, []);

  const fetchDesigns = useCallback(async (c = cat, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else { setLoading(true); setError(null); }
    try {
      const res  = await fetch(`${config.apiUrl}/public/designs?category=${c}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      setDesigns(data.designs ?? []);
      setMeta(data.meta ?? { total: 0, trending: 0, new: 0 });
    } catch (e: any) {
      setError(e.message ?? 'Could not load designs');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [cat]);

  useEffect(() => { fetchDesigns(cat); }, [cat]);

  const trending = designs.filter(d => d.isTrending);
  const newest   = designs.filter(d => d.isNew);
  let   filtered = designs.filter(d => !search || d.title?.toLowerCase().includes(search.toLowerCase()));
  if (sortIdx === 1) filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sortIdx === 2) filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sortIdx === 3) filtered = [...filtered].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));

  if (loading) return (
    <View style={s.centered}>
      <ActivityIndicator size="large" color={Colors.ink} />
      <Text style={s.loadTxt}>Loading collection…</Text>
    </View>
  );

  if (error) return (
    <View style={s.centered}>
      <AlertCircle size={36} color={Colors.dangerText} />
      <Text style={s.errTitle}>Couldn't load</Text>
      <Text style={s.errBody}>{error}</Text>
      <Pressable style={s.retryBtn} onPress={() => fetchDesigns(cat)}>
        <Text style={s.retryTxt}>Try again</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>

      {/* ── Magazine header ── */}
      <View style={s.header}>
        <View style={s.masthead}>
          <View>
            <Text style={s.mastheadLabel}>IMLOCL STUDIO</Text>
            <Text style={s.mastheadTitle}>Designs</Text>
            <Text style={s.mastheadSub}>
              {meta.total > 0 ? `${meta.total} pieces in collection` : 'Browse collection'}
            </Text>
          </View>
          <Pressable style={s.sortBtn} onPress={() => setSortIdx((sortIdx + 1) % SORTS.length)}>
            <SlidersHorizontal size={12} color={Colors.text} />
            <Text style={s.sortTxt}>{SORTS[sortIdx]}</Text>
          </Pressable>
        </View>

        {/* Bold ruled line — magazine masthead */}
        <View style={s.mastheadRule} />

        {/* Search */}
        <View style={[s.searchBar, focused && s.searchBarFocused]}>
          <Search size={14} color={Colors.textLight} />
          <TextInput
            style={s.searchInput}
            placeholder="Search the collection…"
            placeholderTextColor={Colors.textLight}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={8}>
              <X size={13} color={Colors.textLight} />
            </Pressable>
          )}
        </View>

        {/* Category pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.pillsRow}>
          {CATS.map(({ id, label, Icon }) => {
            const active = cat === id;
            return (
              <Pressable key={id} style={[s.pill, active && s.pillActive]} onPress={() => setCat(id)}>
                <Icon size={11} color={active ? '#fff' : Colors.textSecondary} strokeWidth={2} />
                <Text style={[s.pillTxt, active && s.pillTxtActive]}>{label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <Animated.ScrollView
        style={{ opacity: fadeAnim }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchDesigns(cat, true)} tintColor={Colors.ink} />
        }
      >

        {/* ── Trending strip ── */}
        {!search && trending.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHead}>
              <View style={s.sectionHeadLeft}>
                <Zap size={13} fill="#E24B4A" color="#E24B4A" />
                <Text style={s.sectionTitle}>Trending</Text>
              </View>
              <Text style={s.sectionCount}>{meta.trending} pieces</Text>
            </View>
            <FlatList
              data={trending}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hStrip}
              keyExtractor={d => `t-${d.id}`}
              renderItem={({ item }) => <FeaturedCard design={item} />}
            />
          </View>
        )}

        {/* ── New arrivals ── */}
        {!search && newest.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHead}>
              <View style={s.sectionHeadLeft}>
                <Sparkles size={12} color={Colors.maskedText} />
                <Text style={s.sectionTitle}>New arrivals</Text>
              </View>
              <Text style={s.sectionCount}>{meta.new} new</Text>
            </View>
            <FlatList
              data={newest}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hStrip}
              keyExtractor={d => `n-${d.id}`}
              renderItem={({ item }) => <NewArrivalCard design={item} />}
            />
          </View>
        )}

        {/* ── Lookbook grid ── */}
        <View style={s.section}>
          <View style={s.sectionHead}>
            <View style={s.sectionHeadLeft}>
              <Text style={s.sectionTitle}>{search ? 'Results' : 'The lookbook'}</Text>
            </View>
            <Text style={s.sectionCount}>{filtered.length} items</Text>
          </View>

          {filtered.length === 0 ? (
            <View style={s.empty}>
              <Sparkles size={40} color={Colors.border} />
              <Text style={s.emptyTitle}>Nothing here yet</Text>
              <Text style={s.emptyBody}>
                {search ? 'Try a different keyword' : 'No designs in this category'}
              </Text>
            </View>
          ) : (
            chunk(filtered, cols).map((row, ri) => (
              <View key={ri} style={[s.gridRow, { paddingHorizontal: HPAD, gap: GAP, marginBottom: GAP + 4 }]}>
                {row.map((item: any) => <GridCard key={item.id} design={item} cardWidth={CARD} />)}
                {row.length < cols && Array.from({ length: cols - row.length }).map((_, i) => (
                  <View key={`fill-${i}`} style={{ width: CARD }} />
                ))}
              </View>
            ))
          )}
        </View>

        <View style={{ height: 60 }} />
      </Animated.ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 32, gap: 12, backgroundColor: Colors.background,
  },
  loadTxt: { fontSize: 14, color: Colors.textSecondary, marginTop: 8 },
  errTitle: { fontSize: 17, fontWeight: '700' as const, color: Colors.text },
  errBody: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' as const, lineHeight: 18 },
  retryBtn: { backgroundColor: Colors.ink, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20, marginTop: 4 },
  retryTxt: { color: '#fff', fontSize: 14, fontWeight: '700' as const },

  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  masthead: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mastheadLabel: {
    fontSize: 8, fontWeight: '800' as const,
    color: Colors.textLight, letterSpacing: 3,
  },
  mastheadTitle: {
    fontSize: 30, fontWeight: '900' as const,
    color: Colors.text, letterSpacing: -1,
    lineHeight: 34,
  },
  mastheadSub: { fontSize: 11, color: Colors.textLight, marginTop: 1 },
  mastheadRule: { height: 2, backgroundColor: Colors.ink },
  sortBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: Colors.border,
    marginTop: 4,
    alignSelf: 'flex-start' as const,
  },
  sortTxt: { fontSize: 11, fontWeight: '600' as const, color: Colors.text },
  searchBar: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    gap: 8,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  searchBarFocused: { borderColor: Colors.ink, backgroundColor: Colors.inkFaint },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text, padding: 0 },

  pillsRow: { gap: 7, paddingBottom: 2 },
  pill: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 0.5, borderColor: Colors.border,
    gap: 5,
  },
  pillActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  pillTxt: { fontSize: 12, fontWeight: '600' as const, color: Colors.textSecondary },
  pillTxtActive: { color: '#fff' },

  section: { marginTop: 22 },
  sectionHead: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sectionHeadLeft: { flexDirection: 'row' as const, alignItems: 'center', gap: 7 },
  sectionTitle: { fontSize: 20, fontWeight: '800' as const, color: Colors.text, letterSpacing: -0.4 },
  sectionCount: { fontSize: 11, color: Colors.textLight, fontWeight: '500' as const },
  hStrip: { paddingHorizontal: 16 },
  gridRow: { flexDirection: 'row' as const },

  empty: { alignItems: 'center', paddingTop: 48, paddingBottom: 32, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700' as const, color: Colors.text },
  emptyBody: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' as const, lineHeight: 19, paddingHorizontal: 24 },
});