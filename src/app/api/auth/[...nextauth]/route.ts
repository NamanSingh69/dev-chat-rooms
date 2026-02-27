import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "MOCK_CLIENT_ID",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "MOCK_CLIENT_SECRET",
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET || "dev-chat-fallback-secret-key-for-local-development",
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                (session.user as any).id = token.sub;
            }
            return session;
        },
    },
});

export { handler as GET, handler as POST };
