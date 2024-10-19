import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const targetUsername = searchParams.get("targetUsername");

  if (!targetUsername) {
    return NextResponse.json({ error: "缺少目标用户名" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `https://api.twitter.com/2/users/${session.user.id}/following?user.fields=username&max_results=1000`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Twitter API 请求失败");
    }

    const data = await response.json();
    const isFollowing = data.data.some(
      (user: any) =>
        user.username.toLowerCase() === targetUsername.toLowerCase()
    );

    return NextResponse.json({ isFollowing });
  } catch (error) {
    console.error("检查关注状态时出错:", error);
    return NextResponse.json({ error: "检查关注状态失败" }, { status: 500 });
  }
}
