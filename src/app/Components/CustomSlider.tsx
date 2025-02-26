"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface PlantCategory {
  id: number;
  name: string;
  image: string;
  description: string;
}

interface SliderProps {
  items: PlantCategory[];
}

const CustomSlider: React.FC<SliderProps> = ({ items }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings} className="w-full">
      {items.map((item) => (
        <div key={item.id} className="p-4">
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 text-center">
            <Image
              src={item.image}
              alt={item.name}
              width={200}
              height={200}
              className="mx-auto mb-4 rounded"
            />
            <h4 className="text-lg font-semibold">{item.name}</h4>
            <p className="text-gray-600 text-sm mt-2">{item.description}</p>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default CustomSlider;
