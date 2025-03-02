"use client";

import React from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

const Landscaping = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center bg-gray-100 py-12 px-6 md:px-12 rounded-lg">
      {/* Left Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/Service-Landscaping.svg"
          alt="Landscaping and Plant Design"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
      
      {/* Right Content */}
      <div className="w-full md:w-1/2 max-w-md text-left px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Landscaping & Plant Design</h2>
        <p className="text-gray-700 mb-4">
          Our expert landscaping team creates stunning outdoor spaces that reflect your style and enhance your property's natural beauty. We combine artistic vision with horticultural expertise to deliver exceptional results.
        </p>
        <ul className="text-gray-700 space-y-2">
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Professional plant selection and arrangement</li>
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Hardscape integration and installation</li>
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Seasonal garden maintenance services</li>
        </ul>
      </div>
    </section>
  );
};

export default Landscaping;
