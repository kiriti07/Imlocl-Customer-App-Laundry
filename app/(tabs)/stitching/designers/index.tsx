// app/(tabs)/stitching/designers/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Filter, Users, Star, MapPin } from 'lucide-react-native';
import { Image } from 'expo-image';

import Colors from '@/constants/colors';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const API_BASE_URL = "http://localhost:8080/api";

const categories = [
  { id: 'all', label: 'All', icon: '👗' },
  { id: 'bridal', label: 'Bridal', icon: '👰' },
  { id: 'women', label: "Women's", icon: '👚' },
  { id: 'men', label: "Men's", icon: '👔' },
  { id: 'kids', label: 'Kids', icon: '🧸' },
  { id: 'formal', label: 'Formal', icon: '💼' },
  { id: 'casual', label: 'Casual', icon: '👕' },
];

export default function DesignersScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/designers`);
      const data = await response.json();
      setDesigners(data.designers || []);
    } catch (error) {
      console.error('Error fetching designers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDesigners = designers.filter((designer: any) => {
    const matchesSearch = !searchQuery ||
      designer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designer.speciality.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' ||
      designer.tags?.some((tag: string) => 
        tag.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    
    return matchesSearch && matchesCategory;
  });

  const renderCategoryItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemActive,
        pressed && styles.categoryItemPressed,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={[
        styles.categoryLabel,
        selectedCategory === item.id && styles.categoryLabelActive,
      ]}>
        {item.label}
      </Text>
      {selectedCategory === item.id && (
        <View style={styles.categoryActiveIndicator} />
      )}
    </Pressable>
  );

  const renderDesignerCard = ({ item }) => (
    <Pressable
      style={({ pressed }) => [
        styles.designerCard,
        pressed && styles.designerCardPressed,
      ]}
      onPress={() => router.push(`/designer/${item.id}`)}
    >
      <Image source={{ uri: item.avatar }} style={styles.designerAvatar} />
      <View style={styles.designerInfo}>
        <View style={styles.designerHeader}>
          <Text style={styles.designerName}>{item.name}</Text>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.designerSpeciality}>{item.speciality}</Text>
        
        <View style={styles.designerMeta}>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#FFB800" fill="#FFB800" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <View style={styles.dot} />
          <MapPin size={12} color={Colors.textLight} />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>

        <View style={styles.designerTags}>
          {item.tags?.slice(0, 3).map((tag: string, index: number) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Designers</Text>
          <Text style={styles.subtitle}>Discover talented creators</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textLight} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or specialty..."
          placeholderTextColor={Colors.textLight}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        )}
      </View>

      {/* Categories */}
      <View style={styles.categoriesWrapper}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredDesigners.length} designer{filteredDesigners.length !== 1 ? 's' : ''} found
        </Text>
        <Pressable style={styles.filterButton}>
          <Filter size={18} color={Colors.text} />
          <Text style={styles.filterText}>Filter</Text>
        </Pressable>
      </View>

      {/* Designers Grid */}
      {filteredDesigners.length > 0 ? (
        <FlatList
          data={filteredDesigners}
          renderItem={renderDesignerCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.designersList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Users size={60} color={Colors.textLight} />
          <Text style={styles.emptyTitle}>No designers found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#666666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    marginLeft: 10,
    padding: 0,
  },
  clearText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  categoriesWrapper: {
    marginBottom: 16,
  },
  categoriesList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    flexDirection: 'row',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryItemPressed: {
    transform: [{ scale: 0.96 }],
  },
  categoryIcon: {
    fontSize: 16,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  categoryLabelActive: {
    color: '#FFFFFF',
  },
  categoryActiveIndicator: {
    position: 'absolute',
    bottom: -4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  designersList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  designerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  designerCardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  designerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    marginRight: 16,
  },
  designerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  designerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  designerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  designerSpeciality: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 6,
  },
  designerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#DDDDDD',
  },
  locationText: {
    fontSize: 12,
    color: '#999999',
  },
  designerTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 11,
    color: '#666666',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    lineHeight: 20,
  },
});