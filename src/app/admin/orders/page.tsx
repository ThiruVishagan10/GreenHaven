
// "use client";

// import { useEffect, useState } from "react";
// import { collection, query, getDocs, orderBy } from "firebase/firestore";
// import { db } from "../../../../firebase";
// import { useRouter } from "next/navigation";
// import { Loader2, ChevronDown, ChevronUp, Package } from "lucide-react";
// import Image from "next/image";
// import { UserAuth } from "@/lib/context/AuthContent";

// export default function AdminOrdersPage() {
//   const router = useRouter();
//   const { user } = UserAuth();
//   const [orders, setOrders] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchAllOrders = async () => {
//       if (!user) {
//         setLoading(false);
//         return;
//       }

//       try {
//         // Get all orders without filtering by userId
//         const q = query(
//           collection(db, "orders"),
//           orderBy("createdAt", "desc")
//         );
        
//         const querySnapshot = await getDocs(q);
//         const ordersData = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//           createdAt: doc.data().createdAt?.toDate?.() || new Date()
//         }));
        
//         setOrders(ordersData);
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllOrders();
//   }, [user]);

//   const toggleOrderDetails = (orderId: string) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   if (loading) {
//     return (
//       <div className="h-screen flex justify-center items-center">
//         <Loader2 className="h-12 w-12 animate-spin text-green-500" />
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 py-12 text-center">
//         <h1 className="text-3xl font-bold mb-4">Admin Orders</h1>
//         <p className="mb-6">Please log in to view orders.</p>
//         <button
//           onClick={() => router.push("/login")}
//           className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//         >
//           Sign In
//         </button>
//       </div>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="max-w-6xl mx-auto px-4 py-12 text-center">
//         <h1 className="text-3xl font-bold mb-4">Admin Orders</h1>
//         <div className="bg-white p-8 rounded shadow-sm">
//           <p className="mb-6">No orders found in the system.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      
//       <div className="space-y-4">
//         {orders.map((order) => (
//           <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden border">
//             <div 
//               className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer"
//               onClick={() => toggleOrderDetails(order.id)}
//             >
//               <div>
//                 <p className="font-medium">Order #{order.orderId}</p>
//                 <div className="flex space-x-4 text-sm text-gray-500">
//                   <p>{order.createdAt.toLocaleDateString()}</p>
//                   <p>₹{order.amount?.toLocaleString()}</p>
//                 </div>
//               </div>
//               {/* <div className="flex items-center">
//                 <span className={`px-2 py-1 text-xs rounded-full ${
//                   order.paymentStatus === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                 }`}>
//                   {order.paymentStatus}
//                 </span>
//                 {expandedOrder === order.id ? <ChevronUp /> : <ChevronDown />}
//               </div> */}
//             </div>
            
//             {expandedOrder === order.id && (
//               <div className="p-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                   <div>
//                     <h3 className="font-medium mb-2">Order Details</h3>
//                     <p className="text-sm"><strong>Order ID:</strong> {order.orderId}</p>
//                     <p className="text-sm"><strong>Payment ID:</strong> {order.paymentId}</p>
//                     <p className="text-sm"><strong>Date:</strong> {order.createdAt.toLocaleString()}</p>
//                     <p className="text-sm"><strong>Payment Status:</strong> {order.paymentStatus}</p>
//                   </div>
                  
//                 </div>
                
//                 <h3 className="font-medium mb-2 border-t pt-4">Order Items</h3>
//                 <div className="space-y-3">
//                   {order.items?.map((item: any, index: number) => (
//                     <div key={index} className="flex items-center border-b pb-3">
//                       <div className="w-16 h-16 bg-gray-100 flex-shrink-0 mr-4 flex items-center justify-center">
//                         {item.mainImage ? (
//                           <div className="relative w-full h-full">
//                             <Image 
//                               src={item.mainImage} 
//                               alt={item.name}
//                               fill
//                               className="object-cover"
//                               sizes="64px"
//                             />
//                           </div>
//                         ) : (
//                           <Package className="h-6 w-6 text-gray-400" />
//                         )}
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-medium">{item.name}</p>
//                         <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
//                       </div>
//                       <div className="text-right">
//                         <p className="font-medium">₹{Number(item.offeredPrice).toLocaleString()}</p>
//                         <p className="text-sm text-gray-500">Total: ₹{(Number(item.offeredPrice) * item.quantity).toLocaleString()}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
                
//                 <div className="mt-4 flex justify-end">
//                   <button
//                     onClick={() => router.push(`/admin/orders/${order.id}`)}
//                     className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
//                   >
//                     View Full Details
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../../../firebase";
import { useRouter } from "next/navigation";
import { Loader2, ChevronDown, ChevronUp, Package } from "lucide-react";
import Image from "next/image";
import { UserAuth } from "@/lib/context/AuthContent";

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user } = UserAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));
        
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [user]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Admin Orders</h1>
        <p className="mb-6">Please log in to view orders.</p>
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Admin Orders</h1>
        <div className="bg-white p-8 rounded shadow-sm">
          <p className="mb-6">No orders found in the system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden border">
            <div 
              className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleOrderDetails(order.id)}
            >
              <div>
                <p className="font-medium">Order #{order.orderId}</p>
                <div className="flex space-x-4 text-sm text-gray-500">
                  <p>{order.createdAt.toLocaleDateString()}</p>
                  <p>₹{order.amount?.toLocaleString()}</p>
                  {order.orderStatus === 'CANCELLED' && (
                    <span className="text-red-600 font-medium">CANCELLED</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  order.paymentStatus === "COMPLETED" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {order.paymentStatus}
                </span>
                {expandedOrder === order.id ? <ChevronUp /> : <ChevronDown />}
              </div>
            </div>
            
            {expandedOrder === order.id && (
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="font-medium mb-2">Order Details</h3>
                    <p className="text-sm"><strong>Order ID:</strong> {order.orderId}</p>
                    <p className="text-sm"><strong>Customer:</strong> {order.userName}</p>
                    <p className="text-sm"><strong>Phone:</strong> {order.phoneNumber}</p>
                    <p className="text-sm"><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    <p className="text-sm"><strong>Date:</strong> {order.createdAt.toLocaleString()}</p>
                    <p className="text-sm"><strong>Status:</strong> 
                      <span className={order.orderStatus === 'CANCELLED' ? 'text-red-600 ml-1' : 'text-green-600 ml-1'}>
                        {order.orderStatus || 'CONFIRMED'}
                      </span>
                    </p>
                  </div>
                  
                  {order.address && (
                    <div>
                      <h3 className="font-medium mb-2">Delivery Address</h3>
                      <p className="text-sm">{order.address.street}</p>
                      <p className="text-sm">{order.address.city}, {order.address.state}</p>
                      <p className="text-sm">{order.address.postalCode}</p>
                    </div>
                  )}
                </div>
                
                <h3 className="font-medium mb-2 border-t pt-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center border-b pb-3">
                      <div className="w-16 h-16 bg-gray-100 flex-shrink-0 mr-4 flex items-center justify-center">
                        {item.mainImage ? (
                          <div className="relative w-full h-full">
                            <Image 
                              src={item.mainImage} 
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <Package className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{Number(item.offeredPrice).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">Total: ₹{(Number(item.offeredPrice) * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => router.push(`/admin/orders/${order.id}`)}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
