// app/requests/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

import Colors from '@/constants/colors';

export default function RequestsLayout() {
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
      <Stack.Screen
        name="[id]"
        options={{ title: 'Request Details' }}
      />
    </Stack>
  );
}