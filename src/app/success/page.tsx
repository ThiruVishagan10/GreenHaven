

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../../../firebase";
// import { useCart } from "@/lib/context/CartContext";
// import { CheckCircle } from "lucide-react";

// export default function SuccessPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { clearCart } = useCart();
//   const [order, setOrder] = useState<any>(null);
  
//   useEffect(() => {
//     // Clear cart if clearCart parameter is true
//     if (searchParams.get("clearCart") === "true") {
//       clearCart();
//     }
    
//     const fetchOrderDetails = async () => {
//       try {
//         const orderId = searchParams.get("orderId");
//         if (orderId) {
//           const orderDoc = await getDoc(doc(db, "orders", orderId));
//           if (orderDoc.exists()) {
//             setOrder(orderDoc.data());
//           }
//         }
//       } catch (error) {
//         console.error("Error fetching order details:", error);
//       }
//     };

//     fetchOrderDetails();
//   }, [searchParams, clearCart]);

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-12">
//       <div className="bg-white rounded-lg shadow-lg p-8">
//         <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
//         <h1 className="text-3xl font-bold text-green-600 mb-4 text-center">Payment Successful!</h1>
        
//         {order && (
//           <>
//             <div className="mb-6">
//               <h2 className="text-xl font-semibold mb-2">Order Details</h2>
//               <p><span className="font-medium">Order ID:</span> {order.orderId}</p>
//               <p><span className="font-medium">Amount:</span> ₹{order.amount?.toLocaleString()}</p>
//             </div>
            
//             {order.items && order.items.length > 0 && (
//               <div>
//                 <h2 className="text-xl font-semibold mb-2">Order Items</h2>
//                 <div className="space-y-2">
//                   {order.items.map((item: any, index: number) => (
//                     <div key={index} className="border-b pb-2">
//                       <p className="font-medium">{item.name}</p>
//                       <div className="flex justify-between text-sm">
//                         <span>₹{item.offeredPrice} x {item.quantity}</span>
//                         <span>₹{(Number(item.offeredPrice) * item.quantity).toLocaleString()}</span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
            
//             <button
//               onClick={() => router.push("/product")}
//               className="mt-6 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
//             >
//               Continue Shopping
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { useCart } from "@/lib/context/CartContext";
import { CheckCircle, Truck } from "lucide-react";

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [order, setOrder] = useState<any>(null);
  const isCOD = searchParams.get("cod") === "true";
  
  useEffect(() => {
    // Clear cart if clearCart parameter is true
    if (searchParams.get("clearCart") === "true") {
      clearCart();
    }
    
    const fetchOrderDetails = async () => {
      try {
        const orderId = searchParams.get("orderId");
        if (orderId) {
          const orderDoc = await getDoc(doc(db, "orders", orderId));
          if (orderDoc.exists()) {
            setOrder(orderDoc.data());
          }
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    fetchOrderDetails();
  }, [searchParams, clearCart]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          {isCOD ? (
            <Truck className="h-16 w-16 text-green-500 mx-auto mb-4" />
          ) : (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          )}
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            {isCOD ? "Order Placed Successfully!" : "Payment Successful!"}
          </h1>
          {isCOD && (
            <p className="text-gray-600">Your order will be delivered and payment collected at your doorstep</p>
          )}
        </div>
        
        {order && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Order Details</h2>
              <p><span className="font-medium">Order ID:</span> {order.orderId}</p>
              <p><span className="font-medium">Payment Method:</span> {order.paymentMethod || "Online Payment"}</p>
              <p><span className="font-medium">Amount:</span> ₹{order.amount?.toLocaleString()}</p>
              {order.address && (
                <div className="mt-2">
                  <span className="font-medium">Delivery Address:</span>
                  <p className="text-sm text-gray-600">
                    {order.address.street}, {order.address.city}, {order.address.state} - {order.address.postalCode}
                  </p>
                </div>
              )}
            </div>
            
            {order.items && order.items.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Order Items</h2>
                <div className="space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="border-b pb-2">
                      <p className="font-medium">{item.name}</p>
                      <div className="flex justify-between text-sm">
                        <span>₹{item.offeredPrice} x {item.quantity}</span>
                        <span>₹{(Number(item.offeredPrice) * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={() => router.push("/product")}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </button>
          </>
        )}
      </div>
    </div>
  );
}
