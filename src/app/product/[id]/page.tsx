// // src/app/product/[id]/page.tsx
// "use client"

// import { getProduct } from "../../../lib/firestore/createProduct/read";
// import { useEffect, useState } from "react";
// import { CircularProgress } from "@nextui-org/react";
// import Image from "next/image";
// import { Product } from "@/types/product";

// export default function ProductPage({ params }: { params: { id: string } }) {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedImage, setSelectedImage] = useState<string>('');

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const data = await getProduct({ id: params.id });
//         if (data) {
//           setProduct(data);
//           setSelectedImage(data.mainImage);
//         } else {
//           setError('Product not found');
//         }
//       } catch (err) {
//         setError('Failed to fetch product');
//         console.error('Error:', err);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [params.id]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <CircularProgress />
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="text-red-500 text-center py-4">
//         {error || 'Product not found'}
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {/* Image Section */}
//         <div className="space-y-4">
//           {/* Main Image */}
//           <div className="relative h-96 w-full rounded-lg overflow-hidden">
//             <Image
//               src={selectedImage}
//               alt={product.name}
//               fill
//               className="object-cover"
//               sizes="(max-width: 768px) 100vw, 50vw"
//             />
//           </div>

//           {/* Thumbnail Images */}
//           <div className="flex space-x-2 overflow-x-auto">
//             <button
//               onClick={() => setSelectedImage(product.mainImage)}
//               className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
//                 selectedImage === product.mainImage ? 'ring-2 ring-green-500' : ''
//               }`}
//             >
//               <Image
//                 src={product.mainImage}
//                 alt={product.name}
//                 fill
//                 className="object-cover"
//                 sizes="80px"
//               />
//             </button>
//             {product.additionalImages?.map((image, index) => (
//               <button
//                 key={index}
//                 onClick={() => setSelectedImage(image)}
//                 className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
//                   selectedImage === image ? 'ring-2 ring-green-500' : ''
//                 }`}
//               >
//                 <Image
//                   src={image}
//                   alt={`${product.name} ${index + 1}`}
//                   fill
//                   className="object-cover"
//                   sizes="80px"
//                 />
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Product Details */}
//         <div className="space-y-6">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800 mb-2">
//               {product.name}
//             </h1>
//             <p className="text-gray-600">{product.category}</p>
//           </div>

//           {/* Price */}
//           <div className="space-y-1">
//             <div className="flex items-baseline space-x-2">
//               <span className="text-3xl font-bold text-green-600">
//                 ₹{parseFloat(product.offeredPrice).toFixed(2)}
//               </span>
//               {product.price !== product.offeredPrice && (
//                 <span className="text-xl text-gray-500 line-through">
//                   ₹{parseFloat(product.price).toFixed(2)}
//                 </span>
//               )}
//             </div>
//             {product.price !== product.offeredPrice && (
//               <p className="text-green-600">
//                 Save ₹{(parseFloat(product.price) - parseFloat(product.offeredPrice)).toFixed(2)}
//               </p>
//             )}
//           </div>

//           {/* Special Offers */}
//           {product.specialOffers && product.specialOffers.length > 0 && (
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="font-medium text-gray-800 mb-2">Special Offers</h3>
//               <ul className="list-disc list-inside space-y-1">
//                 {product.specialOffers.map((offer, index) => (
//                   <li key={index} className="text-gray-600">
//                     {offer}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {/* Description */}
//           <div>
//             <h3 className="font-medium text-gray-800 mb-2">Description</h3>
//             <p className="text-gray-600 whitespace-pre-line">
//               {product.description}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


// "use client";

// import React, { useState, useEffect } from "react";
// import { CircularProgress } from "@nextui-org/react";
// import Image from "next/image";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../../firebase";
// import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
// import { motion } from "framer-motion";

// interface Product {
//   id: string;
//   name: string;
//   category: string;
//   price: string;
//   offeredPrice: string;
//   description: string;
//   mainImage: string;
//   maintenance?: string;
//   details?: string;
//   care?: string;
//   benefits?: string;
// }

