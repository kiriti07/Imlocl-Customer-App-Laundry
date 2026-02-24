// components/designer/DesignCard.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Heart, Eye } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { Design } from '@/types';

interface DesignCardProps {
  design: Design;
  variant?: 'featured' | 'compact' | 'default';
}

export default function DesignCard({ design, variant = 'default' }: DesignCardProps) {
  const router = useRouter();

  if (variant === 'featured') {
    return (
      <Pressable
        style={styles.featuredCard}
        onPress={() => router.push(`/design/${design.id}`)}
      >
        <Image source={{ uri: design.images[0] }} style={styles.featuredImage} />
        <View style={styles.featuredOverlay}>
          <Text style={styles.featuredTitle}>{design.title}</Text>
          <Text style={styles.featuredDesigner}>{design.designerName}</Text>
          <Text style={styles.featuredPrice}>{design.currency}{design.price}</Text>
        </View>
      </Pressable>
    );
  }

  if (variant === 'compact') {
    return (
      <Pressable
        style={styles.compactCard}
        onPress={() => router.push(`/design/${design.id}`)}
      >
        <Image source={{ uri: design.images[0] }} style={styles.compactImage} />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{design.title}</Text>
          <Text style={styles.compactDesigner} numberOfLines={1}>{design.designerName}</Text>
          <Text style={styles.compactPrice}>{design.currency}{design.price}</Text>
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push(`/design/${design.id}`)}
    >
      <Image source={{ uri: design.images[0] }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{design.title}</Text>
          <View style={styles.likes}>
            <Heart size={14} color={design.likes > 0 ? Colors.error : Colors.textLight} />
            <Text style={styles.likesText}>{design.likes}</Text>
          </View>
        </View>
        <Text style={styles.designer}>{design.designerName}</Text>
        <View style={styles.footer}>
          <Text style={styles.price}>{design.currency}{design.price}</Text>
          <View style={styles.views}>
            <Eye size={12} color={Colors.textLight} />
            <Text style={styles.viewsText}>{design.views}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: Colors.cardAlt,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  likes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  likesText: {
    fontSize: 11,
    color: Colors.textLight,
  },
  designer: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  views: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewsText: {
    fontSize: 11,
    color: Colors.textLight,
  },
  featuredCard: {
    width: 240,
    height: 300,
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 4,
  },
  featuredDesigner: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  featuredPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.white,
  },
  compactCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: 'hidden',
  },
  compactImage: {
    width: '100%',
    height: 160,
  },
  compactContent: {
    padding: 12,
  },
  compactTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  compactDesigner: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  compactPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
});