import { Inter } from "next/font/google";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import AppLayout from "@/components/layout/app-layout";
// import "@splidejs/react-splide/css";
import "@splidejs/react-splide/css/sea-green";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cartopia",
  description: "Cartopia Client",
};

async function fetch_cart() {
  const session = await getServerSession(authOptions);

  if (session) {
    try {
      const headers = {
        Authorization: `Bearer ${session.access_token}`,
      };
      const API_URL = process.env.NEXT_PUBLIC_API_URL;

      const response = await fetch(`${API_URL}/v0/client/cart`, {
        headers: headers,
        next: { tags: ["cart"] },
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message);
      }

      const totalItems =
        data.items?.reduce((total, item) => total + item.quantity, 0) || 0;

      return totalItems;
    } catch (error) {
      throw new Error(
        "Something went wrong, try refreshing the page or try again later.If this problem persist, let us know.",
      );
    }
  } else {
    return 0;
  }
}

export default async function RootLayout({ children }) {
  const totalCartItems = await fetch_cart();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout totalCartItems={totalCartItems}>{children}</AppLayout>
      </body>
    </html>
  );
}
