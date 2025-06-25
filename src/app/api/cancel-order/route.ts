// src/app/api/cancel-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { orderId, userId } = await req.json();

    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    
    if (!orderDoc.exists()) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const orderData = orderDoc.data();
    
    // Check if order belongs to user
    if (orderData.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Check if order is within 24 hours
    const orderTime = orderData.createdAt.toDate();
    const now = new Date();
    const timeDiff = now.getTime() - orderTime.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff > 24) {
      return NextResponse.json({ error: 'Order cannot be cancelled after 24 hours' }, { status: 400 });
    }

    // Update order status
    await updateDoc(doc(db, 'orders', orderId), {
      orderStatus: 'CANCELLED',
      cancelledAt: new Date(),
    });

    // Send cancellation email
    const userDoc = await getDoc(doc(db, 'users', userId));
    const userEmail = userDoc.exists() ? userDoc.data().email : null;

    if (userEmail) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Cancellation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f6f6;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f6f6; padding: 20px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #d32f2f, #f44336); padding: 30px; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Vels Nursuery Garden</h1>
                      <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your order has been cancelled</p>
                    </td>
                  </tr>

                  <!-- Message -->
                  <tr>
                    <td style="padding: 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                      <div style="width: 60px; height: 60px; background-color: #d32f2f; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                        <span style="color: white; font-size: 30px;">✕</span>
                      </div>
                      <h2 style="color: #d32f2f; margin: 0 0 10px 0; font-size: 24px;">Order Cancelled</h2>
                      <p style="color: #6b7280; margin: 0; font-size: 16px;">Your order #${orderData.orderId} has been cancelled as requested.</p>
                    </td>
                  </tr>

                  <!-- Order Summary -->
                  <tr>
                    <td style="padding: 30px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="50%" style="vertical-align: top;">
                            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #d32f2f; padding-bottom: 5px;">Order Details</h3>
                            <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Order ID:</strong> ${orderData.orderId}</p>
                            <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Payment Method:</strong> ${orderData.paymentMethod}</p>
                            <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Order Date:</strong> ${orderTime.toLocaleDateString('en-IN')}</p>
                            <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Cancellation Date:</strong> ${now.toLocaleDateString('en-IN')}</p>
                          </td>
                          <td width="50%" style="vertical-align: top; padding-left: 20px;">
                            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #d32f2f; padding-bottom: 5px;">Customer Details</h3>
                            <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Name:</strong> ${orderData.userName}</p>
                            <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Phone:</strong> ${orderData.phoneNumber}</p>
                            <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Email:</strong> ${userEmail}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Delivery Address -->
                  ${orderData.address ? `
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #d32f2f; padding-bottom: 5px;">Delivery Address</h3>
                      <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #d32f2f;">
                        <p style="margin: 0; color: #374151; line-height: 1.6;">
                          <strong>${orderData.userName}</strong><br>
                          ${orderData.address.street}<br>
                          ${orderData.address.city}, ${orderData.address.state}<br>
                          ${orderData.address.postalCode}<br>
                          Phone: ${orderData.phoneNumber}
                        </p>
                      </div>
                    </td>
                  </tr>
                  ` : ''}

                  <!-- Order Items -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #d32f2f; padding-bottom: 5px;">Cancelled Items</h3>
                      <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                        <thead>
                          <tr style="background-color: #f9fafb;">
                            <th style="padding: 15px; text-align: left; color: #374151; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Item</th>
                            <th style="padding: 15px; text-align: center; color: #374151; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Qty</th>
                            <th style="padding: 15px; text-align: right; color: #374151; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Price</th>
                            <th style="padding: 15px; text-align: right; color: #374151; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          ${orderData.items.map((item : any, index : any) => `
                            <tr style="border-bottom: ${index < orderData.items.length - 1 ? '1px solid #f3f4f6' : 'none'};">
                              <td style="padding: 15px; color: #374151;">
                                <strong>${item.name}</strong>
                                <br><small style="color: #6b7280;">${item.description || ''}</small>
                              </td>
                              <td style="padding: 15px; text-align: center; color: #6b7280;">${item.quantity}</td>
                              <td style="padding: 15px; text-align: right; color: #6b7280;">₹${Number(item.offeredPrice).toLocaleString()}</td>
                              <td style="padding: 15px; text-align: right; color: #374151; font-weight: bold;">₹${(Number(item.offeredPrice) * item.quantity).toLocaleString()}</td>
                            </tr>
                          `).join('')}
                        </tbody>
                      </table>
                    </td>
                  </tr>

                  <!-- Order Total -->
                  <tr>
                    <td style="padding: 0 30px 30px 30px;">
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="60%"></td>
                          <td width="40%">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                              <tr>
                                <td style="padding: 5px 0; color: #6b7280;">Subtotal:</td>
                                <td style="padding: 5px 0; text-align: right; color: #6b7280;">₹${orderData.subtotal.toLocaleString()}</td>
                              </tr>
                              <tr>
                                <td style="padding: 5px 0; color: #6b7280;">Shipping:</td>
                                <td style="padding: 5px 0; text-align: right; color: #6b7280;">
                                  ${orderData.shipping === 0 ? '<span style="color: #16a34a;">Free</span>' : `₹${orderData.shipping.toLocaleString()}`}
                                </td>
                              </tr>
                              <tr style="border-top: 2px solid #d32f2f;">
                                <td style="padding: 10px 0 5px 0; color: #374151; font-weight: bold; font-size: 18px;">Total:</td>
                                <td style="padding: 10px 0 5px 0; text-align: right; color: #d32f2f; font-weight: bold; font-size: 18px;">₹${orderData.amount.toLocaleString()}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Next Steps -->
                  <tr>
                    <td style="padding: 30px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
                      <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px;">What's Next?</h3>
                      <p style="color: #6b7280; line-height: 1.8; margin: 0 0 15px 0;">
                        Your order has been cancelled successfully. If you paid for this order, a refund will be processed according to our refund policy.
                      </p>
                      <p style="color: #6b7280; line-height: 1.8; margin: 0;">
                        If you have any questions about your cancellation or refund, please contact our customer service.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px; text-align: center; background-color: #374151;">
                      <p style="color: #ffffff; margin: 0 0 10px 0; font-size: 16px;">Thank you for choosing Vels Nursuery Garden!</p>
                      <p style="color: #9ca3af; margin: 0; font-size: 14px;">
                        Need help? Contact us at ${process.env.MAIL_RECEIVER_ADDRESS}
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      await transporter.sendMail({
        from: process.env.SMTP_USERNAME,
        to: userEmail,
        cc: process.env.MAIL_RECEIVER_ADDRESS,
        subject: `Order Cancelled - ${orderData.orderId} | Vels Nursuery Garden`,
        html: emailHtml,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel order error:', error);
    return NextResponse.json({ error: 'Failed to cancel order' }, { status: 500 });
  }
}
