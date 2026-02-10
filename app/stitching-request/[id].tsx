import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import {
  Star,
  IndianRupee,
  Clock,
  Check,
  MessageSquare,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { stitchingRequests } from '@/mocks/stitchingRequests';

export default function StitchingRequestDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const request = useMemo(() => stitchingRequests.find((r) => r.id === id), [id]);

  if (!request) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Not Found' }} />
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Request not found</Text>
        </View>
      </View>
    );
  }

  const handleAcceptBid = (bidId: string) => {
    Alert.alert('Accept Bid', 'Do you want to accept this bid?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Accept', onPress: () => console.log('Bid accepted:', bidId) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Request Details',
          headerStyle: { backgroundColor: Colors.surface },
          headerTintColor: Colors.text,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.customerRow}>
          {request.customerAvatar ? (
            <Image source={{ uri: request.customerAvatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>{request.customerName[0]}</Text>
            </View>
          )}
          <View style={styles.customerInfo}>
            <Text style={styles.customerName}>{request.customerName}</Text>
            <Text style={styles.customerDate}>Posted on {request.createdAt}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: request.status === 'open' ? Colors.success + '20' : Colors.warm + '20' }]}>
            <Text style={[styles.statusText, { color: request.status === 'open' ? Colors.success : Colors.warm }]}>
              {request.status === 'open' ? 'Open' : 'In Progress'}
            </Text>
          </View>
        </View>

        <Text style={styles.title}>{request.title}</Text>
        <Text style={styles.description}>{request.description}</Text>

        <View style={styles.detailsGrid}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Outfit Type</Text>
            <Text style={styles.detailValue}>{request.outfitType}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Budget</Text>
            <Text style={[styles.detailValue, { color: Colors.primary }]}>₹{request.budget.toLocaleString()}</Text>
          </View>
          {request.deadline && (
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Deadline</Text>
              <Text style={styles.detailValue}>{request.deadline}</Text>
            </View>
          )}
        </View>

        {request.images.length > 0 && (
          <View style={styles.imagesSection}>
            <Text style={styles.sectionTitle}>Reference Images</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imagesRow}>
              {request.images.map((img, idx) => (
                <Image key={idx} source={{ uri: img }} style={styles.refImage} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.bidsSection}>
          <View style={styles.bidsHeader}>
            <Text style={styles.sectionTitle}>Bids ({request.bids.length})</Text>
          </View>

          {request.bids.length === 0 ? (
            <View style={styles.noBids}>
              <MessageSquare size={36} color={Colors.textLight} />
              <Text style={styles.noBidsText}>No bids yet</Text>
              <Text style={styles.noBidsSubtext}>Tailors and designers will bid on this request</Text>
            </View>
          ) : (
            request.bids.map((bid) => (
              <View key={bid.id} style={[styles.bidCard, bid.isAccepted && styles.bidAccepted]}>
                <View style={styles.bidHeader}>
                  <View style={styles.bidPartner}>
                    {bid.partnerAvatar ? (
                      <Image source={{ uri: bid.partnerAvatar }} style={styles.bidAvatar} />
                    ) : (
                      <View style={[styles.bidAvatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarInitial}>{bid.partnerName[0]}</Text>
                      </View>
                    )}
                    <View>
                      <Text style={styles.bidPartnerName}>{bid.partnerName}</Text>
                      <View style={styles.bidRating}>
                        <Star size={12} color={Colors.warm} fill={Colors.warm} />
                        <Text style={styles.bidRatingText}>{bid.partnerRating}</Text>
                      </View>
                    </View>
                  </View>
                  {bid.isAccepted && (
                    <View style={styles.acceptedBadge}>
                      <Check size={14} color={Colors.success} />
                      <Text style={styles.acceptedText}>Accepted</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.bidMessage}>{bid.message}</Text>

                <View style={styles.bidDetails}>
                  <View style={styles.bidDetailItem}>
                    <IndianRupee size={14} color={Colors.primary} />
                    <Text style={styles.bidPrice}>₹{bid.price.toLocaleString()}</Text>
                  </View>
                  <View style={styles.bidDetailItem}>
                    <Clock size={14} color={Colors.secondaryLight} />
                    <Text style={styles.bidDays}>{bid.daysToComplete} days</Text>
                  </View>
                </View>

                {!bid.isAccepted && request.status === 'open' && (
                  <Pressable
                    style={({ pressed }) => [styles.acceptBtn, pressed && { opacity: 0.9 }]}
                    onPress={() => handleAcceptBid(bid.id)}
                  >
                    <Text style={styles.acceptBtnText}>Accept Bid</Text>
                  </Pressable>
                )}
              </View>
            ))
          )}
        </View>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  scrollContent: {
    padding: 20,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.secondaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    color: '#FFF',
    fontWeight: '700' as const,
    fontSize: 18,
  },
  customerInfo: {
    flex: 1,
    gap: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  customerDate: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  title: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 28,
  },
  description: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  detailItem: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    minWidth: 100,
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  imagesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800' as const,
    color: Colors.text,
    marginBottom: 12,
  },
  imagesRow: {
    gap: 12,
  },
  refImage: {
    width: 160,
    height: 200,
    borderRadius: 12,
  },
  bidsSection: {
    marginTop: 4,
  },
  bidsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  noBids: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  noBidsText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  noBidsSubtext: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bidCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  bidAccepted: {
    borderColor: Colors.success + '40',
    backgroundColor: Colors.success + '05',
  },
  bidHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  bidPartner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bidAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  bidPartnerName: {
    fontSize: 15,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  bidRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  bidRatingText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  acceptedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.success + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  acceptedText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.success,
  },
  bidMessage: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  bidDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 14,
  },
  bidDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bidPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  bidDays: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.secondaryLight,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  acceptBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700' as const,
  },
});
