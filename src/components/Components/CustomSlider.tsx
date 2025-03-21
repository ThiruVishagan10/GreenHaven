"use client";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from "next/navigation";

interface PlantCategory {
  id: number;
  name: string;
  image: string;
  description: string;
  path: string; 
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

  const router = useRouter();
  
  const handleExploreClick = (path: string) => {
    router.push(path);
  };

  return (
    <Slider {...settings} className="w-full">
      {items.map((item) => (
        <div key={item.id} className="p-4">
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 text-center transition-transform transform hover:scale-105 hover:shadow-lg">
            <div className="relative w-[180px] h-[180px] mx-auto"> {/* Added fixed width and centered */}
              <Image
                src={item.image}
                alt={item.name}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
              />
            </div>
            <h4 className="text-lg font-semibold mt-4">{item.name}</h4>
            <p className="text-gray-600 text-sm mt-2">{item.description}</p>
            <button 
              onClick={() => handleExploreClick(item.path)}
              className="mt-4 px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition"
            >
              Explore More
            </button>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default CustomSlider;
