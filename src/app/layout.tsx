"use client"
import type { Metadata } from "next";
import "./globals.css";
// app/layout.tsx
import { AuthContextProvider } from '@/lib/context/AuthContent';
import { AdminAuthProvider } from '@/lib/context/AdminAuth';
import NavBar from "./ui/Components/Navbar";
import Footer from "./ui/Components/Footer";
import { FavoritesProvider } from "@/lib/context/FavoritesContext";
import { CartProvider } from "@/lib/context/CartContext";

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
            <CartProvider>
            <FavoritesProvider>
            <NavBar/>
            {children}
            <Footer/>
            </FavoritesProvider>
            </CartProvider>
          </AdminAuthProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
