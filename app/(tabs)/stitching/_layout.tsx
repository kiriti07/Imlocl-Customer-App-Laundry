// app/(tabs)/stitching/_layout.tsx
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Users, Palette, Plus } from 'lucide-react-native';
import { Pressable, View, Text } from 'react-native';

import Colors from '@/constants/colors';

export default function StitchingLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
        headerRight: () => (
          <Pressable
            onPress={() => router.push('/post-request')}
            style={({ pressed }) => ({
              marginRight: 16,
              opacity: pressed ? 0.7 : 1,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: Colors.primary,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            })}
          >
            <Plus size={18} color="#FFF" />
            <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 13 }}>Post Request</Text>
          </Pressable>
        ),
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.borderLight,
          paddingBottom: insets.bottom || 8,
          paddingTop: 8,
          height: 60 + (insets.bottom || 0),
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="designers"
        options={{
          title: 'Designers',
          tabBarIcon: ({ color, size }) => (
            <Users size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="designs"
        options={{
          title: 'Designs',
          tabBarIcon: ({ color, size }) => (
            <Palette size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}