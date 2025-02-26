"use client";

import Image from "next/image";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  image: string;
  description: string;
};

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "John Doe",
    role: "CEO",
    image: "/path/to/image.jpg", // Replace with actual image path
    description: "John leads the team with vision and passion, ensuring that every project is a success.",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Head of Operations",
    image: "/path/to/image.jpg", // Replace with actual image path
    description: "Jane ensures smooth day-to-day operations and streamlines processes across the board.",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Marketing Director",
    image: "/path/to/image.jpg", // Replace with actual image path
    description: "Sarah crafts innovative marketing strategies that help us connect with customers.",
  },
  // Add more team members as necessary
];

const OurTeam: React.FC = () => {
  return (
    <section className="p-8 bg-gray-100 text-center">
      <h3 className="text-3xl font-bold mb-8">Meet Our Team</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col items-center">
              <Image
                src={member.image}
                alt={member.name}
                width={150}
                height={150}
                className="rounded-full mb-4"
              />
              <h4 className="text-xl font-semibold">{member.name}</h4>
              <p className="text-gray-600">{member.role}</p>
              <p className="mt-4 text-sm text-gray-500">{member.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OurTeam;
