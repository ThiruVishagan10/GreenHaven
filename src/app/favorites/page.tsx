"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/lib/context/FavoritesContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { UserAuth } from "@/lib/context/AuthContent";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Heart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const {
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    loading: favoriteLoading,
  } = useFavorites();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const { user } = UserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const fetchFavoriteProducts = async () => {
      if (favoriteLoading) return;

      try {
        setIsLoading(true);
        const productsRef = collection(db, "products");
        const querySnapshot = await getDocs(productsRef);

        const allProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          if (isFavorite(doc.id)) {
            allProducts.push({ id: doc.id, ...doc.data() } as Product);
          }
        });

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching favorite products:", error);
        setError("Failed to fetch favorite products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [user, router, favoriteLoading, isFavorite]);

  const handleFavoriteClick = async (
    e: React.MouseEvent,
    productId: string
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [productId]: true }));

      if (isFavorite(productId)) {
        await removeFromFavorites(productId);
        // Remove product from local state
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      setError("Failed to update favorite status");
    } finally {
      setActionLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (!user) {
    return null;
  }

  if (isLoading || favoriteLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">My Favorites</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 mb-4">No favorite items yet</p>
          <button
            onClick={() => router.push("/product")}
            className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          {/* Reduced gap and added more columns for larger screens */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleProductClick(product.id)}
              >
                {/* Image Container with Fixed Aspect Ratio */}
                <div className="relative w-full aspect-square bg-gray-100">
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    priority={false}
                  />
                  <button
                    onClick={(e) => handleFavoriteClick(e, product.id)}
                    disabled={actionLoading[product.id] || favoriteLoading}
                    className={`absolute top-2 right-2 p-2 rounded-full 
                      bg-white/80 backdrop-blur-sm shadow-md 
                      hover:bg-white transition-all duration-200 z-10
                      ${
                        actionLoading[product.id] || favoriteLoading
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    aria-label={
                      isFavorite(product.id)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {actionLoading[product.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                    ) : (
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          isFavorite(product.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600 hover:text-gray-900"
                        }`}
                      />
                    )}
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <div className="mb-1.5">
                    <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500">{product.category}</p>
                  </div>

                  <p className="text-xs text-gray-600 line-clamp-2 min-h-[2rem] mb-2">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 line-through">
                        ₹{product.price}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        ₹{product.offeredPrice}
                      </span>
                    </div>
                    <div className="text-[10px] px-1.5 py-0.5 bg-green-50 rounded text-green-600 font-medium">
                      {(() => {
                        const discount = Math.round(
                          ((parseFloat(product.price) -
                            parseFloat(product.offeredPrice)) /
                            parseFloat(product.price)) *
                            100
                        );
                        return `${discount}% OFF`;
                      })()}
                    </div>
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
