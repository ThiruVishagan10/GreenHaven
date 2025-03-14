"use client";

import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { Heart, Trash2, ShoppingCart, AlertCircle, CheckCircle2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getFavorites, removeFromFavorites } from '@/services/favorites';
import { db } from '../../../../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { Product } from '@/types/product';
import { useCart } from '@/lib/context/CartContext';

interface Alert {
  type: 'success' | 'error';
  message: string;
}

const FavoritesSection = () => {
  const { user } = useUser();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<Alert | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const { addToCart: addItemToCart } = useCart();


  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      // Get favorite product IDs
      const favoriteIds = await getFavorites(user.uid);
      
      if (favoriteIds.length === 0) {
        setFavorites([]);
        return;
      }

      // Fetch each product individually
      const productsPromises = favoriteIds.map(async (productId) => {
        const productDoc = await getDoc(doc(db, 'products', productId));
        if (productDoc.exists()) {
          return {
            id: productDoc.id,
            ...productDoc.data()
          } as Product;
        }
        return null;
      });

      const products = await Promise.all(productsPromises);
      // Filter out any null values (products that weren't found)
      const validProducts = products.filter((product): product is Product => product !== null);
      
      setFavorites(validProducts);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setAlert({
        type: 'error',
        message: 'Failed to load favorites'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId: string) => {
    if (!user) return;

    try {
      const success = await removeFromFavorites(user.uid, productId);
      if (success) {
        setFavorites(prev => prev.filter(fav => fav.id !== productId));
        setAlert({
          type: 'success',
          message: 'Item removed from favorites'
        });
      } else {
        throw new Error('Failed to remove from favorites');
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to remove item from favorites'
      });
    }
  };

  const addToCart = async (item: Product) => {
    try {
      if (!user) {
        setAlert({
          type: 'error',
          message: 'Please login to add items to cart'
        });
        return;
      }

      const cartItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        offeredPrice: item.offeredPrice,
        quantity: 1,
        mainImage: item.mainImage
      };

      await addItemToCart(cartItem);
      setAlert({
        type: 'success',
        message: 'Item added to cart'
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAlert({
        type: 'error',
        message: 'Failed to add item to cart'
      });
    }
  };

  const getCategories = () => {
    const categories = new Set(favorites.map(item => item.category));
    return ['all', ...Array.from(categories)];
  };

  const sortFavorites = (items: Product[]) => {
    return [...items].sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === 'price') {
        const priceA = parseFloat(a.price);
        const priceB = parseFloat(b.price);
        return sortOrder === 'asc' 
          ? priceA - priceB
          : priceB - priceA;
      }
      // Sort by createdAt date if available, otherwise by id
      if (a.createdAt && b.createdAt) {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return sortOrder === 'asc'
        ? a.id.localeCompare(b.id)
        : b.id.localeCompare(a.id);
    });
  };

  const filteredAndSortedFavorites = sortFavorites(
    favorites.filter(item => 
      selectedCategory === 'all' || item.category === selectedCategory
    )
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Alert */}
      {alert && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 p-4 rounded-lg shadow-lg ${
            alert.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {alert.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{alert.message}</span>
          <button
            onClick={() => setAlert(null)}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No Favorites Yet</h2>
          <p className="text-gray-500 mb-4">Start adding items to your favorites</p>
          <Link 
            href="/product" 
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Favorites</h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              {/* Filter by category */}
              <div className="flex items-center gap-2">
                <label htmlFor="category" className="text-sm font-medium text-gray-700">
                  Category:
                </label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  {getCategories().map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort options */}
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'name' | 'price' | 'date')}
                  className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                </select>
                <button
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedFavorites.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative h-48">
                  {item.mainImage ? (
                    <Image
                      src={item.mainImage}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No image available</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="text-gray-500 line-through text-sm mr-2">
                        ${parseFloat(item.price).toFixed(2)}
                      </span>
                      <span className="text-green-600 font-bold">
                        ${parseFloat(item.offeredPrice).toFixed(2)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(item.id)}
                      className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesSection;
