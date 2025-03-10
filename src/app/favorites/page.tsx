"use client";

import { useEffect, useState } from 'react';
import { useFavorites } from '@/lib/context/FavoritesContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { UserAuth } from '@/lib/context/AuthContent';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  offeredPrice: string;
  mainImage: string;
  category: string;
}

export default function FavoritesPage() {
  const { favorites, toggleFavorite, isLoading: favoritesLoading } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const { user } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchFavoriteProducts = async () => {
      if (favoritesLoading) return;
      
      try {
        setIsLoading(true);
        const favoriteIds = Array.from(favorites);
        
        if (favoriteIds.length === 0) {
          setProducts([]);
          setIsLoading(false);
          return;
        }

        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('id', 'in', favoriteIds));
        const querySnapshot = await getDocs(q);
        
        const favoriteProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          favoriteProducts.push({ id: doc.id, ...doc.data() } as Product);
        });

        setProducts(favoriteProducts);
      } catch (error) {
        console.error('Error fetching favorite products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [favorites, favoritesLoading, user, router]);

  const handleToggleFavorite = async (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); // Prevent navigation when clicking the heart icon
    setRemovingId(productId);
    await toggleFavorite(productId);
    setRemovingId(null);
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (!user) {
    return null;
  }

  if (isLoading || favoritesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>
      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No favorite items yet</p>
          <Link 
            href="/product" 
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                onClick={() => handleProductClick(product.id)}
              >
                <div className="relative aspect-square cursor-pointer">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <button
                    onClick={(e) => handleToggleFavorite(e, product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all duration-200 z-10"
                    disabled={removingId === product.id}
                  >
                    {removingId === product.id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                    ) : (
                      <Heart
                        size={20}
                        className={`transition-colors ${
                          favorites.has(product.id)
                            ? "fill-red-500 text-red-500"
                            : "fill-none text-gray-500"
                        }`}
                      />
                    )}
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-400 line-through text-sm">
                        ₹{product.price}
                      </span>
                      <span className="text-green-600 font-bold ml-2">
                        ₹{product.offeredPrice}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}