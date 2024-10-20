import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route"; // 请确保路径正确

const PAN_ECOSYSTEM_ID = process.env.OFFICIAL_TWITTER_ID; // 您的官方账号ID
const BEARER_TOKEN = process.env.BEARER_TOKEN; // 您的Twitter开发者账号的Bearer Token

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const session = await getServerSession(authOptions);

  if (!BEARER_TOKEN) {
    return NextResponse.json(
      { error: "服务器配置错误：缺少Bearer Token" },
      { status: 500 }
    );
  }

  try {
    const response = await axios.get(
      `https://api.twitter.com/2/users/${userId}/following`,
      {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
        },
        params: {
          max_results: 1000,
          "user.fields": "id",
        },
      }
    );

    const isFollowing = response.data.data.some(
      (user: any) => user.id === PAN_ECOSYSTEM_ID
    );

    return NextResponse.json({ isFollowing });
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // 404错误意味着用户没有关注官方账号
      return NextResponse.json({ isFollowing: false });
    }
    console.error(
      "Error checking follow status:",
      error.response?.data || error.message
    );
    return NextResponse.json(
      {
        error: "Failed to fetch follow status",
        details: error.response?.data || error.message,
      },
      { status: error.response?.status || 500 }
    );
  }
}
