

"use client"

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  Heart,
  Menu,
  ShoppingCart,
  UserCircle,
  X,
  User,
  ShoppingBag,
  LogOut,
} from "lucide-react";
import { UserAuth } from "@/lib/context/AuthContent";
import { useAdminAuth } from "@/lib/context/AdminAuth";
import { useFavorites } from "@/lib/context/FavoritesContext";

// Define menu items
const menuItems = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/product" },
  // { name: "Services", path: "/services" },
  // { name: "Buy & Sell", path: "/buy" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contactus" },
];
import { useCart } from "@/lib/context/CartContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/../firebase";
import { AnimatePresence, motion } from "framer-motion";

interface UserProfile {
  photoURL: string;
  displayName: string;
}

const NavBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logOut } = UserAuth();
  const { isAdmin } = useAdminAuth();
  const { getFavoriteCount } = useFavorites();
  const { getCartCount } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user profile from Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setUserProfile(null);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logOut();
      setDropdownOpen(false);
      localStorage.clear();
      router.push('/');
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminNavigation = () => {
    setDropdownOpen(false);
    router.push('/admin');
  };

  // Function to get user display image
  const getUserDisplayImage = () => {
    if (!user) return null;
    
    // First check Firestore profile photo
    if (userProfile?.photoURL) {
      return (
        <img
          src={userProfile.photoURL}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
          referrerPolicy="no-referrer"
        />
      );
    }
    
    // Fallback to Google Auth photo if available
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
    
    // Default to UserCircle if no photo available
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
              <>
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
                <Link
                  href="/cart"
                  className="relative text-gray-600 hover:text-green-600 transition-colors"
                >
                  <ShoppingCart size={24} />
                  {getCartCount() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getCartCount()}
                    </span>
                  )}
                </Link>
              </>
            )}

            {user ? (
              <div className="relative dropdown-container">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:text-black focus:outline-none"
                >
                  {getUserDisplayImage()}
                  <ChevronDown 
                    size={20} 
                    className={`transition-transform duration-200 ${
                      dropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden"
                    >
                      <ul className="text-gray-700">
                        <li className="hover:bg-gray-50">
                          <Link 
                            href="/profile" 
                            className="px-4 py-2 flex items-center gap-2"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <User size={18} />
                            Profile
                          </Link>
                        </li>
                        <li className="hover:bg-gray-50">
                          <Link 
                            href="/orders" 
                            className="px-4 py-2 flex items-center gap-2"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <ShoppingBag size={18} />
                            Orders
                          </Link>
                        </li>
                        <li className="hover:bg-gray-50">
                          <Link 
                            href="/favorites" 
                            className="px-4 py-2 flex items-center gap-2"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <Heart size={18} />
                            Favorites
                          </Link>
                        </li>
                        <li className="hover:bg-gray-50">
                          <Link 
                            href="/cart" 
                            className="px-4 py-2 flex items-center gap-2"
                            onClick={() => setDropdownOpen(false)}
                          >
                            <ShoppingCart size={18} />
                            Cart
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
                            disabled={loading}
                            className="w-full px-4 py-2 flex items-center gap-2 text-red-500 hover:bg-red-50"
                          >
                            <LogOut size={18} />
                            {loading ? 'Logging out...' : 'Logout'}
                          </button>
                        </li>
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  href="/login" 
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
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
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
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
              transition={{ duration: 0.2 }}
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
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {/* {item.icon} */}
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
                        onClick={() => setMobileMenuOpen(false)}
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
                        href="/cart"
                        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50 text-gray-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <ShoppingCart size={20} />
                        Cart
                        {getCartCount() > 0 && (
                          <span className="bg-green-600 text-white text-xs rounded-full px-2 py-1">
                            {getCartCount()}
                          </span>
                        )}
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50 text-gray-600"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <User size={20} />
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/orders"
                        className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-50 text-gray-600"
                        onClick={() => setMobileMenuOpen(false)}
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
                        disabled={loading}
                        className="w-full flex items-center gap-2 px-4 py-2 rounded-md hover:bg-red-50 text-red-500"
                      >
                        <LogOut size={20} />
                        {loading ? 'Logging out...' : 'Logout'}
                      </button>
                    </li>
                  </>
                ) : (
                  <li className="flex flex-col gap-2 px-4 py-2">
                    <Link
                      href="/login"
                      className="w-full text-center py-2 text-gray-600 hover:text-black"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                      onClick={() => setMobileMenuOpen(false)}
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
