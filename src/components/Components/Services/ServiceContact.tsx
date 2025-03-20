"use client";

import React from "react";

const ServiceContact = () => {
  return (
    <section className="bg-black text-white py-16 px-6 md:px-12 flex flex-col md:flex-row items-center justify-center">
      {/* Left Content */}
      <div className="w-full md:w-1/2 text-left max-w-md md:max-w-lg px-6">
        <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Space?</h2>
        <p className="text-gray-400 mb-6">
          Schedule a consultation with our experts and start creating your dream garden today.
        </p>
        <div className="flex space-x-4">
          <button className="bg-white border text-black px-6 py-2 rounded-md font-semibold hover:bg-black hover:text-white hover:border-white">
            Book Consultation
          </button>
          <button className="border border-white px-6 py-2 rounded-md font-semibold hover:bg-white hover:text-black ">
            View Portfolio
          </button>
        </div>
      </div>
      
      {/* Contact Form */}
      <div className="w-full md:w-[50%] bg-white text-black p-10 rounded-lg shadow-lg max-w-xl">
        <h3 className="text-xl font-bold mb-4">Contact Us</h3>
        <form>
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input type="text" placeholder="Your name" className="w-full border p-3 mb-4 rounded-md" />
          
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input type="email" placeholder="your@email.com" className="w-full border p-3 mb-4 rounded-md" />
          
          <label className="block text-sm font-semibold mb-1">Service Interest</label>
          <select className="w-full border p-3 mb-4 rounded-md">
            <option>Landscaping & Design</option>
          </select>
          
          <label className="block text-sm font-semibold mb-1">Message</label>
          <textarea placeholder="Tell us about your project" className="w-full border p-3 mb-4 rounded-md" rows={4}></textarea>
          
          <button className="w-full bg-black text-white py-3 rounded-md font-semibold">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
};

export default ServiceContact;
