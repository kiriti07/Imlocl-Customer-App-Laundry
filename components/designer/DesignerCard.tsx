// components/designer/DesignerCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Star, MapPin, BadgeCheck } from 'lucide-react-native';

import Colors from '@/constants/colors';

interface DesignerCardProps {
  designer: {
    id: string;
    name: string;
    avatar: string;
    speciality: string;
    rating: number;
    reviewCount: number;
    location: string;
    verified: boolean;
    tags?: string[];
  };
  variant?: 'default' | 'horizontal';
}

export default function DesignerCard({ designer, variant = 'default' }: DesignerCardProps) {
  const router = useRouter();

  if (variant === 'horizontal') {
    return (
      <Pressable
        style={styles.horizontalCard}
        onPress={() => router.push(`/designer/${designer.id}`)}
      >
        <Image source={{ uri: designer.avatar }} style={styles.horizontalAvatar} />
        <View style={styles.horizontalContent}>
          <View style={styles.horizontalNameRow}>
            <Text style={styles.horizontalName} numberOfLines={1}>{designer.name}</Text>
            {designer.verified && <BadgeCheck size={14} color={Colors.primary} />}
          </View>
          <Text style={styles.horizontalSpeciality}>{designer.speciality}</Text>
          <View style={styles.horizontalMeta}>
            <View style={styles.horizontalRating}>
              <Star size={12} color={Colors.star} fill={Colors.star} />
              <Text style={styles.horizontalRatingText}>{designer.rating}</Text>
            </View>
            <Text style={styles.horizontalDot}>·</Text>
            <MapPin size={12} color={Colors.textLight} />
            <Text style={styles.horizontalLocation} numberOfLines={1}>{designer.location}</Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/designer/${designer.id}`)}
    >
      <Image source={{ uri: designer.avatar }} style={styles.avatar} />
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{designer.name}</Text>
          {designer.verified && <BadgeCheck size={14} color={Colors.primary} />}
        </View>
        <Text style={styles.speciality} numberOfLines={1}>{designer.speciality}</Text>
        <View style={styles.meta}>
          <Star size={12} color={Colors.star} fill={Colors.star} />
          <Text style={styles.rating}>{designer.rating}</Text>
          <Text style={styles.reviews}>({designer.reviewCount})</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 140,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  info: {
    alignItems: 'center',
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  speciality: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  reviews: {
    fontSize: 11,
    color: Colors.textLight,
  },
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  horizontalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  horizontalContent: {
    flex: 1,
    gap: 4,
  },
  horizontalNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  horizontalName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  horizontalSpeciality: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  horizontalMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  horizontalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  horizontalRatingText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  horizontalDot: {
    color: Colors.textLight,
  },
  horizontalLocation: {
    fontSize: 12,
    color: Colors.textLight,
    flex: 1,
  },
});