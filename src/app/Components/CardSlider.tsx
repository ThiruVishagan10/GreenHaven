"use client";

import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Review = {
  id: number;
  name: string;
  location: string;
  review: string;
  image: string;
};

type CardSliderProps = {
  items: Review[];
  containerClass?: string;
  slidesToShow?: number;
};

const CardSlider: React.FC<CardSliderProps> = ({ items, containerClass = "", slidesToShow = 4 }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className={`px-32 md:px-48 lg:px-64 ${containerClass}`}>
      <Slider {...settings}>
        {items.map((review) => (
          <div
            key={review.id}
            className="bg-white p-6 rounded-2xl shadow-lg text-center w-48 h-80 flex flex-col justify-center items-center transition-transform transform hover:scale-105 hover:mt-2 mx-12 border border-gray-300"
          >
            <img
              src={review.image}
              alt={review.name}
              className="w-16 h-16 rounded-full mb-4"
            />
            <p className="text-gray-600 italic text-sm overflow-hidden text-ellipsis whitespace-nowrap max-w-[90%]">
              "{review.review}"
            </p>
            <h3 className="text-lg font-semibold mt-4">{review.name}</h3>
            <p className="text-gray-500 text-sm">{review.location}</p>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CardSlider;
