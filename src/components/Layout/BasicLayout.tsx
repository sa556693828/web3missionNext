"use client";
import React from "react";
import homePagePic from "@/assets/homePage.png";
import missionPagePic from "@/assets/missionPage.png";
import { FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { usePathname } from "next/navigation";
interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const backgroundImage =
    pathname === "/" ? homePagePic.src : missionPagePic.src;

  return (
    <div
      className={`flex min-h-screen w-[100vw] flex-col items-center overflow-x-hidden bg-black text-white`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <nav className="bg-gray-800 flex h-[72px] w-full max-w-[1200px] items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-9 w-11 rounded bg-[#585858]"></div>
          <span className="font-chakra text-base">PAYMENTS ACCELERATION</span>
        </div>
        <button className="h-[41px] w-[150px] rounded-[10px] bg-[#FAFAFA] text-sm font-semibold text-black">
          Introducing PAN
        </button>
        {/* <div>
          <Link to="/" className="mr-4 text-white">
            Home
          </Link>
          <Link to="/mission" className="text-white">
            mission
          </Link>
        </div> */}
      </nav>
      {/* Main Content */}
      <main className="w-full flex-grow">{children}</main>
      {/* Footer */}
      {pathname === "/" && (
        <footer className="flex h-[72px] w-full max-w-[1200px] items-center justify-between">
          <div className="text-sm text-[#7C7C7C]">
            © 2024 Payments Accelerated, Inc.
          </div>
          <div className="flex gap-4 text-gray">
            <FaTelegram className="h-6 w-6 cursor-pointer" />
            <FaXTwitter className="h-6 w-6 cursor-pointer" />
          </div>
        </footer>
      )}
    </div>
  );
};

export default BasicLayout;
