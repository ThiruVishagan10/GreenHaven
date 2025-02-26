import React from "react";

const teamMembers = [
  {
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    experience: "25+ years of horticultural expertise",
    image: "path-to-image1",
  },
  {
    name: "Priya Sharma",
    role: "Head Horticulturist",
    experience: "15+ years of plant care experience",
    image: "path-to-image2",
  },
  {
    name: "Arjun Patel",
    role: "Landscape Designer",
    experience: "10+ years of design experience",
    image: "path-to-image3",
  },
  {
    name: "Anjali Verma",
    role: "Customer Care Manager",
    experience: "8+ years of service excellence",
    image: "path-to-image4",
  },
];

const OurTem = () => {
  return (
    <div className="bg-[#f9fafb] text-black p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Our Team</h2>
      <div className="flex justify-center space-x-6">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg text-center w-72 transition-transform transform hover:scale-105 hover:mt-2"
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 mx-auto rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-gray-600">{member.role}</p>
            <p className="text-gray-500 text-sm mt-2">{member.experience}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTem;