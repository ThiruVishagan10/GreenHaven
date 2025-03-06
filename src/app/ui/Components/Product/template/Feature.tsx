import { FaLeaf, FaHeart, FaHome } from "react-icons/fa";

const features = [
  {
    icon: <FaLeaf className="text-3xl text-black" />,
    title: "Air Purification",
    description: "Natural air purifier that removes toxins and improves indoor air quality",
  },
  {
    icon: <FaHeart className="text-3xl text-black" />,
    title: "Low Maintenance",
    description: "Easy to care for, perfect for beginners and busy plant parents",
  },
  {
    icon: <FaHome className="text-3xl text-black" />,
    title: "Aesthetic Appeal",
    description: "Adds elegance and natural beauty to any indoor space",
  },
];

const Feature = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto max-w-4xl"> {/* Controls overall width */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-6 text-center border">
              <div className="mx-auto mb-2">{feature.icon}</div>
              <h3 className="font-semibold text-lg text-black">{feature.title}</h3>
              <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
