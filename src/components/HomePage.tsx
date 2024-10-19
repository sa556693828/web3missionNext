import React from "react";
import atalog from "../assets/logos/atalog.svg";
import capsule from "../assets/logos/capsule.svg";
import luminous from "../assets/logos/luminous.svg";
import nietzsche from "../assets/logos/nietzsche.svg";
import lumi from "../assets/logos/lumi.svg";
import { PiRocketLaunch } from "react-icons/pi";
import { MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const partners = [atalog, capsule, luminous, nietzsche, lumi];
  return (
    <div className="flex h-[calc(100vh-144px)] w-full flex-col items-center justify-center">
      <main className="flex w-full flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 flex items-center gap-2 rounded-full border border-[#27272A] bg-[#FFFFFF05] px-4 py-2 shadow-sm backdrop-blur-md">
          <div className="bg-gray-gradient flex items-center gap-2 rounded-full px-4 py-2">
            <PiRocketLaunch className="text-[#FF7A00]" size={14} />
            <span className="text-xs font-semibold">ODYSSEY</span>
          </div>
          <span className="text-sm text-[#FAFAFA]">
            Start your adventure now!
          </span>
        </div>
        <h1 className="text-title bg-text-gray-gradient bg-clip-text text-transparent">
          Payments Acceleration Nodes
        </h1>
        <h2 className="text-title bg-text-orange-gradient bg-clip-text text-transparent">
          Campaign
        </h2>
        <p className="my-8 max-w-2xl text-base font-normal text-white/60">
          Building Bitcoin node infrastructure for real-world payments. Fast,
          secure, and permissionless with the Lightning Network.
        </p>
        <div className="mt-4 flex gap-4">
          <button
            onClick={() => {
              navigate("/mission");
            }}
            className="flex h-[54px] cursor-pointer items-center gap-2 rounded-2xl bg-[#FF7A00] px-6 text-xl font-extrabold text-white transition-opacity hover:opacity-80"
          >
            Start Journey
            <MdArrowForward size={24} />
          </button>
          <button className="h-[54px] cursor-pointer rounded bg-transparent px-6 text-xl font-semibold text-white/60 transition-opacity hover:opacity-80">
            Learn More
          </button>
        </div>
      </main>
      <section className="mt-20">
        <h3 className="mb-6 text-center text-xl text-white/60">Supported By</h3>
        <div className="flex w-[80vw] justify-between gap-4">
          {partners.map((partner) => (
            <div key={partner} className="">
              <img src={partner} alt={partner} className="" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
