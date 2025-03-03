"use client";

import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa"; // Import star icons

interface BuyCardProps {
  id: number;
  name: string;
  price: number; // Ensure price is a number
  category: string;
  image: string;
  route: string;
  rating?: number; // Optional rating property
}

const BuyCard: React.FC<BuyCardProps> = ({ name, price, image, rating = 4 }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-sm">
      <img src={image} alt={name} className="w-full h-40 object-cover rounded-lg mb-3" />
      
      <h3 className="text-lg font-semibold">{name}</h3>

      {/* Customer Review Stars */}
      <div className="flex items-center my-2">
        {Array.from({ length: 5 }).map((_, index) => (
          index < rating ? (
            <FaStar key={index} className="text-yellow-500 text-sm" />
          ) : (
            <FaRegStar key={index} className="text-gray-300 text-sm" />
          )
        ))}
      </div>

      {/* Price & Add to Cart Button in Single Row */}
      <div className="flex justify-between items-center mt-3">
        <span className="text-xl font-bold text-green-600">₹{price}</span>
        <button className="text-m font-bold px-5 py-3 bg-black text-white rounded-md hover:bg-gray-800">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BuyCard;
