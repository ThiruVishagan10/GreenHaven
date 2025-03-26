"use client";

import { useState } from "react";

const Checkout = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Information */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form className="space-y-4">
            <input
              type="text"
              name="fullName"
              placeholder="Enter your full name"
              className="w-full p-3 bg-gray-800 rounded-md text-white placeholder-gray-900"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              className="w-full p-3 bg-gray-800 rounded-md text-white placeholder-gray-400"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Enter your complete address"
              className="w-full p-3 bg-gray-800 rounded-md text-white placeholder-gray-400"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Indoor Snake Plant</span>
              <span>₹1,499</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Ceramic Plant Pot</span>
              <span>₹899</span>
            </div>
            <hr className="border-gray-700" />
            <div className="flex justify-between items-center">
              <span>Subtotal</span>
              <span>₹2,398</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Shipping</span>
              <span>₹149</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Tax</span>
              <span>₹432</span>
            </div>
            <hr className="border-gray-700" />
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total</span>
              <span>₹2,979</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Payment Button */}
      <button
        className="bg-white text-black w-full p-3 rounded-md mt-6 font-semibold hover:bg-gray-300 transition"
      >
        Confirm Payment
      </button>
    </div>
  );
};

export default Checkout;
