import { NextRequest, NextResponse } from 'next/server';
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
    const { orderData, userEmail } = await req.json();

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f6f6f6;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f6f6; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #16a34a, #22c55e); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Vels Nursuery Garden</h1>
                    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your order has been confirmed!</p>
                  </td>
                </tr>

                <!-- Success Message -->
                <tr>
                  <td style="padding: 30px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                    <div style="width: 60px; height: 60px; background-color: #16a34a; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                      <span style="color: white; font-size: 30px;">✓</span>
                    </div>
                    <h2 style="color: #16a34a; margin: 0 0 10px 0; font-size: 24px;">Order Confirmed!</h2>
                    <p style="color: #6b7280; margin: 0; font-size: 16px;">Thank you for your order, ${orderData.userName}!</p>
                  </td>
                </tr>

                <!-- Order Summary -->
                <tr>
                  <td style="padding: 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td width="50%" style="vertical-align: top;">
                          <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #16a34a; padding-bottom: 5px;">Order Details</h3>
                          <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Order ID:</strong> ${orderData.orderId}</p>
                          <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Payment Method:</strong> ${orderData.paymentMethod}</p>
                          <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Order Status:</strong> <span style="color: #16a34a; font-weight: bold;">Confirmed</span></p>
                          <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Order Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
                        </td>
                        <td width="50%" style="vertical-align: top; padding-left: 20px;">
                          <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #16a34a; padding-bottom: 5px;">Customer Details</h3>
                          <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Name:</strong> ${orderData.userName}</p>
                          <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Phone:</strong> ${orderData.phoneNumber}</p>
                          <p style="margin: 8px 0; color: #6b7280;"><strong style="color: #374151;">Email:</strong> ${userEmail}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Delivery Address -->
                <tr>
                  <td style="padding: 0 30px 30px 30px;">
                    <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #16a34a; padding-bottom: 5px;">Delivery Address</h3>
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #16a34a;">
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

                <!-- Order Items -->
                <tr>
                  <td style="padding: 0 30px 30px 30px;">
                    <h3 style="color: #374151; margin: 0 0 20px 0; font-size: 18px; border-bottom: 2px solid #16a34a; padding-bottom: 5px;">Order Items</h3>
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
                        ${orderData.items.map((item: any, index: number) => `
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
                            <tr style="border-top: 2px solid #16a34a;">
                              <td style="padding: 10px 0 5px 0; color: #374151; font-weight: bold; font-size: 18px;">Total:</td>
                              <td style="padding: 10px 0 5px 0; text-align: right; color: #16a34a; font-weight: bold; font-size: 18px;">₹${orderData.amount.toLocaleString()}</td>
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
                    <ul style="color: #6b7280; line-height: 1.8; margin: 0; padding-left: 20px;">
                      <li>We'll process your order within 24 hours</li>
                      <li>You'll receive a shipping confirmation with tracking details</li>
                      <li>${orderData.paymentMethod === 'Cash on Delivery' ? 'Keep the exact amount ready for delivery' : 'Your payment has been processed successfully'}</li>
                      <li>Expected delivery: 3-5 business days</li>
                    </ul>
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
      subject: `✅ Order Confirmed - ${orderData.orderId} | Vels Nursuery Garden`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
