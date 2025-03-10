// src/components/ProductCard.tsx
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const calculateDiscount = (price: string, offeredPrice: string) => {
    const originalPrice = parseFloat(price);
    const discountedPrice = parseFloat(offeredPrice);
    if (originalPrice && discountedPrice) {
      const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  return (
    <Link 
      href={`/product/${product.id}`}
      className="group"
    >
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
        {/* Image Container */}
        <div className="relative h-64 w-full">
          <Image
            src={product.mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Discount Badge */}
          {calculateDiscount(product.price, product.offeredPrice) > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
              {calculateDiscount(product.price, product.offeredPrice)}% OFF
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-1">
            {product.name}
          </h3>
          
          <div className="space-y-1">
            {/* Price */}
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-bold text-green-600">
                ₹{parseFloat(product.offeredPrice).toFixed(2)}
              </span>
              {product.price !== product.offeredPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{parseFloat(product.price).toFixed(2)}
                </span>
              )}
            </div>

            {/* Description Preview */}
            <p className="text-sm text-gray-500 line-clamp-2">
              {product.description}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
