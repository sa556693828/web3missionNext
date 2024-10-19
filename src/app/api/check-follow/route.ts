import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const YOUR_TWITTER_ID = "your_official_twitter_user_id";

export async function POST(req: NextRequest) {
  const { accessToken, userId } = await req.json();

  try {
    const response = await axios.get(
      `https://api.twitter.com/2/users/${userId}/following`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          target_user_id: YOUR_TWITTER_ID,
        },
      }
    );

    const isFollowing = response.data.data.some(
      (user: any) => user.id === YOUR_TWITTER_ID
    );

    return NextResponse.json({ isFollowing });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch follow status" },
      { status: 500 }
    );
  }
}
