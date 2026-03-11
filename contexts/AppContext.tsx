// contexts/AppContext.tsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { UserRole, CartItem } from '@/types';
import { config } from '@/config';

const API_BASE_URL = config.apiUrl;
const ROLE_KEY = 'user_role';

async function apiFetch(path: string, options: RequestInit = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const text = await res.text();

  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text || null;
  }

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data;
}

export type CheckoutSummary = {
  subtotal: number;
  packagingFee?: number;
  deliveryFee?: number;
  platformFee?: number;
  handlingFee?: number;
  lateNightFee?: number;
  gstAmount?: number;
  gstPercent?: number;
  discountAmount?: number;
  couponCode?: string | null;
  totalPayable: number;
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [role, setRole] = useState<UserRole>('customer');
  const [isRoleLoaded, setIsRoleLoaded] = useState<boolean>(false);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartStoreId, setCartStoreId] = useState<string | null>(null);
  const [cartStoreName, setCartStoreName] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState<string>('');
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummary | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ROLE_KEY).then((stored) => {
      if (stored === 'customer' || stored === 'partner') {
        setRole(stored);
      }
      setIsRoleLoaded(true);
    });
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setRole(newRole);
    AsyncStorage.setItem(ROLE_KEY, newRole);
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setCartStoreId(null);
    setCartStoreName(null);
    setCouponCode('');
    setCheckoutSummary(null);
  }, []);

  const addToCart = useCallback(
    (item: CartItem) => {
      setCart((prev) => {
        const incomingStoreId = item.storeId || null;
        const existingStoreId = cartStoreId;

        // single-store cart logic
        if (existingStoreId && incomingStoreId && existingStoreId !== incomingStoreId) {
          setCartStoreId(incomingStoreId);
          setCartStoreName(item.storeName || null);
          return [{ ...item }];
        }

        if (!existingStoreId && incomingStoreId) {
          setCartStoreId(incomingStoreId);
          setCartStoreName(item.storeName || null);
        }

        const existing = prev.find((i) => i.productId === item.productId);
        if (existing) {
          return prev.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        }

        return [...prev, item];
      });
      setCheckoutSummary(null);
    },
    [cartStoreId]
  );

  const incQty = useCallback((productId: string, step = 1) => {
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: i.quantity + step }
          : i
      )
    );
    setCheckoutSummary(null);
  }, []);

  const decQty = useCallback((productId: string, step = 1) => {
    setCart((prev) => {
      const updated = prev
        .map((i) => {
          if (i.productId !== productId) return i;
          const nextQty = i.quantity - step;
          if (nextQty <= 0) return null;
          return { ...i, quantity: nextQty };
        })
        .filter(Boolean) as CartItem[];

      if (updated.length === 0) {
        setCartStoreId(null);
        setCartStoreName(null);
      }

      return updated;
    });
    setCheckoutSummary(null);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.productId !== productId);
      if (updated.length === 0) {
        setCartStoreId(null);
        setCartStoreName(null);
      }
      return updated;
    });
    setCheckoutSummary(null);
  }, []);

  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const cartTotal = useMemo(() => {
    if (checkoutSummary?.totalPayable != null) {
      return checkoutSummary.totalPayable;
    }
    return cartSubtotal;
  }, [checkoutSummary, cartSubtotal]);

  const fetchCheckoutSummary = useCallback(
    async (serviceType = 'LAUNDRY', coupon?: string) => {
      const items = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      }));

      const result = await apiFetch('/checkout/summary', {
        method: 'POST',
        body: JSON.stringify({
          serviceType,
          couponCode: coupon || couponCode || null,
          cartItems: items,
          cartSubtotal,
          storeId: cartStoreId,
        }),
      });

      setCheckoutSummary(result);
      return result;
    },
    [cart, cartSubtotal, cartStoreId, couponCode]
  );

  const applyCoupon = useCallback(
    async (code: string, serviceType = 'LAUNDRY') => {
      setCouponCode(code);
      return await fetchCheckoutSummary(serviceType, code);
    },
    [fetchCheckoutSummary]
  );

  return {
    role,
    switchRole,
    isRoleLoaded,

    cart,
    cartStoreId,
    cartStoreName,
    addToCart,
    incQty,
    decQty,
    removeFromCart,
    clearCart,

    cartSubtotal,
    cartTotal,
    cartCount,

    couponCode,
    setCouponCode,
    checkoutSummary,
    setCheckoutSummary,
    fetchCheckoutSummary,
    applyCoupon,
  };
});