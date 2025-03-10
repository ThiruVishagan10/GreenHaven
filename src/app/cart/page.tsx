// "use client";

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import { motion } from 'framer-motion';
// import { Trash2, Minus, Plus, Loader2 } from 'lucide-react';
// import { useCart } from '@/lib/context/CartContext';
// import { UserAuth } from '@/lib/context/AuthContent';

// export default function CartPage() {
//   const router = useRouter();
//   const { user } = UserAuth();
//   const { 
//     cart, 
//     removeFromCart, 
//     updateQuantity, 
//     getCartTotal, 
//     isLoading 
//   } = useCart();

//   useEffect(() => {
//     if (!user) {
//       router.push('/login');
//     }
//   }, [user, router]);

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <Loader2 className="h-12 w-12 animate-spin text-green-500" />
//       </div>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   if (cart.length === 0) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
//           <p className="text-gray-600 mb-8">Add some products to your cart to continue shopping.</p>
//           <button
//             onClick={() => router.push('/product')}
//             className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
//           >
//             Browse Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Cart Items */}
//         <div className="lg:col-span-2 space-y-4">
//           {cart.map((item) => (
//             <motion.div
//               key={item.id}
//               layout
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
//             >
//               <div className="relative w-24 h-24 flex-shrink-0">
//                 <Image
//                   src={item.mainImage}
//                   alt={item.name}
//                   fill
//                   className="object-cover rounded-md"
//                 />
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-semibold">{item.name}</h3>
//                 <div className="flex items-center gap-2 mt-1">
//                   <span className="text-green-600 font-medium">
//                     ₹{item.offeredPrice}
//                   </span>
//                   {item.price !== item.offeredPrice && (
//                     <span className="text-sm text-gray-500 line-through">
//                       ₹{item.price}
//                     </span>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-4 mt-2">
//                   <div className="flex items-center border rounded-md">
//                     <button
//                       onClick={() => updateQuantity(item.id, item.quantity - 1)}
//                       className="p-1 hover:bg-gray-100"
//                       disabled={item.quantity <= 1}
//                     >
//                       <Minus size={16} />
//                     </button>
//                     <span className="px-4 py-1">{item.quantity}</span>
//                     <button
//                       onClick={() => updateQuantity(item.id, item.quantity + 1)}
//                       className="p-1 hover:bg-gray-100"
//                     >
//                       <Plus size={16} />
//                     </button>
//                   </div>

//                   <button
//                     onClick={() => removeFromCart(item.id)}
//                     className="text-red-500 hover:text-red-600"
//                   >
//                     <Trash2 size={20} />
//                   </button>
//                 </div>
//               </div>

//               <div className="text-right">
//                 <span className="font-semibold">
//                   ₹{(parseFloat(item.offeredPrice) * item.quantity).toFixed(2)}
//                 </span>
//               </div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Order Summary */}
//         <div className="lg:col-span-1">
//           <div className="bg-white p-6 rounded-lg shadow-sm">
//             <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
//             <div className="space-y-2 mb-4">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>₹{getCartTotal().toFixed(2)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Shipping</span>
//                 <span>Free</span>
//               </div>
//             </div>
            
//             <div className="border-t pt-4">
//               <div className="flex justify-between font-semibold">
//                 <span>Total</span>
//                 <span>₹{getCartTotal().toFixed(2)}</span>
//               </div>
//             </div>

//             <button
//               onClick={() => router.push('/checkout')}
//               className="w-full bg-green-600 text-white py-3 rounded-md mt-6 hover:bg-green-700 transition-colors"
//             >
//               Proceed to Checkout
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Trash2, Minus, Plus, Loader2, Package, Truck } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext';
import { UserAuth } from '@/lib/context/AuthContent';

export default function CartPage() {
  const router = useRouter();
  const { user } = UserAuth();
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    isLoading 
  } = useCart();

  // Calculate savings
  const calculateSavings = () => {
    return cart.reduce((total, item) => {
      const originalPrice = parseFloat(item.price) * item.quantity;
      const discountedPrice = parseFloat(item.offeredPrice) * item.quantity;
      return total + (originalPrice - discountedPrice);
    }, 0);
  };

  // Calculate subtotal (before savings)
  const getSubtotal = () => {
    return cart.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0);
  };

  // Calculate shipping cost (free above ₹500)
  const getShippingCost = () => {
    const subtotal = getCartTotal();
    return subtotal >= 500 ? 0 : 50;
  };

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleQuantityChange = async (e: React.MouseEvent, productId: string, newQuantity: number) => {
    e.stopPropagation();
    if (newQuantity >= 1 && newQuantity <= 10) {
      await updateQuantity(productId, newQuantity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (!user) return null;

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to your cart to continue shopping.</p>
          <button
            onClick={() => router.push('/product')}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart ({cart.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => handleProductClick(item.id)}
              className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative w-24 h-24 flex-shrink-0">
                <Image
                  src={item.mainImage}
                  alt={item.name}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold hover:text-green-600 transition-colors">
                  {item.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-green-600 font-medium">
                    ₹{item.offeredPrice}
                  </span>
                  {item.price !== item.offeredPrice && (
                    <>
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.price}
                      </span>
                      <span className="text-xs text-green-600">
                        ({Math.round((1 - parseFloat(item.offeredPrice)/parseFloat(item.price)) * 100)}% OFF)
                      </span>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4 mt-2">
                  <div 
                    className="flex items-center border rounded-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={(e) => handleQuantityChange(e, item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1">{item.quantity}</span>
                    <button
                      onClick={(e) => handleQuantityChange(e, item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100"
                      disabled={item.quantity >= 10}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromCart(item.id);
                    }}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <div className="font-semibold">
                  ₹{(parseFloat(item.offeredPrice) * item.quantity).toFixed(2)}
                </div>
                {item.price !== item.offeredPrice && (
                  <div className="text-sm text-gray-500 line-through">
                    ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            {/* Detailed Summary */}
            <div className="space-y-4">
              {/* Items Breakdown */}
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{(parseFloat(item.offeredPrice) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                {/* Subtotal */}
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{getSubtotal().toFixed(2)}</span>
                </div>

                {/* Savings */}
                {calculateSavings() > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Savings</span>
                    <span>-₹{calculateSavings().toFixed(2)}</span>
                  </div>
                )}

                {/* Shipping */}
                <div className="flex justify-between">
                  <span className="flex items-center gap-2">
                    <Truck size={16} />
                    Shipping
                  </span>
                  <span>
                    {getShippingCost() === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${getShippingCost().toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{(getCartTotal() + getShippingCost()).toFixed(2)}</span>
                </div>
                {calculateSavings() > 0 && (
                  <p className="text-green-600 text-sm mt-2">
                    You save ₹{calculateSavings().toFixed(2)} on this order
                  </p>
                )}
              </div>

              {/* Free Shipping Progress */}
              {getCartTotal() < 500 && (
                <div className="mt-4">
                  <div className="text-sm text-gray-600 mb-2">
                    Add ₹{(500 - getCartTotal()).toFixed(2)} more for free shipping
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(getCartTotal() / 500) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-green-600 text-white py-3 rounded-md mt-6 hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <Package size={20} />
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
