import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Briefcase,
  WashingMachine,
  Scissors,
  Truck,
  ChevronRight,
  ArrowLeft,
  TrendingUp,
  Package,
  Star,
  Users,
  Plus,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { stitchingRequests } from '@/mocks/stitchingRequests';

const PARTNER_TYPES = [
  { id: 'laundry_store', title: 'Laundry Store', subtitle: 'Register your laundry business', icon: WashingMachine, color: Colors.laundry },
  { id: 'tailor', title: 'Tailor', subtitle: 'Bid on stitching requests', icon: Scissors, color: Colors.stitching },
  { id: 'designer', title: 'Designer', subtitle: 'Design custom outfits', icon: Scissors, color: Colors.accent },
  { id: 'delivery_rider', title: 'Delivery Rider', subtitle: 'Deliver orders in your area', icon: Truck, color: Colors.delivery },
];

const STATS = [
  { label: 'Total Orders', value: '156', icon: Package, color: Colors.secondaryLight },
  { label: 'Rating', value: '4.8', icon: Star, color: Colors.warm },
  { label: 'Earnings', value: '₹45.2K', icon: TrendingUp, color: Colors.success },
  { label: 'Customers', value: '89', icon: Users, color: Colors.primary },
];

export default function PartnerDashboard() {
  const router = useRouter();
  const { switchRole } = useApp();
  const [showBidForm, setShowBidForm] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [bidPrice, setBidPrice] = useState<string>('');
  const [bidDays, setBidDays] = useState<string>('');
  const [bidMessage, setBidMessage] = useState<string>('');

  const openRequests = stitchingRequests.filter((r) => r.status === 'open');

  const handleSubmitBid = () => {
    if (!bidPrice || !bidDays || !bidMessage.trim()) {
      Alert.alert('Missing Fields', 'Please fill all bid details.');
      return;
    }
    Alert.alert('Bid Submitted!', 'Your bid has been sent to the customer.', [
      {
        text: 'OK',
        onPress: () => {
          setShowBidForm(false);
          setSelectedRequest(null);
          setBidPrice('');
          setBidDays('');
          setBidMessage('');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Partner Dashboard',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: '#FFF',
          headerTitleStyle: { fontWeight: '700' },
          headerLeft: () => (
            <Pressable
              onPress={() => {
                switchRole('customer');
                router.back();
              }}
              style={styles.backBtn}
            >
              <ArrowLeft size={22} color="#FFF" />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomeBanner}>
          <Briefcase size={28} color="#FFF" />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Welcome, Partner!</Text>
            <Text style={styles.welcomeSubtitle}>Manage your business from here</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <View key={stat.label} style={styles.statCard}>
                <Icon size={20} color={stat.color} />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Register As</Text>
        {PARTNER_TYPES.map((type) => {
          const Icon = type.icon;
          return (
            <Pressable
              key={type.id}
              style={({ pressed }) => [styles.partnerTypeCard, pressed && { opacity: 0.9 }]}
              onPress={() => Alert.alert('Coming Soon', `${type.title} registration will be available soon!`)}
            >
              <View style={[styles.partnerIcon, { backgroundColor: type.color + '15' }]}>
                <Icon size={22} color={type.color} />
              </View>
              <View style={styles.partnerInfo}>
                <Text style={styles.partnerTitle}>{type.title}</Text>
                <Text style={styles.partnerSubtitle}>{type.subtitle}</Text>
              </View>
              <ChevronRight size={18} color={Colors.textLight} />
            </Pressable>
          );
        })}

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Open Stitching Requests</Text>
        <Text style={styles.sectionSubtitle}>Bid on customer requests to win projects</Text>

        {openRequests.map((req) => (
          <View key={req.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View>
                <Text style={styles.requestTitle}>{req.title}</Text>
                <Text style={styles.requestType}>{req.outfitType} · Budget: ₹{req.budget.toLocaleString()}</Text>
              </View>
              <Text style={styles.requestBids}>{req.bids.length} bids</Text>
            </View>
            <Text style={styles.requestDesc} numberOfLines={2}>{req.description}</Text>

            {showBidForm && selectedRequest === req.id ? (
              <View style={styles.bidForm}>
                <Text style={styles.bidFormTitle}>Your Bid</Text>
                <View style={styles.bidFormRow}>
                  <View style={styles.bidFormField}>
                    <Text style={styles.bidFormLabel}>Price (₹)</Text>
                    <TextInput
                      style={styles.bidInput}
                      value={bidPrice}
                      onChangeText={setBidPrice}
                      keyboardType="numeric"
                      placeholder="Amount"
                      placeholderTextColor={Colors.textLight}
                    />
                  </View>
                  <View style={styles.bidFormField}>
                    <Text style={styles.bidFormLabel}>Days</Text>
                    <TextInput
                      style={styles.bidInput}
                      value={bidDays}
                      onChangeText={setBidDays}
                      keyboardType="numeric"
                      placeholder="Days"
                      placeholderTextColor={Colors.textLight}
                    />
                  </View>
                </View>
                <TextInput
                  style={[styles.bidInput, styles.bidMessageInput]}
                  value={bidMessage}
                  onChangeText={setBidMessage}
                  placeholder="Why should the customer choose you?"
                  placeholderTextColor={Colors.textLight}
                  multiline
                  textAlignVertical="top"
                />
                <View style={styles.bidActions}>
                  <Pressable
                    style={styles.cancelBidBtn}
                    onPress={() => { setShowBidForm(false); setSelectedRequest(null); }}
                  >
                    <Text style={styles.cancelBidText}>Cancel</Text>
                  </Pressable>
                  <Pressable style={styles.submitBidBtn} onPress={handleSubmitBid}>
                    <Text style={styles.submitBidText}>Submit Bid</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Pressable
                style={styles.placeBidBtn}
                onPress={() => { setShowBidForm(true); setSelectedRequest(req.id); }}
              >
                <Plus size={16} color={Colors.primary} />
                <Text style={styles.placeBidText}>Place Bid</Text>
              </Pressable>
            )}
          </View>
        ))}

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
  backBtn: {
    padding: 4,
    marginRight: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  welcomeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  welcomeText: {
    gap: 4,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#FFF',
  },
  welcomeSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  statCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 14,
    width: '47%',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500' as const,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  partnerTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    gap: 14,
  },
  partnerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  partnerInfo: {
    flex: 1,
    gap: 2,
  },
  partnerTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  partnerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  requestCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  requestType: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  requestBids: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.secondaryLight,
    backgroundColor: Colors.secondaryLight + '15',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  requestDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
    marginBottom: 12,
  },
  placeBidBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary + '10',
    borderWidth: 1,
    borderColor: Colors.primary + '30',
  },
  placeBidText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  bidForm: {
    marginTop: 4,
    padding: 14,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
  },
  bidFormTitle: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  bidFormRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  bidFormField: {
    flex: 1,
  },
  bidFormLabel: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  bidInput: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bidMessageInput: {
    height: 80,
    marginBottom: 12,
  },
  bidActions: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBidBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelBidText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  submitBidBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  submitBidText: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: '#FFF',
  },
});
