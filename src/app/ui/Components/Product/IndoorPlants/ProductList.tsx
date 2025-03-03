"use client";

import React, { useState, useEffect } from "react";
import BuyCard from "../../BuyCard"; // ✅ Corrected import path
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import products from "../IndoorPlants/List"; // ✅ Updated import path

const categories = ["Low Maintenance", "Medium Maintenance", "High Maintenance"];

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(1000);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const filteredProducts = products
    .filter((product) => product.price <= priceRange)
    .filter((product) => selectedCategories.length === 0 || selectedCategories.includes(product.category))
    .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="flex">
      <aside className="hidden lg:block w-1/4 h-screen p-6 fixed top-20 left-0 overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">Filter</h3>
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <div className="mb-6">
          <label className="text-sm font-semibold block mb-2">Price: ₹{priceRange}</label>
          <input type="range" min="100" max="1000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full" />
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2">Category</h4>
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-2 mb-2">
              <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => handleCategoryChange(category)} className="h-4 w-4" />
              <span className="text-sm">{category}</span>
            </label>
          ))}
        </div>
      </aside>
      <div className="w-full lg:w-3/4 lg:ml-[25%] p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Plant Collection</h2>
        <AnimatePresence mode="wait">
          <motion.div key={currentPage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => <BuyCard key={product.id} {...product} />)
            ) : (
              <p className="text-center col-span-3">No products match your filter.</p>
            )}
          </motion.div>
        </AnimatePresence>
        <div className="flex justify-center mt-8">
          <button className={`px-4 py-2 mx-2 rounded-md ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white"}`} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Prev</button>
          <span className="px-4 py-2 text-lg font-semibold">{currentPage} / {totalPages}</span>
          <button className={`px-4 py-2 mx-2 rounded-md ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white"}`} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
