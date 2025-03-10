// // NavBar.tsx
// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";
// import { User, LogOut, ShoppingBag, UserCircle } from "lucide-react";
// import { UserAuth } from "@/lib/context/AuthContent";
// import { useAdminAuth } from "@/lib/context/AdminAuth";

// const NavBar = () => {
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const pathname = usePathname();
//   const { user, logOut } = UserAuth();
//   const { isAdmin } = useAdminAuth(); // Add this line to check admin status

//   const menuItems = [
//     { name: "Home", path: "/" },
//     { name: "Products", path: "/product" },
//     { name: "Services", path: "/services" },
//     { name: "Buy & Sell", path: "/buy" },
//     { name: "About", path: "/about" },
//     { name: "Contact", path: "/contact" },
//   ];

//   const handleLogout = async () => {
//     setLoading(true);
//     try {
//       await logOut();
//       setDropdownOpen(false);
//       router.push("/");
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//     setLoading(false);
//   };

//   const handleAdminNavigation = () => {
//     setDropdownOpen(false);
//     router.push('/admin');
//   };

//   // Function to get user display image
//   const getUserDisplayImage = () => {
//     if (!user) return null;
    
//     // Check for photoURL from Google Auth
//     if (user.photoURL) {
//       return (
//         <img
//           src={user.photoURL}
//           alt="Profile"
//           className="w-8 h-8 rounded-full object-cover"
//           referrerPolicy="no-referrer" // Important for Google Photos URLs
//         />
//       );
//     }
    
//     // Default to UserCircle if no photo available
//     return <UserCircle size={28} />;
//   };

//   return (
//     <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between sticky top-0 z-50">
//       {/* Logo */}
//       <div className="text-xl font-bold text-black">Vel's Nursery Garden</div>

//       {/* Navigation Links */}
//       <ul className="hidden md:flex space-x-8 text-gray-500">
//         {menuItems.map((item) => (
//           <li key={item.name}>
//             <Link
//               href={item.path}
//               className={`hover:text-black ${
//                 pathname === item.path ? "text-green-700 font-semibold" : ""
//               }`}
//             >
//               {item.name}
//             </Link>
//           </li>
//         ))}
//       </ul>

//       {/* Authentication Section */}
//       <div className="relative">
//         {user ? (
//           // Logged in user profile dropdown
//           <>
//             <button
//               onClick={() => setDropdownOpen(!dropdownOpen)}
//               className="flex items-center gap-2 text-gray-700 hover:text-black focus:outline-none"
//             >
//               {getUserDisplayImage()}
//             </button>

//             {dropdownOpen && (
//               <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden">
//                 <ul className="text-gray-700">
//                   <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
//                     <User size={18} />
//                     <Link href="/profile">Profile</Link>
//                   </li>
//                   <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
//                     <ShoppingBag size={18} />
//                     <Link href="/orders">Orders</Link>
//                   </li>
//                   {/* Only show Admin Page option if user is admin */}
//                   {isAdmin && (
//                     <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
//                       <User size={18} />
//                       <button onClick={handleAdminNavigation}>Admin Page</button>
//                     </li>
//                   )}
//                   <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-500">
//                     <LogOut size={18} />
//                     <button onClick={handleLogout}>Logout</button>
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </>
//         ) : (
//           // Sign in/Sign up buttons for non-authenticated users
//           <div className="flex items-center gap-4">
//             <Link href="/login" className="text-gray-600 hover:text-black">
//               Sign In
//             </Link>
//             <Link
//               href="/signup"
//               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//             >
//               Sign Up
//             </Link>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default NavBar;

