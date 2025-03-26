"use client";

import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderDetailsProps {
  shippingData: {
    fullName: string;
    phone: string;
    address: string;
  };
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ shippingData }) => {
  const router = useRouter();

  // Function to generate and download the invoice as a PDF
  const downloadReceipt = () => {
    const doc = new jsPDF();
    doc.text("Order Receipt", 20, 20);
    
    // Adding user details
    doc.text(`Name: ${shippingData.fullName || "N/A"}`, 20, 30);
    doc.text(`Phone: ${shippingData.phone || "N/A"}`, 20, 40);
    doc.text(`Address: ${shippingData.address || "N/A"}`, 20, 50);

    // Adding order summary table
    autoTable(doc, {
      startY: 60,
      head: [["Product", "Quantity", "Price"]],
      body: [
        ["Example Plant 1", "2", "₹500"],
        ["Example Plant 2", "1", "₹250"],
      ],
    });

    doc.save("order_receipt.pdf"); // Download the file
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-xl text-gray-900 font-semibold mb-4">Order Details</h2>

      <div className="space-y-2 text-gray-700">
        <p><strong>Name:</strong> {shippingData.fullName || "N/A"}</p>
        <p><strong>Phone:</strong> {shippingData.phone || "N/A"}</p>
        <p><strong>Address:</strong> {shippingData.address || "N/A"}</p>
      </div>

      {/* Buttons Section */}
      <div className="flex flex-col md:flex-row gap-4 mt-6">
        {/* Continue Shopping Button */}
        <button
          className="w-full md:w-[30vw] bg-black text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-gray-800 transition"
          onClick={() => router.push("/product")}
        >
          Continue Shopping
        </button>

        {/* Download Receipt Button */}
        <button
          className="w-full md:w-[30vw] bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-gray-700 transition"
          onClick={downloadReceipt}
        >
          Download Receipt
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
// Compare this snippet from src/components/Components/checkout/PaymentMethod.tsx:
// "use client";