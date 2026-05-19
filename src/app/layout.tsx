import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import { Web3Provider } from "@/components/providers/Web3Provider";
import SmoothScroll from "@/components/SmoothScroll";
import AuthSync from "@/components/AuthSync";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Archetypes | The Reputation Layer for Arc Network",
  description: "Build verifiable on-chain reputation through high-signal contributions. Archetypes is the premier platform for developer and builder identity on the Arc ecosystem.",
  openGraph: {
    title: "Archetypes | Reputation Layer",
    description: "Contribute to protocols, prove your work, and grow your on-chain presence.",
    url: "https://archetypes.arc",
    siteName: "Archetypes",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          <SmoothScroll>
            <AuthSync />
            <Sidebar />
            <div className="main-layout">
              {children}
              <Footer />
            </div>
          </SmoothScroll>
        </Web3Provider>
      </body>
    </html>
  );
}
