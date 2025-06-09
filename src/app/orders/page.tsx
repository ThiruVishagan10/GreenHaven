"use client";

import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { UserAuth } from "@/lib/context/AuthContent";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Package, ChevronRight, CheckCircle } from "lucide-react";

export default function OrdersPage() {
  const { user } = UserAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));
        
        ordersData.sort((a, b) => b.createdAt - a.createdAt);
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

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
        <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
        <p className="mb-6">Please log in to view your orders.</p>
        <button
          onClick={() => router.push("/login")}
          className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-500"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
        <div className="bg-white p-8 rounded shadow-sm">
          <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <p className="mb-6">You haven't placed any orders yet.</p>
          <button
            onClick={() => router.push("/product")}
            className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-500"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  // Group orders by year and month
  const groupedOrders = orders.reduce((acc, order) => {
    const date = order.createdAt;
    const year = date.getFullYear();
    const month = date.getMonth();
    
    if (!acc[year]) {
      acc[year] = {};
    }
    
    if (!acc[year][month]) {
      acc[year][month] = [];
    }
    
    acc[year][month].push(order);
    return acc;
  }, {});

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      
      {Object.keys(groupedOrders).sort((a, b) => Number(b) - Number(a)).map(year => (
        <div key={year} className="mb-8">
          {Object.keys(groupedOrders[year]).sort((a, b) => Number(b) - Number(a)).map(month => (
            <div key={`${year}-${month}`} className="mb-6">
              <h2 className="text-xl font-bold mb-4 border-b pb-2">
                {monthNames[Number(month)]} {year}
              </h2>
              
              <div className="space-y-4">
                {groupedOrders[year][month].map((order:any) => (
                  <div key={order.id} className="bg-white rounded shadow-sm overflow-hidden">
                    {/* Order Header */}
                    <div className="bg-gray-100 p-4 grid grid-cols-4 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">ORDER PLACED</p>
                        <p>{order.createdAt.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">TOTAL</p>
                        <p>₹{order.amount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">ORDER #</p>
                        <p className="truncate">{order.orderId}</p>
                      </div>
                      <div className="text-right">
                        <button 
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="text-blue-600 hover:text-blue-800 hover:underline flex items-center justify-end"
                        >
                          View order details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Order Status */}
                    <div className="p-4 border-b">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="font-medium">
                          {order.paymentStatus === "COMPLETED" ? "Payment completed" : "Processing payment"}
                        </span>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="p-4">
                      {order.items?.slice(0, 2).map((item:any, index:number) => (
                        <div key={index} className="flex py-3 border-b last:border-0">
                          <div 
                            className="w-20 h-20 bg-gray-100 flex-shrink-0 mr-4 flex items-center justify-center cursor-pointer"
                            onClick={() => router.push(`/product/${item.id}`)}
                          >
                            {item.mainImage ? (
                              <div className="relative w-full h-full">
                                <Image 
                                  src={item.mainImage} 
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                              </div>
                            ) : (
                              <Package className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p 
                              className="font-medium line-clamp-2 cursor-pointer hover:text-blue-600"
                              onClick={() => router.push(`/product/${item.id}`)}
                            >
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            <button 
                              onClick={() => router.push(`/product/${item.id}`)}
                              className="mt-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                            >
                              Buy again
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">₹{Number(item.offeredPrice).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                      
                      {order.items?.length > 2 && (
                        <div className="mt-3 text-sm">
                          <span className="text-gray-500">
                            + {order.items.length - 2} more item{order.items.length - 2 > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                      
                      <div className="mt-4 flex justify-between">
                        <button
                          onClick={() => router.push(`/orders/${order.id}`)}
                          className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                        >
                          View order details
                        </button>
                        <button
                          onClick={() => {
                            // Add items to cart logic would go here
                            router.push('/cart');
                          }}
                          className="bg-yellow-400 hover:bg-yellow-500 text-sm px-4 py-1 rounded"
                        >
                          Buy all again
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
