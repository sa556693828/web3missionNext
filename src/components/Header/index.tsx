"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/PAN_Logo.png";
import ConnectButton from "../Button/ConnectButton";
const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAtTop, setIsAtTop] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`flex fixed top-0 h-[72px] px-[5%] z-[200] w-full items-center justify-between transition-colors duration-300 ${
        isAtTop ? "bg-transparent" : "bg-black"
      }`}
    >
      <div
        className="flex items-center gap-4 cursor-pointer "
        onClick={() => router.push("/")}
      >
        <Image src={logo} alt="logo" width={36} height={36} />
        <span className="font-chakra text-base">PAN</span>
      </div>
      {pathname === "/" ? (
        <></>
      ) : (
        // <button className="h-[41px] w-[150px] rounded-[10px] bg-[#FAFAFA] text-sm font-semibold text-black">
        //   Introducing PAN
        // </button>
        <ConnectButton />
      )}
    </nav>
  );
};

export default Header;
