// "use client";

// import React, { useState, useEffect } from "react";
// import BuyCard from "../../BuyCard"; // ✅ Corrected import path
// import { motion, AnimatePresence } from "framer-motion";
// import { Search } from "lucide-react";
// import products from "../IndoorPlants/List"; // ✅ Updated import path

// const categories = ["Low Maintenance", "Medium Maintenance", "High Maintenance"];

// const ProductList = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 9;
//   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
//   const [priceRange, setPriceRange] = useState(1000);
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }, [currentPage]);

//   const filteredProducts = products
//     .filter((product) => product.price <= priceRange)
//     .filter((product) => selectedCategories.length === 0 || selectedCategories.includes(product.category))
//     .filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()));

//   const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
//   const indexOfLastProduct = currentPage * itemsPerPage;
//   const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
//   const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

//   const handleCategoryChange = (category: string) => {
//     setSelectedCategories((prev) =>
//       prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
//     );
//   };

//   return (
//     <div className="flex">
//       <aside className="hidden lg:block w-1/4 h-screen p-6 fixed top-20 left-0 overflow-y-auto">
//         <h3 className="text-lg font-bold mb-4">Filter</h3>
//         {/* Search Bar */}
//         <div className="relative mb-6">
//           <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Search products..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
//           />
//         </div>
//         <div className="mb-6">
//           <label className="text-sm font-semibold block mb-2">Price: ₹{priceRange}</label>
//           <input type="range" min="100" max="1000" value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} className="w-full" />
//         </div>
//         <div>
//           <h4 className="text-sm font-semibold mb-2">Category</h4>
//           {categories.map((category) => (
//             <label key={category} className="flex items-center space-x-2 mb-2">
//               <input type="checkbox" checked={selectedCategories.includes(category)} onChange={() => handleCategoryChange(category)} className="h-4 w-4" />
//               <span className="text-sm">{category}</span>
//             </label>
//           ))}
//         </div>
//       </aside>
//       <div className="w-full lg:w-3/4 lg:ml-[25%] p-8">
//         <h2 className="text-2xl font-bold mb-6 text-center">Our Plant Collection</h2>
//         <AnimatePresence mode="wait">
//           <motion.div key={currentPage} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {currentProducts.length > 0 ? (
//               currentProducts.map((product) => <BuyCard key={product.id} {...product} />)
//             ) : (
//               <p className="text-center col-span-3">No products match your filter.</p>
//             )}
//           </motion.div>
//         </AnimatePresence>
//         <div className="flex justify-center mt-8">
//           <button className={`px-4 py-2 mx-2 rounded-md ${currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white"}`} onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Prev</button>
//           <span className="px-4 py-2 text-lg font-semibold">{currentPage} / {totalPages}</span>
//           <button className={`px-4 py-2 mx-2 rounded-md ${currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black text-white"}`} onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductList;


"use client";

import React, { useState, useEffect } from "react";
import { CircularProgress } from "@nextui-org/react";
import BuyCard from "../../BuyCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../../../firebase";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  offeredPrice: string;
  description: string;
  mainImage: string;
  maintenance?: string;
}

const maintenanceCategories = [
  { value: "all", label: "All Maintenance" },
  { value: "Low Maintenance", label: "Low Maintenance" },
  { value: "Medium Maintenance", label: "Medium Maintenance" },
  { value: "High Maintenance", label: "High Maintenance" },
];

export default function ProductList() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaintenance, setSelectedMaintenance] = useState("all");
  const [priceRange, setPriceRange] = useState(1000);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchIndoorPlants = async () => {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", "Indoor Plants"));
        const querySnapshot = await getDocs(q);
        
        const indoorPlants: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Product, 'id'>;
          indoorPlants.push({
            id: doc.id,
            ...data,
          });
        });

        setProducts(indoorPlants);
      } catch (err) {
        console.error("Error fetching indoor plants:", err);
        setError('Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndoorPlants();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedMaintenance, priceRange]);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleMaintenanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMaintenance(e.target.value);
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

  const resetFilters = () => {
    setInputValue("");
    setSearchQuery("");
    setSelectedMaintenance("all");
    setPriceRange(1000);
    setIsMobileFiltersOpen(false);
  };

  const filteredProducts = products.filter((product) => {
    const searchTerms = searchQuery.toLowerCase().split(' ');
    const productName = product.name.toLowerCase();
    const productDescription = product.description.toLowerCase();
    
    const matchesSearch = searchTerms.every(term => 
      productName.includes(term) || productDescription.includes(term)
    );
    
    const matchesMaintenance = selectedMaintenance === "all" || 
      product.maintenance?.toLowerCase() === selectedMaintenance.toLowerCase();
    
    const matchesPrice = parseFloat(product.price) <= priceRange;
    
    return matchesSearch && matchesMaintenance && matchesPrice;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          Maintenance Level
        </label>
        <select
          value={selectedMaintenance}
          onChange={handleMaintenanceChange}
          className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          {maintenanceCategories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
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

      {(searchQuery || selectedMaintenance !== "all" || priceRange < 1000) && (
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
                <span className="text-sm truncate flex-1 mr-2">Search: {searchQuery}</span>
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
            {selectedMaintenance !== "all" && (
              <div className="flex items-center justify-between">
                <span className="text-sm truncate flex-1 mr-2">
                  Maintenance: {selectedMaintenance}
                </span>
                <button
                  onClick={() => setSelectedMaintenance("all")}
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
    <div className="min-h-screen bg-gray-50">
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
          aria-label="Open filters"
        >
          <Filter size={24} />
        </button>
      </div>

      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-[300px] bg-white p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Filters</h3>
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
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-4">
              <h3 className="text-lg font-bold mb-4">Filters</h3>
              <SearchAndFilters />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Indoor Plants</h1>
              <span className="text-sm text-gray-500">
                {filteredProducts.length} products
              </span>
            </div>

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
            
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
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
                      className="cursor-pointer"
                      onClick={() => handleProductClick(product.id)}
                    >
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
