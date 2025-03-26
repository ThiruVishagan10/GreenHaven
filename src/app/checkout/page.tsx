"use client";

import { useState } from "react";
import ShippingInformation from "@/components/Components/checkout/ShippingInformation";
import PaymentMethod from "@/components/Components/checkout/PaymentMethod";
import OrderDetails from "@/components/Components/Payment/OrderDetails";

export default function CheckoutPage() {
  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Left Column: Shipping & Payment */}
        <div className="w-full md:w-1/2 flex flex-col bg-gray-100 p-6">
          <div className="flex-grow">
            <ShippingInformation onSave={setShippingData} />
          </div>
          <div className="mt-10">
            <PaymentMethod />
          </div>
        </div>

        {/* Right Column: Order Details */}
        <div className="w-full md:w-1/2 bg-gray-100 p-6">
          <OrderDetails shippingData={shippingData} />
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>© {new Date().getFullYear()} Vel's Nursery Garden. All rights reserved.</p>
      </footer>
    </div>
  );
}
