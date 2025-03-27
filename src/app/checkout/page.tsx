"use client";

import { useState } from "react";
import ShippingInformation from "@/components/Components/checkout/ShippingInformation";
import PaymentMethod from "@/components/Components/checkout/PaymentMethod";
import OrderDetails from "@/components/Components/checkout/OrderDetails";

export default function CheckoutPage() {
 

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex flex-col md:flex-row flex-grow">
        {/* Left Column: Shipping & Payment */}
        <div className="w-full md:w-1/2 flex flex-col bg-gray-100 p-6">
          <div className="flex-grow">
            <ShippingInformation/>
          </div>
          {/* <div className="mt-10">
            <PaymentMethod />
          </div> */}
        </div>
        <OrderDetails />
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-auto">
        <p>© {new Date().getFullYear()} Vel's Nursery Garden. All rights reserved.</p>
      </footer>
    </div>
  );
}
