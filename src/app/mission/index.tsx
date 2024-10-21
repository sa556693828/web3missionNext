"use client";
import React, { useEffect, useState } from "react";
import point from "@/assets/point.svg";
import { FaTelegram } from "react-icons/fa";
import DailyPoint from "@/components/DailyPoint";
import ReferralCard from "@/components/ReferralCard";
import { createClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import MissionCard from "@/components/MissionCard";
import { useAccounts } from "@particle-network/btc-connectkit";
import { decodeReferralCode, generateReferralCode } from "@/lib/code";

const MissionPage: React.FC = () => {
  const { accounts } = useAccounts();
  const supabase = createClient();
  const [referralLink, setReferralLink] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [points, setPoints] = useState(0);
  const [user, setUser] = useState<User | null>(null);

  const handleLogout = async () => {
    console.log("logout");
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        setIsLogin(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };
  const signInWithTwitter = async () => {
    try {
      const redirectUrl =
        process.env.NODE_ENV === "production"
          ? process.env.NEXT_PUBLIC_APP_URL + "/mission"
          : "http://localhost:3004/mission";
      console.log(redirectUrl);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "twitter",
        options: {
          redirectTo: redirectUrl,
        },
      });
      if (error) {
        toast.error(`please try again later`);
        return;
      }
    } catch (error) {
      console.error("Error signing in with Twitter:", error);
    }
  };
  const checkLogin = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (data.user) {
        await createUser(data.user);
        setIsLogin(true);
        const user = await getUser(data.user.id);
        setUser(user as User);
      } else {
        setIsLogin(false);
      }
    } catch (error) {
      console.error("Error checking login:", error);
    }
  };
  const createUser = async (user: any) => {
    try {
      const userId = user?.id;
      const userTwitterId = user?.user_metadata.provider_id;
      const userName = user?.user_metadata.preferred_username;
      const existingUser = await getUser(userId);
      let error2;
      if (existingUser) {
        return;
        // const { error: updateError } = await supabase
        //   .from("users")
        //   .update({
        //     wallet_addr: accounts[0],
        //     twitter_id: userTwitterId,
        //     name: userName,
        //     status: 1,
        //     created_at: new Date().toISOString(),
        //   })
        //   .eq("user_id", userId);
        // error2 = updateError;
      } else {
        const { error: insertError } = await supabase.from("users").insert({
          user_id: userId,
          wallet_addr: accounts[0],
          twitter_id: userTwitterId,
          name: userName,
          status: 1,
          inviter: referralCode,
          created_at: new Date().toISOString(),
        });
        error2 = insertError;
      }

      if (error2) {
        toast.error("login to server error");
        console.error(error2);
        return;
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const getUser = async (userId: string) => {
    try {
      const { data: existingUser, error: selectError } = await supabase
        .from("users")
        .select("user_id")
        .eq("user_id", userId)
        .single();
      if (selectError && selectError.code !== "PGRST116") {
        console.error(selectError);
        toast.error("check user error");
        return;
      }
      if (existingUser) {
        return existingUser;
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  const getPoints = async () => {
    try {
      const { data, error } = await supabase
        .from("task_user")
        .select("task_point")
        .eq("user_id", user?.user_id);
      if (error) {
        console.error(error);
        toast.error("get points error");
        return;
      }
      const { data: inviterData, error: inviterError } = await supabase
        .from("users")
        .select("id")
        .eq("inviter", user?.user_id);

      if (inviterError) {
        console.error("inviter error:", inviterError);
        toast.error("get inviter error");
        return;
      }

      const inviterPoints = (inviterData?.length || 0) * 150;
      const taskPoints = data.reduce((acc: number, curr: any) => {
        return acc + curr.task_point;
      }, 0);

      const totalPoints = taskPoints + inviterPoints;
      setPoints(totalPoints);
    } catch (error) {
      console.error("get points error:", error);
    }
  };

  useEffect(() => {
    getPoints();
  }, [user]);

  useEffect(() => {
    if (accounts.length > 0) {
      checkLogin();
    }
  }, [accounts]);

  useEffect(() => {
    const cookies = document.cookie.split(";");
    const referralCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("referralCode=")
    );
    if (referralCookie) {
      setReferralCode(referralCookie.split("=")[1]);
    }
  }, []);

  const getReferralLink = async (userId: string) => {
    // const code = generateReferralCode(userId);
    // console.log(code);
    // const exCode = decodeReferralCode("mc9izfp5");
    // console.log(exCode);
    setReferralLink(`${process.env.NEXT_PUBLIC_APP_URL}/invite/${userId}`);
  };

  return (
    <div className="mx-auto relative flex min-h-[calc(100vh-72px)] w-full max-w-[1200px] flex-col items-center justify-between">
      {/* Main Content */}
      {(!isLogin || accounts.length === 0) && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/50 z-50">
          <div className="flex m-auto flex-col items-center justify-center h-1/3 aspect-[2/1] rounded-2xl px-10 bg-[#1A1A1A] ">
            {accounts.length === 0 ? (
              <>
                <p className="text-white text-2xl font-semibold">
                  Please connect wallet first
                </p>
              </>
            ) : (
              <>
                <p className="text-white text-2xl font-semibold">
                  Please login twitter
                </p>
                <button
                  className="mt-2 h-[44px] cursor-pointer rounded-[10px] bg-[#343434] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                  onClick={signInWithTwitter}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex w-full flex-col gap-8">
        <div className="flex w-full gap-8">
          <div className="flex w-2/3 flex-col gap-4">
            <DailyPoint user={user} getPoints={getPoints} />
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
                // onClick={handleLogout}
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
            <MissionCard
              taskName="Twitter"
              userId={user?.user_id}
              getPoints={getPoints}
            />
            <MissionCard
              taskName="Telegram"
              userId={user?.user_id}
              getPoints={getPoints}
            />
          </div>
          <div className="grid grid-cols-1">
            <MissionCard
              taskName="Discord"
              userId={user?.user_id}
              getPoints={getPoints}
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
              onClick={() => getReferralLink(user?.user_id as string)}
              className=""
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex h-[112px] w-full max-w-[1200px] items-center justify-between border-t-2 border-white/10">
        <div className="flex items-center gap-6">
          <button
            onClick={() => {
              window.open(process.env.NEXT_PUBLIC_X_LINK, "_blank");
            }}
            className="h-[44px] cursor-pointer rounded-[10px] bg-[#343434] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            Connect X
          </button>
          <button
            onClick={() => {
              window.open(process.env.NEXT_PUBLIC_TELEGRAM_LINK, "_blank");
            }}
            className="h-[44px] cursor-pointer rounded-[10px] bg-[#343434] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            Connect Telegram
          </button>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-xl">Your Points:</span>
          <img src={point.src} alt="point" className="size-10" />
          <span className="text-[32px] font-bold text-[#FF7A00]">{points}</span>
        </div>
      </div>
    </div>
  );
};

export default MissionPage;
