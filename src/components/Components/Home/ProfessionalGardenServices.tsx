"use client";

import { FaTree, FaLeaf, FaSeedling, FaHandHoldingHeart } from "react-icons/fa";
import React from "react";

const services = [
  {
    icon: <FaTree size={24} />, 
    title: "Landscaping & Design",
    description: "Professional landscape design and implementation services.",
  },
  {
    icon: <FaLeaf size={24} />, 
    title: "Vertical Gardens",
    description: "Create stunning vertical gardens for any space.",
  },
  {
    icon: <FaSeedling size={24} />, 
    title: "Garden Maintenance",
    description: "Regular maintenance to keep your garden thriving.",
  },
  {
    icon: <FaHandHoldingHeart size={24} />, 
    title: "Plant Care Guidance",
    description: "Expert advice for plant care and maintenance.",
  }
];

export default function ProfessionalGardenServices() {
  
  return (
    <section className="py-16 bg-gray-100 text-center">
      <h2 className="text-lg font-semibold text-gray-600">Our Services</h2>
      <h3 className="text-3xl font-bold text-gray-900 mt-2">Professional Garden Services</h3>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 lg:px-20">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none"
          >
            <div className="text-black mb-4">{service.icon}</div>
            <h4 className="text-xl font-semibold text-gray-900">{service.title}</h4>
            <p className="text-gray-600 mt-2 text-sm">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}