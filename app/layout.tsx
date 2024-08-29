import { Provider } from "@/app/client-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Money Gift Management Web Application",
  description: "Money Gift Management Web Application (intern assignment)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <main className="max-w-7xl mx-auto p-10">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
