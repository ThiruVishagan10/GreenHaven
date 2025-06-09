"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { UserAuth } from "@/lib/context/AuthContent";
import Image from "next/image";
import {
  Loader2,
  Package,
  ArrowLeft,
  CheckCircle,
  Truck,
  MapPin,
} from "lucide-react";

export default function OrderDetailPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { user } = UserAuth();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId as string));
        if (orderDoc.exists()) {
          const orderData = {
            id: orderDoc.id,
            ...orderDoc.data(),
            createdAt: orderDoc.data().createdAt?.toDate?.() || new Date(),
          };
          setOrder(orderData);

          // Fetch user's shipping data
          if (orderData.userId) {
            const userDoc = await getDoc(doc(db, "users", orderData.userId));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setShippingData({
                fullName: userData.displayName || "",
                phone: userData.phoneNumber || "",
                address: userData.address || "",
              });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId, user]);

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
            {order.items?.map((item, index) => (
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

                  <button
                    onClick={() => router.push(`/product/${item.id}`)}
                    className="mt-3 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                  >
                    Buy again
                  </button>
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
              <MapPin className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-xl font-bold">Shipping Address</h2>
            </div>

            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Name:</strong> {shippingData.fullName || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {shippingData.phone || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {shippingData.address || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {(() => {
                // Calculate subtotal from items
                const subtotal = order.items?.reduce(
                  (sum: number, item: { offeredPrice: any; quantity: number; }) => sum + (Number(item.offeredPrice) * item.quantity),
                  0
                ) || order.subtotal || order.amount || 0;
                
                // Calculate shipping fee
                const shipping = subtotal < 500 ? 50 : 0;
                
                // Calculate total
                const total = subtotal + shipping;
                
                return (
                  <>
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>₹{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `₹${shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Order Total:</span>
                      <span>₹{total.toLocaleString()}</span>
                    </div>
                  </>
                );
              })()}
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
              <p className="text-sm">Payment ID: {order.paymentId}</p>
              <p className="text-sm">Status: {order.paymentStatus}</p>
              <p className="text-sm">Method: Online Payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
