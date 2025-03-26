
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { UserAuth } from './AuthContent';

interface CartItem {
  description: ReactNode;
  id: string;
  name: string;
  price: string;
  offeredPrice: string;
  mainImage: string | null;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  isItemInCart: (itemId: string) => boolean;
  getCartTotal: () => { subtotal: number; savings: number };
  getCartCount: () => number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = UserAuth();

  // Fetch cart from Firestore
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      try {
        const cartDoc = await getDoc(doc(db, 'carts', user.uid));
        if (cartDoc.exists()) {
          setCartItems(cartDoc.data().items || []);
        } else {
          await setDoc(doc(db, 'carts', user.uid), { items: [] });
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  const addToCart = async (newItem: CartItem) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const cartRef = doc(db, 'carts', user.uid);
      const existingItemIndex = cartItems.findIndex(item => item.id === newItem.id);

      let updatedItems: CartItem[];
      if (existingItemIndex !== -1) {
        // Update existing item
        updatedItems = cartItems.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: newItem.quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...cartItems, newItem];
      }

      await updateDoc(cartRef, { items: updatedItems });
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (!user) return;

    try {
      setIsLoading(true);
      const cartRef = doc(db, 'carts', user.uid);
      const updatedItems = cartItems.filter(item => item.id !== itemId);
      await updateDoc(cartRef, { items: updatedItems });
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user || quantity < 1 || quantity > 10) return;

    try {
      setIsLoading(true);
      const cartRef = doc(db, 'carts', user.uid);
      const updatedItems = cartItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      );
      await updateDoc(cartRef, { items: updatedItems });
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isItemInCart = (itemId: string) => {
    return cartItems.some(item => item.id === itemId);
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal  = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + parseFloat(item.offeredPrice) * item.quantity;
    }, 0);

    const savings = cartItems.reduce((total, item) => {
      const originalPrice = parseFloat(item.price) * item.quantity;
      const discountedPrice = parseFloat(item.offeredPrice) * item.quantity;
      return total + (originalPrice - discountedPrice);
    }, 0);

    return { subtotal, savings };
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      isItemInCart,
      getCartTotal,
      getCartCount,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
