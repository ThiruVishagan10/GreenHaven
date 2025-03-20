"use client";

import React, { useState, useEffect } from "react";
import CustomSlider from "../CustomSlider";
import { useRouter } from "next/navigation";
import { db } from "../../../../../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { CircularProgress } from "@nextui-org/react";
import { Product } from "../../../../types/product";



const IndoorPlants = () => {
  const router = useRouter(); // ✅ Moved inside the component
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchIndoorPlants = async () => {
      try {
        setIsLoading(true);
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

  // Take only the first 6 products for the slider
  const featuredProducts = products.slice(0, 6);


  return (
    <section className="py-12 bg-pink-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Featured Indoor Plants</h2>
        <CustomSlider
           items={featuredProducts.map((product) => ({
            id: product.id,
            name: product.name,
            image: product.mainImage,
            description: product.description,
            price: product.price,
            offeredPrice: product.offeredPrice,
            path: `/product/${product.id}`,
            action: (
              <button
                className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                onClick={() => router.push("/IndoorPlants/ProductList")} // ✅ Corrected router usage
              >
                Explore More
              </button>
            ),
            hoverEffect: "hover:shadow-lg hover:scale-105 transition-transform",
          }))}
        />
        <button className="mt-16 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
                onClick={() => router.push("/product/indoorplants")}> 
                Explore More
        </button>
      </div>
    </section>
  );
};

export default IndoorPlants;
