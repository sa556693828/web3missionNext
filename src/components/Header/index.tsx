"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/assets/PAN_Logo.png";
import ConnectButton from "../Button/ConnectButton";
const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 flex h-[72px] w-full max-w-[1200px] items-center justify-between">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image src={logo} alt="logo" width={36} height={36} />
        <span className="font-chakra text-base">PAYMENTS ACCELERATION</span>
      </div>
      {pathname === "/" ? (
        <button className="h-[41px] w-[150px] rounded-[10px] bg-[#FAFAFA] text-sm font-semibold text-black">
          Introducing PAN
        </button>
      ) : (
        <ConnectButton />
      )}
    </nav>
  );
};

export default Header;
