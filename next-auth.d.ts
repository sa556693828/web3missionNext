import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    twitterAccessToken?: string;
    discordAccessToken?: string;
    user: {
      /** The user's ID from the Twitter API */
      id: string;
      name: string;
      email?: string;
    };
  }

  interface JWT {
    twitterAccessToken?: string;
    discordAccessToken?: string;
  }
}
