"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

const Searchbar = () => {
  const [search, setSearch] = useState("");

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
    <div className="relative">
      <Search className="absolute left-3 top-2 text-gray-400" size={18} />
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 rounded-md pl-10 pr-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
      />
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
  );
};

export default Searchbar;
