// components/designer/DesignerCard.tsx
import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { MapPin, ArrowUpRight, CheckCircle } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface DesignerCardProps {
  designer: {
    id: string;
    name: string;
    avatar: string;
    coverImage?: string;
    speciality: string;
    rating: number;
    reviewCount: number;
    location: string;
    verified: boolean;
    tags?: string[];
    designCount?: number;
    experience?: string;
  };
  variant?: 'editorial' | 'horizontal' | 'featured';
  index?: number;
}

const COVER_PALETTES = [
  { bg: '#1C1C1E', accent: '#3C3C3E' },
  { bg: '#1A1F2E', accent: '#2A2F4E' },
  { bg: '#1E1A14', accent: '#3E3428' },
  { bg: '#14201A', accent: '#243830' },
  { bg: '#1E1420', accent: '#3E2840' },
  { bg: '#201414', accent: '#402828' },
  { bg: '#141420', accent: '#282840' },
  { bg: '#1A1A14', accent: '#323228' },
];

const AVATAR_SWATCHES = [
  { bg: '#FDF6E3', fg: '#9B6914' },
  { bg: '#E8F5E9', fg: '#2E7D32' },
  { bg: '#EDE7F6', fg: '#512DA8' },
  { bg: '#FCE4EC', fg: '#AD1457' },
  { bg: '#E3F2FD', fg: '#1565C0' },
  { bg: '#FFF8E1', fg: '#F57F17' },
  { bg: '#E0F2F1', fg: '#00695C' },
  { bg: '#F3E5F5', fg: '#7B1FA2' },
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

function AvatarView({ uri, name, size }: { uri: string; name: string; size: number }) {
  const sw = AVATAR_SWATCHES[hash(name) % AVATAR_SWATCHES.length];
  if (isReal(uri)) {
    return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2 }} contentFit="cover" transition={200} />;
  }
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: sw.bg, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: size * 0.33, fontWeight: '700', color: sw.fg }}>{initials(name)}</Text>
    </View>
  );
}

function CoverBanner({ uri, name, height }: { uri?: string; name: string; height: number }) {
  const pal = COVER_PALETTES[hash(name) % COVER_PALETTES.length];
  if (isReal(uri)) {
    return (
      <View style={{ width: '100%', height, overflow: 'hidden' }}>
        <Image source={{ uri }} style={{ width: '100%', height }} contentFit="cover" transition={300} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.45, backgroundColor: 'rgba(0,0,0,0.4)' }} />
      </View>
    );
  }
  return (
    <View style={{ width: '100%', height, backgroundColor: pal.bg, overflow: 'hidden' }}>
      {/* Editorial grid lines */}
      {[0.3, 0.6].map(f => (
        <View key={`h${f}`} style={{ position: 'absolute', left: 0, right: 0, top: height * f, height: 0.5, backgroundColor: pal.accent }} />
      ))}
      {[0.35, 0.7].map(f => (
        <View key={`v${f}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${f * 100}%` as any, width: 0.5, backgroundColor: pal.accent }} />
      ))}
      {/* Big initials watermark */}
      <Text style={{ position: 'absolute', right: 12, bottom: 6, fontSize: 80, fontWeight: '900', color: 'rgba(255,255,255,0.07)', letterSpacing: -6 }}>{initials(name)}</Text>
      {/* IMLOCL brand mark */}
      <Text style={{ position: 'absolute', left: 14, top: 13, fontSize: 8, fontWeight: '800', color: 'rgba(255,255,255,0.4)', letterSpacing: 3.5 }}>IMLOCL</Text>
      <View style={{ position: 'absolute', left: 14, top: 25, width: 20, height: 1, backgroundColor: 'rgba(255,255,255,0.25)' }} />
    </View>
  );
}

