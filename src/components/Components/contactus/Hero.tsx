
import ContactForm from "@/components/ContactForm";
import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import nodemailer from "nodemailer";
import { FaInstagram, FaFacebook, FaPinterest, FaTwitter, FaYoutube } from "react-icons/fa";
import { FormData } from "@/types/contact";
import contactSchema from "@/utils/validation/Form-contact";
import { getErrorMessage } from "@/utils/message.error";

const Hero = () => {

  const sendMail = async (data: FormData) => {
    'use server'

    try{

      //Validate the data
      contactSchema.parse(data);

        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const messageText = `
        From: ${data.email}
        Subject: ${data.subject}
        
        Message:
        ${data.message}
    `;

        const mailOptions = {
          from: process.env.SMTP_USERNAME, // Use the authenticated email address
          replyTo: data.email, // Add reply-to field with the contact form email
          to: process.env.MAIL_RECEIVER_ADDRESS,
          subject: `Contact Form: ${data.subject}`,
          text: messageText,
          html: `
              <p><strong>From:</strong> ${data.email}</p>
              <p><strong>Subject:</strong> ${data.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${data.message}</p>
          `,
      };

        //Send Email
        await transporter.sendMail(mailOptions);
        return{
            success: true,
            error:null
        }
    }catch(error){
        return{
            success: false,
            error: getErrorMessage(error),
        }
    }
}

  return (
    <section className="bg-white py-12 px-6 md:px-16 lg:px-24">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Contact Us</h1>
        <p className="text-gray-600 mt-2">
          Get in touch with us for any questions about our plants or services
        </p>
      </div>

      {/* Contact Form and Information Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact Form */}

        <ContactForm sendMail = {sendMail} />

        {/* Contact Information */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <p className="flex items-center gap-2 text-gray-700 mb-2">
            <FaPhone className="text-gray-600" /> 044-3581-2725
          </p>
          <p className="flex items-center gap-2 text-gray-700 mb-2">
            <FaPhone className="text-gray-600" /> +91-75502 74125
          </p>
          <p className="flex items-center gap-2 text-gray-700 mb-2">
            <FaPhone className="text-gray-600" /> +91-94425 32215
          </p>
          <p className="flex items-center gap-2 text-gray-700 mb-2">
            <FaEnvelope className="text-gray-600" /> contact@greenhaven.com
          </p>
          <p className="flex items-center gap-2 text-gray-700 mb-4">
            <FaMapMarkerAlt className="text-gray-600" /> No.4/101, Ambedhkar Nagar,Main Road,<br></br>Manapakkam, Chennai - 600 125
          </p>

          <h3 className="text-lg font-semibold">Business Hours</h3>
          <p className="text-gray-700">Monday - Friday: 9:00 AM - 6:00 PM</p>
          <p className="text-gray-700">Saturday: 10:00 AM - 4:00 PM</p>
          <p className="text-gray-700 mb-4">Sunday: Closed</p>

          {/* Social Media Links */}
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex gap-4">
            <FaInstagram className="text-gray-600 text-2xl cursor-pointer hover:text-black" />
            <FaFacebook className="text-gray-600 text-2xl cursor-pointer hover:text-black" />
            <FaPinterest className="text-gray-600 text-2xl cursor-pointer hover:text-black" />
            <FaTwitter className="text-gray-600 text-2xl cursor-pointer hover:text-black" />
            <FaYoutube className="text-gray-600 text-2xl cursor-pointer hover:text-black" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
