import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center p-8 md:p-16 bg-gray-100 mt-16">
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold">Welcome to Green Haven Nursery</h2>
        <p className="mt-4">
          Transform your space into a green paradise with our extensive
          collection of plants and expert gardening services.
        </p>
        <div className="mt-6 flex gap-4">
          <button className="bg-black text-white px-4 py-2 rounded">
            Explore Collection
          </button>
          <button className="border px-4 py-2 rounded">Contact Us</button>
        </div>
      </div>
      <div className="md:w-1/2 mt-6 md:mt-0 hidden md:flex justify-center">
        <Image
          src="/hero.svg"
          alt="Plants"
          width={500}
          height={500}
          className="rounded-xl shadow-lg"
          priority
        />
      </div>
    </section>
  );
}
