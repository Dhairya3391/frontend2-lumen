import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Lumen | AI Heart Health Assessment",
  description: "Advanced cardiovascular disease risk prediction powered by AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased min-h-screen flex flex-col bg-[#F9F6F2] font-sans selection:bg-[#FF4D8C] selection:text-white`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#EAE0D5] bg-white/50 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-[#8A817C]">
            <p className="font-serif text-lg text-[#1F1F1F] mb-2">Lumen</p>
            <p>
              © {new Date().getFullYear()} Created by{" "}
              <span className="font-semibold text-[#FF4D8C]">NoobOkay</span>.
            </p>
            <p className="mt-2 text-xs opacity-70">
              AI predictions are for informational purposes only. Consult a
              doctor for medical advice.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
