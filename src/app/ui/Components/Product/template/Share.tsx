import { FaCamera, FaHeart, FaGift, FaFacebook, FaInstagram, FaShareAlt } from "react-icons/fa";

const Share = () => {
  return (
    <section className="py-8">
      <div className="container mx-auto max-w-4xl"> {/* Reduced width */}
        <h2 className="text-2xl font-bold text-black mb-6 text-center">Share & Connect</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Share Your Plant */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center border">
            <FaCamera className="text-3xl mx-auto text-black mb-2" />
            <h3 className="font-semibold text-lg">Share Your Plant</h3>
            <p className="text-gray-600 text-sm mt-1">Show off your Ficus Panda! Tag us using #VelsGarden</p>
            <div className="flex justify-center gap-4 mt-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                <FaFacebook /> Share
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition">
                <FaInstagram /> Post
              </button>
            </div>
          </div>

          {/* Save for Later */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center border">
            <FaHeart className="text-3xl mx-auto text-red-500 mb-2" />
            <h3 className="font-semibold text-lg">Save for Later</h3>
            <p className="text-gray-600 text-sm mt-1">Add to your wishlist and never lose track of your favorites</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition mx-auto mt-4">
              <FaHeart /> Add to Wishlist
            </button>
          </div>

          {/* Refer a Friend */}
          <div className="bg-white shadow-lg rounded-lg p-6 text-center border">
            <FaGift className="text-3xl mx-auto text-orange-500 mb-2" />
            <h3 className="font-semibold text-lg">Refer a Friend</h3>
            <p className="text-gray-600 text-sm mt-1">Share with friends and both get ₹100 off!</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition mx-auto mt-4">
              <FaShareAlt /> Invite Friends
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Share;
