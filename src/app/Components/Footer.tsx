import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-10 px-6 md:px-16 text-sm">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex flex-col space-y-2">
          <div className="text-indigo-500 font-bold italic text-lg">LOGO</div>
          <p>Creating beautiful green spaces since 1995.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:gap-16">
          <div>
            <h3 className="text-white font-semibold mb-2">Products</h3>
            <ul className="space-y-2">
              {["Indoor Plants", "Outdoor Plants", "Flowering Plants", "Fruit Trees"].map((product, index) => (
                <li key={index}>
                  <button className="text-gray-400 hover:text-white transition px-2 py-1 rounded-md">
                    {product}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Services</h3>
            <ul className="space-y-2">
              {["Landscaping", "Garden Maintenance", "Plant Care", "Consultation"].map((service, index) => (
                <li key={index}>
                  <button className="text-gray-400 hover:text-white transition px-2 py-1 rounded-md">
                    {service}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">Contact</h3>
            <ul className="space-y-1">
              <li>123 Garden Street</li>
              <li>Greenville, GV 12345</li>
              <li>(555) 123-4567</li>
              <li>info@greenhaven.com</li>
            </ul>
          </div>

          {/* Social Media Column */}
          <div>
            <h3 className="text-white font-semibold mb-2">Follow Us</h3>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaFacebookF size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <FaLinkedinIn size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-500">
        &copy; 2024 Green Haven Nursery. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
