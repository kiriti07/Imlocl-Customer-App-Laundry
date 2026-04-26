// app/(tabs)/stitching/designers/index.tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, Pressable,
  ActivityIndicator, FlatList, RefreshControl,
  Animated, ScrollView, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, X, Users, AlertCircle, LayoutGrid, List } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { EditorialCard, HorizontalCard, FeaturedDesignerCard } from '@/components/designer/DesignerCard';
import { config } from '@/config';

const { width } = Dimensions.get('window');

const CATS = [
  { id: 'all', label: 'All' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'women', label: "Women's" },
  { id: 'men', label: "Men's" },
  { id: 'kids', label: 'Kids' },
  { id: 'formal', label: 'Formal' },
  { id: 'casual', label: 'Casual' },
];

export default function DesignersScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch]       = useState('');
  const [cat, setCat]             = useState('all');
  const [view, setView]           = useState<'grid' | 'list'>('grid');
  const [designers, setDesigners] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [focused, setFocused]     = useState(false);

  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  const fetchDesigners = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else { setLoading(true); setError(null); }
    try {
      const res  = await fetch(`${config.apiUrl}/public/designers`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `Error ${res.status}`);
      setDesigners(data.designers ?? []);
    } catch (e: any) {
      setError(e.message ?? 'Could not load');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchDesigners(); }, [fetchDesigners]);

  const filtered = designers.filter(d => {
    const q = search.toLowerCase();
    const matchS = !search || d.name?.toLowerCase().includes(q) || d.speciality?.toLowerCase().includes(q) || d.tags?.some((t: string) => t.toLowerCase().includes(q));
    const matchC = cat === 'all' || d.tags?.some((t: string) => t.toLowerCase().includes(cat));
    return matchS && matchC;
  });

  const featured  = filtered[0] ?? null;
  const rest      = filtered.slice(1);

  if (loading) return (
    <View style={s.centered}>
      <ActivityIndicator size="large" color={Colors.ink} />
      <Text style={s.loadTxt}>Finding designers…</Text>
    </View>
  );

  if (error) return (
    <View style={s.centered}>
      <AlertCircle size={36} color={Colors.dangerText} />
      <Text style={s.errTitle}>Couldn't load</Text>
      <Text style={s.errBody}>{error}</Text>
      <Pressable style={s.retryBtn} onPress={() => fetchDesigners()}>
        <Text style={s.retryTxt}>Try again</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>

      {/* ── Magazine header ── */}
      <View style={s.header}>
        {/* Masthead */}
        <View style={s.masthead}>
          <View style={s.mastheadLeft}>
            <Text style={s.mastheadLabel}>IMLOCL STUDIO</Text>
            <Text style={s.mastheadTitle}>Designers</Text>
            <Text style={s.mastheadSub}>
              {designers.length > 0 ? `${designers.length} creators · Hyderabad` : 'Browse creators'}
            </Text>
          </View>
          {/* View toggle */}
          <View style={s.toggleRow}>
            <Pressable style={[s.toggleBtn, view === 'grid' && s.toggleActive]} onPress={() => setView('grid')}>
              <LayoutGrid size={14} color={view === 'grid' ? '#fff' : Colors.textSecondary} />
            </Pressable>
            <Pressable style={[s.toggleBtn, view === 'list' && s.toggleActive]} onPress={() => setView('list')}>
              <List size={14} color={view === 'list' ? '#fff' : Colors.textSecondary} />
            </Pressable>
          </View>
        </View>

        {/* Ruled line — magazine separator */}
        <View style={s.mastheadRule} />

        {/* Search */}
        <View style={[s.searchBar, focused && s.searchBarFocused]}>
          <Search size={14} color={Colors.textLight} />
          <TextInput
            style={s.searchInput}
            placeholder="Search by name or specialty…"
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
          {CATS.map(c => (
            <Pressable
              key={c.id}
              style={[s.pill, cat === c.id && s.pillActive]}
              onPress={() => setCat(c.id)}
            >
              <Text style={[s.pillTxt, cat === c.id && s.pillTxtActive]}>{c.label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* ── Stats band ── */}
      {filtered.length > 0 && (
        <View style={s.statsBand}>
          <Text style={s.statsItem}>{filtered.length} designer{filtered.length !== 1 ? 's' : ''}</Text>
          <Text style={s.statsDot}>·</Text>
          <Text style={s.statsItem}>{filtered.filter(d => d.verified).length} verified</Text>
          <Text style={s.statsDot}>·</Text>
          <Text style={s.statsItem}>Hyderabad</Text>
        </View>
      )}

      {/* ── Content ── */}
      <Animated.ScrollView
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => fetchDesigners(true)} tintColor={Colors.ink} />
        }
      >
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Users size={44} color={Colors.border} />
            <Text style={s.emptyTitle}>No designers found</Text>
            <Text style={s.emptyBody}>{search ? 'Try a different keyword' : 'No designers in this category yet'}</Text>
          </View>
        ) : (
          <View style={s.content}>

            {/* ── Hero featured card ── */}
            {featured && view === 'grid' && (
              <View style={s.heroSection}>
                <View style={s.sectionHead}>
                  <Text style={s.sectionRule}>———</Text>
                  <Text style={s.sectionLabel}>EDITOR'S PICK</Text>
                  <Text style={s.sectionRule}>———</Text>
                </View>
                <FeaturedDesignerCard designer={featured} />
              </View>
            )}

            {/* ── Rest of designers ── */}
            {(view === 'grid' ? rest : filtered).length > 0 && (
              <View>
                <View style={s.sectionHead}>
                  <Text style={s.sectionRule}>———</Text>
                  <Text style={s.sectionLabel}>{view === 'grid' ? 'ALL DESIGNERS' : 'DIRECTORY'}</Text>
                  <Text style={s.sectionRule}>———</Text>
                </View>

                {(view === 'grid' ? rest : filtered).map((d, i) =>
                  view === 'grid'
                    ? <EditorialCard key={d.id} designer={d} index={i + 1} />
                    : <HorizontalCard key={d.id} designer={d} index={i} />
                )}
              </View>
            )}

          </View>
        )}
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

  // Header
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
  mastheadLeft: { gap: 2 },
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
  mastheadRule: {
    height: 2,
    backgroundColor: Colors.ink,
    marginBottom: 2,
  },
  toggleRow: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    padding: 2,
    borderWidth: 0.5,
    borderColor: Colors.border,
    marginTop: 4,
  },
  toggleBtn: {
    width: 32, height: 30, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
  },
  toggleActive: { backgroundColor: Colors.ink },

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
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 20, backgroundColor: Colors.surface,
    borderWidth: 0.5, borderColor: Colors.border,
  },
  pillActive: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  pillTxt: { fontSize: 12, fontWeight: '600' as const, color: Colors.textSecondary },
  pillTxtActive: { color: '#fff' },

  // Stats band
  statsBand: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: Colors.surface,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  statsItem: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' as const },
  statsDot: { fontSize: 11, color: Colors.border },

  // Content
  content: { padding: 16 },

  heroSection: { marginBottom: 8 },
  sectionHead: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    marginTop: 4,
  },
  sectionRule: { color: Colors.border, fontSize: 10, letterSpacing: 1 },
  sectionLabel: {
    fontSize: 9, fontWeight: '800' as const,
    color: Colors.textLight, letterSpacing: 3,
  },

  empty: { alignItems: 'center', paddingTop: 64, gap: 10 },
  emptyTitle: { fontSize: 17, fontWeight: '700' as const, color: Colors.text },
  emptyBody: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center' as const, lineHeight: 19, paddingHorizontal: 24 },
});