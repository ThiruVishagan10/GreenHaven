// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { motion, AnimatePresence } from "framer-motion";
// import { Package, Loader2 } from "lucide-react";
// import { useCart } from "@/lib/context/CartContext";
// import { UserAuth } from "@/lib/context/AuthContent";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../../firebase";

// interface Address {
//   id: string;
//   street: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   isDefault: boolean;
// }

// interface PaymentData {
//   total: number;
//   userName: string;
//   phoneNumber: string;
//   address?: Address;
// }

// export default function OrderDetails() {
//   const router = useRouter();
//   const { user } = UserAuth();
//   const [userData, setUserData] = useState<any>(null);
//   const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
//   const { cartItems, getCartTotal, isLoading } = useCart();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!user?.uid) return;

//       try {
//         const userDoc = await getDoc(doc(db, "users", user.uid));
//         if (userDoc.exists()) {
//           const data = userDoc.data();
//           setUserData(data);
          
//           // Find default address
//           if (data.addresses && Array.isArray(data.addresses)) {
//             const defaultAddr = data.addresses.find((addr: Address) => addr.isDefault) || data.addresses[0];
//             setDefaultAddress(defaultAddr || null);
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//       }
//     };

//     fetchUserData();
//   }, [user]);
  
//   if (isLoading) {
//     return (
//       <div className="h-screen flex justify-center items-center">
//         <Loader2 className="h-12 w-12 animate-spin text-green-500" />
//       </div>
//     );
//   }
//   const handleProceedToPayment = () => {
//     if (!user) {
//       return;
//     }
  
//     // Make sure we have the address
//     if (!defaultAddress) {
//       alert("Please add a delivery address before proceeding to payment.");
//       return;
//     }
    
//     const paymentData = {
//       total: total,
//       userName: userData?.displayName || user.displayName || "",
//       phoneNumber: userData?.phoneNumber || user.phoneNumber || "",
//       cartItems: cartItems,
//       address: defaultAddress, // Make sure this is included
//       userId: user.uid
//     };
  
//     const encodedData = encodeURIComponent(JSON.stringify(paymentData));
//     router.push(`/payment?data=${encodedData}`);
//   };
  
//   if (!user || cartItems.length === 0) {
//     return (
//       <div className="h-screen flex items-center justify-center">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4">No items in checkout</h2>
//           <p className="text-gray-600 mb-8">Your cart is empty.</p>
//           <button
//             onClick={() => router.push("/product")}
//             className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
//           >
//             Browse Products
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { subtotal, savings } = getCartTotal();
//   const shipping = subtotal >= 500 ? 0 : 50;
//   const total = subtotal + shipping;

//   return (
//     <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       <h1 className="text-2xl font-bold mb-8">Checkout</h1>

//       {/* Order Items */}
//       <div className="space-y-4 ml-10 ">
//         <AnimatePresence>
//           {cartItems.map((item) => (
//             <motion.div
//               key={item.id}
//               layout
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               className="flex items-center gap-4 bg-gray-200 p-4 rounded-lg shadow-sm"
//             >
//               <div className="relative w-24 h-24 flex-shrink-0">
//                 {item.mainImage ? (
//                   <Image
//                     src={item.mainImage}
//                     alt={item.name}
//                     fill
//                     className="object-cover rounded-md"
//                     sizes="96px"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
//                     <Package className="h-8 w-8 text-gray-400" />
//                   </div>
//                 )}
//               </div>

//               <div className="flex-1">
//                 <h3 className="font-semibold">{item.name}</h3>
//                 <p className="text-sm text-gray-500">{item.description}</p>
//                 <p className="text-green-600 font-medium mt-1">
//                   ₹{item.offeredPrice.toLocaleString()} x {item.quantity}
//                 </p>
//               </div>

//               <div className="text-right">
//                 <span className="font-semibold">
//                   ₹{(Number(item.offeredPrice) * Number(item.quantity)).toLocaleString()}
//                 </span>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>

//       {/* Order Summary (Moved Below Checkout) */}
//       <div className="bg-gray-100 w-[30vw] ml-10 p-6 rounded-lg shadow-sm mt-8">
//         <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

