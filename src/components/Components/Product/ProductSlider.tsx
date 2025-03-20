"use client";

import React, { useState, useEffect } from "react";
import CustomSlider from "../CustomSlider";
import { useRouter } from "next/navigation";
import { db } from "@/../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { CircularProgress } from "@nextui-org/react";

interface ProductSliderProps {
  category: string;
}

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  mainImage: string;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ category }) => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("category", "==", category));
        const querySnapshot = await getDocs(q);
        
        const categoryProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<Product, 'id'>;
          categoryProducts.push({
            id: doc.id,
            ...data,
          });
        });

        setProducts(categoryProducts);
      } catch (err) {
        console.error(`Error fetching ${category}:`, err);
        setError('Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
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

  // Take first 6 products for the slider
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-12 bg-pink-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Featured {category}</h2>
        <div className="max-w-7xl mx-auto">
          <CustomSlider
            items={featuredProducts.map((product) => ({
              id: Number(product.id),
              name: product.name,
              image: product.mainImage,
              description: product.description,
              path: `/product/${product.id}`,
            }))}
          />
          <button
          className="mt-16 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          onClick={() => router.push(`/product/${category.toLowerCase().trim().replace(/\s+/g, '')}`)}
        >
          Explore More
        </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;