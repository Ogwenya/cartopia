import { getServerSession } from "next-auth";
import { Inter } from "next/font/google";
import { authOptions } from "./api/auth/[...nextauth]/route";
import AppLayout from "@/components/layout/AppLayout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Cartopia",
};

async function getData() {
  const server_session = await getServerSession(authOptions);

  if (server_session?.access_token) {
    const { user } = server_session;

    return { user };
  }
}

export default async function RootLayout({ children }) {
  const data = await getData();
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppLayout session={data?.user}>{children}</AppLayout>
      </body>
    </html>
  );
}
