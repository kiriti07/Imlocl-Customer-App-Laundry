// app/(tabs)/(home)/index.tsx
import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Pressable, Animated, FlatList, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Scissors, MapPin, Bell, Search, Clock,
  ArrowUpRight, Sparkles, Shirt, Flower2,
  Zap, CheckCircle, Star,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { stitchingRequests } from '@/mocks/stitchingRequests';
import { config } from '@/config';

const { width } = Dimensions.get('window');
const DESIGN_CARD_W = 160;
const DESIGNER_CARD_W = 220;

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

function hash(s: string) {
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

// ── Avatar inline ─────────────────────────────────────────────────────────────
function AvatarView({ uri, name, size }: { uri: string; name: string; size: number }) {
  const sw = AVATAR_SWATCHES[hash(name) % AVATAR_SWATCHES.length];
  if (isReal(uri)) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: sw.bg, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: size * 0.32, fontWeight: '700', color: sw.fg }}>{initials(name)}</Text>
    </View>
  );
}

// ── Designer cover inline ─────────────────────────────────────────────────────
function DesignerCover({ uri, name, height, width: w }: { uri?: string; name: string; height: number; width: number }) {
  const pal = COVER_PALETTES[hash(name) % COVER_PALETTES.length];
  if (isReal(uri)) {
    return (
      <View style={{ width: w, height, overflow: 'hidden' }}>
        <Image source={{ uri }} style={{ width: w, height }} contentFit="cover" transition={200} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.5, backgroundColor: 'rgba(0,0,0,0.5)' }} />
      </View>
    );
  }
  return (
    <View style={{ width: w, height, backgroundColor: pal.bg, overflow: 'hidden' }}>
      {[0.35, 0.65].map(f => (
        <View key={`h${f}`} style={{ position: 'absolute', left: 0, right: 0, top: height * f, height: 0.5, backgroundColor: pal.accent }} />
      ))}
      {[0.4].map(f => (
        <View key={`v${f}`} style={{ position: 'absolute', top: 0, bottom: 0, left: w * f, width: 0.5, backgroundColor: pal.accent }} />
      ))}
      <Text style={{ position: 'absolute', right: 8, bottom: 40, fontSize: 56, fontWeight: '900', color: 'rgba(255,255,255,0.07)', letterSpacing: -4 }}>{initials(name)}</Text>
    </View>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────
const SERVICES = [
  { id: 'stitching', title: 'Stitching', subtitle: 'Design & tailor', icon: Scissors, color: Colors.stitching, bgColor: Colors.stitchingLight, route: '/(tabs)/stitching/designers' },
  { id: 'maggam',    title: 'Maggam',    subtitle: 'Embroidery work', icon: Flower2,  color: Colors.maggam,   bgColor: Colors.maggamLight,   route: '/(tabs)/stitching/designers' },
  { id: 'dyeing',    title: 'Dyeing',    subtitle: 'Cloth colouring', icon: Shirt,    color: Colors.dyeing,   bgColor: Colors.dyeingLight,   route: '/(tabs)/stitching/designers' },
];

// ── Main screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();

  const fade  = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  const [designers, setDesigners] = useState<any[]>([]);
  const [designs,   setDesigns]   = useState<any[]>([]);
  const [loadingD,  setLoadingD]  = useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade,  { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slide, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();

    // Fetch designers + designs in parallel
    Promise.all([
      fetch(`${config.apiUrl}/public/designers`).then(r => r.json()).catch(() => ({ designers: [] })),
      fetch(`${config.apiUrl}/public/designs?category=all`).then(r => r.json()).catch(() => ({ designs: [] })),
    ]).then(([dRes, dsRes]) => {
      setDesigners(dRes.designers ?? []);
      setDesigns(dsRes.designs ?? []);
    }).finally(() => setLoadingD(false));
  }, []);

  const openPosts = stitchingRequests.filter(r => r.status === 'open');

  // Top 6 trending designs
  const trendingDesigns = designs.filter(d => d.isTrending).slice(0, 6);
  const allDesigns = designs.slice(0, 6);
  const showcaseDesigns = trendingDesigns.length > 0 ? trendingDesigns : allDesigns;

  return (
    <View style={s.root}>
      <SafeAreaView edges={['top']} style={s.safeTop}>
        <View style={s.header}>
          <View>
            <Text style={s.brandMark}>IMLOCL</Text>
            <View style={s.locRow}>
              <MapPin size={10} color={Colors.textLight} />
              <Text style={s.locTxt}>Hyderabad, Telangana</Text>
            </View>
          </View>
          <View style={s.headerRight}>
            <Pressable style={s.iconBtn}><Search size={16} color={Colors.text} /></Pressable>
            <Pressable style={s.iconBtn}>
              <Bell size={16} color={Colors.text} />
              <View style={s.notifDot} />
            </Pressable>
            <View style={s.avatar}><Text style={s.avatarTxt}>P</Text></View>
          </View>
        </View>
        <View style={s.mastheadRule} />
      </SafeAreaView>

      <Animated.ScrollView
        style={{ opacity: fade, transform: [{ translateY: slide }] }}
        showsVerticalScrollIndicator={false}
      >

        {/* ════════════════════════════════════════
            POSTER HERO — full-width magazine cover
            ════════════════════════════════════════ */}
        <View style={s.poster}>
          {/* Background — uses first designer cover or dark editorial */}
          {isReal(designers[0]?.coverImage) ? (
            <Image
              source={{ uri: designers[0].coverImage }}
              style={s.posterBg}
              contentFit="cover"
              transition={400}
            />
          ) : isReal(designs[0]?.images?.[0]) ? (
            <Image
              source={{ uri: designs[0].images[0] }}
              style={s.posterBg}
              contentFit="cover"
              transition={400}
            />
          ) : (
            <View style={[s.posterBg, { backgroundColor: '#1A1A1E' }]}>
              {/* Grid lines for editorial dark poster */}
              {[0.25, 0.5, 0.75].map(f => (
                <View key={`h${f}`} style={{ position: 'absolute', left: 0, right: 0, top: 420 * f, height: 0.5, backgroundColor: 'rgba(255,255,255,0.06)' }} />
              ))}
              {[0.33, 0.66].map(f => (
                <View key={`v${f}`} style={{ position: 'absolute', top: 0, bottom: 0, left: width * f, width: 0.5, backgroundColor: 'rgba(255,255,255,0.06)' }} />
              ))}
            </View>
          )}

          {/* Dark gradient overlay */}
          <View style={s.posterOverlay} />

          {/* Poster content */}
          <View style={s.posterContent}>
            {/* Top tag */}
            <View style={s.posterTag}>
              <Zap size={10} color={Colors.warnText} fill={Colors.warnText} />
              <Text style={s.posterTagTxt}>Now in Hyderabad</Text>
            </View>

            {/* Main headline */}
            <Text style={s.posterHeadline}>Your city,{'\n'}your craftsmen.</Text>

            {/* Sub line */}
            <Text style={s.posterSub}>Stitching · Maggam · Dyeing · Design</Text>

            {/* Stats row */}
            <View style={s.posterStats}>
              <View style={s.posterStat}>
                <Text style={s.posterStatVal}>{designers.length}</Text>
                <Text style={s.posterStatKey}>Designers</Text>
              </View>
              <View style={s.posterStatSep} />
              <View style={s.posterStat}>
                <Text style={s.posterStatVal}>{designs.length}</Text>
                <Text style={s.posterStatKey}>Designs</Text>
              </View>
              <View style={s.posterStatSep} />
              <View style={s.posterStat}>
                <Text style={s.posterStatVal}>{openPosts.length}</Text>
                <Text style={s.posterStatKey}>Open requests</Text>
              </View>
            </View>

            {/* CTA buttons */}
            <View style={s.posterCtaRow}>
              <Pressable
                style={s.posterCtaPrimary}
                onPress={() => router.push('/(tabs)/stitching/designers')}
              >
                <Text style={s.posterCtaPrimaryTxt}>Browse designers</Text>
                <ArrowUpRight size={14} color={Colors.ink} />
              </Pressable>
              <Pressable
                style={s.posterCtaSecondary}
                onPress={() => router.push('/post-request' as any)}
              >
                <Text style={s.posterCtaSecondaryTxt}>Post a request</Text>
              </Pressable>
            </View>
          </View>

          {/* Issue marker top-right */}
          <View style={s.posterIssue}>
            <Text style={s.posterIssueTxt}>VOL.01</Text>
          </View>
        </View>

        {/* ════════════════════════════════
            SERVICES
            ════════════════════════════ */}
        <View style={s.sectionHead}>
          <Text style={s.rule}>——</Text>
          <Text style={s.sectionLabel}>SERVICES</Text>
          <Text style={s.rule}>——</Text>
        </View>

        <View style={s.servicesGrid}>
          {SERVICES.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <Pressable
                key={svc.id}
                style={({ pressed }) => [s.svcCard, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
                onPress={() => router.push(svc.route as any)}
              >
                <View style={[s.svcIcon, { backgroundColor: svc.bgColor }]}>
                  <Icon size={24} color={svc.color} />
                </View>
                <Text style={s.svcTitle}>{svc.title}</Text>
                <Text style={s.svcSub}>{svc.subtitle}</Text>
                <Text style={s.svcNum}>0{i + 1}</Text>
                <View style={s.svcArrow}>
                  <ArrowUpRight size={12} color={Colors.textLight} />
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* ════════════════════════════════
            FEATURED DESIGNERS
            ════════════════════════════ */}
        {designers.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeadRow}>
              <View style={{ flexDirection: 'row' as const, alignItems: 'center', gap: 8 }}>
                <CheckCircle size={14} color={Colors.successText} />
                <Text style={s.sectionTitle}>Featured designers</Text>
              </View>
              <Pressable onPress={() => router.push('/(tabs)/stitching/designers')}>
                <Text style={s.seeAll}>See all →</Text>
              </Pressable>
            </View>

            <FlatList
              data={designers.slice(0, 5)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hStrip}
              keyExtractor={d => d.id}
              renderItem={({ item: d }) => (
                <Pressable
                  style={({ pressed }) => [s.designerCard, pressed && { opacity: 0.9 }]}
                  onPress={() => router.push(`/designer/${d.id}`)}
                >
                  <DesignerCover uri={d.coverImage} name={d.name} height={140} width={DESIGNER_CARD_W} />

                  {/* Info panel */}
                  <View style={s.designerPanel}>
                    <View style={s.designerPanelTop}>
                      <View style={s.designerAvatarRing}>
                        <AvatarView uri={d.avatar} name={d.name} size={32} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.designerName} numberOfLines={1}>{d.name}</Text>
                        <Text style={s.designerSpec} numberOfLines={1}>{d.speciality}</Text>
                      </View>
                      {d.verified && (
                        <CheckCircle size={12} color={Colors.successText} />
                      )}
                    </View>
                    <View style={s.designerMeta}>
                      <Star size={10} color={Colors.star} fill={Colors.star} />
                      <Text style={s.designerRating}>{d.rating?.toFixed(1)}</Text>
                      <View style={s.designerMetaDot} />
                      <MapPin size={10} color={Colors.textLight} />
                      <Text style={s.designerLoc} numberOfLines={1}>{d.location}</Text>
                    </View>
                  </View>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* ════════════════════════════════
            TRENDING DESIGNS
            ════════════════════════════ */}
        {showcaseDesigns.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeadRow}>
              <View style={{ flexDirection: 'row' as const, alignItems: 'center', gap: 8 }}>
                <Zap size={14} color="#E24B4A" fill="#E24B4A" />
                <Text style={s.sectionTitle}>
                  {trendingDesigns.length > 0 ? 'Trending designs' : 'Latest designs'}
                </Text>
              </View>
              <Pressable onPress={() => router.push('/(tabs)/stitching/designs')}>
                <Text style={s.seeAll}>See all →</Text>
              </Pressable>
            </View>

            <FlatList
              data={showcaseDesigns}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.hStrip}
              keyExtractor={d => d.id}
              renderItem={({ item: d }) => (
                <Pressable
                  style={({ pressed }) => [s.designCard, pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] }]}
                  onPress={() => router.push(`/design/${d.id}`)}
                >
                  <View style={s.designImgWrap}>
                    <Image
                      source={{ uri: d.images?.[0] }}
                      style={{ width: '100%', height: '100%' }}
                      contentFit="cover"
                      transition={200}
                    />
                    {d.isTrending && (
                      <View style={s.designTrendBadge}>
                        <Zap size={8} fill="#fff" color="#fff" />
                      </View>
                    )}
                    <View style={s.designPriceOverlay}>
                      <Text style={s.designPriceTxt}>{d.currency}{d.price?.toLocaleString()}</Text>
                    </View>
                  </View>
                  <View style={s.designCaption}>
                    <Text style={s.designTitle} numberOfLines={1}>{d.title}</Text>
                    <Text style={s.designDesigner} numberOfLines={1}>{d.designerName}</Text>
                  </View>
                </Pressable>
              )}
            />
          </View>
        )}

        {/* ════════════════════════════════
            OPEN REQUESTS
            ════════════════════════════ */}
        <View style={s.section}>
          <View style={s.sectionHeadRow}>
            <View style={{ flexDirection: 'row' as const, alignItems: 'center', gap: 8 }}>
              <Text style={s.rule}>——</Text>
              <Text style={s.sectionLabel}>OPEN REQUESTS</Text>
            </View>
            <Pressable onPress={() => router.push('/(tabs)/stitching/designers' as any)}>
              <Text style={s.seeAll}>See all →</Text>
            </Pressable>
          </View>

          <View style={s.maskedNote}>
            <Sparkles size={11} color={Colors.maskedText} />
            <Text style={s.maskedNoteTxt}>Tailor identities hidden until you connect</Text>
          </View>

          {openPosts.slice(0, 3).map((req, i) => (
            <Pressable
              key={req.id}
              style={({ pressed }) => [s.postCard, pressed && { opacity: 0.9 }]}
              onPress={() => router.push(`/stitching-request/${req.id}`)}
            >
              <View style={s.postNumCol}>
                <Text style={s.postNum}>№{String(i + 1).padStart(2, '0')}</Text>
              </View>
              <View style={s.postBody}>
                <View style={s.postTopRow}>
                  <View style={s.postTypePill}>
                    <Scissors size={10} color={Colors.maskedText} />
                    <Text style={s.postTypeTxt}>{req.outfitType}</Text>
                  </View>
                  <View style={s.postBidPill}>
                    <Text style={s.postBidTxt}>{req.bids.length} bids</Text>
                  </View>
                </View>
                <Text style={s.postTitle} numberOfLines={1}>{req.title}</Text>
                <Text style={s.postDesc}  numberOfLines={2}>{req.description}</Text>
                <View style={s.postFooter}>
                  <Text style={s.postBudget}>₹{req.budget.toLocaleString()}</Text>
                  {req.deadline && (
                    <View style={s.deadlineRow}>
                      <Clock size={10} color={Colors.textLight} />
                      <Text style={s.deadlineTxt}>By {req.deadline}</Text>
                    </View>
                  )}
                  <View style={s.postArrow}>
                    <ArrowUpRight size={12} color={Colors.text} />
                  </View>
                </View>
              </View>
            </Pressable>
          ))}

          {openPosts.length === 0 && (
            <View style={s.emptyPosts}>
              <Text style={s.emptyTxt}>No open requests yet</Text>
            </View>
          )}
        </View>

        {/* ════════════════════════════════
            POST CTA
            ════════════════════════════ */}
        <Pressable
          style={({ pressed }) => [s.cta, pressed && { opacity: 0.92 }]}
          onPress={() => router.push('/post-request' as any)}
        >
          <View style={s.ctaLeft}>
            <Text style={s.ctaEyebrow}>POST A REQUEST</Text>
            <Text style={s.ctaHeadline}>Need something{'\n'}tailored?</Text>
            <Text style={s.ctaBody}>Share your requirements and receive bids from verified tailors nearby.</Text>
          </View>
          <View style={s.ctaCircle}>
            <ArrowUpRight size={22} color="#fff" />
          </View>
        </Pressable>

        <View style={{ height: 56 }} />
      </Animated.ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  safeTop: { backgroundColor: Colors.surface },

  // ── Header ──
  header: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
  },
  brandMark: { fontSize: 17, fontWeight: '900' as const, color: Colors.text, letterSpacing: 5 },
  locRow: { flexDirection: 'row' as const, alignItems: 'center', gap: 4, marginTop: 2 },
  locTxt: { fontSize: 10, color: Colors.textLight, fontWeight: '500' as const },
  headerRight: { flexDirection: 'row' as const, alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 0.5, borderColor: Colors.border,
  },
  notifDot: {
    position: 'absolute' as const, top: 7, right: 7,
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: Colors.dangerText,
    borderWidth: 1.5, borderColor: Colors.surface,
  },
  avatar: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: Colors.maskedBg,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarTxt: { fontSize: 13, fontWeight: '700' as const, color: Colors.maskedText },
  mastheadRule: { height: 2, backgroundColor: Colors.ink },

  // ── Poster hero ──
  poster: {
    width: '100%',
    height: 420,
    position: 'relative' as const,
    backgroundColor: '#1A1A1E',
    overflow: 'hidden',
  },
  posterBg: {
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
  },
  posterOverlay: {
    position: 'absolute' as const,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  posterContent: {
    position: 'absolute' as const,
    bottom: 0, left: 0, right: 0,
    padding: 24,
    paddingBottom: 28,
    gap: 12,
  },
  posterTag: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.warnBg,
    alignSelf: 'flex-start' as const,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  posterTagTxt: { fontSize: 11, fontWeight: '700' as const, color: Colors.warnText },
  posterHeadline: {
    fontSize: 38,
    fontWeight: '900' as const,
    color: '#fff',
    letterSpacing: -1.5,
    lineHeight: 42,
  },
  posterSub: { fontSize: 13, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.3 },
  posterStats: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 0,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    paddingVertical: 10,
  },
  posterStat: { flex: 1, alignItems: 'center' as const, gap: 2 },
  posterStatVal: { fontSize: 18, fontWeight: '900' as const, color: '#fff', letterSpacing: -0.5 },
  posterStatKey: { fontSize: 9, color: 'rgba(255,255,255,0.45)', fontWeight: '600' as const, letterSpacing: 0.5 },
  posterStatSep: { width: 0.5, height: 28, backgroundColor: 'rgba(255,255,255,0.15)' },
  posterCtaRow: { flexDirection: 'row' as const, gap: 10, marginTop: 4 },
  posterCtaPrimary: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 24,
  },
  posterCtaPrimaryTxt: { fontSize: 14, fontWeight: '700' as const, color: Colors.ink },
  posterCtaSecondary: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  posterCtaSecondaryTxt: { fontSize: 14, fontWeight: '600' as const, color: '#fff' },
  posterIssue: {
    position: 'absolute' as const,
    top: 16, right: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  posterIssueTxt: { fontSize: 8, fontWeight: '800' as const, color: 'rgba(255,255,255,0.5)', letterSpacing: 2 },

  // ── Section heads ──
  sectionHead: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 16,
  },
  sectionHeadRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  rule: { fontSize: 10, color: Colors.border, letterSpacing: 1 },
  sectionLabel: { fontSize: 9, fontWeight: '800' as const, color: Colors.textLight, letterSpacing: 3 },
  sectionTitle: { fontSize: 19, fontWeight: '800' as const, color: Colors.text, letterSpacing: -0.4 },
  seeAll: { fontSize: 12, color: Colors.maskedText, fontWeight: '700' as const },
  section: { marginTop: 28 },
  hStrip: { paddingHorizontal: 20, gap: 14 },

  // ── Services grid ──
  servicesGrid: {
    flexDirection: 'row' as const,
    paddingHorizontal: 16,
    gap: 10,
  },
  svcCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.border,
    padding: 0,
  },
  svcIcon: {
    height: 76,
    justifyContent: 'center',
    alignItems: 'center',
  },
  svcTitle: { fontSize: 12, fontWeight: '800' as const, color: Colors.text, paddingHorizontal: 10, paddingTop: 8, letterSpacing: -0.2 },
  svcSub: { fontSize: 9, color: Colors.textLight, paddingHorizontal: 10, paddingBottom: 10, lineHeight: 13 },
  svcNum: {
    position: 'absolute' as const, top: 7, right: 9,
    fontSize: 8, fontWeight: '700' as const, color: 'rgba(0,0,0,0.15)', letterSpacing: 1,
  },
  svcArrow: {
    position: 'absolute' as const, bottom: 10, right: 10,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.inkFaint,
    justifyContent: 'center', alignItems: 'center',
  },

  // ── Designer cards ──
  designerCard: {
    width: DESIGNER_CARD_W,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  designerPanel: {
    padding: 12,
    gap: 6,
  },
  designerPanelTop: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 8,
  },
  designerAvatarRing: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  designerName: { fontSize: 13, fontWeight: '700' as const, color: Colors.text, letterSpacing: -0.2 },
  designerSpec: { fontSize: 10, color: Colors.textSecondary },
  designerMeta: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 4,
  },
  designerRating: { fontSize: 11, fontWeight: '700' as const, color: Colors.text },
  designerMetaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.border },
  designerLoc: { fontSize: 10, color: Colors.textLight, flex: 1 },

  // ── Design cards ──
  designCard: {
    width: DESIGN_CARD_W,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  designImgWrap: {
    width: DESIGN_CARD_W,
    height: DESIGN_CARD_W * 1.3,
    backgroundColor: Colors.surfaceAlt,
    position: 'relative' as const,
  },
  designTrendBadge: {
    position: 'absolute' as const, top: 8, left: 8,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#E24B4A',
    justifyContent: 'center', alignItems: 'center',
  },
  designPriceOverlay: {
    position: 'absolute' as const, bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(17,17,17,0.6)',
    paddingHorizontal: 10, paddingVertical: 5,
  },
  designPriceTxt: { fontSize: 13, fontWeight: '800' as const, color: '#fff' },
  designCaption: { padding: 10, gap: 2 },
  designTitle: { fontSize: 12, fontWeight: '700' as const, color: Colors.text },
  designDesigner: { fontSize: 10, color: Colors.textSecondary },

  // ── Open requests ──
  maskedNote: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 7,
    backgroundColor: Colors.maskedBg,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 20,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: Colors.maskedBorder,
  },
  maskedNoteTxt: { fontSize: 11, color: Colors.maskedText, fontWeight: '500' as const },
  postCard: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  postNumCol: {
    width: 38, backgroundColor: Colors.inkFaint,
    borderRightWidth: 0.5, borderRightColor: Colors.border,
    justifyContent: 'flex-start' as const, alignItems: 'center', paddingTop: 16,
  },
  postNum: { fontSize: 8, fontWeight: '800' as const, color: Colors.textLight, letterSpacing: 1.5 },
  postBody: { flex: 1, padding: 14, gap: 6 },
  postTopRow: { flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center' },
  postTypePill: {
    flexDirection: 'row' as const, alignItems: 'center', gap: 5,
    backgroundColor: Colors.maskedBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5,
  },
  postTypeTxt: { fontSize: 10, fontWeight: '600' as const, color: Colors.maskedText },
  postBidPill: { backgroundColor: Colors.successBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  postBidTxt: { fontSize: 10, fontWeight: '600' as const, color: Colors.successText },
  postTitle: { fontSize: 14, fontWeight: '700' as const, color: Colors.text, letterSpacing: -0.2 },
  postDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },
  postFooter: {
    flexDirection: 'row' as const, alignItems: 'center', gap: 8,
    paddingTop: 8, borderTopWidth: 0.5, borderTopColor: Colors.borderLight,
  },
  postBudget: { fontSize: 15, fontWeight: '800' as const, color: Colors.text, flex: 1, letterSpacing: -0.3 },
  deadlineRow: { flexDirection: 'row' as const, alignItems: 'center', gap: 4 },
  deadlineTxt: { fontSize: 11, color: Colors.textLight },
  postArrow: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: Colors.inkFaint, borderWidth: 0.5, borderColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  emptyPosts: { paddingVertical: 32, alignItems: 'center' as const, marginHorizontal: 20 },
  emptyTxt: { fontSize: 14, color: Colors.textLight, fontWeight: '500' as const },

  // ── CTA ──
  cta: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.ink,
    marginHorizontal: 20, marginTop: 28,
    borderRadius: 20, padding: 24,
    alignItems: 'center', gap: 16,
  },
  ctaLeft: { flex: 1, gap: 5 },
  ctaEyebrow: { fontSize: 8, fontWeight: '800' as const, color: 'rgba(255,255,255,0.35)', letterSpacing: 3 },
  ctaHeadline: { fontSize: 22, fontWeight: '900' as const, color: '#fff', letterSpacing: -0.5, lineHeight: 26 },
  ctaBody: { fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 17 },
  ctaCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
});