// src/app/ui/Components/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  User, 
  LogOut, 
  ShoppingBag, 
  UserCircle, 
  Heart, 
  Menu, 
  X,
  ChevronDown,
  Home,
  Package,
  ShoppingCart,
  Phone,
  Info
} from "lucide-react";
import { UserAuth } from "@/lib/context/AuthContent";
import { useAdminAuth } from "@/lib/context/AdminAuth";
import { useFavorites } from "@/lib/context/FavoritesContext";
import { motion, AnimatePresence } from "framer-motion";

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logOut } = UserAuth();
  const { isAdmin } = useAdminAuth();
  const { getFavoriteCount } = useFavorites();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const menuItems = [
    { name: "Home", path: "/", icon: <Home size={20} /> },
    { name: "Products", path: "/product", icon: <Package size={20} /> },
    { name: "Services", path: "/services", icon: <ShoppingCart size={20} /> },
    { name: "Buy & Sell", path: "/buy", icon: <ShoppingBag size={20} /> },
    { name: "About", path: "/about", icon: <Info size={20} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={20} /> },
  ];

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logOut();
      setDropdownOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setLoading(false);
  };

  const handleAdminNavigation = () => {
    setDropdownOpen(false);
    router.push('/admin');
  };

  const getUserDisplayImage = () => {
    if (!user) return null;
    
    if (user.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      );
    }
    
    return <UserCircle size={28} />;
  };

  return (
    <nav className="bg-white shadow-md py-4 px-4 md:px-8 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-black">
            Vel's Nursery Garden
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8 text-gray-500">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.path}
                  className={`hover:text-black transition-colors ${
                    pathname === item.path ? "text-green-700 font-semibold" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-4 relative">
            {user && (
              <Link
                href="/favorites"
                className="relative text-gray-600 hover:text-green-600 transition-colors"
              >
                <Heart size={24} />
                {getFavoriteCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getFavoriteCount()}
                  </span>
                )}
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-black focus:outline-none"
                >
                  {getUserDisplayImage()}
                  <ChevronDown size={20} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden"
                    >
                      <ul className="text-gray-700">
                        <li className="hover:bg-gray-50">
                          <Link href="/profile" className="px-4 py-2 flex items-center gap-2">
                            <User size={18} />
                            Profile
                          </Link>
                        </li>
                        <li className="hover:bg-gray-50">
                          <Link href="/orders" className="px-4 py-2 flex items-center gap-2">
                            <ShoppingBag size={18} />
                            Orders
                          </Link>
                        </li>
                        <li className="hover:bg-gray-50">
                          <Link href="/favorites" className="px-4 py-2 flex items-center gap-2">
                            <Heart size={18} />
                            Favorites
                          </Link>
                        </li>
                        {isAdmin && (
                          <li className="hover:bg-gray-50">
                            <button 
                              onClick={handleAdminNavigation}
                              className="w-full px-4 py-2 flex items-center gap-2"
                            >
                              <User size={18} />
                              Admin Page
                            </button>
                          </li>
                        )}
                        <li className="hover:bg-gray-50">
                          <button 
                            onClick={handleLogout}
                            className="w-full px-4 py-2 flex items-center gap-2 text-red-500"
                          >
                            <LogOut size={18} />
                            Logout
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-gray-600 hover:text-black">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-600 hover:text-black"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4"
            >
              <ul className="flex flex-col space-y-2">
                {menuItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50 ${
                        pathname === item.path ? "text-green-700 font-semibold" : "text-gray-600"
                      }`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  </li>
                ))}
                {user ? (
                  <>
                    <li>
                      <Link
                        href="/favorites"
                        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50 text-gray-600"
                      >
                        <Heart size={20} />
                        Favorites
                        {getFavoriteCount() > 0 && (
                          <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1">
                            {getFavoriteCount()}
                          </span>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50 text-gray-600"
                      >
                        <User size={20} />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50 text-gray-600"
                      >
                        <ShoppingBag size={20} />
                        Orders
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <button
                          onClick={handleAdminNavigation}
                          className="w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50 text-gray-600"
                        >
                          <User size={20} />
                          Admin Page
                        </button>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50 text-red-500"
                      >
                        <LogOut size={20} />
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="flex flex-col gap-2 px-4 py-2">
                    <Link
                      href="/login"
                      className="w-full text-center py-2 text-gray-600 hover:text-black"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Sign Up
                    </Link>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default NavBar;
