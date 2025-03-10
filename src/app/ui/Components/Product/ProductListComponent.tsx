// components/ProductListComponent.tsx

"use client";

import React, { useState, useEffect } from "react";
import { CircularProgress } from "@nextui-org/react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { useFavorites } from "@/lib/context/FavoritesContext";
import { UserAuth } from "../../../../lib/context/AuthContent";
import Image from "next/image";

// Types
interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  offeredPrice: string;
  description: string;
  mainImage: string;
  createdAt: string;
}

interface ProductListProps {
  category: string;
  itemsPerPage?: number;
  initialPriceRange?: number;
  className?: string;
}

interface SortOption {
  value: string;
  label: string;
}

const SORT_OPTIONS: SortOption[] = [
  { value: "featured", label: "Featured" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "name-a-z", label: "Name: A to Z" },
  { value: "name-z-a", label: "Name: Z to A" },
  { value: "newest", label: "Newest First" }
];

export default function ProductListComponent({
  category,
  itemsPerPage = 9,
  initialPriceRange = 1000,
  className = ""
}: ProductListProps) {
  const router = useRouter();
  const { user } = UserAuth();
  const { favorites, toggleFavorite } = useFavorites();

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortOption, setSortOption] = useState("featured");

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", category));
        const querySnapshot = await getDocs(q);
        
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ 
            id: doc.id, 
            ...doc.data() 
          } as Product);
        });

        setProducts(fetchedProducts);
      } catch (err) {
        console.error(`Error fetching ${category}:`, err);
        setError('Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, priceRange, sortOption]);

  // Event Handlers
  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleFavoriteClick = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    if (!user) {
      router.push('/login');
      return;
    }
    await toggleFavorite(productId);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setSearchQuery((e.target as HTMLInputElement).value);
    }
  };

  const handleSearchSubmit = () => {
    setSearchQuery(inputValue);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const resetFilters = () => {
    setInputValue("");
    setSearchQuery("");
    setPriceRange(initialPriceRange);
    setSortOption("featured");
    setIsMobileFiltersOpen(false);
  };

  // Filter and Sort Products
  const filteredProducts = products.filter((product) => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const productName = product.name.toLowerCase();
    const productDescription = product.description.toLowerCase();
    
    const matchesSearch = searchTerms.every(term => 
      productName.includes(term) || productDescription.includes(term)
    );
    
    const matchesPrice = parseFloat(product.price) <= priceRange;
    
    return matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low-high":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high-low":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name-a-z":
        return a.name.localeCompare(b.name);
      case "name-z-a":
        return b.name.localeCompare(a.name);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Product Card Component
  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-square">
        <Image
          src={product.mainImage}
          alt={product.name}
          fill
          className="object-cover"
        />
        <button
          onClick={(e) => handleFavoriteClick(e, product.id)}
          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all duration-200"
        >
          <Heart
            size={20}
            className={`transition-colors ${
              favorites.has(product.id)
                ? "fill-red-500 text-red-500"
                : "fill-none text-gray-500"
            }`}
          />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
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
        </div>
      </div>
    </div>
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="text-red-500 text-center py-4">
        {error}
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Mobile Filter Button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg"
        >
          <Filter size={24} />
        </button>
      </div>

      {/* Mobile Filters */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50" 
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-[300px] bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Filters & Sort</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={24} />
              </button>
            </div>
            {/* Mobile Filters Content */}
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={inputValue}
                  onChange={handleSearchChange}
                  onKeyPress={handleSearchKeyPress}
                  className="w-full pl-10 pr-4 py-2 border rounded-md"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={sortOption}
                  onChange={handleSortChange}
                  className="w-full p-2 border rounded-md"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Price Range: ₹{priceRange}
                </label>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64">
            <div className="sticky top-4 space-y-4">
              <h3 className="text-lg font-bold mb-4">Filters & Sort</h3>
              {/* Desktop Filters Content */}
              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={inputValue}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full pl-10 pr-4 py-2 border rounded-md"
                  />
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <select
                    value={sortOption}
                    onChange={handleSortChange}
                    className="w-full p-2 border rounded-md"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Price Range: ₹{priceRange}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{category}</h1>
              <span className="text-sm text-gray-500">
                {sortedProducts.length} products
              </span>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleProductClick(product.id)}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
