import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Scissors, Camera, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

const OUTFIT_TYPES = ['Lehenga', 'Sherwani', 'Suit', 'Kurti', 'Saree Blouse', 'Dress', 'Kurta', 'Other'];

export default function PostRequestScreen() {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [budget, setBudget] = useState<string>('');

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !selectedType || !budget.trim()) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    Alert.alert('Request Posted!', 'Your stitching request has been posted. Tailors and designers will start bidding soon.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Post Request',
          presentation: 'modal',
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '700' },
          headerLeft: () => (
            <Pressable onPress={() => router.back()} style={styles.closeBtn}>
              <X size={22} color={Colors.text} />
            </Pressable>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerBanner}>
            <Scissors size={24} color={Colors.primary} />
            <Text style={styles.headerText}>Describe your outfit and tailors will bid on it</Text>
          </View>

          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Custom Bridal Lehenga"
            placeholderTextColor={Colors.textLight}
            value={title}
            onChangeText={setTitle}
            testID="title-input"
          />

          <Text style={styles.label}>Outfit Type *</Text>
          <View style={styles.typesGrid}>
            {OUTFIT_TYPES.map((type) => (
              <Pressable
                key={type}
                style={[styles.typeChip, selectedType === type && styles.typeChipActive]}
                onPress={() => setSelectedType(type)}
              >
                <Text style={[styles.typeChipText, selectedType === type && styles.typeChipTextActive]}>
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Budget (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 15000"
            placeholderTextColor={Colors.textLight}
            value={budget}
            onChangeText={setBudget}
            keyboardType="numeric"
            testID="budget-input"
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your outfit in detail - fabric preferences, color, design details, measurements..."
            placeholderTextColor={Colors.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            testID="description-input"
          />

          <Pressable style={styles.imageBtn}>
            <Camera size={20} color={Colors.secondaryLight} />
            <Text style={styles.imageBtnText}>Add Reference Images</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.submitBtn, pressed && { opacity: 0.9 }]}
            onPress={handleSubmit}
            testID="submit-btn"
          >
            <Text style={styles.submitBtnText}>Post Request</Text>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  headerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.primary + '10',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
  },
  headerText: {
    fontSize: 14,
    color: Colors.text,
    flex: 1,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    marginTop: 4,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  textArea: {
    height: 120,
    paddingTop: 14,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeChipActive: {
    backgroundColor: Colors.primary + '15',
    borderColor: Colors.primary,
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  typeChipTextActive: {
    color: Colors.primary,
  },
  imageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 18,
    marginBottom: 24,
  },
  imageBtnText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.secondaryLight,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});
