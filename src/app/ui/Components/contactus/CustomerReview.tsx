"use client";

import React from "react";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    name: "Lakshmi Ranganathan",
    location: "Chennai",
    review: "The quality of plants and service at Green Haven is exceptional. Their team helped me transform my terrace into a beautiful garden.",
    image: "/hero.svg",
    rating: 5,
  },
  {
    id: 2,
    name: "Suresh Menon",
    location: "Coimbatore",
    review: "Their expertise in landscaping is unmatched. They designed and executed my home garden beautifully.",
    image: "/hero.svg",
    rating: 5,
  },
  {
    id: 3,
    name: "Meera Krishnan",
    location: "Madurai",
    review: "Great selection of plants and very knowledgeable staff. They provided excellent guidance for my indoor plant collection.",
    image: "/hero.svg",
    rating: 5,
  }
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex">
      {Array.from({ length: rating }).map((_, index) => (
        <span key={index} className="text-yellow-500 text-lg">★</span>
      ))}
    </div>
  );
};

const CustomerReviews = () => {
  return (
    <div className="bg-[#f9fafb] text-black p-8">
      <h2 className="text-2xl font-bold text-center mb-6">What Our Customers Say</h2>
      <div className="flex justify-center gap-8">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="bg-white p-6 shadow-md rounded-lg w-[360px] transition-transform duration-300 ease-in-out transform hover:scale-105"
          >
            <StarRating rating={review.rating} />
            <p className="text-gray-700 mt-3 italic">"{review.review}"</p>
            <div className="flex items-center mt-4 gap-3">
              <Image src={review.image} alt={review.name} width={40} height={40} className="rounded-full" />
              <div>
                <p className="font-semibold">{review.name}</p>
                <p className="text-sm text-gray-500">{review.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerReviews;
