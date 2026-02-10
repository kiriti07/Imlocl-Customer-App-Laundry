import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  MapPin,
  CreditCard,
  HelpCircle,
  Settings,
  ChevronRight,
  Shield,
  Briefcase,
  LogOut,
  Heart,
  Bell,
  Star,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

const MENU_SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'addresses', label: 'My Addresses', icon: MapPin, color: Colors.accent },
      { id: 'payments', label: 'Payment Methods', icon: CreditCard, color: Colors.secondaryLight },
      { id: 'favorites', label: 'Favorites', icon: Heart, color: Colors.primary },
      { id: 'notifications', label: 'Notifications', icon: Bell, color: Colors.warm },
    ],
  },
  {
    title: 'General',
    items: [
      { id: 'help', label: 'Help & Support', icon: HelpCircle, color: Colors.secondaryLight },
      { id: 'about', label: 'About Us', icon: Shield, color: Colors.accent },
      { id: 'settings', label: 'Settings', icon: Settings, color: Colors.textSecondary },
      { id: 'rate', label: 'Rate Us', icon: Star, color: Colors.warm },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { role, switchRole } = useApp();

  const handlePartnerSwitch = () => {
    if (role === 'customer') {
      Alert.alert(
        'Switch to Partner Mode',
        'You will be able to register your services and manage your business.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Switch',
            onPress: () => {
              switchRole('partner');
              router.push('/partner-dashboard');
            },
          },
        ]
      );
    } else {
      switchRole('customer');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.safeTop}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileCard}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Ravi Kumar</Text>
            <Text style={styles.profileEmail}>ravi.kumar@email.com</Text>
            <Text style={styles.profilePhone}>+91 98765 43210</Text>
          </View>
          <Pressable style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
        </View>

        <Pressable
          style={({ pressed }) => [styles.partnerBanner, pressed && { opacity: 0.9 }]}
          onPress={handlePartnerSwitch}
        >
          <View style={styles.partnerLeft}>
            <View style={styles.partnerIcon}>
              <Briefcase size={22} color="#FFF" />
            </View>
            <View>
              <Text style={styles.partnerTitle}>
                {role === 'customer' ? 'Become a Partner' : 'Back to Customer'}
              </Text>
              <Text style={styles.partnerSubtitle}>
                {role === 'customer'
                  ? 'Register as a store owner, tailor, or rider'
                  : 'Switch to customer mode'}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="rgba(255,255,255,0.7)" />
        </Pressable>

        {MENU_SECTIONS.map((section) => (
          <View key={section.title} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.menuItem,
                      index < section.items.length - 1 && styles.menuItemBorder,
                    ]}
                  >
                    <View style={styles.menuLeft}>
                      <View style={[styles.menuIconWrap, { backgroundColor: item.color + '15' }]}>
                        <Icon size={18} color={item.color} />
                      </View>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                    </View>
                    <ChevronRight size={18} color={Colors.textLight} />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        <Pressable style={styles.logoutBtn}>
          <LogOut size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Text style={styles.version}>Version 1.0.0</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeTop: {
    backgroundColor: Colors.surface,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  profileEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  profilePhone: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  editBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.primary + '15',
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  partnerBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  partnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  partnerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFF',
  },
  partnerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  menuSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500' as const,
    color: Colors.text,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: Colors.error,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textLight,
    marginTop: 8,
  },
});
