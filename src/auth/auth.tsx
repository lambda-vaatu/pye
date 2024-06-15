import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
providers: [
DiscordProvider({
clientId: process.env.DISCORD_CLIENT_ID,
clientSecret: process.env.DISCORD_CLIENT_SECRET,
authorization: {
params: {
scope: 'identify email guilds applications.commands.permissions.update'
}
},
token: "https://discord.com/api/oauth2/token",
userinfo: "https://discord.com/api/users/@me",
}),
],
secret: process.env.AUTH_SECRET,
callbacks: {
async jwt({ token, account, profile }) {
if (account) {
token.accessToken = account.access_token;
}
if (profile) {
token.name = profile.name; 
token.email = profile.email;
token.image = "https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png"; 
}
return token;
},
async session({ session, token }) {
if (token) {
session.user.name = token; 
session.user.email = token.email; 
session.user.image = token.image;
session.user.accessToken = token.accessToken;
}
return session;
},
},
});