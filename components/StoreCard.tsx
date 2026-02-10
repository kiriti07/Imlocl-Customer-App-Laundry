import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Star, Clock, MapPin } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface StoreCardProps {
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  distance: string;
  deliveryTime: string;
  tags: string[];
  isOpen: boolean;
  onPress: () => void;
  accentColor?: string;
}

export default React.memo(function StoreCard({
  name,
  image,
  rating,
  reviewCount,
  distance,
  deliveryTime,
  tags,
  isOpen,
  onPress,
  accentColor = Colors.primary,
}: StoreCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      testID="store-card"
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} contentFit="cover" />
        {!isOpen && (
          <View style={styles.closedOverlay}>
            <Text style={styles.closedText}>Closed</Text>
          </View>
        )}
        <View style={[styles.ratingBadge, { backgroundColor: accentColor }]}>
          <Star size={12} color="#FFF" fill="#FFF" />
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{distance}</Text>
          </View>
          <View style={styles.dot} />
          <View style={styles.metaItem}>
            <Clock size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText}>{deliveryTime}</Text>
          </View>
          <View style={styles.dot} />
          <Text style={styles.reviewText}>{reviewCount} reviews</Text>
        </View>
        <View style={styles.tagsRow}>
          {tags.slice(0, 3).map((tag) => (
            <View key={tag} style={[styles.tag, { backgroundColor: accentColor + '15' }]}>
              <Text style={[styles.tagText, { color: accentColor }]}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  pressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  imageContainer: {
    height: 160,
    position: 'relative' as const,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700' as const,
  },
  ratingBadge: {
    position: 'absolute' as const,
    bottom: 10,
    left: 10,
    flexDirection: 'row' as const,
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700' as const,
  },
  content: {
    padding: 14,
  },
  name: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: Colors.textLight,
    marginHorizontal: 8,
  },
  reviewText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  tagsRow: {
    flexDirection: 'row' as const,
    gap: 6,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
});
