// app/requests/index.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  Search,
  Filter,
  Clock,
  IndianRupee,
  MessageCircle,
  X,
  Send,
  Users,
} from 'lucide-react-native';

import Colors from '@/constants/colors';
import { stitchingRequests } from '@/mocks/stitchingRequests';

const statusFilters = ['All', 'Open', 'In Progress', 'Completed'];

export default function RequestsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [bidModalVisible, setBidModalVisible] = useState(false);
  const [bidPrice, setBidPrice] = useState('');
  const [bidDays, setBidDays] = useState('');
  const [bidMessage, setBidMessage] = useState('');

  // Filter requests based on search and status
  const filteredRequests = stitchingRequests.filter((req) => {
    const matchesSearch = !searchQuery ||
      req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.outfitType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || req.status === selectedStatus.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  const handlePlaceBid = () => {
    if (!bidPrice || !bidDays || !bidMessage) {
      Alert.alert('Missing Fields', 'Please fill in all bid fields');
      return;
    }

    Alert.alert(
      'Bid Placed Successfully',
      'Your bid has been submitted. The customer will review it shortly.',
      [
        {
          text: 'OK',
          onPress: () => {
            setBidModalVisible(false);
            setBidPrice('');
            setBidDays('');
            setBidMessage('');
          },
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          title: 'Customer Requests',
          headerShown: true,
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
        }}
      />

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Users size={28} color={Colors.primary} />
          <View>
            <Text style={styles.title}>Open Requests</Text>
            <Text style={styles.subtitle}>Find your next project</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Search size={18} color={Colors.textLight} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search requests..."
            placeholderTextColor={Colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {statusFilters.map((status) => (
          <Pressable
            key={status}
            style={[
              styles.filterPill,
              selectedStatus === status && styles.filterPillActive,
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.filterText,
                selectedStatus === status && styles.filterTextActive,
              ]}
            >
              {status}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        <Text style={styles.resultCount}>
          {filteredRequests.length} request{filteredRequests.length !== 1 ? 's' : ''} found
        </Text>

        {filteredRequests.map((request) => (
          <Pressable
            key={request.id}
            style={({ pressed }) => [styles.requestCard, pressed && styles.requestCardPressed]}
            onPress={() => setSelectedRequest(request)}
          >
            <View style={styles.requestHeader}>
              <View style={styles.customerInfo}>
                {request.customerAvatar ? (
                  <Image source={{ uri: request.customerAvatar }} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarInitial}>{request.customerName[0]}</Text>
                  </View>
                )}
                <View>
                  <Text style={styles.customerName}>{request.customerName}</Text>
                  <Text style={styles.postedDate}>Posted {request.createdAt}</Text>
                </View>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: request.status === 'open' ? Colors.success + '20' : Colors.warm + '20' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: request.status === 'open' ? Colors.success : Colors.warm }
                ]}>
                  {request.status}
                </Text>
              </View>
            </View>

            <Text style={styles.requestTitle}>{request.title}</Text>
            <Text style={styles.requestDescription} numberOfLines={2}>
              {request.description}
            </Text>

            <View style={styles.requestDetails}>
              <View style={styles.detailChip}>
                <Text style={styles.detailChipText}>{request.outfitType}</Text>
              </View>
              <View style={styles.detailChip}>
                <IndianRupee size={12} color={Colors.primary} />
                <Text style={[styles.detailChipText, { color: Colors.primary }]}>
                  ₹{request.budget.toLocaleString()}
                </Text>
              </View>
              {request.deadline && (
                <View style={styles.detailChip}>
                  <Clock size={12} color={Colors.secondaryLight} />
                  <Text style={styles.detailChipText}>{request.deadline}</Text>
                </View>
              )}
            </View>

            {request.images.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailRow}>
                {request.images.map((img, idx) => (
                  <Image key={idx} source={{ uri: img }} style={styles.thumbnail} />
                ))}
              </ScrollView>
            )}

            <View style={styles.bidInfo}>
              <Text style={styles.bidCount}>{request.bids.length} bid{request.bids.length !== 1 ? 's' : ''} placed</Text>
              <Pressable
                style={styles.bidButton}
                onPress={() => {
                  setSelectedRequest(request);
                  setBidModalVisible(true);
                }}
              >
                <Text style={styles.bidButtonText}>Place Bid</Text>
              </Pressable>
            </View>
          </Pressable>
        ))}

        {filteredRequests.length === 0 && (
          <View style={styles.emptyState}>
            <Filter size={48} color={Colors.borderLight} />
            <Text style={styles.emptyTitle}>No requests found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
          </View>
        )}
      </ScrollView>

      {/* Bid Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bidModalVisible}
        onRequestClose={() => setBidModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Place Your Bid</Text>
              <Pressable onPress={() => setBidModalVisible(false)}>
                <X size={24} color={Colors.text} />
              </Pressable>
            </View>

            {selectedRequest && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.modalRequestInfo}>
                  <Text style={styles.modalRequestTitle}>{selectedRequest.title}</Text>
                  <Text style={styles.modalRequestType}>{selectedRequest.outfitType}</Text>
                </View>

                <Text style={styles.modalLabel}>Your Bid Amount (₹) *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., 12000"
                  placeholderTextColor={Colors.textLight}
                  value={bidPrice}
                  onChangeText={setBidPrice}
                  keyboardType="numeric"
                />

                <Text style={styles.modalLabel}>Days to Complete *</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., 14"
                  placeholderTextColor={Colors.textLight}
                  value={bidDays}
                  onChangeText={setBidDays}
                  keyboardType="numeric"
                />

                <Text style={styles.modalLabel}>Message to Customer *</Text>
                <TextInput
                  style={[styles.modalInput, styles.modalTextArea]}
                  placeholder="Describe your approach, materials, etc..."
                  placeholderTextColor={Colors.textLight}
                  value={bidMessage}
                  onChangeText={setBidMessage}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Pressable
                  style={({ pressed }) => [styles.submitBidBtn, pressed && { opacity: 0.9 }]}
                  onPress={handlePlaceBid}
                >
                  <Send size={18} color="#FFF" />
                  <Text style={styles.submitBidBtnText}>Submit Bid</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    padding: 0,
  },
  filtersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  filterTextActive: {
    color: Colors.white,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  resultCount: {
    fontSize: 13,
    color: Colors.textLight,
    marginBottom: 12,
    fontWeight: '500' as const,
  },
  requestCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  requestCardPressed: {
    opacity: 0.9,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#FFF',
    fontWeight: '700' as const,
    fontSize: 16,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  postedDate: {
    fontSize: 11,
    color: Colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600' as const,
    textTransform: 'capitalize',
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 6,
  },
  requestDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  requestDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceAlt,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  detailChipText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.textSecondary,
  },
  thumbnailRow: {
    marginBottom: 12,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 8,
  },
  bidInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  bidCount: {
    fontSize: 13,
    color: Colors.textLight,
    fontWeight: '500' as const,
  },
  bidButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bidButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700' as const,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: Colors.text,
  },
  modalRequestInfo: {
    backgroundColor: Colors.surfaceAlt,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  modalRequestTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 4,
  },
  modalRequestType: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600' as const,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text,
    marginBottom: 8,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  modalTextArea: {
    height: 100,
    paddingTop: 14,
  },
  submitBidBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    marginBottom: 20,
  },
  submitBidBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
});