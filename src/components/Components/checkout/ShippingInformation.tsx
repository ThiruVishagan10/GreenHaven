"use client";

import { useState } from "react";
import Breadcrumb from "./Breadcrumb";

const steps = ["Cart", "Shipping", "Payment", "Confirmation"];

interface ShippingProps {
  onSave: (data: { fullName: string; phone: string; address: string }) => void;
}

const ShippingInformation: React.FC<ShippingProps> = ({ onSave }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const updatedData = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedData);
    onSave(updatedData); // Send data to CheckoutPage
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <Breadcrumb steps={steps} currentStep={2} />
      <h2 className="text-xl text-gray-900 font-semibold mb-4">Shipping Information</h2>

      <form className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Enter your full name"
          className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          value={formData.fullName}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Enter your phone number"
          className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          value={formData.phone}
          onChange={handleChange}
        />
        <textarea
          name="address"
          placeholder="Enter your complete address"
          className="w-full p-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 h-24 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          value={formData.address}
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

export default ShippingInformation;