// ── Editorial card (default) ──────────────────────────────────────────────────
export function EditorialCard({ designer, index = 0 }: { designer: DesignerCardProps['designer']; index?: number }) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;

  const press = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.975, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start(() => router.push(`/designer/${designer.id}`));
  };

  return (
    <Pressable onPress={press}>
      <Animated.View style={[s.editCard, { transform: [{ scale }] }]}>
        <CoverBanner uri={designer.coverImage} name={designer.name} height={136} />

        {/* Issue-number row */}
        <View style={s.issueRow}>
          <Text style={s.issueNum}>№{String(index + 1).padStart(2, '0')}</Text>
          <View style={s.issueLine} />
          {designer.verified && (
            <View style={s.verifiedChip}>
              <CheckCircle size={9} color={Colors.successText} />
              <Text style={s.verifiedLabel}>Verified</Text>
            </View>
          )}
        </View>

        {/* Avatar + name */}
        <View style={s.identityRow}>
          <View style={s.avatarFrame}>
            <AvatarView uri={designer.avatar} name={designer.name} size={52} />
          </View>
          <View style={s.nameBlock}>
            <Text style={s.designerName} numberOfLines={1}>{designer.name}</Text>
            <Text style={s.speciality}>{designer.speciality}</Text>
          </View>
          <View style={s.arrowBtn}>
            <ArrowUpRight size={15} color={Colors.text} />
          </View>
        </View>

        {/* Stats rule */}
        <View style={s.rule} />
        <View style={s.statsRow}>
          <View style={s.stat}>
            <Text style={s.statVal}>{designer.rating.toFixed(1)}</Text>
            <Text style={s.statKey}>RATING</Text>
          </View>
          <View style={s.statSep} />
          <View style={s.stat}>
            <Text style={s.statVal}>{designer.designCount ?? 0}</Text>
            <Text style={s.statKey}>DESIGNS</Text>
          </View>
          <View style={s.statSep} />
          <View style={[s.stat, { flex: 1, alignItems: 'flex-start' as const }]}>
            <View style={{ flexDirection: 'row' as const, alignItems: 'center', gap: 3 }}>
              <MapPin size={10} color={Colors.textLight} />
              <Text style={s.statVal} numberOfLines={1}>{designer.location}</Text>
            </View>
            <Text style={s.statKey}>CITY</Text>
          </View>
        </View>

        {/* Tags */}
        {(designer.tags ?? []).length > 0 && (
          <View style={s.tagsWrap}>
            {(designer.tags ?? []).slice(0, 4).map((tag, i) => (
              <View key={i} style={[s.tag, i === 0 && s.tagHighlight]}>
                <Text style={[s.tagTxt, i === 0 && s.tagTxtHighlight]}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

// ── Horizontal list card ──────────────────────────────────────────────────────
export function HorizontalCard({ designer, index = 0 }: { designer: DesignerCardProps['designer']; index?: number }) {
  const router = useRouter();
  return (
    <Pressable style={({ pressed }) => [s.hCard, pressed && { opacity: 0.88 }]} onPress={() => router.push(`/designer/${designer.id}`)}>
      <Text style={s.hIdx}>{String(index + 1).padStart(2, '0')}</Text>
      <View style={{ position: 'relative' as const }}>
        <AvatarView uri={designer.avatar} name={designer.name} size={48} />
        {designer.verified && (
          <View style={s.hVerDot}>
            <CheckCircle size={8} color={Colors.successText} />
          </View>
        )}
      </View>
      <View style={s.hInfo}>
        <Text style={s.hName} numberOfLines={1}>{designer.name}</Text>
        <Text style={s.hSpec}>{designer.speciality}</Text>
        <View style={{ flexDirection: 'row' as const, gap: 6, alignItems: 'center', marginTop: 2 }}>
          <Text style={s.hRating}>★ {designer.rating.toFixed(1)}</Text>
          <Text style={{ color: Colors.border }}>·</Text>
          <Text style={s.hLoc} numberOfLines={1}>{designer.location}</Text>
        </View>
      </View>
      <View style={s.hRight}>
        {(designer.tags ?? []).slice(0, 1).map((t, i) => (
          <View key={i} style={s.hTag}><Text style={s.hTagTxt}>{t}</Text></View>
        ))}
        <ArrowUpRight size={13} color={Colors.textLight} />
      </View>
    </Pressable>
  );
}

// ── Featured hero card ────────────────────────────────────────────────────────
export function FeaturedDesignerCard({ designer }: { designer: DesignerCardProps['designer'] }) {
  const router = useRouter();
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.timing(scale, { toValue: 0.98, duration: 100, useNativeDriver: true }).start(() => {
      Animated.timing(scale, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      router.push(`/designer/${designer.id}`);
    });
  };
  return (
    <Pressable onPress={press}>
      <Animated.View style={[s.featCard, { transform: [{ scale }] }]}>
        <CoverBanner uri={designer.coverImage} name={designer.name} height={200} />
        <View style={s.featPanel}>
          <View style={s.featTop}>
            <View style={s.featAvatarRing}>
              <AvatarView uri={designer.avatar} name={designer.name} size={42} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.featLabel}>FEATURED DESIGNER</Text>
              <Text style={s.featName} numberOfLines={1}>{designer.name}</Text>
            </View>
            {designer.verified && (
              <View style={s.featVerif}>
                <CheckCircle size={9} color={Colors.successText} />
                <Text style={s.featVerifTxt}>Verified</Text>
              </View>
            )}
          </View>
          <View style={s.rule} />
          <View style={{ flexDirection: 'row' as const, alignItems: 'center', gap: 8 }}>
            <Text style={s.featSpec}>{designer.speciality}</Text>
            <Text style={{ color: Colors.border }}>·</Text>
            <MapPin size={10} color={Colors.textLight} />
            <Text style={s.hLoc}>{designer.location}</Text>
            <Text style={[s.hRating, { marginLeft: 'auto' as const }]}>★ {designer.rating.toFixed(1)}</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export default function DesignerCard({ designer, variant = 'editorial', index = 0 }: DesignerCardProps) {
  if (variant === 'horizontal') return <HorizontalCard designer={designer} index={index} />;
  if (variant === 'featured')   return <FeaturedDesignerCard designer={designer} />;
  return <EditorialCard designer={designer} index={index} />;
}

const s = StyleSheet.create({
  editCard: {
    backgroundColor: Colors.surface,
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 18,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  issueRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
  },
  issueNum: {
    fontSize: 9,
    fontWeight: '800' as const,
    color: Colors.textLight,
    letterSpacing: 2,
  },
  issueLine: { flex: 1, height: 0.5, backgroundColor: Colors.border },
  verifiedChip: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  verifiedLabel: { fontSize: 9, fontWeight: '700' as const, color: Colors.successText },
  identityRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 12,
  },
  avatarFrame: {
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  nameBlock: { flex: 1, gap: 3 },
  designerName: {
    fontSize: 19,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  speciality: { fontSize: 12, color: Colors.textSecondary },
  arrowBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.inkFaint,
    borderWidth: 0.5,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rule: { height: 0.5, backgroundColor: Colors.border, marginHorizontal: 16 },
  statsRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  stat: { alignItems: 'center' as const, paddingHorizontal: 14, gap: 2 },
  statVal: { fontSize: 15, fontWeight: '800' as const, color: Colors.text, letterSpacing: -0.3 },
  statKey: { fontSize: 8, color: Colors.textLight, letterSpacing: 1.5, fontWeight: '700' as const },
  statSep: { width: 0.5, height: 28, backgroundColor: Colors.border },
  tagsWrap: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: 6,
    paddingHorizontal: 16,
    paddingBottom: 14,
    paddingTop: 2,
  },
  tag: {
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  tagHighlight: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  tagTxt: { fontSize: 11, fontWeight: '600' as const, color: Colors.textSecondary },
  tagTxtHighlight: { color: '#fff' },

  hCard: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: 12,
  },
  hIdx: { fontSize: 10, fontWeight: '800' as const, color: Colors.textLight, letterSpacing: 1.5, width: 20, textAlign: 'center' as const },
  hVerDot: {
    position: 'absolute' as const, bottom: 0, right: 0,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: Colors.successBg,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1.5, borderColor: Colors.surface,
  },
  hInfo: { flex: 1, gap: 2 },
  hName: { fontSize: 14, fontWeight: '700' as const, color: Colors.text, letterSpacing: -0.2 },
  hSpec: { fontSize: 11, color: Colors.textSecondary },
  hRating: { fontSize: 11, fontWeight: '700' as const, color: Colors.star },
  hLoc: { fontSize: 11, color: Colors.textLight, flex: 1 },
  hRight: { alignItems: 'flex-end' as const, gap: 5 },
  hTag: { backgroundColor: Colors.maskedBg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  hTagTxt: { fontSize: 10, color: Colors.maskedText, fontWeight: '600' as const },

  featCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginBottom: 20,
  },
  featPanel: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, gap: 10 },
  featTop: { flexDirection: 'row' as const, alignItems: 'center', gap: 12 },
  featAvatarRing: { borderRadius: 25, borderWidth: 2, borderColor: Colors.border, overflow: 'hidden' },
  featLabel: { fontSize: 7, fontWeight: '800' as const, color: Colors.textLight, letterSpacing: 3 },
  featName: { fontSize: 20, fontWeight: '800' as const, color: Colors.text, letterSpacing: -0.5, marginTop: 1 },
  featVerif: {
    flexDirection: 'row' as const, alignItems: 'center', gap: 4,
    backgroundColor: Colors.successBg, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20,
  },
  featVerifTxt: { fontSize: 10, fontWeight: '600' as const, color: Colors.successText },
  featSpec: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' as const },
});