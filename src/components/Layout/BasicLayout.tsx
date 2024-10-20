// @ts-ignore
"use client";
import React from "react";
import homePagePic from "@/assets/homePage.png";
import missionPagePic from "@/assets/missionPage.png";
import { FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import {
  ConnectProvider,
  OKXConnector,
  UnisatConnector,
  BitgetConnector,
  TokenPocketConnector,
  BybitConnector,
  WizzConnector,
  XverseConnector,
} from "@particle-network/btc-connectkit"; // eslint-disable-line @typescript-eslint/no-unused-vars
import {
  Merlin,
  BEVM,
  MAPProtocol,
  Mantle,
  BitlayerTestnet,
  PolygonzkEVMCardona,
} from "@particle-network/chains"; // eslint-disable-line @typescript-eslint/no-unused-vars
import Header from "../Header"; // eslint-disable-line @typescript-eslint/no-unused-vars

interface BasicLayoutProps {
  children: React.ReactNode;
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const backgroundImage =
    pathname === "/" ? homePagePic.src : missionPagePic.src;

  return (
    <SessionProvider>
      <div
        className={`flex min-h-screen w-[100vw] flex-col items-center overflow-x-hidden bg-black text-white`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* <Header /> */}
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
    </SessionProvider>
    // <ConnectProvider
    //   options={{
    //     projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "", // -
    //     clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY || "", // Retrieved from https://dashboard.particle.network
    //     appId: process.env.NEXT_PUBLIC_APP_ID || "", // -
    //     aaOptions: {
    //       accountContracts: {
    //         BTC: [
    //           {
    //             chainIds: [Merlin.id, BEVM.id, MAPProtocol.id],
    //             version: "1.0.0",
    //           },
    //           {
    //             chainIds: [
    //               BitlayerTestnet.id,
    //               PolygonzkEVMCardona.id,
    //               Mantle.id,
    //             ],
    //             version: "2.0.0",
    //           },
    //         ],
    //       },
    //     },
    //     walletOptions: {
    //       visible: false,
    //     },
    //   }}
    //   connectors={[
    //     new UnisatConnector(),
    //     new OKXConnector(),
    //     // new BitgetConnector(),
    //     // new TokenPocketConnector(),
    //     // new BybitConnector(),
    //     // new WizzConnector(),
    //     new XverseConnector(),
    //   ]}
    // >

    // </ConnectProvider>
  );
};

export default BasicLayout;
