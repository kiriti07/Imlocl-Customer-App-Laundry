// app/(tabs)/stitching/designers/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

import Colors from '@/constants/colors';

export default function DesignersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.background },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}