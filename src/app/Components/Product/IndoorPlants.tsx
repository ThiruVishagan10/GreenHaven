"use client";

import React from "react";
import CustomSlider from "../CustomSlider";

const plants = [
  {
    id: 1,
    name: "Roses",
    image: "/images/roses.jpg",
    description:
      "Classic symbols of love and beauty, our roses come in various colors and varieties.",
  },
  {
    id: 2,
    name: "Hibiscus",
    image: "/images/hibiscus.jpg",
    description:
      "Bright and tropical, hibiscus flowers add a burst of color to any garden.",
  },
  {
    id: 3,
    name: "Marigold",
    image: "/images/marigold.jpg",
    description:
      "Cheerful and easy to grow, perfect for adding vibrant colors to gardens.",
  },
  {
    id: 4,
    name: "Jasmine",
    image: "/images/jasmine.jpg",
    description:
      "Famous for its fragrant blossoms, jasmine is a delightful addition to any space.",
  },
];

const IndoorPlants = () => {
  return (
    <section className="py-12 bg-pink-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Featured Indoor Plants</h2>
        <CustomSlider
          items={plants.map((plant) => ({
            ...plant,
            action: (
              <button className="mt-4 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition">
                Explore More
              </button>
            ),
            hoverEffect: "hover:shadow-lg hover:scale-105 transition-transform",
          }))}
        />
      </div>
    </section>
  );
};

export default IndoorPlants;