// export default function ProductPage({ params }: { params: { id: string } }) {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [quantity, setQuantity] = useState(1);
//   const [activeTab, setActiveTab] = useState<'details' | 'care' | 'benefits'>('details');
//   const [isWishlist, setIsWishlist] = useState(false);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const docRef = doc(db, "products", params.id);
//         const docSnap = await getDoc(docRef);

//         if (docSnap.exists()) {
//           setProduct({
//             id: docSnap.id,
//             ...docSnap.data() as Omit<Product, 'id'>
//           });
//         } else {
//           setError("Product not found");
//         }
//       } catch (err) {
//         console.error("Error fetching product:", err);
//         setError("Failed to fetch product details");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [params.id]);

//   const handleQuantityChange = (action: 'increase' | 'decrease') => {
//     if (action === 'increase') {
//       setQuantity(prev => prev + 1);
//     } else if (action === 'decrease' && quantity > 1) {
//       setQuantity(prev => prev - 1);
//     }
//   };

//   const calculateDiscount = () => {
//     if (!product) return 0;
//     const originalPrice = parseFloat(product.price);
//     const discountedPrice = parseFloat(product.offeredPrice);
//     return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <CircularProgress />
//       </div>
//     );
//   }

//   if (error || !product) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
//           <p className="text-gray-600">{error || "Product not found"}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
//             {/* Image Section */}
//             <div className="relative aspect-square rounded-lg overflow-hidden">
//               <Image
//                 src={product.mainImage}
//                 alt={product.name}
//                 fill
//                 className="object-cover"
//                 sizes="(max-width: 768px) 100vw, 50vw"
//                 priority
//               />
//               {calculateDiscount() > 0 && (
//                 <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
//                   {calculateDiscount()}% OFF
//                 </div>
//               )}
//             </div>

//             {/* Product Details Section */}
//             <div className="flex flex-col">
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
//                 {product.name}
//               </h1>

//               <div className="flex items-baseline space-x-4 mb-6">
//                 <span className="text-3xl font-bold text-green-600">
//                   ₹{parseFloat(product.offeredPrice).toFixed(2)}
//                 </span>
//                 {product.price !== product.offeredPrice && (
//                   <span className="text-xl text-gray-500 line-through">
//                     ₹{parseFloat(product.price).toFixed(2)}
//                   </span>
//                 )}
//               </div>

//               {/* Category and Maintenance */}
//               <div className="space-y-2 mb-6">
//                 <p className="text-gray-600">
//                   <span className="font-semibold">Category:</span> {product.category}
//                 </p>
//                 {product.maintenance && (
//                   <p className="text-gray-600">
//                     <span className="font-semibold">Maintenance:</span> {product.maintenance}
//                   </p>
//                 )}
//               </div>

//               {/* Quantity Selector */}
//               <div className="flex items-center space-x-4 mb-6">
//                 <span className="text-gray-700 font-medium">Quantity:</span>
//                 <div className="flex items-center border border-gray-300 rounded-md">
//                   <button
//                     onClick={() => handleQuantityChange('decrease')}
//                     className="p-2 hover:bg-gray-100"
//                     disabled={quantity <= 1}
//                   >
//                     <Minus size={20} className={quantity <= 1 ? 'text-gray-300' : 'text-gray-600'} />
//                   </button>
//                   <span className="px-4 py-2 text-gray-700">{quantity}</span>
//                   <button
//                     onClick={() => handleQuantityChange('increase')}
//                     className="p-2 hover:bg-gray-100"
//                   >
//                     <Plus size={20} className="text-gray-600" />
//                   </button>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-4 mb-8">
//                 <motion.button
//                   whileTap={{ scale: 0.95 }}
//                   className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
//                 >
//                   <ShoppingCart size={20} />
//                   <span>Add to Cart</span>
//                 </motion.button>
//                 <motion.button
//                   whileTap={{ scale: 0.95 }}
//                   onClick={() => setIsWishlist(!isWishlist)}
//                   className={`flex items-center justify-center p-3 rounded-md border ${
//                     isWishlist 
//                       ? 'border-red-500 text-red-500' 
//                       : 'border-gray-300 text-gray-600'
//                   }`}
//                 >
//                   <Heart 
//                     size={20} 
//                     fill={isWishlist ? "currentColor" : "none"} 
//                   />
//                 </motion.button>
//               </div>

