import { Truck, RotateCcw, Headphones } from "lucide-react";

const deliveryInfo = [
  {
    icon: <Truck size={32} />,
    title: "Fast Delivery",
    description: "Ships within 2-3 business days",
    highlight: "Free shipping on orders above $999",
    highlightClass: "text-green-600 font-medium",
  },
  {
    icon: <RotateCcw size={32} />,
    title: "Easy Returns",
    description: "7-day replacement guarantee",
    highlight: "No questions asked return policy",
  },
  {
    icon: <Headphones size={32} />,
    title: "24/7 Support",
    description: "Live chat support available",
    highlight: "Expert plant care guidance",
  },
];

const Delivery = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Delivery & Support Information
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {deliveryInfo.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-start p-6 bg-white shadow-md rounded-xl border"
          >
            <div className="text-black">{item.icon}</div>
            <h3 className="text-lg font-semibold mt-3">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
            <p className={`${item.highlightClass || "text-gray-500"}`}>
              {item.highlight}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Delivery;

