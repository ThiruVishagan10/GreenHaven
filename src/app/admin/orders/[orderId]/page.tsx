"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../../firebase";
import { UserAuth } from "@/lib/context/AuthContent";
import Image from "next/image";
import { Loader2, Package, ArrowLeft, CheckCircle, Truck, MapPin } from "lucide-react";

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { user } = UserAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId as string));
        if (orderDoc.exists()) {
          const orderData = {
            id: orderDoc.id,
            ...orderDoc.data(),
            createdAt: orderDoc.data().createdAt?.toDate?.() || new Date()
          };
          setOrder(orderData);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

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
        <h1 className="text-3xl font-bold mb-4">Order Details</h1>
        <p className="mb-6">Please log in to view your order details.</p>
        <button
          onClick={() => router.push("/login")}
          className="bg-yellow-400 text-black px-6 py-2 rounded hover:bg-yellow-500"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <button 
          onClick={() => router.push("/orders")}
          className="flex items-center text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to orders
        </button>
        <div className="bg-white p-8 rounded shadow-sm text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <p className="mb-6">We couldn't find the order you're looking for.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <button 
        onClick={() => router.push("/orders")}
        className="flex items-center text-blue-600 hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to orders
      </button>

      <div className="bg-white rounded shadow-sm overflow-hidden mb-6">
        <div className="bg-gray-800 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Order Details</h1>
              <p className="text-gray-300">Order #{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-300">Order Placed</p>
              <p>{order.createdAt.toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
            <span className="font-medium">
              {order.paymentStatus === "COMPLETED"
                ? "Payment completed"
                : "Processing payment"}
            </span>
          </div>

          <div className="flex items-center">
            <Truck className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium">Preparing for dispatch</span>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-6">
            {order.items?.map((item:any, index:any) => (
              <div key={index} className="flex border-b pb-6 last:border-0">
                <div
                  className="w-24 h-24 bg-gray-100 flex-shrink-0 mr-6 flex items-center justify-center cursor-pointer"
                  onClick={() => router.push(`/product/${item.id}`)}
                >
                  {item.mainImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={item.mainImage}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  ) : (
                    <Package className="h-10 w-10 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3
                        className="font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => router.push(`/product/${item.id}`)}
                      >
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{Number(item.offeredPrice).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        ₹{Number(item.price).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Shipping Address */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-green-600 mr-2" />
              <h2 className="text-xl font-bold">Shipping Address</h2>
            </div>
            
            {order.address ? (
              <div className="bg-white p-4 rounded-lg shadow-sm mt-2 relative">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">
                      <strong>Street:</strong> {order.address.street || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>City:</strong> {order.address.city || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>State:</strong> {order.address.state || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Postal Code:</strong> {order.address.postalCode || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg mt-2">
                <p className="text-sm text-gray-500">No address information available</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Items:</span>
                <span>₹{order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {order.shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₹${order.shipping?.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t">
                <span>Order Total:</span>
                <span>₹{order.amount?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Payment Information</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Payment Details</h3>
              <p className="text-sm"><strong>Payment ID:</strong> {order.paymentId}</p>
              <p className="text-sm"><strong>Payment Status:</strong> {order.paymentStatus}</p>
              <p className="text-sm"><strong>Method:</strong> Online Payment</p>
              <p className="text-sm"><strong>Customer Name:</strong> {order.userName}</p>
              <p className="text-sm"><strong>Phone Number:</strong> {order.phoneNumber}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
