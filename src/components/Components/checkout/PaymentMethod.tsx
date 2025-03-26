"use client";

import { useState } from "react";
import { FaCreditCard, FaQrcode, FaMoneyBillWave } from "react-icons/fa";

const PaymentMethod = () => {
  const [selectedMethod, setSelectedMethod] = useState("credit");

  return (
    <div className="p-6 w-full bg-white rounded-lg shadow-md">
      {/* Payment Method Section */}
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Payment Method</h2>
      <p className="text-gray-700 mb-4">Select your preferred payment method</p>

      {/* Payment Options */}
      <div className="space-y-4">
        {/* Credit/Debit Card Option */}
        <div
          className={`flex items-center p-4 border ${
            selectedMethod === "credit" ? "border-gray-900" : "border-gray-300"
          } rounded-lg cursor-pointer bg-white`}
          onClick={() => setSelectedMethod("credit")}
        >
          <input type="radio" checked={selectedMethod === "credit"} readOnly className="hidden" />
          <FaCreditCard className="text-xl mr-3 text-gray-700" />
          <div>
            <h3 className="font-semibold text-gray-900">Credit/Debit Card</h3>
            <p className="text-gray-600 text-sm">Pay securely with your card</p>
          </div>
        </div>

        {/* UPI Payment Option */}
        <div
          className={`flex items-center p-4 border ${
            selectedMethod === "upi" ? "border-gray-900" : "border-gray-300"
          } rounded-lg cursor-pointer bg-white`}
          onClick={() => setSelectedMethod("upi")}
        >
          <input type="radio" checked={selectedMethod === "upi"} readOnly className="hidden" />
          <FaQrcode className="text-xl mr-3 text-gray-700" />
          <div>
            <h3 className="font-semibold text-gray-900">UPI/QR Payment</h3>
            <p className="text-gray-600 text-sm">Pay using UPI apps</p>
          </div>
        </div>

        {/* Cash on Delivery Option */}
        <div
          className={`flex items-center p-4 border ${
            selectedMethod === "cod" ? "border-gray-900" : "border-gray-300"
          } rounded-lg cursor-pointer bg-white`}
          onClick={() => setSelectedMethod("cod")}
        >
          <input type="radio" checked={selectedMethod === "cod"} readOnly className="hidden" />
          <FaMoneyBillWave className="text-xl mr-3 text-gray-700" />
          <div>
            <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
            <p className="text-gray-600 text-sm">Pay when you receive the order</p>
          </div>
        </div>
      </div>

      {/* Payment Fields */}
      {selectedMethod === "credit" && (
        <div className="mt-6 space-y-4">
          <input type="text" placeholder="Card Number" className="w-full p-3 border rounded-md text-gray-900 placeholder-gray-500 border-gray-300" />
          <div className="flex space-x-4">
            <input type="text" placeholder="MM/YY" className="w-1/2 p-3 border rounded-md text-gray-900 placeholder-gray-500 border-gray-300" />
            <input type="text" placeholder="CVV" className="w-1/2 p-3 border rounded-md text-gray-900 placeholder-gray-500 border-gray-300" />
          </div>
          <input type="text" placeholder="Name on Card" className="w-full p-3 border rounded-md text-gray-900 placeholder-gray-500 border-gray-300" />
        </div>
      )}

      {selectedMethod === "upi" && (
        <div className="mt-6">
          <input type="text" placeholder="Enter your UPI ID" className="w-full p-3 border rounded-md text-gray-900 placeholder-gray-500 border-gray-300" />
        </div>
      )}
    </div>
  );
};

export default PaymentMethod;
