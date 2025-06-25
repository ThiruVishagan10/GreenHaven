// import crypto from "crypto";
// import axios from "axios";
// import { NextResponse } from "next/server";
// import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
// import { db } from "../../../../firebase";

// let saltKey = "96434309-7796-489d-8924-ab56988a6076";
// let merchantId = "PGTESTPAYUAT86";

// import { NextRequest } from "next/server";

// export async function POST(req: NextRequest) {
//   try {
//     const searchParams = req.nextUrl.searchParams;
//     const merchantTransactionId = searchParams.get("id");
//     const userId = searchParams.get("userId");
    
//     // Get cart items directly from the user's cart in Firestore
//     let cartItems = [];
//     if (userId) {
//       try {
//         const cartDoc = await getDoc(doc(db, 'carts', userId));
//         if (cartDoc.exists()) {
//           cartItems = cartDoc.data().items || [];
//         }
//       } catch (error) {
//         console.error("Error fetching cart:", error);
//       }
//     }

//     const keyIndex = 1;

//     const string =
//       `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
//     const sha256 = crypto.createHash("sha256").update(string).digest("hex");
//     const checksum = sha256 + "###" + keyIndex;

//     const options = {
//       method: "GET",
//       url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
//       headers: {
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-VERIFY": checksum,
//         "X-MERCHANT-ID": merchantId,
//       },
//     };

//     const response = await axios(options);

//     if (response.data.success === true) {
//       // Get the actual paid amount from the payment gateway response
//       const paidAmount = response.data.data?.amount 
//         ? response.data.data.amount / 100 // Convert from paise to rupees
//         : 0;
      
//       // Save order details to Firebase
//       const orderId = merchantTransactionId || `order-${Date.now()}`;
//       await setDoc(doc(db, "orders", orderId), {
//         orderId,
//         userId,
//         paymentId: response.data.data?.transactionId || merchantTransactionId,
//         paymentStatus: response.data.data?.paymentState || "COMPLETED",
//         amount: paidAmount, // Use the actual paid amount
//         items: cartItems,
//         createdAt: serverTimestamp()
//       });
      
//       return NextResponse.redirect(`http://localhost:3000/success?orderId=${orderId}&clearCart=true`, {
//         status: 301,
//       });
//     } else {
//       return NextResponse.redirect("http://localhost:3000/failed", {
//         status: 301,
//       })
//     }
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Payment check failed", details: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 }
//     );
//   }
// }
import crypto from "crypto";
import axios from "axios";
import { NextResponse } from "next/server";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";

let saltKey = "96434309-7796-489d-8924-ab56988a6076";
let merchantId = "PGTESTPAYUAT86";

import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const merchantTransactionId = searchParams.get("id");
    const orderDataParam = searchParams.get("od"); // Using shorter parameter name
    
    console.log("Status API received params:", { 
      merchantTransactionId, 
      orderDataParam: orderDataParam?.substring(0, 100) + "..." // Log first 100 chars
    });
    
    interface OrderData {
      userName?: string;
      phoneNumber?: string;
      cartItems?: Array<{ offeredPrice: number; quantity: number }>;
      address?: string | null;
      userId?: string | null;
    }

    let orderData: OrderData = {};
    let cartItems = [];
    let userAddress = null;
    let userId = null;
    
    if (orderDataParam) {
      try {
        orderData = JSON.parse(decodeURIComponent(orderDataParam));
        console.log("Parsed order data:", orderData);
        cartItems = orderData.cartItems || [];
        userAddress = orderData.address || null;
        userId = orderData.userId || null;
      } catch (error) {
        console.error("Error parsing order data:", error);
      }
    }
    
    // Get cart items directly from the user's cart in Firestore if not provided
    if (!cartItems.length && userId) {
      try {
        const cartDoc = await getDoc(doc(db, 'carts', userId));
        if (cartDoc.exists()) {
          cartItems = cartDoc.data().items || [];
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }

    const keyIndex = 1;

    const string =
      `/pg/v1/status/${merchantId}/${merchantTransactionId}` + saltKey;
    const sha256 = crypto.createHash("sha256").update(string).digest("hex");
    const checksum = sha256 + "###" + keyIndex;

    const options = {
      method: "GET",
      url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`,
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": merchantId,
      },
    };

    const response = await axios(options);

    if (response.data.success === true) {
      // Calculate subtotal from cart items
      const subtotal = cartItems.reduce((sum : any  , item: any) => 
        sum + (Number(item.offeredPrice) * item.quantity), 0);
      
      // Calculate shipping fee
      const shipping = subtotal < 500 ? 50 : 0;
      
      console.log("Saving order with address:", userAddress);
      
      // Save order details to Firebase
      const orderId = merchantTransactionId || `order-${Date.now()}`;
      await setDoc(doc(db, "orders", orderId), {
        orderId,
        userId,
        userName: orderData.userName || "",
        phoneNumber: orderData.phoneNumber || "",
        paymentId: response.data.data?.transactionId || merchantTransactionId,
        paymentStatus: response.data.data?.paymentState || "COMPLETED",
        subtotal: subtotal,
        shipping: shipping,
        amount: subtotal + shipping,
        items: cartItems,
        address: userAddress, // Save the user's address
        createdAt: serverTimestamp()
      });
      
      return NextResponse.redirect(`http://localhost:3000/success?orderId=${orderId}&clearCart=true`, {
        status: 301,
      });
    } else {
      return NextResponse.redirect("http://localhost:3000/failed", {
        status: 301,
      })
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Payment check failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
