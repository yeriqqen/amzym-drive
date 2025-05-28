import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AmzymDrive - Fast & Reliable Delivery",
  description: "Your trusted partner for quick, safe, and efficient delivery of food and goods. We offer global coverage, real-time tracking, and secure delivery services.",
  keywords: "delivery, food delivery, goods delivery, tracking, fast delivery, reliable delivery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`min-h-full ${inter.className}`}>
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
