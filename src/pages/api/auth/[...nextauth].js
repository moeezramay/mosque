import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export default NextAuth({

  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      // redirect: "https://www.mosquematch.com/api/auth/callback/google",
    //   redirect: "https://www.mosquematch.com/",
    }),
  ],
  callbacks:{
    async redirect({ url, baseUrl }) {
        return `${process.env.NEXT_PUBLIC_NEXT_AUTH_URL}/Pagess/sign/signIn/signIn`
      },
  },
  secret: process.env.JWT_SECRET,
});
