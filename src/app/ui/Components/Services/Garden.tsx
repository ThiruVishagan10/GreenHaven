"use client";

import React from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

const Garden = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center bg-gray-100 py-12 px-6 md:px-12 rounded-lg">
      {/* Left Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/Service-Garden.svg"
          alt="Garden Maintenance"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
      
      {/* Right Content */}
      <div className="w-full md:w-1/2 max-w-md text-left px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Garden Maintenance</h2>
        <p className="text-gray-700 mb-4">
          Keep your garden looking its best year-round with our comprehensive maintenance services. Our experienced team provides regular care and attention to ensure your plants thrive.
        </p>
        <ul className="text-gray-700 space-y-2">
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Regular pruning and trimming</li>
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Seasonal plant care and protection</li>
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Soil health assessment and enhancement</li>
        </ul>
      </div>
    </section>
  );
};

export default Garden;