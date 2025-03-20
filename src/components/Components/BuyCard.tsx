// "use client";

// import React from "react";
// import { FaStar, FaRegStar } from "react-icons/fa"; // Import star icons

// interface BuyCardProps {
//   id: number;
//   name: string;
//   price: number; // Ensure price is a number
//   category: string;
//   image: string;
//   route: string;
//   rating?: number; // Optional rating property
// }

// const BuyCard: React.FC<BuyCardProps> = ({ name, price, image, rating = 4 }) => {
//   return (
//     <div className="bg-white p-4 rounded-xl shadow-lg w-full max-w-sm">
//       <img src={image} alt={name} className="w-full h-40 object-cover rounded-lg mb-3" />
      
//       <h3 className="text-lg font-semibold">{name}</h3>

//       {/* Customer Review Stars */}
//       <div className="flex items-center my-2">
//         {Array.from({ length: 5 }).map((_, index) => (
//           index < rating ? (
//             <FaStar key={index} className="text-yellow-500 text-sm" />
//           ) : (
//             <FaRegStar key={index} className="text-gray-300 text-sm" />
//           )
//         ))}
//       </div>

//       {/* Price & Add to Cart Button in Single Row */}
//       <div className="flex justify-between items-center mt-3">
//         <span className="text-xl font-bold text-green-600">₹{price}</span>
//         <button className="text-m font-bold px-5 py-3 bg-black text-white rounded-md hover:bg-gray-800">
//           Add to Cart
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BuyCard;

// src/app/ui/Components/BuyCard.tsx
import React from 'react';
import Image from 'next/image';

interface BuyCardProps {
  id: string;
  name: string;
  price: string;
  offeredPrice: string;
  description: string;
  mainImage: string;
  category: string;
}

const BuyCard: React.FC<BuyCardProps> = ({
  name,
  price,
  offeredPrice,
  description,
  mainImage,
}) => {
  // Calculate discount percentage
  const calculateDiscount = () => {
    const originalPrice = parseFloat(price);
    const discountedPrice = parseFloat(offeredPrice);
    if (originalPrice && discountedPrice) {
      const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
      {/* Image Container */}
      <div className="relative h-64 w-full">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // Add error handling
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-image.jpg'; // Add a placeholder image
            }}
          />
        ) : (
          // Placeholder when no image is available
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        {calculateDiscount() > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            {calculateDiscount()}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-1">{name}</h3>
        
        <div className="space-y-2">
          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <span className="text-xl font-bold text-green-600">
              ₹{parseFloat(offeredPrice).toFixed(2)}
            </span>
            {price !== offeredPrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{parseFloat(price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-gray-500 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuyCard;
