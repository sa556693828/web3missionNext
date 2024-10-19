"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

const CheckFollow = () => {
  const { data: session, status } = useSession();
  const [isFollowing, setIsFollowing] = useState(false);

  const checkTwitterFollow = async (targetUsername: string) => {
    if (!session) {
      console.log("用户未登录");
      return;
    }

    try {
      const response = await fetch(
        `/api/check-follow?targetUsername=${targetUsername}`
      );
      if (!response.ok) {
        throw new Error("API 请求失败");
      }
      const data = await response.json();
      if (data.isFollowing) {
        console.log("用户已关注目标账号");
        // 更新任务状态或显示成功消息
      } else {
        console.log("用户未关注目标账号");
        // 提示用户关注
      }
    } catch (error) {
      console.error("检查关注状态时出错:", error);
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
      <button onClick={() => signIn("twitter")}>Sign in with Twitter</button>
    );
  }

  return (
    <div className="flex flex-col items-center">
      {isFollowing ? (
        <p>您已关注官方账号！</p>
      ) : (
        <p>您尚未关注官方账号。请关注！</p>
      )}
      <button onClick={() => console.log(session)}>检查关注状态</button>
      <button onClick={handleLogout}>登出</button>
    </div>
  );
};

export default CheckFollow;
