"use client";
import React, { useState } from "react";
import point from "@/assets/point.svg";
import { FaTelegram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import DailyPoint from "@/components/DailyPoint";
import TaskCard from "@/components/TaskCard";
import ReferralCard from "@/components/ReferralCard";
import { signIn, signOut, useSession } from "next-auth/react";
import { createClient } from "@/utils/supabase/client";

const MissionPage: React.FC = () => {
  const supabase = createClient();
  const [days] = useState([false, false, false, false, false, false, false]);
  const [referralLink, setReferralLink] = useState("");
  const nextDayIndex = days.findIndex((day) => !day);
  const { data: session, status } = useSession();
  const handleLogout = async () => {
    await signOut();
  };
  const signInWithTwitter = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "twitter",
      });
      console.log("data", data);
    } catch (error) {
      console.error("Error signing in with Twitter:", error);
    }
  };
  const getUser = async () => {
    try {
      const { data, error } = await supabase.from("tasks").select("*");
      console.log("data", data);
      console.log("error", error);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  if (status === "loading") {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[1200px] flex-col items-center justify-between">
        Loading...
      </div>
    );
  }
  if (!session) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[1200px] flex-col items-center justify-center">
        {/* Main Content */}
        <p>Please login twitter first</p>
        <button
          className="mt-2 h-[44px] cursor-pointer rounded-[10px] bg-[#343434] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          // onClick={() => signIn("twitter")}
          onClick={signInWithTwitter}
        >
          Login
        </button>
      </div>
    );
  }
  return (
    <div className="mx-auto flex min-h-[calc(100vh-72px)] w-full max-w-[1200px] flex-col items-center justify-between">
      {/* Main Content */}
      <div className="mt-4 flex w-full flex-col gap-8">
        <div className="flex w-full gap-8">
          <div className="flex w-2/3 flex-col gap-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="bg-text-orange-gradient bg-clip-text text-subtitle text-transparent">
                Daily check event
              </h2>
              <button
                className="h-[49px] w-[162px] rounded-[10px] bg-white text-sm font-semibold text-black"
                onClick={() => {
                  if (session) {
                    console.log("session", session);
                  } else {
                    signIn("twitter");
                  }
                }}
              >
                Check - Out
              </button>
            </div>
            <div className="flex w-full justify-between space-x-4">
              {days.map((checked, index) => (
                <DailyPoint
                  key={index}
                  checked={checked}
                  isNext={index === nextDayIndex}
                />
              ))}
            </div>
          </div>
          <div className="flex w-1/3 flex-1 flex-col items-center">
            <div className="mb-4">
              <h2 className="font-poppins text-content text-white">
                Achievement bridge
              </h2>
              <span className="text-base text-white/60">
                Impact the rankings with missions and invitations.
              </span>
            </div>
            <div className="mb-4">
              <h2
                className="font-poppins text-content text-white"
                onClick={handleLogout}
              >
                Task bridge
              </h2>
              <span className="text-base text-white/60">
                Start your journey of achievement by completing a series of
                tasks through the Odyssey page.
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          <p className="text-base font-semibold">Get 50 Points</p>
          <div className="grid grid-cols-2 gap-4">
            <TaskCard
              icon={<FaXTwitter className="text-white" size={24} />}
              text={
                <span>
                  Follow{" "}
                  <a
                    href={process.env.NEXT_PUBLIC_X_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-white underline underline-offset-2 transition-opacity hover:opacity-80"
                  >
                    @Pan_Ecosystem
                  </a>{" "}
                  on Twitter
                </span>
              }
              buttonText="Follow"
              onClick={() => {
                getUser();
              }}
              className=""
            />
            <TaskCard
              icon={<FaTelegram className="text-white" size={24} />}
              text={
                <span>
                  Join{" "}
                  <a
                    href={process.env.NEXT_PUBLIC_TELEGRAM_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-white underline underline-offset-2 transition-opacity hover:opacity-80"
                  >
                    @Pan_Eco
                  </a>{" "}
                  on Telegram
                </span>
              }
              buttonText="Join"
              onClick={() => {
                // window.open("https://twitter.com/Pan_Ecosystem", "_blank");
              }}
              isDone={true}
              className=""
            />
          </div>
          <div className="grid grid-cols-1">
            <TaskCard
              icon={<FaTelegram className="text-white" size={24} />}
              text={
                <span>
                  Join Discord{" "}
                  <a
                    href={process.env.NEXT_PUBLIC_DISCORD_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer text-white underline underline-offset-2 transition-opacity hover:opacity-80"
                  >
                    {process.env.NEXT_PUBLIC_DISCORD_LINK}
                  </a>{" "}
                  and Verify
                </span>
              }
              buttonText="Join"
              onClick={() => {
                // window.open("https://twitter.com/Pan_Ecosystem", "_blank");
              }}
              className=""
            />
          </div>
          <p className="mt-4 text-base font-semibold">
            Every 1 Referral: Get 150 Points
          </p>
          <div className="grid grid-cols-1">
            <ReferralCard
              icon={<FaTelegram className="text-white" size={24} />}
              text={<span>Referral link</span>}
              buttonText="Generate"
              referralLink={referralLink}
              onClick={() => {
                setReferralLink("https://ReferralLink/invite/dayuwbdiw8ub");
              }}
              className=""
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex h-[112px] w-full max-w-[1200px] items-center justify-between border-t-2 border-white/10">
        <div className="flex items-center gap-6">
          <button className="h-[44px] cursor-pointer rounded-[10px] bg-[#343434] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80">
            Connect X
          </button>
          <button className="h-[44px] cursor-pointer rounded-[10px] bg-[#343434] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80">
            Connect Telegram
          </button>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-xl">Your Points:</span>
          <img src={point.src} alt="point" className="size-10" />
          <span className="text-[32px] font-bold text-[#FF7A00]">1,500</span>
        </div>
      </div>
    </div>
  );
};

export default MissionPage;
