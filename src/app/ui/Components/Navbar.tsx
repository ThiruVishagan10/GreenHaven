"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { User, LogOut, ShoppingBag, UserCircle } from "lucide-react";

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/product" },
    { name: "Services", path: "/services" },
    { name: "Buy & Sell", path: "/buy" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="text-xl font-bold text-black">Vel's Nursery Garden</div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-8 text-gray-500">
        {menuItems.map((item) => (
          <li key={item.name}>
            <Link href={item.path} className={`hover:text-black ${pathname === item.path ? "text-green-700 font-semibold" : ""}`}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* User Profile Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 text-gray-700 hover:text-black focus:outline-none"
        >
          <UserCircle size={28} />
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
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-red-500">
                <LogOut size={18} />
                <button onClick={() => console.log("Logging out...")}>Logout</button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
