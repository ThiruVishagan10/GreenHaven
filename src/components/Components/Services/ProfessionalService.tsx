import { FaTree, FaBuilding, FaLeaf, FaComments } from "react-icons/fa";

const services = [
  {
    icon: <FaTree size={40} />, 
    title: "Landscaping & Design",
    description: "Custom landscape design and implementation for gardens of all sizes."
  },
  {
    icon: <FaBuilding size={40} />, 
    title: "Terrace Gardens",
    description: "Specialized solutions for urban spaces and vertical gardens."
  },
  {
    icon: <FaLeaf size={40} />, 
    title: "Garden Maintenance",
    description: "Regular upkeep and care for thriving gardens year-round."
  },
  {
    icon: <FaComments size={40} />, 
    title: "Expert Consultation",
    description: "Professional guidance for plant selection and care."
  }
];

export default function ProfessionalServices() {
  return (
    <section className="py-16 bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-gray-900 mt-2">Professional Garden Services</h1>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 lg:px-20">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-xl"
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