//               {/* Tabs */}
//               <div className="border-t border-gray-200 pt-6">
//                 <div className="flex space-x-6 mb-6">
//                   {['details', 'care', 'benefits'].map((tab) => (
//                     <button
//                       key={tab}
//                       onClick={() => setActiveTab(tab as typeof activeTab)}
//                       className={`text-sm font-medium capitalize ${
//                         activeTab === tab 
//                           ? 'text-green-600 border-b-2 border-green-600' 
//                           : 'text-gray-500 hover:text-gray-700'
//                       } pb-2`}
//                     >
//                       {tab}
//                     </button>
//                   ))}
//                 </div>
//                 <div className="prose prose-sm max-w-none text-gray-600">
//                   {activeTab === 'details' && <p>{product.details || product.description}</p>}
//                   {activeTab === 'care' && <p>{product.care || "Care instructions not available"}</p>}
//                   {activeTab === 'benefits' && <p>{product.benefits || "Benefits information not available"}</p>}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { CircularProgress } from "@nextui-org/react";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  offeredPrice: string;
  description: string;
  mainImage: string;
  additionalImages?: string[];
  specialOffers?: string[];
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isWishlist, setIsWishlist] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = {
            id: docSnap.id,
            ...docSnap.data() as Omit<Product, 'id'>
          };
          setProduct(productData);
          setSelectedImage(productData.mainImage);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (action: 'increase' | 'decrease') => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const calculateDiscount = () => {
    if (!product) return 0;
    const originalPrice = parseFloat(product.price);
    const discountedPrice = parseFloat(product.offeredPrice);
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-600">{error || "Product not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image Section */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-lg overflow-hidden">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {calculateDiscount() > 0 && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {calculateDiscount()}% OFF
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              <div className="flex space-x-2 overflow-x-auto">
                <button
                  onClick={() => setSelectedImage(product.mainImage)}
                  className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                    selectedImage === product.mainImage ? 'ring-2 ring-green-500' : ''
                  }`}
                >
                  <Image
                    src={product.mainImage}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
                {product.additionalImages?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(image)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                      selectedImage === image ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="flex flex-col">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {/* Price Section */}
              <div className="flex items-baseline space-x-4 mb-6">
                <span className="text-3xl font-bold text-green-600">
                  ₹{parseFloat(product.offeredPrice).toFixed(2)}
                </span>
                {product.price !== product.offeredPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{parseFloat(product.price).toFixed(2)}
                    </span>
                    <span className="text-sm text-green-600">
                      Save ₹{(parseFloat(product.price) - parseFloat(product.offeredPrice)).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Category */}
              <div className="mb-6">
                <p className="text-gray-600">
                  <span className="font-semibold">Category:</span> {product.category}
                </p>
              </div>

              {/* Special Offers Section */}
              {product.specialOffers && product.specialOffers.length > 0 && (
                <div className="mb-6">
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Special Offers
                    </h3>
                    <ul className="space-y-2">
                      {product.specialOffers.map((offer, index) => (
                        <li 
                          key={index}
                          className="flex items-start space-x-2 text-green-700"
                        >
                          <span className="text-green-500 mt-1">•</span>
                          <span>{offer}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange('decrease')}
                    className="p-2 hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus size={20} className={quantity <= 1 ? 'text-gray-300' : 'text-gray-600'} />
                  </button>
                  <span className="px-4 py-2 text-gray-700">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange('increase')}
                    className="p-2 hover:bg-gray-100"
                  >
                    <Plus size={20} className="text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md font-medium flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
                >
                  <ShoppingCart size={20} />
                  <span>Add to Cart</span>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsWishlist(!isWishlist)}
                  className={`flex items-center justify-center p-3 rounded-md border ${
                    isWishlist 
                      ? 'border-red-500 text-red-500' 
                      : 'border-gray-300 text-gray-600'
                  }`}
                >
                  <Heart 
                    size={20} 
                    fill={isWishlist ? "currentColor" : "none"} 
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
