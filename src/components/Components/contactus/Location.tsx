"use client";

import React from "react";

const locations = [
  {
    id: 1,
    name: "Vels Nursery Garden, Manapakkam",
    address: "No. 4/101, Jeyaram Garden, Niligiris Super Market, Ambedkar Nagar Main Rd, near Manapakkam, Ramapuram, Parthasarathy Nagar, Manapakkam, Chennai, Tamil Nadu 600125",
    timing: "Mon-Sat: 8:00 AM - 7:00 PM",
  }
];

const Location = () => {
  return (
    <div className="bg-[#f9fafb] text-black px-8 py-12">
      <h2 className="text-2xl font-bold text-center mb-6">Our Locations</h2>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-8">
        {/* Google Map */}
        <div className="w-full md:w-[600px] h-[400px] rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.3051383888983!2d80.17612037575601!3d13.016230313896912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5260cf26e646b1%3A0xe01a307edd7f228c!2sVels%20Nursery%20Garden!5e0!3m2!1sen!2sin!4v1740492304971!5m2!1sen!2sin"
            className="w-full h-full"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Location Details */}
        <div className="w-full md:w-[400px] flex flex-col gap-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-white p-4 shadow-md rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <h3 className="font-semibold text-lg">{location.name}</h3>
              <p className="text-gray-600">{location.address}</p>
              <p className="text-gray-500 text-sm">{location.timing}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Location;
