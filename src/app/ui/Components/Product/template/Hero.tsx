import { useMemo } from "react";
import OutdoorPlantsList from "./List"; // Ensure correct import
import { FaStar } from "react-icons/fa";

interface HeroProps {
  productId: string;
}

const Hero: React.FC<HeroProps> = ({ productId }) => {
  const product = useMemo(
    () => OutdoorPlantsList.find((item) => item.id === Number(productId)),
    [productId]
  );

  if (!product) return <p className="text-center text-gray-500 text-lg">Product not found</p>;

  return (
    <section className="bg-white py-8 flex justify-center items-center min-h-screen">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-8 w-[80vw]">
        
        {/* Product Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-[30vw] h-[60vh] rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div className="w-full md:w-1/2 flex flex-col text-left">
          <h1 className="text-3xl font-bold text-black">{product.name}</h1>
          <p className="text-lg text-gray-600 mt-1">{product.category}</p>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1 mt-2 text-yellow-500">
            <FaStar /> <span className="text-lg font-semibold">{product.rating}</span>
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>

          {/* Special Offers */}
          <div className="w-full md:w-[35vw] mt-4 p-4 border rounded-lg bg-orange-100">
            <h3 className="font-semibold text-orange-700">Special Offers:</h3>
            <ul className="text-gray-700 text-sm list-disc list-inside">
              {product.specialOffers.map((offer, index) => (
                <li key={index}>{offer}</li>
              ))}
            </ul>
          </div>

          {/* Limited Time Offer */}
          <div className="w-full md:w-[35vw] mt-2 p-3 border rounded-lg bg-red-100">
            <h3 className="text-red-700 font-semibold">Limited Time Offer!</h3>
            <p className="text-sm text-gray-700">{product.limitedTimeOffer}</p>
          </div>

          {/* Product Highlights */}
          <div className="mt-4 w-full md:w-[35vw]">
            <h3 className="font-semibold">Product Highlights:</h3>
            <ul className="text-gray-700 text-sm list-disc list-inside">
              {product.highlights.map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
            </ul>
          </div>

          {/* Price & Action Buttons (Left-aligned) */}
          <div className="mt-6">
            {/* Price Section */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-green-600">₹{product.discountPrice}</span>
              <span className="text-lg line-through text-gray-500">₹{product.price}</span>
              <span className="text-sm text-red-600">(Save ₹{product.price - product.discountPrice})</span>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-4">
              <button className="px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
                Add to Cart
              </button>
              <button className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition">
                Buy Now
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
