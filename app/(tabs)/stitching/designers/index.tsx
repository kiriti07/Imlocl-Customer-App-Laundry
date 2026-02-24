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
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Filter, Users } from 'lucide-react-native';

import Colors from '@/constants/colors';
import DesignerCard from '@/components/designer/DesignerCard';

const API_BASE_URL = 'http://localhost:8080/api';

export default function DesignersScreen() {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [designers, setDesigners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All');

  const specialties = ['All', 'Bridal', 'Women', 'Men', 'Kids', 'Formal', 'Casual'];

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
    
    const matchesFilter = selectedFilter === 'All' ||
      designer.tags.some((tag: string) => 
        tag.toLowerCase().includes(selectedFilter.toLowerCase())
      );
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Users size={28} color={Colors.primary} />
          <View>
            <Text style={styles.title}>Fashion Designers</Text>
            <Text style={styles.subtitle}>Discover talented creators</Text>
          </View>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or specialty..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {specialties.map((specialty) => (
          <Pressable
            key={specialty}
            style={[
              styles.filterPill,
              selectedFilter === specialty && styles.filterPillActive,
            ]}
            onPress={() => setSelectedFilter(specialty)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === specialty && styles.filterTextActive,
              ]}
            >
              {specialty}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        <Text style={styles.resultCount}>
          {filteredDesigners.length} designer{filteredDesigners.length !== 1 ? 's' : ''} found
        </Text>
        {filteredDesigners.map((designer: any) => (
          <DesignerCard key={designer.id} designer={designer} variant="horizontal" />
        ))}
        {filteredDesigners.length === 0 && (
          <View style={styles.emptyState}>
            <Filter size={48} color={Colors.borderLight} />
            <Text style={styles.emptyTitle}>No designers found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
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
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  resultCount: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 12,
    fontWeight: '500' as const,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});