//         <div className="space-y-4">
//           <div className="flex justify-between">
//             <span>Subtotal</span>
//             <span>₹{subtotal.toLocaleString()}</span>
//           </div>

//           {savings > 0 && (
//             <div className="flex justify-between text-green-600">
//               <span>Discount</span>
//               <span>-₹{savings.toLocaleString()}</span>
//             </div>
//           )}

//           <div className="flex justify-between">
//             <span>Shipping</span>
//             <span>
//               {shipping === 0 ? (
//                 <span className="text-green-600">Free</span>
//               ) : (
//                 `₹${shipping.toLocaleString()}`
//               )}
//             </span>
//           </div>

//           <div className="border-t pt-4">
//             <div className="flex justify-between font-semibold text-lg">
//               <span>Total</span>
//               <span>₹{total.toLocaleString()}</span>
//             </div>
//           </div>

//           <button
//             onClick={handleProceedToPayment}
//             className="w-full bg-green-600 text-white py-3 rounded-md mt-6 hover:bg-green-700 transition-colors"
//           >
//             Proceed to Payment
//           </button>
          
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Loader2, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/context/CartContext";
import { UserAuth } from "@/lib/context/AuthContent";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export default function OrderDetails() {
  const router = useRouter();
  const { user } = UserAuth();
  const [userData, setUserData] = useState<any>(null);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const { cartItems, getCartTotal, isLoading, clearCart } = useCart();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.uid) return;

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserData(data);
          
          if (data.addresses && Array.isArray(data.addresses)) {
            const defaultAddr = data.addresses.find((addr: Address) => addr.isDefault) || data.addresses[0];
            setDefaultAddress(defaultAddr || null);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  const handleProceedToOrder = async () => {
    if (!user || !defaultAddress) {
      alert("Please add a delivery address before placing order.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setIsProcessing(true);
    
    try {
      const { subtotal } = getCartTotal();
      const shipping = subtotal >= 500 ? 0 : 50;
      const total = subtotal + shipping;
      
      const orderId = `${paymentMethod === "cod" ? "COD" : "ORD"}-${Date.now()}-${user.uid.slice(-6)}`;
      
      const orderData = {
        orderId,
        userId: user.uid,
        userName: userData?.displayName || user.displayName || "",
        phoneNumber: userData?.phoneNumber || user.phoneNumber || "",
        paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
        paymentStatus: paymentMethod === "cod" ? "PENDING" : "COMPLETED",
        orderStatus: "CONFIRMED",
        subtotal: subtotal,
        shipping: shipping,
        amount: total,
        items: cartItems,
        address: defaultAddress,
        createdAt: serverTimestamp()
      };

      await setDoc(doc(db, "orders", orderId), orderData);

      // Send email
      try {
        await fetch('/api/send-order-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderData: { ...orderData, createdAt: new Date() },
            userEmail: user.email
          })
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      await clearCart();
      router.push(`/success?orderId=${orderId}&cod=${paymentMethod === "cod"}`);
      
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };
  
  if (!user || cartItems.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No items in checkout</h2>
          <p className="text-gray-600 mb-8">Your cart is empty.</p>
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="space-y-4 ml-10">
        <AnimatePresence>
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4 bg-gray-200 p-4 rounded-lg shadow-sm"
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
                  <div className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                <p className="text-green-600 font-medium mt-1">
                  ₹{item.offeredPrice.toLocaleString()} x {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <span className="font-semibold">
                  ₹{(Number(item.offeredPrice) * Number(item.quantity)).toLocaleString()}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="bg-gray-100 w-[30vw] ml-10 p-6 rounded-lg shadow-sm mt-8">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          {savings > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{savings.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {shipping === 0 ? (
                <span className="text-green-600">Free</span>
              ) : (
                `₹${shipping.toLocaleString()}`
              )}
            </span>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">Payment Method</label>
            <div className="relative">
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Payment Method</option>
                <option value="cod">Cash on Delivery</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button
            onClick={handleProceedToOrder}
            disabled={isProcessing || !paymentMethod}
            className="w-full bg-green-600 text-white py-3 rounded-md mt-6 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              "Proceed to Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
