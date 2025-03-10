"use client";

import React, { useState, useEffect } from "react";
import { CircularProgress } from "@nextui-org/react";
import BuyCard from "../BuyCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { Product, ProductListProps, SORT_OPTIONS } from "../../../../types/product";

export default function ProductListComponent({ 
  category,
  itemsPerPage = 9,
  initialPriceRange = 1000,
  className = ""
}: ProductListProps) {
  const router = useRouter();
  
  // State management
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [sortOption, setSortOption] = useState("featured");

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Sync favorites across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorites') {
        const newFavorites = e.newValue ? JSON.parse(e.newValue) : [];
        setFavorites(new Set(newFavorites));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", category));
        const querySnapshot = await getDocs(q);
        
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Product, 'id'>;
          fetchedProducts.push({
            id: doc.id,
            ...data,
          });
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

  // Event handlers
  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const toggleFavorite = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      localStorage.setItem('favorites', JSON.stringify([...newFavorites]));
      return newFavorites;
    });
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

  // Product filtering and sorting
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

  const sortProducts = (productsToSort: Product[]) => {
    const sorted = [...productsToSort];
    
    switch (sortOption) {
      case "price-low-high":
        return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      case "price-high-low":
        return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      case "name-a-z":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case "name-z-a":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case "newest":
        return sorted.sort((a, b) => 
          new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
      default:
        return sorted;
    }
  };

  const sortedProducts = sortProducts(filteredProducts);
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const currentProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Search and Filters component
  const SearchAndFilters = () => (
    <div className="space-y-4">
      <div className="relative flex">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search plants..."
            value={inputValue}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
        <button
          onClick={handleSearchSubmit}
          className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Search
        </button>
      </div>

      <div>
        <label className="text-sm font-semibold block mb-2">
          Sort By
        </label>
        <select
          value={sortOption}
          onChange={handleSortChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {SORT_OPTIONS.map((option: { value: string; label: string }) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold block mb-2">
          Maximum Price: ₹{priceRange}
        </label>
        <input
          type="range"
          min="100"
          max="1000"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-green-500"
        />
      </div>

      {(searchQuery || priceRange < initialPriceRange) && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Active Filters</h4>
            <button
              onClick={resetFilters}
              className="text-sm text-green-600 hover:text-green-700"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-2">
            {searchQuery && (
              <div className="flex items-center justify-between">
                <span className="text-sm truncate flex-1 mr-2">
                  Search: {searchQuery}
                </span>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setInputValue("");
                  }}
                  className="text-red-500 text-sm flex-shrink-0"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

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
          className="bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
          aria-label="Open filters"
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
                aria-label="Close filters"
              >
                <X size={24} />
              </button>
            </div>
            <SearchAndFilters />
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4">
              <h3 className="text-lg font-bold mb-4">Filters & Sort</h3>
              <SearchAndFilters />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">{category}</h1>
              <span className="text-sm text-gray-500">
                {sortedProducts.length} products
              </span>
            </div>

            {/* Mobile Search */}
            <div className="lg:hidden mb-6">
              <div className="relative flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search plants..."
                    value={inputValue}
                    onChange={handleSearchChange}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <button
                  onClick={handleSearchSubmit}
                  className="ml-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage + sortOption}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              >
                {currentProducts.length > 0 ? (
                  currentProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.02 }}
                      className="cursor-pointer relative"
                      onClick={() => handleProductClick(product.id)}
                    >
                      <div className="absolute top-2 right-2 z-10">
                        <button
                          onClick={(e) => toggleFavorite(e, product.id)}
                          className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-all duration-200 transform hover:scale-110"
                          aria-label={favorites.has(product.id) ? "Remove from favorites" : "Add to favorites"}
                        >
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={favorites.has(product.id) ? 'filled' : 'empty'}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Heart
                                size={20}
                                className={`transition-colors ${
                                  favorites.has(product.id)
                                    ? "fill-red-500 text-red-500"
                                    : "fill-none text-gray-500"
                                }`}
                              />
                            </motion.div>
                          </AnimatePresence>
                        </button>
                      </div>
                      <BuyCard {...product} />
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-10">
                    <p className="text-gray-500">No products match your filters</p>
                    <button
                      onClick={resetFilters}
                      className="mt-4 text-green-600 hover:text-green-700"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-8">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed"
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
