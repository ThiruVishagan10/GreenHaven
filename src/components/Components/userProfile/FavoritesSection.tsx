// components/FavoritesSection.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Loader2, Package } from 'lucide-react';
import { useFavorites } from '../../../../lib/context/FavoritesContext';
import { UserAuth } from '@/lib/context/AuthContent';


export default function FavoritesSection() {
  const router = useRouter();
  const { user } = UserAuth();
  const { 
    favoriteItems, 
    removeFromFavorites, 
    loading: favoritesLoading,
    error 
  } = useFavorites();
  
  const [removingItem, setRemovingItem] = useState<{ [key: string]: boolean }>({});

  const handleRemoveFromFavorites = async (itemId: string) => {
    try {
      setRemovingItem(prev => ({ ...prev, [itemId]: true }));
      await removeFromFavorites(itemId);
    } catch (error) {
      console.error('Error removing from favorites:', error);
    } finally {
      setRemovingItem(prev => ({ ...prev, [itemId]: false }));
    }
  };

  if (favoritesLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Sign in to view your favorites</h2>
        <button
          onClick={() => router.push('/login')}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (favoriteItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
        <p className="text-gray-600 mb-4">Start adding some products to your favorites!</p>
        <button
          onClick={() => router.push('/product')}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold mb-6">Your Favorites ({favoriteItems.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {favoriteItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <div 
                className="relative aspect-square cursor-pointer"
                onClick={() => router.push(`/product/${item.id}`)}
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <Package className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 
                      className="font-semibold text-gray-900 hover:text-green-600 cursor-pointer"
                      onClick={() => router.push(`/product/${item.id}`)}
                    >
                      {item.name}
                    </h3>
                    <p className="text-green-600 font-medium mt-1">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromFavorites(item.id)}
                    disabled={removingItem[item.id]}
                    className={`p-2 rounded-full transition-colors ${
                      removingItem[item.id]
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-red-500 hover:text-red-600'
                    }`}
                    aria-label="Remove from favorites"
                  >
                    {removingItem[item.id] ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Heart className="h-5 w-5 fill-current" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
