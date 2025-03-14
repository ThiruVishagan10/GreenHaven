// lib/context/FavoritesProvider.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { UserAuth } from './AuthContent'; // Update this import to use UserAuth

import { FavoritesContextType } from '../../types/product';

interface FavoritesProviderProps {
  children: React.ReactNode;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Firebase service functions
const getFavorites = async (userId: string): Promise<string[]> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data().favorites || [];
    }
    await setDoc(doc(db, 'users', userId), { 
      favorites: [],
      updatedAt: new Date().toISOString()
    });
    return [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

const addToFavorites = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: arrayUnion(productId),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return false;
  }
};

const removeFromFavorites = async (userId: string, productId: string): Promise<boolean> => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      favorites: arrayRemove(productId),
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return false;
  }
};

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const { user } = UserAuth(); // Use UserAuth here

  useEffect(() => {
    const loadFavorites = async () => {
      if (user?.uid) {
        setIsLoading(true);
        try {
          const userFavorites = await getFavorites(user.uid);
          setFavorites(new Set(userFavorites));
        } catch (error) {
          console.error('Error loading favorites:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setFavorites(new Set());
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [user]);

  const toggleFavorite = async (productId: string) => {
    if (!user?.uid) {
      console.error('User not logged in');
      return;
    }

    const isFav = favorites.has(productId);
    const newFavorites = new Set(favorites);

    try {
      if (isFav) {
        const success = await removeFromFavorites(user.uid, productId);
        if (success) {
          newFavorites.delete(productId);
          setFavorites(newFavorites);
        }
      } else {
        const success = await addToFavorites(user.uid, productId);
        if (success) {
          newFavorites.add(productId);
          setFavorites(newFavorites);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (productId: string) => favorites.has(productId);

  const getFavoriteCount = () => favorites.size;

  const value = {
    favorites,
    isLoading,
    toggleFavorite,
    isFavorite,
    getFavoriteCount
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export { FavoritesContext };
