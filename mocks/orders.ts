import { Order } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 'o1',
    type: 'laundry',
    storeName: 'SparkleWash Premium',
    storeImage: 'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=200',
    items: [
      { name: 'Wash & Fold (3kg)', quantity: 1, price: 147 },
      { name: 'Dry Clean - Suit', quantity: 2, price: 298 },
    ],
    total: 445,
    status: 'processing',
    createdAt: '2025-02-08',
    estimatedDelivery: '2025-02-09',
  },
  {
    id: 'o3',
    type: 'laundry',
    storeName: 'FreshPress Laundry',
    storeImage: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=200',
    items: [
      { name: 'Wash & Iron (5kg)', quantity: 1, price: 345 },
    ],
    total: 345,
    status: 'delivered',
    createdAt: '2025-02-05',
  },
];
