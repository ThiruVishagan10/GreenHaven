"use client";

import { useState, useEffect } from "react";
import OrderConfirmation from "@/components/Components/Payment/OrderConfirmation";
import OrderDetails from "@/components/Components/Payment/OrderDetails";

export default function OrderSummaryPage() {
  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    // Fetch shipping details from sessionStorage to keep data during the checkout session
    const savedShippingData = sessionStorage.getItem("shippingData");
    if (savedShippingData) {
      setShippingData(JSON.parse(savedShippingData));
    }
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl">
        {/* Order Confirmation Message */}
        <OrderConfirmation status="success" orderId="ORD-2024-1234" orderDate="2024-03-20" />

        {/* Order Details */}
        <div className="mt-6">
          <OrderDetails shippingData={shippingData} />
        </div>
      </div>
    </div>
  );
}
