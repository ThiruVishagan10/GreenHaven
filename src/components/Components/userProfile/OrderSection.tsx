"use client";

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../../../../firebase";
import { UserAuth } from "@/lib/context/AuthContent";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Package, ChevronRight } from "lucide-react";

const OrdersSection: React.FC = () => {
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
        setOrders(ordersData.slice(0, 3)); // Show only the 3 most recent orders
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
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
        <div className="space-y-4">
          <p className="text-gray-600">No orders found.</p>
          <button
            onClick={() => router.push("/product")}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Recent Orders</h1>
        <button
          onClick={() => router.push("/orders")}
          className="text-blue-600 hover:text-blue-800 hover:underline text-sm flex items-center"
        >
          View all orders
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden border">
            <div className="bg-gray-50 p-4 flex justify-between items-center">
              <div>
                <p className="font-medium">Order #{order.orderId}</p>
                <p className="text-sm text-gray-500">
                  {order.createdAt.toLocaleDateString()} • ₹{order.amount?.toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => router.push(`/orders/${order.id}`)}
                className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
              >
                View details
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 mr-4">
                  {order.items && order.items[0]?.mainImage ? (
                    <div className="relative w-16 h-16">
                      <Image 
                        src={order.items[0].mainImage} 
                        alt={order.items[0].name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded">
                      <Package className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium">{order.items?.[0]?.name || "Product"}</p>
                  {order.items && order.items.length > 1 && (
                    <p className="text-sm text-gray-500">
                      + {order.items.length - 1} more item{order.items.length - 1 > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersSection;
