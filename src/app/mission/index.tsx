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
import { User as SupabaseUser } from "@supabase/supabase-js";
import { getUserByID, getUserByWallet } from "@/lib/getData";
import { IoReload } from "react-icons/io5";

const MissionPage: React.FC = () => {
  const { accounts } = useAccounts();
  const supabase = createClient();
  const [referralLink, setReferralLink] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [points, setPoints] = useState(0);
  const [user, setUser] = useState<User | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [hasGeneratedLink, setHasGeneratedLink] = useState(false);

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
  const checkBindedTwitter = async (walletAddr: string) => {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_addr", walletAddr)
        .single();

      if (user?.twitter_id) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking binded twitter:", error);
    }
  };
  const checkLogin = async (walletAddr: string) => {
    try {
      const isBinded = await checkBindedTwitter(walletAddr); // 檢查是否綁定過X
      if (!isBinded) {
        const { data, error } = await supabase.auth.getUser(); // user table 沒資料，則檢查是否登入
        if (error) {
          console.error("error get user", error);
          return;
        }
        if (data.user) {
          await createUserDB(data.user);
          const { error: updateError } = await supabase.auth.updateUser({
            password: data.user.id,
          });
          if (updateError) {
            console.error("error update password", updateError);
            return;
          }
          const user = await getUserByID(data.user.id);
          setUser(user as User);
          setIsLogin(true);
        } else {
          setIsLogin(false);
        }
      } else {
        // 以綁定過X，則一樣先檢查是否登入，沒登入的話用帳號密碼登入
        const { data, error } = await supabase.auth.getUser();
        if (data.user) {
          const DBuser = await getUserByID(data.user.id);
          setUser(DBuser as User);
          setIsLogin(true);
        } else {
          const userData = await getUserByWallet(accounts[0]);
          const { error } = await supabase.auth.signInWithPassword({
            email: userData?.email,
            password: userData?.user_id,
          });
          if (error) {
            toast.error(`error sign in`);
            return;
          }
          setUser(userData as User);
          setIsLogin(true);
        }
      }
    } catch (error) {
      console.error("Error checking login:", error);
    }
  };
  const createUserDB = async (user: SupabaseUser) => {
    try {
      const cookies = document.cookie.split(";");
      const referralCookie = cookies.find((cookie) =>
        cookie.trim().startsWith("referralCode=")
      );
      const userId = user?.id;
      const userTwitterId = user?.user_metadata.provider_id;
      const userName = user?.user_metadata.preferred_username;
      const userEmail = user?.email;
      const existingUser = await getUserByID(userId);
      let error2;
      if (existingUser) {
        return;
      } else {
        const { error: insertError } = await supabase.from("users").insert({
          user_id: userId,
          wallet_addr: accounts[0],
          twitter_id: userTwitterId,
          name: userName,
          status: 1,
          inviter: referralCookie ? referralCookie?.split("=")[1] : "",
          email: userEmail,
          created_at: new Date().toISOString(),
        });

        if (insertError) {
          toast.error("login to server error");
          console.error(insertError);
          return;
        }
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };
  const getPoints = async () => {
    try {
      // TODO: 拿points時，限制只能拿幾次
      const { data, error } = await supabase
        .from("task_user")
        .select("*")
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
      const now = new Date().getTime();
      const validTasks = data.filter((task) => {
        if (task.task_name === "daily_check") {
          return true; // 'daily_check' 任务直接返回 true，不进行时间检查
        }
        const createdTime = new Date(task.created_at).getTime();
        const isOverOneMinute = now - createdTime >= 60 * 1000;
        return isOverOneMinute;
      });

      const inviterPoints = (inviterData?.length || 0) * 150;
      const taskPoints = validTasks.reduce((acc: number, curr: any) => {
        return acc + curr.task_point;
      }, 0);

      const totalPoints = taskPoints + inviterPoints;
      setPoints(totalPoints);
    } catch (error) {
      console.error("get points error:", error);
    }
  };
  const getUser = async () => {
    const { data, error } = await supabase.auth.getUser(); // user table 沒資料，則檢查是否登入
  };
  useEffect(() => {
    getPoints();
  }, [user]);
  const handleReloadClick = () => {
    setIsRotating(true);
    setRefresh(!refresh);
    getPoints();
    setTimeout(() => setIsRotating(false), 1000); // 1秒后停止旋转
  };
  useEffect(() => {
    if (accounts.length > 0) {
      checkLogin(accounts[0]);
    }
  }, [accounts, isLogin]);
  const getReferralLink = async (userId: string) => {
    const link = `${process.env.NEXT_PUBLIC_APP_URL}/invite/${userId}`;
    setReferralLink(link);
    setHasGeneratedLink(true);

    // 设置 cookie
    document.cookie = `referralLinkGenerated=true; path=/; max-age=${
      60 * 60 * 24 * 30
    }`; // 30天有效期
    document.cookie = `referralLink=${link}; path=/; max-age=${
      60 * 60 * 24 * 30
    }`;
  };

  useEffect(() => {
    // 检查 cookie 是否存在已生成的推荐链接
    const cookies = document.cookie.split(";");
    const generatedCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("referralLinkGenerated=")
    );
    const linkCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("referralLink=")
    );

    if (generatedCookie && linkCookie) {
      setHasGeneratedLink(true);
      setReferralLink(linkCookie.split("=")[1]);
    }
  }, []);

  return (
    <div className="mx-auto relative flex min-h-[calc(100vh-72px)] w-full max-w-[1200px] flex-col items-center justify-between">
      {/* Main Content */}
      {(!isLogin || accounts.length === 0) && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full bg-black/50 z-50">
          <div className="flex m-auto flex-col items-center justify-center h-[30%] aspect-[2/1] rounded-2xl px-10 bg-[#1A1A1A] ">
            {accounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4">
                <p className="text-white text-2xl font-semibold">
                  Connect Your Wallet
                </p>
                <p className="text-white/60 text-base text-center">
                  Connect your BTC wallet to join the event!
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <p className="text-white text-2xl font-semibold">
                  Please login twitter
                </p>
                <button
                  className="mt-2 h-[44px] cursor-pointer rounded-[10px] bg-[#343434] px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-80"
                  onClick={signInWithTwitter}
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex w-full flex-col gap-8">
        <div className="flex w-full gap-8">
          <div className="flex w-2/3 flex-col gap-4">
            <DailyPoint user={user} getPoints={getPoints} />
          </div>
          <div className="flex w-1/3 flex-1 flex-col items-start">
            <div className="mb-4">
              <h2 className="font-poppins text-content text-white">
                Achievement Bridge
              </h2>
              <span className="text-base text-white/60">
                Raise your rank with missions and invites!
              </span>
            </div>
            <div className="mb-4">
              <h2
                className="font-poppins text-content text-white"
                // onClick={handleLogout}
                onClick={getUser}
              >
                Task Bridge
              </h2>
              <span className="text-base text-white/60">
                Kickstart your journey by completing tasks on the Odyssey page
                and unlock achievements along the way!
              </span>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col gap-4">
          <div className="flex items-center gap-2">
            <p className="text-base font-semibold">Get 50 Points</p>

            <IoReload
              onClick={handleReloadClick}
              className={`text-white cursor-pointer transition-all duration-100 ${
                isRotating ? "rotate-360" : ""
              }`}
              size={20}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MissionCard
              taskName="Twitter"
              userId={user?.user_id}
              getPoints={getPoints}
              refresh={refresh}
            />
            <MissionCard
              taskName="Telegram"
              userId={user?.user_id}
              getPoints={getPoints}
              refresh={refresh}
            />
          </div>
          <div className="grid grid-cols-1">
            <MissionCard
              taskName="Discord"
              userId={user?.user_id}
              getPoints={getPoints}
              refresh={refresh}
            />
          </div>
          <p
            className="mt-4 text-base font-semibold"
            // onClick={handleLogout}
          >
            Every 1 Referral: Get 150 Points
          </p>
          <div className="grid grid-cols-1">
            <ReferralCard
              icon={<FaTelegram className="text-white" size={24} />}
              text={<span>Referral link</span>}
              buttonText="Generate"
              referralLink={referralLink}
              onClick={() =>
                hasGeneratedLink
                  ? navigator.clipboard.writeText(referralLink)
                  : getReferralLink(user?.user_id as string)
              }
              className=""
            />
          </div>
        </div>
      </div>
      {/* Footer */}
      <div className="flex h-[112px] w-full max-w-[1200px] items-center justify-between border-t-2 border-white/10">
        <div className="flex items-center gap-6">
          {/* <button
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
          </button> */}
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
