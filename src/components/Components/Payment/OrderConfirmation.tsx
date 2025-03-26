"use client";

import { useState, useEffect } from "react";

const OrderSummary = () => {
  const [shippingData, setShippingData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    // Fetch shipping details from localStorage or a global state
    const savedShippingData = localStorage.getItem("shippingData");
    if (savedShippingData) {
      setShippingData(JSON.parse(savedShippingData));
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {/* Order Confirmation Section */}
      <div className="bg-white p-6 rounded-lg shadow-md text-center w-full max-w-md">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900">Order Confirmed!</h2>
        <p className="text-gray-700 mt-2">Order #ORD-2024-1234</p>
        <p className="text-gray-500">Placed on March 15, 2024 at 2:30 PM</p>
      </div>

      {/* Shipping Information & Order Details */}
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl mt-6">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Shipping Information */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-900">Shipping Information</h3>
            <p className="text-gray-700">{shippingData.fullName}</p>
            <p className="text-gray-700">{shippingData.address}</p>
            <p className="text-gray-700">{shippingData.phone}</p>
          </div>

          {/* Order Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
            <p className="text-gray-700">Email: john.smith@example.com</p>
            <p className="text-gray-700">Phone: (555) 123-4567</p>
            <p className="text-gray-700">Payment Method: •••• 4242</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
