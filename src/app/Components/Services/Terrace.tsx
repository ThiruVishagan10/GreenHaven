"use client";

import React from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

const Terrace = () => {
  return (
    <section className="flex flex-col md:flex-row-reverse items-center justify-center bg-gray-100 py-12 px-6 md:px-12 rounded-lg">
      {/* Right Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/Service-Terrace.svg"
          alt="Terrace and Vertical Gardening"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
      
      {/* Left Content */}
      <div className="w-full md:w-1/2 max-w-md text-left px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Terrace & Vertical Gardening</h2>
        <p className="text-gray-700 mb-4">
          Transform your urban space into a green oasis with our innovative terrace and vertical gardening solutions. We specialize in maximizing limited spaces to create beautiful, sustainable gardens.
        </p>
        <ul className="text-gray-700 space-y-2">
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Space-efficient vertical garden systems</li>
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Custom container gardening solutions</li>
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Sustainable irrigation systems</li>
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Eco-friendly rooftop landscaping</li>
        </ul>
      </div>
    </section>
  );
};

export default Terrace;
