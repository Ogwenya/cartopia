import { Inter } from "next/font/google";
import AppLayout from "@/components/layout/app-layout";
import "@splidejs/react-splide/css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cartopia",
  description: "Cartopia Client",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
