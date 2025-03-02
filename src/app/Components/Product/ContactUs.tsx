"use client";

import React from "react";
import Image from "next/image";

const ContactUs = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between bg-black text-white py-12 px-6 md:px-12">
      {/* Left Content */}
      <div className="w-full md:w-1/2 max-w-md ml-20 text-left mb-10">
        <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
        <p className="mb-4">
          Our expert gardeners are here to help you select the perfect flowering
          plants for your space. Fill out the form and we'll get back to you
          with personalized recommendations.
        </p>
        <input
          type="text"
          placeholder="Your Name"
          className="w-full p-2 mb-4 text-black"
        />
        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-2 mb-4 text-black"
        />
        <button className="bg-white text-black px-4 py-2 rounded-md">
          Send Message
        </button>
      </div>
      
      {/* Right Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="./Product-Contact.svg"
          alt="Contact Us"
          width={500}
          height={500}
          className="rounded-lg"
        />
      </div>
    </section>
  );
};

export default ContactUs;
