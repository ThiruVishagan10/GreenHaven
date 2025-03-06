// app/admin/products/page.tsx
"use client"

import { Button } from "@nextui-org/react";
import Link from "next/link";
import ListView from "../components/ListView";
import { useState, useEffect } from "react";
import { useProducts } from "@/lib/firestore/createProduct/read";
import { CircularProgress } from "@nextui-org/react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  mainImage?: string;
  additionalImages?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductsPage() {
  const { data: allProducts, error, isLoading } = useProducts();
  
  // State for filters and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [paginatedProducts, setPaginatedProducts] = useState<Product[]>([]);
  
  // Changed to 10 items per page
  const itemsPerPage = 10;

  // Categories data
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'indoor', label: 'Indoor Plants' },
    { value: 'outdoor', label: 'Outdoor Plants' },
    { value: 'succulents', label: 'Succulents' },
    { value: 'tools', label: 'Gardening Tools' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' }
  ];

  // Filter and sort products
  useEffect(() => {
    if (!allProducts) return;

    let filtered = [...allProducts];

    // Apply search filter
    if (searchQuery.trim()) {
      const searchLower = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) ||
        product.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        case 'price-asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default: // newest
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
      }
    });

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  // Handle pagination
  useEffect(() => {
    if (!filteredProducts) return;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil((filteredProducts?.length || 0) / itemsPerPage);

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  // Handle product deletion
  const handleProductDelete = () => {
    window.location.reload();
  };

  // Calculate the range of items being displayed
  const startItem = filteredProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredProducts.length);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link href="/admin/CreateProduct">
          <Button 
            className="bg-green-600 text-white"
            size="sm"
          >
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filters Section */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* List View Section */}
      <div className="bg-white rounded-lg shadow-sm">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">
            Error loading products
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No products found</p>
          </div>
        ) : (
          <>
            <ListView 
              products={paginatedProducts} 
              onDelete={handleProductDelete}
            />
            
            {/* Showing items range */}
            <div className="px-6 py-3 text-sm text-gray-500">
              Showing {startItem} to {endItem} of {filteredProducts.length} items
            </div>
          </>
        )}
      </div>

      {/* Pagination Section */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Previous
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === index + 1
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}

      {/* Active filters */}
      {(searchQuery || selectedCategory !== 'all') && (
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
          <span>Active filters:</span>
          {searchQuery && (
            <span className="bg-gray-100 px-2 py-1 rounded-md">
              Search: {searchQuery}
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span className="bg-gray-100 px-2 py-1 rounded-md">
              Category: {categories.find(c => c.value === selectedCategory)?.label}
            </span>
          )}
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
            className="text-red-500 hover:text-red-700"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
