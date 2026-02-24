import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Camera,
  DollarSign,
  Tag,
  FileText,
  Clock,
  Ruler,
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

import Colors from '@/constants/colors';
import { Category } from '@/types';

const categoryOptions: { id: Category; label: string }[] = [
  { id: 'women', label: "Women's" },
  { id: 'men', label: "Men's" },
  { id: 'kids', label: 'Kids' },
  { id: 'bridal', label: 'Bridal' },
  { id: 'formal', label: 'Formal' },
  { id: 'casual', label: 'Casual' },
];

export default function AddDesignScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [category, setCategory] = useState<Category | null>(null);
  const [fabricType, setFabricType] = useState<string>('');
  const [deliveryTime, setDeliveryTime] = useState<string>('');
  const [tags, setTags] = useState<string>('');

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a title for your design.');
      return;
    }
    if (!category) {
      Alert.alert('Missing Category', 'Please select a category.');
      return;
    }
    if (!price.trim()) {
      Alert.alert('Missing Price', 'Please enter a price.');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Design Saved!', 'Your design has been added to your portfolio.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
          presentation: 'modal',
        }}
      />
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <X size={22} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Add Design</Text>
        <Pressable onPress={handleSave} style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable style={styles.imageUpload}>
          <Camera size={32} color={Colors.primary} />
          <Text style={styles.uploadTitle}>Add Photos</Text>
          <Text style={styles.uploadSubtitle}>Upload images of your design</Text>
        </Pressable>

        <View style={styles.formSection}>
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Tag size={16} color={Colors.primary} />
              <Text style={styles.labelText}>Title</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. Royal Ankara Gown"
              placeholderTextColor={Colors.textLight}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <FileText size={16} color={Colors.primary} />
              <Text style={styles.labelText}>Description</Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your design, materials, inspiration..."
              placeholderTextColor={Colors.textLight}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.labelTextStandalone}>Category</Text>
            <View style={styles.categoryGrid}>
              {categoryOptions.map((cat) => (
                <Pressable
                  key={cat.id}
                  style={[
                    styles.categoryOption,
                    category === cat.id && styles.categoryOptionActive,
                  ]}
                  onPress={() => {
                    setCategory(cat.id);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text
                    style={[
                      styles.categoryOptionText,
                      category === cat.id && styles.categoryOptionTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <DollarSign size={16} color={Colors.primary} />
              <Text style={styles.labelText}>Price ($)</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={Colors.textLight}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <View style={styles.inputLabel}>
                <Ruler size={16} color={Colors.primary} />
                <Text style={styles.labelText}>Fabric</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. Silk"
                placeholderTextColor={Colors.textLight}
                value={fabricType}
                onChangeText={setFabricType}
              />
            </View>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <View style={styles.inputLabel}>
                <Clock size={16} color={Colors.primary} />
                <Text style={styles.labelText}>Delivery</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2-3 weeks"
                placeholderTextColor={Colors.textLight}
                value={deliveryTime}
                onChangeText={setDeliveryTime}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <Tag size={16} color={Colors.primary} />
              <Text style={styles.labelText}>Tags (comma separated)</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ankara, Formal, Wedding"
              placeholderTextColor={Colors.textLight}
              value={tags}
              onChangeText={setTags}
            />
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [styles.publishButton, pressed && styles.publishButtonPressed]}
          onPress={handleSave}
        >
          <Text style={styles.publishButtonText}>Publish Design</Text>
        </Pressable>

        <Pressable style={styles.draftButton} onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          Alert.alert('Saved as Draft', 'You can publish it later from your studio.');
          router.back();
        }}>
          <Text style={styles.draftButtonText}>Save as Draft</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.primary,
    borderRadius: 20,
  },
  saveBtnText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.white,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  imageUpload: {
    height: 180,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.cardAlt,
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  formSection: {
    gap: 18,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  labelTextStandalone: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  categoryOptionTextActive: {
    color: Colors.white,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  publishButton: {
    backgroundColor: Colors.accent,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  publishButtonPressed: {
    opacity: 0.85,
  },
  publishButtonText: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.white,
  },
  draftButton: {
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  draftButtonText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
});
