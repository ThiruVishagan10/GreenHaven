"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import List from "../IndoorPlants/List"; // Import the List data

const Hero = () => {
  const { id } = useParams(); // Get the product ID from the route
  const product = List.find((item) => item.id === Number(id)); // Find the product by ID

  if (!product) {
    return <p className="text-center text-gray-500">Product not found</p>;
  }

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <Image
            src={`/${product.image}`} // Ensure image paths are correct
            alt={product.name}
            width={500}
            height={500}
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-600 mt-4">Category: {product.category}</p>

          {/* Pricing */}
          <div className="mt-4 flex items-center space-x-4">
            <span className="text-2xl font-semibold text-green-600">
              ₹{product.price}
            </span>
          </div>

          {/* Buy Now Button */}
          <button className="mt-6 px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition">
            Buy Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
