

"use client";

import { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy, where } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Loader2, ChevronDown, ChevronUp, Package, X } from "lucide-react";
import Image from "next/image";
import { UserAuth } from "@/lib/context/AuthContent";
import { db } from "../../../firebase";

export default function OrdersPage() { 
  const router = useRouter();
  const { user } = UserAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Filter orders by userId to show only the user's orders
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
        
        setOrders(ordersData);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserOrders();
  }, [user]);

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const canCancelOrder = (order: any) => {
    if (order.orderStatus === 'CANCELLED') return false;
    
    const orderTime = order.createdAt;
    const now = new Date();
    const timeDiff = now.getTime() - orderTime.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);
    
    return hoursDiff <= 24;
  };

  const handleCancelOrder = async (orderId: string, userId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    setCancelling(orderId);
    try {
      const response = await fetch('/api/cancel-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          userId
        })
      });

      if (response.ok) {
        setOrders(prev => prev.map(order => 
          order.id === orderId ? { ...order, orderStatus: 'CANCELLED' } : order
        ));
        alert('Order cancelled successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to cancel order');
      }
    } catch (error) {
      alert('Failed to cancel order');
    } finally {
      setCancelling(null);
    }
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
        <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
        <p className="mb-6">Please log in to view your orders.</p>
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
        <h1 className="text-3xl font-bold mb-4">Your Orders</h1>
        <div className="bg-white p-8 rounded shadow-sm">
          <p className="mb-6">You haven't placed any orders yet.</p>
          <button
            onClick={() => router.push("/product")}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      
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
                {canCancelOrder(order) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelOrder(order.id, user.uid);
                    }}
                    disabled={cancelling === order.id}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50 flex items-center"
                  >
                    {cancelling === order.id ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        Cancelling...
                      </>
                    ) : (
                      <>
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </>
                    )}
                  </button>
                )}
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
                    <p className="text-sm"><strong>Payment Method:</strong> {order.paymentMethod}</p>
                    <p className="text-sm"><strong>Date:</strong> {order.createdAt.toLocaleString()}</p>
                    <p className="text-sm"><strong>Status:</strong> 
                      <span className={order.orderStatus === 'CANCELLED' ? 'text-red-600 font-medium ml-1' : 'text-green-600 ml-1'}>
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
                    onClick={() => router.push(`/orders/${order.id}`)}
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
