"use client";

const ContactSection: React.FC = () => {
  return (
    <section className="p-8 bg-black text-white">
      <div className="flex justify-between items-center">
        <div className="text-left">
          <h3 className="text-2xl font-bold">Ready to start your garden journey?</h3>
          <p className="mt-2">Get in touch with us today.</p>
        </div>
        <button className="mt-4 bg-white text-black px-4 py-2 rounded hover:bg-green-700 hover:text-white">Get Started</button>
      </div>
    </section>
  );
};

export default ContactSection;
