// app/(tabs)/stitching/designs/index.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  TextInput,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Sparkles, Crown, Shirt, Baby, Heart, GraduationCap, Sun, Palette } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { designs } from '@/mocks/designs';
import DesignCard from '@/components/designer/DesignCard';

const categoryIcons: Record<string, React.ReactNode> = {
  all: <Sparkles size={18} color={Colors.white} />,
  women: <Crown size={18} color={Colors.white} />,
  men: <Shirt size={18} color={Colors.white} />,
  kids: <Baby size={18} color={Colors.white} />,
  bridal: <Heart size={18} color={Colors.white} />,
  formal: <GraduationCap size={18} color={Colors.white} />,
  casual: <Sun size={18} color={Colors.white} />,
};

const categoryIconsInactive: Record<string, React.ReactNode> = {
  all: <Sparkles size={18} color={Colors.textSecondary} />,
  women: <Crown size={18} color={Colors.textSecondary} />,
  men: <Shirt size={18} color={Colors.textSecondary} />,
  kids: <Baby size={18} color={Colors.textSecondary} />,
  bridal: <Heart size={18} color={Colors.textSecondary} />,
  formal: <GraduationCap size={18} color={Colors.textSecondary} />,
  casual: <Sun size={18} color={Colors.textSecondary} />,
};

const categories = [
  { id: 'all', label: 'All' },
  { id: 'women', label: "Women's" },
  { id: 'men', label: "Men's" },
  { id: 'kids', label: 'Kids' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'formal', label: 'Formal' },
  { id: 'casual', label: 'Casual' },
];

export default function DesignsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const scrollY = useRef(new Animated.Value(0)).current;

  const trendingDesigns = designs.filter((d) => d.isTrending);
  const newDesigns = designs.filter((d) => d.isNew);

  const filteredDesigns = designs.filter((d) => {
    const matchesCategory = selectedCategory === 'all' || d.category === selectedCategory;
    const matchesSearch = !searchQuery || d.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Palette size={28} color={Colors.accent} />
            <View>
              <Text style={styles.greeting}>Design Gallery</Text>
              <Text style={styles.subtitle}>Browse Creation from our Tailors and Designers</Text>
            </View>
          </View>
        </View>
        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search designs..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              style={[
                styles.categoryPill,
                selectedCategory === cat.id && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              {selectedCategory === cat.id
                ? categoryIcons[cat.id]
                : categoryIconsInactive[cat.id]}
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {!searchQuery && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Trending Now</Text>
              <Text style={styles.sectionCount}>{trendingDesigns.length} designs</Text>
            </View>
            <FlatList
              data={trendingDesigns}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <DesignCard design={item} variant="featured" />
              )}
              scrollEnabled
            />

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Just Arrived</Text>
              <Text style={styles.sectionCount}>{newDesigns.length} new</Text>
            </View>
            <FlatList
              data={newDesigns}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <DesignCard design={item} variant="compact" />
              )}
              scrollEnabled
            />
          </>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? 'Search Results' : 'All Designs'}
          </Text>
          <Text style={styles.sectionCount}>{filteredDesigns.length} items</Text>
        </View>
        <View style={styles.designsGrid}>
          {filteredDesigns.map((design) => (
            <DesignCard key={design.id} design={design} />
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: Colors.background,
  },
  headerTop: {
    marginBottom: 16,
    paddingTop: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: 6,
  },
  categoryPillActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  categoryTextActive: {
    color: Colors.white,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.3,
  },
  sectionCount: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  designsGrid: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});