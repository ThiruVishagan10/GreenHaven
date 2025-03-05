// NavBar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut, ShoppingBag, UserCircle } from "lucide-react";
import { UserAuth } from "@/lib/context/AuthContent";

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logOut } = UserAuth();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/product" },
    { name: "Services", path: "/services" },
    { name: "Buy & Sell", path: "/buy" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
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
    setDropdownOpen(false); // Close dropdown after clicking
    router.push('/admin');
  };

  // Function to get user display image
  const getUserDisplayImage = () => {
    if (!user) return null;
    
    // Check for photoURL from Google Auth
    if (user.photoURL) {
      return (
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
          referrerPolicy="no-referrer" // Important for Google Photos URLs
        />
      );
    }
    
    // Default to UserCircle if no photo available
    return <UserCircle size={28} />;
  };

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="text-xl font-bold text-black">Vel's Nursery Garden</div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-8 text-gray-500">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link
              href={item.path}
              className={`hover:text-black ${
                pathname === item.path ? "text-green-700 font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Authentication Section */}
      <div className="relative">
        {user ? (
          // Logged in user profile dropdown
          <>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 text-gray-700 hover:text-black focus:outline-none"
            >
              {getUserDisplayImage()}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden">
                <ul className="text-gray-700">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <User size={18} />
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <ShoppingBag size={18} />
                    <Link href="/orders">Orders</Link>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
                    <User size={18} />
                    <button onClick={handleAdminNavigation}>Admin Page</button>
                  </li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-500">
                    <LogOut size={18} />
                    <button onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            )}
          </>
        ) : (
          // Sign in/Sign up buttons for non-authenticated users
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
    </nav>
  );
};

export default NavBar;
