"use client";

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  testimonial: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    image: "/path/to/image.jpg", // Replace with the image source
    testimonial: "Green Haven transformed our backyard into a beautiful oasis. Their team was professional and knowledgeable.",
  },
  {
    id: 2,
    name: "John Doe",
    role: "Business Owner",
    image: "/path/to/image.jpg", // Replace with the image source
    testimonial: "Great service, wonderful team! I highly recommend them for any landscaping project.",
  },
  // Add more testimonials here
];

const TestimonialSlider: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <section className="p-8 bg-white">
      <h3 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h3>
      <Slider {...settings}>
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="p-4 text-center">
            <div className="flex flex-col items-center bg-gray-50 p-6 rounded shadow-lg">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={100}
                height={100}
                className="rounded-full mb-4"
              />
              <p className="italic text-lg mb-4">{`"${testimonial.testimonial}"`}</p>
              <h4 className="font-semibold">{testimonial.name}</h4>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default TestimonialSlider;
