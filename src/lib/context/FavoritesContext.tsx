
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc 
} from "firebase/firestore";
import { db } from "../../../firebase";
import { UserAuth } from "../context/AuthContent";

interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface FavoriteContextType {
  favorites: Set<string>; // Changed to Set of IDs for easier checking
  favoriteItems: FavoriteItem[]; // Full items array
  addToFavorites: (item: FavoriteItem) => Promise<void>;
  removeFromFavorites: (itemId: string) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  getFavoriteCount: () => number;
  loading: boolean;
  error: string | null;
}

const FavoriteContext = createContext<FavoriteContextType>({
  favorites: new Set(),
  favoriteItems: [],
  addToFavorites: async () => {},
  removeFromFavorites: async () => {},
  isFavorite: () => false,
  getFavoriteCount: () => 0,
  loading: false,
  error: null,
});

export const FavoriteProvider = ({ children }: { children: React.ReactNode }) => {
  const [favoriteItems, setFavoriteItems] = useState<FavoriteItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = UserAuth();

  // Get favorites count
  const getFavoriteCount = () => {
    return favorites.size;
  };

  // Check if item is in favorites
  const isFavorite = (itemId: string) => {
    return favorites.has(itemId);
  };

  // Fetch favorites from Firestore
  const fetchFavorites = async () => {
    if (!user) {
      setFavoriteItems([]);
      setFavorites(new Set());
      return;
    }

    setLoading(true);
    try {
      const favRef = doc(db, "favorites", user.uid);
      const favSnap = await getDoc(favRef);

      if (favSnap.exists()) {
        const items = favSnap.data().items || [];
        setFavoriteItems(items);
        setFavorites(new Set(items.map((item: FavoriteItem) => item.id)));
      } else {
        await setDoc(favRef, { items: [] });
        setFavoriteItems([]);
        setFavorites(new Set());
      }
    } catch (err) {
      setError("Failed to fetch favorites");
      console.error("Error fetching favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add to favorites
  const addToFavorites = async (item: FavoriteItem) => {
    if (!user) {
      setError("Please sign in to add favorites");
      return;
    }

    setLoading(true);
    try {
      const favRef = doc(db, "favorites", user.uid);
      if (!favorites.has(item.id)) {
        const newFavoriteItems = [...favoriteItems, item];
        await updateDoc(favRef, { items: newFavoriteItems });
        setFavoriteItems(newFavoriteItems);
        setFavorites(new Set([...favorites, item.id]));
      }
    } catch (err) {
      setError("Failed to add to favorites");
      console.error("Error adding to favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (itemId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const favRef = doc(db, "favorites", user.uid);
      const updatedItems = favoriteItems.filter(item => item.id !== itemId);
      await updateDoc(favRef, { items: updatedItems });
      setFavoriteItems(updatedItems);
      const newFavorites = new Set(favorites);
      newFavorites.delete(itemId);
      setFavorites(newFavorites);
    } catch (err) {
      setError("Failed to remove from favorites");
      console.error("Error removing from favorites:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch favorites when user changes
  useEffect(() => {
    fetchFavorites();
  }, [user]);

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        favoriteItems,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        getFavoriteCount,
        loading,
        error,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};
