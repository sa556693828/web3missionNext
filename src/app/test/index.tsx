"use client";
import { createClient } from "@/utils/supabase/client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const CheckFollow = () => {
  const { data: session, status } = useSession();
  const supabase = createClient();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const checkTwitterFollow = async () => {
    if (!session) {
      console.log("用户未登录");
      return;
    }
    try {
      const response = await fetch("/api/check-follow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        throw new Error("请求失败");
      }

      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (err) {
      console.error("检查关注状态时出错:", err);
    } finally {
      setIsLoading(false);
    }
  };
  async function signInWithTwitter() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "twitter",
    });
    console.log(data);
  }
  const checkBindedTwitter = async (walletAddr: string) => {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("wallet_addr", walletAddr)
        .single();

      console.log(user);
      if (user?.twitter_id) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error checking binded twitter:", error);
    }
  };
  const fetchTwitterUser = async () => {
    try {
      const response = await fetch("/api/getme");
      if (!response.ok) {
        throw new Error("请求失败");
      }
      const userData = await response.json();
      console.log(userData);
      // 处理用户数据...
    } catch (error) {
      console.error("获取Twitter用户信息时出错:", error);
      // 处理错误...
    }
  };
  const handleLogout = async () => {
    await signOut();
  };
  // useEffect(() => {
  //   if (session?.accessToken) {
  //     fetch("/api/check-follow", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         accessToken: session.accessToken,
  //         userId: session.user.id, // 使用擴展後的 user id
  //       }),
  //     })
  //       .then((res) => res.json())
  //       .then((data) => setIsFollowing(data.isFollowing));
  //   }
  // }, [session]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <>
        <button className="bg-blue-500 my-2 px-2" onClick={signInWithTwitter}>
          登录
        </button>
        <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
        <button
          className="bg-blue-500 my-2 px-2"
          onClick={async () =>
            console.log(
              await checkBindedTwitter(
                "bc1qdamw4y3u5czdz8s8f4lzfyegefd8rsgw7tmhvf"
              )
            )
          }
        >
          asd
        </button>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {isFollowing ? (
        <p>您已关注官方账号！</p>
      ) : (
        <p>您尚未关注官方账号。请关注！</p>
      )}
      <button
        className="bg-blue-500 my-2 px-2"
        onClick={() => console.log(session)}
      >
        检查状态
      </button>
      <button className="bg-blue-500 my-2 px-2" onClick={checkTwitterFollow}>
        检查关注状态
      </button>
      <button className="bg-blue-500 my-2 px-2" onClick={fetchTwitterUser}>
        获取用户信息
      </button>

      <button className="bg-blue-500 my-2 px-2" onClick={handleLogout}>
        登出
      </button>
    </div>
  );
};

export default CheckFollow;
