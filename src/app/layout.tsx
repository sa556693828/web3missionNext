import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BasicLayout from "@/components/Layout/BasicLayout";

const inter = Inter({ subsets: ["latin"] });
// const chakra = Chakra_Petch({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
// });
// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["300", "400", "500", "600", "700"],
// });

export const metadata: Metadata = {
  title: "PANPAY",
  description: "PANPAY official website",
  icons: {
    icon: "/assets/PAN_Logo.png",
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
        <BasicLayout>{children}</BasicLayout>
      </body>
    </html>
  );
}
