// "use client";

// import { useState, useEffect } from "react";
// import OrderConfirmation from "@/components/Components/Payment/OrderConfirmation";
// import OrderDetails from "@/components/Components/Payment/OrderDetails";

// export default function OrderSummaryPage() {
//   const [shippingData, setShippingData] = useState({
//     fullName: "",
//     phone: "",
//     address: "",
//   });

//   useEffect(() => {
//     // Fetch shipping details from sessionStorage to keep data during the checkout session
//     const savedShippingData = sessionStorage.getItem("shippingData");
//     if (savedShippingData) {
//       setShippingData(JSON.parse(savedShippingData));
//     }
//   }, []);

//   return (
//     <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
//       <div className="w-full max-w-4xl">
//         {/* Order Confirmation Message */}
//         <OrderConfirmation status="success" orderId="ORD-2024-1234" orderDate="2024-03-20" />

//         {/* Order Details */}
//         <div className="mt-6">
//           <OrderDetails shippingData={shippingData} />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from 'next/navigation';
import { Loader2 } from "lucide-react";

interface PaymentData {
  total: number;
  userName: string;
  phoneNumber: string;
}

export default function Payment() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get and parse the payment data from URL
    const encodedData = searchParams.get('data');
    if (encodedData) {
      try {
        const paymentData: PaymentData = JSON.parse(decodeURIComponent(encodedData));
        console.log("Received payment data:", paymentData); // Debug log
        
        setName(paymentData.userName || "");
        // Remove any non-numeric characters and take last 10 digits
        const cleanPhone = (paymentData.phoneNumber || "")
          .replace(/\D/g, '')
          .slice(-10);
        setMobile(cleanPhone);
        setAmount(paymentData.total.toString());
      } catch (error) {
        console.error("Error parsing payment data:", error);
        setError("Invalid payment data");
      }
    }
  }, [searchParams]);

  const handlePayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      name: name,
      amount: amount,
      mobile,
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



  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <p className="text-red-500 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-indigo-50 to-green-500">
      <div className="flex flex-col items-center max-w-4xl p-8 bg-white rounded-lg lg:flex-row">
        {/* Left Section: Video */}
        <div className="flex-col items-center justify-center w-full lg:w-1/2">
          <div className="p-10">
            {/* Add your logo here if needed */}
          </div>
          <video
            src="https://www.phonepe.com/webstatic/8020/videos/page/home-fast-secure-v3.mp4"
            autoPlay
            loop
            muted
            className="rounded-lg"
          />
        </div>

        {/* Right Section: Payment Form */}
        <div className="w-full mt-8 lg:w-1/2 lg:mt-0 lg:ml-8">
          <div className="p-8 bg-green-500 rounded-lg shadow-md">
            <h2 className="mb-6 text-3xl font-bold text-center text-white">
              Payment Details
            </h2>

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-white rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Order Summary</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Amount</span>
                <span className="text-lg font-semibold">₹{amount}</span>
              </div>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label
                  htmlFor="Name"
                  className="block text-sm font-medium text-white"
                >
                  Name
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    😎
                  </span>
                  <input
                    id="Name"
                    name="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="block w-full py-2 pl-10 pr-4 text-gray-900 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div>
      <label
        htmlFor="Mobile"
        className="block text-sm font-medium text-white"
      >
        Mobile
      </label>
      <div className="relative mt-2">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          📞
        </span>
        <input
          id="Mobile"
          name="Mobile"
          type="tel"
          pattern="[0-9]{10}"
          value={mobile}
          required
          onChange={(e) => {
            // Only allow numbers and limit to 10 digits
            const value = e.target.value.replace(/\D/g, '').slice(0, 10);
            setMobile(value);
          }}
          placeholder="Enter your mobile number"
          className="block w-full py-2 pl-10 pr-4 text-gray-900 bg-white rounded-lg shadow-sm focus:ring-2 focus:ring-purple-400"
        />
      </div>
    </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  `Pay ₹${amount}`
                )}
              </button>
            </form>

            {/* Security Badge */}
            <div className="flex items-center justify-center mt-6 space-x-2">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm text-white">Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
