// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppProvider } from '@/contexts/AppContext';
import Colors from '@/constants/colors';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerBackTitle: 'Back',
        headerStyle: { backgroundColor: Colors.surface },
        headerTintColor: Colors.text,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="laundry-stores" options={{ title: 'Laundry Stores' }} />
      <Stack.Screen name="laundry-store/[id]" options={{ title: 'Store' }} />
      <Stack.Screen name="stitching-request/[id]" options={{ title: 'Request' }} />
      <Stack.Screen name="post-request" options={{ presentation: 'modal', title: 'Post Request' }} />
      <Stack.Screen name="partner-dashboard" options={{ title: 'Partner Dashboard' }} />
      
      {/* Designer/stitching routes */}
      <Stack.Screen name="designer/[id]" options={{ title: 'Designer Profile' }} />
      <Stack.Screen name="design/[id]" options={{ title: 'Design Details' }} />
      
      {/* Requests route for designers to view and bid on customer requests */}
      <Stack.Screen name="requests" options={{ headerShown: false }} />
      
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <AppProvider>
          <RootLayoutNav />
        </AppProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}