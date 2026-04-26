// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Home, Scissors, ShoppingBag, User } from 'lucide-react-native';
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

interface TabIconProps {
  icon: React.ReactNode;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <View style={styles.iconWrap}>{icon}</View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]} numberOfLines={1}>
        {label}
      </Text>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 56 + (insets.bottom > 0 ? insets.bottom : 12);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: tabBarHeight,
          backgroundColor: Colors.surface,
          borderTopWidth: 0.5,
          borderTopColor: Colors.border,
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 12,
          paddingTop: 0,
        },
        tabBarActiveTintColor: Colors.ink,
        tabBarInactiveTintColor: Colors.textLight,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <TabIcon
              icon={<Home size={20} color={focused ? Colors.ink : Colors.textLight} strokeWidth={focused ? 2.5 : 1.8} />}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="stitching"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<Scissors size={20} color={focused ? Colors.ink : Colors.textLight} strokeWidth={focused ? 2.5 : 1.8} />}
              label="Stitching"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<ShoppingBag size={20} color={focused ? Colors.ink : Colors.textLight} strokeWidth={focused ? 2.5 : 1.8} />}
              label="Orders"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={<User size={20} color={focused ? Colors.ink : Colors.textLight} strokeWidth={focused ? 2.5 : 1.8} />}
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 3,
    minWidth: 64,
    position: 'relative',
  },
  tabItemActive: {
    backgroundColor: Colors.inkFaint,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textLight,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.ink,
    fontWeight: '700',
  },
  activeDot: {
    position: 'absolute',
    bottom: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.ink,
  },
});