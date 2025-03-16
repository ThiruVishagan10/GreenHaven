"use client";

import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { FaInstagram, FaFacebook, FaPinterest, FaTwitter, FaYoutube } from "react-icons/fa";

const Hero = () => {
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
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Send us a message</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Name</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Email</label>
              <input type="email" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Subject</label>
              <input type="text" className="w-full p-2 border border-gray-300 rounded-md" />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Message</label>
              <textarea className="w-full p-2 border border-gray-300 rounded-md" rows={4}></textarea>
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Attach a file (optional)</label>
              <input type="file" className="mt-2" />
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <p className="flex items-center gap-2 text-gray-700 mb-2">
            <FaPhone className="text-gray-600" /> +1 (555) 123-4567
          </p>
          <p className="flex items-center gap-2 text-gray-700 mb-2">
            <FaEnvelope className="text-gray-600" /> contact@greenhaven.com
          </p>
          <p className="flex items-center gap-2 text-gray-700 mb-4">
            <FaMapMarkerAlt className="text-gray-600" /> 123 Plant Street, Garden City, New York, NY 10001
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
