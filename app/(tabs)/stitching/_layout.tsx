// app/(tabs)/stitching/_layout.tsx
import { Stack, useRouter, usePathname } from 'expo-router';
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Users, Palette, Plus } from 'lucide-react-native';
import Colors from '@/constants/colors';

function SegmentedControl() {
  const router   = useRouter();
  const pathname = usePathname();
  const onDesigners = !pathname.includes('designs');

  return (
    <View style={s.segWrap}>
      <Pressable
        style={[s.seg, onDesigners && s.segActive]}
        onPress={() => router.push('/(tabs)/stitching/designers')}
      >
        <Users
          size={14}
          color={onDesigners ? Colors.ink : Colors.textLight}
          strokeWidth={onDesigners ? 2.5 : 1.8}
        />
        <Text style={[s.segTxt, onDesigners && s.segTxtActive]}>Designers</Text>
      </Pressable>

      <Pressable
        style={[s.seg, !onDesigners && s.segActive]}
        onPress={() => router.push('/(tabs)/stitching/designs')}
      >
        <Palette
          size={14}
          color={!onDesigners ? Colors.ink : Colors.textLight}
          strokeWidth={!onDesigners ? 2.5 : 1.8}
        />
        <Text style={[s.segTxt, !onDesigners && s.segTxtActive]}>Designs</Text>
      </Pressable>
    </View>
  );
}

function PostBtn() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push('/post-request')}
      style={({ pressed }) => [
        s.postBtn,
        pressed && { opacity: 0.8, transform: [{ scale: 0.97 }] },
      ]}
    >
      <Plus size={14} color="#fff" strokeWidth={2.5} />
      <Text style={s.postBtnTxt}>Post</Text>
    </Pressable>
  );
}

const sharedScreenOpts = {
  headerShown: true,
  headerTitle: () => <SegmentedControl />,
  headerTitleAlign: 'center' as const,
  headerRight: () => <PostBtn />,
  headerStyle: { backgroundColor: Colors.surface } as any,
  headerShadowVisible: false,
  headerBackVisible: false,
};

export default function StitchingLayout() {
  return (
    <Stack>
      <Stack.Screen name="designers" options={sharedScreenOpts} />
      <Stack.Screen name="designs"   options={sharedScreenOpts} />
    </Stack>
  );
}

const s = StyleSheet.create({
  segWrap: {
    flexDirection: 'row' as const,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 10,
    padding: 3,
    borderWidth: 0.5,
    borderColor: Colors.border,
    gap: 2,
  },
  seg: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  segActive: {
    backgroundColor: Colors.surface,
    borderWidth: 0.5,
    borderColor: Colors.border,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 2,
    elevation: 1,
  },
  segTxt: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textLight,
  },
  segTxtActive: {
    color: Colors.ink,
    fontWeight: '700' as const,
  },
  postBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center',
    gap: 5,
    backgroundColor: Colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    marginRight: 16,
  },
  postBtnTxt: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700' as const,
  },
});