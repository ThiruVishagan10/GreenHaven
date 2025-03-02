"use client";

import React from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

const Expert = () => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center bg-gray-100 py-12 px-6 md:px-12 rounded-lg">
      {/* Left Content */}
      <div className="w-full md:w-1/2 max-w-md text-left px-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Expert Consultation</h2>
        <p className="text-gray-700 mb-4">
          Get professional guidance from our experienced horticulturists. We provide personalized advice to help you make informed decisions about your garden.
        </p>
        <ul className="text-gray-700 space-y-2">
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Plant selection and care guidance</li>
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Soil quality and improvement tips</li>
          <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Pest and disease management strategies</li>
        </ul>
      </div>
      
      {/* Right Image */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Image
          src="/Service-Expert.svg"
          alt="Expert Consultation"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
};

export default Expert;
