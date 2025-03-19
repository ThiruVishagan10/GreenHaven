import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center w-screen h-screen p-8 md:p-16 bg-white ">
      <div className="md:w-1/2 text-center md:text-left flex flex-col items-center md:items-start">
        <h2 className="text-5xl md:text-6xl font-bold">
          Welcome to <br />
          <span className="text-green-700">Vel's Nursery Garden</span>
        </h2>
        <p className="mt-4 max-w-lg">
          Transform your space into a green paradise with our extensive
          collection of plants and expert gardening services.
        </p>
        <div className="mt-6 flex gap-4">
          <button className="bg-black text-white px-6 py-3 rounded hover:bg-green-600 hover:text-white">
            Explore Collection
          </button>
          <button className="border px-6 py-3 rounded hover:bg-green-600 hover:text-white">
            Contact Us
          </button>
        </div>
      </div>

      <div className="md:w-1/2 flex justify-center items-center mt-6 md:mt-0">
        <Image src="/hero.svg" alt="Plants" width={600} height={600} priority />
      </div>
    </section>
  );
}
