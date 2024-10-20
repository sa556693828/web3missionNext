import NextAuth, { AuthOptions } from "next-auth";
import TwitterProvider from "next-auth/providers/twitter";
import DiscordProvider from "next-auth/providers/discord";
export const authOptions: AuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
      version: "2.0",
      authorization: {
        params: {
          scope: "users.read follows.read tweet.read",
        },
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "identify guilds guilds.members.read",
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        // 根据提供者保存不同的accessToken
        if (account.provider === "twitter") {
          token.twitterAccessToken = account.access_token;
        } else if (account.provider === "discord") {
          token.discordAccessToken = account.access_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.twitterAccessToken = token.twitterAccessToken as
        | string
        | undefined;
      session.discordAccessToken = token.discordAccessToken as
        | string
        | undefined;
      session.user.id = token.sub || "";
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
