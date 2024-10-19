import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      /** The user's ID from the Twitter API */
      id: string;
      name: string;
      email?: string;
    };
  }

  interface JWT {
    accessToken?: string;
  }
}
