"use client"
import type { Metadata } from "next";
import "./globals.css";
// app/layout.tsx
import { AuthContextProvider } from '@/lib/context/AuthContent';
import { AdminAuthProvider } from '@/lib/context/AdminAuth';
import NavBar from "./ui/Components/Navbar";
import Footer from "./ui/Components/Footer";

import { CartProvider } from "@/lib/context/CartContext";
import { UserProvider } from "@/lib/context/UserContext";
import { FavoriteProvider } from "@/lib/context/FavoritesContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <AdminAuthProvider>
          <UserProvider>
            <CartProvider>
            <FavoriteProvider >
            <NavBar/>
            {children}
            <Footer/>
            </FavoriteProvider>
            </CartProvider>
            </UserProvider>
          </AdminAuthProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
