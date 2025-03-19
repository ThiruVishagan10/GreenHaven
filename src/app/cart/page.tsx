"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Minus, Plus, Loader2, Package } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { UserAuth } from "@/lib/context/AuthContent";

interface QuantityLoadingState {
  [key: string]: {
    isLoading: boolean;
    type: "increase" | "decrease" | null;
  };
}

export default function CartPage() {
  const router = useRouter();
  const { user } = UserAuth();
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal,
    isLoading: cartLoading 
  } = useCart();

  const [quantityLoading, setQuantityLoading] = useState<QuantityLoadingState>({});
  const [removingItem, setRemovingItem] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleQuantityUpdate = async (itemId: string, newQuantity: number, type: "increase" | "decrease") => {
    if (newQuantity < 1 || newQuantity > 10) return;

    try {
      setQuantityLoading(prev => ({
        ...prev,
        [itemId]: { isLoading: true, type }
      }));

      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setQuantityLoading(prev => ({
        ...prev,
        [itemId]: { isLoading: false, type: null }
      }));
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      setRemovingItem(prev => ({ ...prev, [itemId]: true }));
      await removeFromCart(itemId);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setRemovingItem(prev => ({ ...prev, [itemId]: false }));
    }
  };

  if (cartLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to your cart to continue shopping.</p>
          <button
            onClick={() => router.push("/product")}
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const { subtotal, savings } = getCartTotal();
  const shipping = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart ({cartItems.length} items)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
              >
                <div className="relative w-24 h-24 flex-shrink-0">
                  {item.mainImage ? (
                    <Image
                      src={item.mainImage}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                      sizes="96px"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-green-600 font-medium">
                      ₹{item.offeredPrice}
                    </span>
                    {parseFloat(item.price) > parseFloat(item.offeredPrice) && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{item.price}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity - 1, "decrease")}
                        disabled={item.quantity <= 1 || quantityLoading[item.id]?.isLoading}
                        className={`p-2 transition-colors ${
                          item.quantity <= 1 || quantityLoading[item.id]?.isLoading
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {quantityLoading[item.id]?.isLoading && quantityLoading[item.id]?.type === "decrease" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                      </button>
                      <span className="px-4 py-1 min-w-[40px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityUpdate(item.id, item.quantity + 1, "increase")}
                        disabled={item.quantity >= 10 || quantityLoading[item.id]?.isLoading}
                        className={`p-2 transition-colors ${
                          item.quantity >= 10 || quantityLoading[item.id]?.isLoading
                            ? "text-gray-300 cursor-not-allowed"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {quantityLoading[item.id]?.isLoading && quantityLoading[item.id]?.type === "increase" ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={removingItem[item.id]}
                      className="text-red-500 hover:text-red-600 disabled:text-red-300"
                    >
                      {removingItem[item.id] ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                    <span className="font-semibold">
                      ₹{(parseFloat(item.offeredPrice) * item.quantity).toFixed(2)}
                    </span>
                  </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
         {/* Order Summary */}
         <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
  
                {savings > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Total Savings</span>
                    <span>-₹{savings.toFixed(2)}</span>
                  </div>
                )}
  
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
  
                {shipping > 0 && (
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">
                      Add ₹{(500 - subtotal).toFixed(2)} more for free shipping
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (subtotal / 500) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                  {savings > 0 && (
                    <p className="text-green-600 text-sm mt-2">
                      You save ₹{savings.toFixed(2)} on this order
                    </p>
                  )}
                </div>
  
                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-green-600 text-white py-3 rounded-md mt-6 hover:bg-green-700 transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
}
