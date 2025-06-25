"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true);

  // Parse the payment data from URL
  const searchParams = new URLSearchParams(window.location.search);
  const encodedData = searchParams.get('data');
  interface PaymentData {
    address?: string;
    cartItems?: any[];
    userId?: string;
  }

  let paymentData: PaymentData = {};
  let address = null;
  let cartItems = [];
  let userId = "";
  
  if (encodedData) {
    try {
      paymentData = JSON.parse(decodeURIComponent(encodedData));
      address = paymentData.address || null;
      cartItems = paymentData.cartItems || [];
      userId = paymentData.userId || "";
    } catch (error) {
      console.error("Error parsing payment data:", error);
    }
  }

  const data = {
    name: name,
    amount: amount,
    mobile: mobile,
    userId: userId,
    address: address,
    cartItems: cartItems,
    MUID: "MUID" + Date.now(),
    transactionId: "T" + Date.now(),
  };

  try {
    const response = await axios.post("http://localhost:3000/api/order", data);
    if (response.data?.data?.instrumentResponse?.redirectInfo?.url) {
      window.location.href = response.data.data.instrumentResponse.redirectInfo.url;
    }
  } catch (err) {
    console.error("Payment error:", err);
    setError("Payment processing failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-50 to-green-500">
      <div className="max-w-4xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          PhonePe Payment Gateway
        </h2>
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label>Mobile:</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label>Amount:</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </form>
      </div>
    </div>
  );
}