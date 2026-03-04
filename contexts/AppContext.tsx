// contexts/AppContext.tsx
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { UserRole, CartItem } from '@/types';
import { config } from '@/config';

const API_BASE_URL = config.apiUrl;

const ROLE_KEY = 'user_role';

// Create the context hook
export const [AppProvider, useApp] = createContextHook(() => {
  const [role, setRole] = useState<UserRole>('customer');
  const [isRoleLoaded, setIsRoleLoaded] = useState<boolean>(false);
  const [cart, setCart] = useState<CartItem[]>([]);

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

  const addToCart = useCallback((item: CartItem) => {
    setCart((prev) => {
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
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    role,
    switchRole,
    isRoleLoaded,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  };
});