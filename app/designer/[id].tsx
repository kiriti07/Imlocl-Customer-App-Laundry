// app/designer/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Star,
  MapPin,
  BadgeCheck,
  Scissors,
  Clock,
  MessageCircle,
  Share2,
  ChevronRight,
  Grid,
  Heart,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';

import Colors from '@/constants/colors';
import { config } from '@/config';

const { width } = Dimensions.get('window');
const API_BASE_URL = config.apiUrl;

export default function DesignerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [designer, setDesigner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchDesigner();
  }, [id]);

  const fetchDesigner = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/public/designers/${id}`);
      const data = await response.json();
      setDesigner(data.designer);
      
      // Auto-select first category if available
      if (data.designer?.categories?.length > 0) {
        setSelectedCategory(data.designer.categories[0]);
        setExpandedCategory(data.designer.categories[0].id);
      }
    } catch (error) {
      console.error('Error fetching designer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: any) => {
    setSelectedCategory(category);
    setExpandedCategory(expandedCategory === category.id ? null : category.id);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryPress = (subcategory: any) => {
    setSelectedSubcategory(subcategory);
  };

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else {
      router.back();
    }
  };

  const handleGoHome = () => {
    router.push('/(tabs)/(home)');
  };

  const getHeaderTitle = () => {
    if (selectedSubcategory) return selectedSubcategory.name;
    if (selectedCategory) return selectedCategory.name;
    return designer?.name || 'Designer';
  };

  const renderHorizontalCategories = () => (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Shop by Category</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScrollContent}
      >
        {designer?.categories?.map((category: any) => (
          <Pressable
            key={category.id}
            style={({ pressed }) => [
              styles.categoryCard,
              selectedCategory?.id === category.id && styles.categoryCardActive,
              pressed && styles.categoryCardPressed,
            ]}
            onPress={() => handleCategoryPress(category)}
          >
            <Text style={[
              styles.categoryName,
              selectedCategory?.id === category.id && styles.categoryNameActive,
            ]}>
              {category.name}
            </Text>
            <View style={[
              styles.categoryBadge,
              selectedCategory?.id === category.id && styles.categoryBadgeActive,
            ]}>
              <Text style={[
                styles.categoryBadgeText,
                selectedCategory?.id === category.id && styles.categoryBadgeTextActive,
              ]}>
                {category.subcategories?.length || 0}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );

  const renderSubcategoriesDropdown = () => {
    if (!selectedCategory) return null;

    return (
      <View style={styles.subcategoriesSection}>
        <View style={styles.subcategoriesHeader}>
          <Text style={styles.subcategoriesTitle}>
            {selectedCategory.name} Subcategories
          </Text>
          <Pressable
            style={styles.expandAllButton}
            onPress={() => setExpandedCategory(expandedCategory === selectedCategory.id ? null : selectedCategory.id)}
          >
            <Text style={styles.expandAllText}>
              {expandedCategory === selectedCategory.id ? 'Collapse' : 'Expand'}
            </Text>
          </Pressable>
        </View>

        {/* Dropdown for selected category */}
        {expandedCategory === selectedCategory.id && (
          <View style={styles.dropdownContainer}>
            {selectedCategory.subcategories?.map((subcategory: any) => (
              <Pressable
                key={subcategory.id}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  selectedSubcategory?.id === subcategory.id && styles.dropdownItemActive,
                  pressed && styles.dropdownItemPressed,
                ]}
                onPress={() => handleSubcategoryPress(subcategory)}
              >
                <View style={styles.dropdownItemLeft}>
                  <Text style={[
                    styles.dropdownItemName,
                    selectedSubcategory?.id === subcategory.id && styles.dropdownItemNameActive,
                  ]}>
                    {subcategory.name}
                  </Text>
                </View>
                <View style={[
                  styles.dropdownItemBadge,
                  selectedSubcategory?.id === subcategory.id && styles.dropdownItemBadgeActive,
                ]}>
                  <Text style={[
                    styles.dropdownItemBadgeText,
                    selectedSubcategory?.id === subcategory.id && styles.dropdownItemBadgeTextActive,
                  ]}>
                    {subcategory.items?.length || 0}
                  </Text>
                </View>
                {selectedSubcategory?.id === subcategory.id && (
                  <ChevronRight size={16} color={Colors.white} />
                )}
              </Pressable>
            ))}

            {(!selectedCategory.subcategories || selectedCategory.subcategories.length === 0) && (
              <View style={styles.emptySubcategories}>
                <Text style={styles.emptySubcategoriesText}>No subcategories available</Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderItems = () => (
    <View style={styles.itemsContainer}>
      <View style={styles.itemsHeader}>
        <View>
          <Text style={styles.itemsHeaderCategory}>{selectedCategory?.name}</Text>
          <Text style={styles.itemsHeaderTitle}>{selectedSubcategory?.name}</Text>
        </View>
        <Text style={styles.itemsHeaderCount}>
          {selectedSubcategory?.items?.length || 0} items
        </Text>
      </View>
      <FlatList
        key="designer-grid"
        numColumns={2}
        data={Array.isArray(selectedSubcategory?.items) ? selectedSubcategory!.items : []}
        keyExtractor={(item, index) => String(item?.id ?? index)}
        columnWrapperStyle={styles.itemRow}
        renderItem={({ item }) => (
          <Pressable
            style={({ pressed }) => [
              styles.itemCard,
              pressed && styles.itemCardPressed,
            ]}
            onPress={() => router.push(`/design/${item.id}`)}
          >
            <Image source={{ uri: item.images?.[0] }} style={styles.itemImage} />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
              <View style={styles.itemBadge}>
                <Text style={styles.itemBadgeText}>
                  {item.availability === 'READY_MADE' ? 'Ready Made' : 'Custom'}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.emptyItems}>
            <ShoppingBag size={48} color={Colors.textLight} />
            <Text style={styles.emptyItemsText}>No items in this subcategory</Text>
          </View>
        }
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!designer) {
    return (
      <View style={styles.errorContainer}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Designer not found</Text>
        <Pressable onPress={handleGoHome} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go to Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Custom Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <Pressable style={styles.headerBackBtn} onPress={handleBack}>
            <ArrowLeft size={24} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle} numberOfLines={1}>{getHeaderTitle()}</Text>
          <View style={styles.headerRight}>
            <Pressable style={styles.headerIcon} onPress={handleGoHome}>
              <Grid size={22} color={Colors.text} />
            </Pressable>
            <Pressable style={styles.headerIcon}>
              <Share2 size={22} color={Colors.text} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Breadcrumb */}
      {selectedSubcategory && (
        <View style={styles.breadcrumb}>
          <Pressable onPress={() => setSelectedSubcategory(null)}>
            <Text style={styles.breadcrumbText}>{designer.name}</Text>
          </Pressable>
          <ChevronRight size={14} color={Colors.textLight} />
          <Text style={styles.breadcrumbCurrent}>{selectedCategory?.name}</Text>
          <ChevronRight size={14} color={Colors.textLight} />
          <Text style={styles.breadcrumbCurrent}>{selectedSubcategory.name}</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Designer Profile Section */}
        <View style={styles.profileSection}>
          <Image source={{ uri: designer.coverImage }} style={styles.coverImage} />
          <View style={styles.profileInfo}>
            <Image source={{ uri: designer.avatar }} style={styles.profileAvatar} />
            <View style={styles.profileDetails}>
              <View style={styles.profileNameRow}>
                <Text style={styles.profileName}>{designer.name}</Text>
                {designer.verified && <BadgeCheck size={18} color={Colors.primary} />}
              </View>
              <View style={styles.profileSpeciality}>
                <Scissors size={14} color={Colors.primary} />
                <Text style={styles.profileSpecialityText}>{designer.speciality}</Text>
              </View>
              <View style={styles.profileLocation}>
                <MapPin size={12} color={Colors.textLight} />
                <Text style={styles.profileLocationText}>{designer.location}</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statValueRow}>
                <Star size={14} color={Colors.star} fill={Colors.star} />
                <Text style={styles.statValue}>{designer.rating}</Text>
              </View>
              <Text style={styles.statLabel}>{designer.reviewCount} reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{designer.designCount}</Text>
              <Text style={styles.statLabel}>Designs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{designer.experience}</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
          </View>

          {/* Bio */}
          <View style={styles.bioSection}>
            <Text style={styles.bioText}>{designer.bio}</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsSection}>
            {designer.tags?.map((tag: string) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Horizontal Categories */}
        {!selectedSubcategory && renderHorizontalCategories()}

        {/* Subcategories Dropdown (only shows when category selected) */}
        {selectedCategory && !selectedSubcategory && renderSubcategoriesDropdown()}

        {/* Items (when subcategory selected) */}
        {selectedSubcategory && renderItems()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  backBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.white,
  },
  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerBackBtn: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
  breadcrumb: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: 4,
  },
  breadcrumbText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  breadcrumbCurrent: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  profileSection: {
    padding: 20,
  },
  coverImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    backgroundColor: Colors.cardAlt,
    marginBottom: 16,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: -40,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.white,
    backgroundColor: Colors.cardAlt,
  },
  profileDetails: {
    flex: 1,
    marginLeft: 16,
    marginBottom: 8,
  },
  profileNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  profileSpeciality: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  profileSpecialityText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  profileLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  profileLocationText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textLight,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.borderLight,
  },
  bioSection: {
    marginBottom: 16,
  },
  bioText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tagText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  categoriesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  categoriesScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 8,
    minWidth: 100,
    justifyContent: 'space-between',
  },
  categoryCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  categoryNameActive: {
    color: Colors.white,
  },
  categoryBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 16,
    minWidth: 24,
    alignItems: 'center',
  },
  categoryBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  categoryBadgeText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  categoryBadgeTextActive: {
    color: Colors.white,
  },
  subcategoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  subcategoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subcategoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  expandAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.surface,
    borderRadius: 16,
  },
  expandAllText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  dropdownContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  dropdownItemActive: {
    backgroundColor: Colors.primary,
  },
  dropdownItemPressed: {
    opacity: 0.8,
  },
  dropdownItemLeft: {
    flex: 1,
  },
  dropdownItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
  dropdownItemNameActive: {
    color: Colors.white,
  },
  dropdownItemBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  dropdownItemBadgeActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dropdownItemBadgeText: {
    fontSize: 12,
    color: Colors.textLight,
  },
  dropdownItemBadgeTextActive: {
    color: Colors.white,
  },
  emptySubcategories: {
    padding: 24,
    alignItems: 'center',
  },
  emptySubcategoriesText: {
    fontSize: 14,
    color: Colors.textLight,
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  itemsHeaderCategory: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemsHeaderTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
  },
  itemsHeaderCount: {
    fontSize: 14,
    color: Colors.textLight,
  },
  itemRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemCard: {
    width: (width - 48) / 2,
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  itemImage: {
    width: '100%',
    height: 160,
    backgroundColor: Colors.cardAlt,
  },
  itemDetails: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 6,
  },
  itemBadge: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  itemBadgeText: {
    fontSize: 10,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  emptyItems: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyItemsText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
  },
});