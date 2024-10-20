import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // 请确保路径正确

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  try {
    const response = await axios.get("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
        "User-Agent": "v2UserLookupJS",
      },
      params: {
        "user.fields": "id,name,username,profile_image_url",
      },
    });

    const userData = response.data.data;

    return NextResponse.json(userData);
  } catch (error: any) {
    console.error("获取用户信息时出错:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "获取用户信息失败",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
