import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

const handler = NextAuth({
  providers: [
    DiscordProvider({
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  authorization: {
    params: { 
      scope: 'identify guilds guilds.members.read' // O segredo está aqui!
    }
  },
}),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user, account, profile }: any) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.id = profile.id; // Aqui pegamos o ID real do Discord
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      if (session.user) {
        session.user.id = token.id; // Aqui passamos para o front-end
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
