import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const authOptions = {
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async jwt({token, account}) {
            if (account?.provider === "google" &&
                account?.type === "oauth" &&
                token?.sub === process.env.GOOGLE_ADMIN_ID) {
                token.userRole = "admin"
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client
            session.userRole = token?.userRole
            return session
        }
    },
    debug: process.env.NODE_ENV === "development",
}

export default NextAuth(authOptions)
