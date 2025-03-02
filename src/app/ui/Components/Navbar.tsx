"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";

const NavBar = () => {
  const [search, setSearch] = useState("");
  const [activeColor, setActiveColor] = useState("text-black");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setActiveColor("text-green-700 font-semibold");
  }, [pathname]);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/product" },
    { name: "Services", path: "/services" },
    { name: "Buy & Sell", path: "/buy" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="text-xl font-bold text-black">Vel's Nursery Garden</div>

      {/* Navigation Links */}
      <ul className="hidden md:flex space-x-8 text-gray-500">
        {menuItems.map((item) => (
          <li key={item.name} className="relative">
            <Link href={item.path} className="cursor-pointer">
              <span className={`hover:text-black ${pathname === item.path ? activeColor : ""}`}>
                {item.name}
              </span>
            </Link>
            {pathname === item.path && (
              <div className="absolute left-0 w-full h-[2px] bg-green-700"></div>
            )}
          </li>
        ))}
      </ul>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md pl-10 pr-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        {/* Search Results Dropdown */}
        {search && (
          <ul className="absolute left-0 mt-2 w-full bg-white shadow-md rounded-md">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li key={item.name} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  <Link href={item.path} onClick={() => setSearch("")}> {item.name} </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-gray-500">No results found</li>
            )}
          </ul>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
