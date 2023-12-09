import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from 'axios';

export const authOptions: any = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: 'Remember Me', type: 'checkbox', optional: true },
      },
      async authorize(credentials: any) {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, {
            username: credentials.username,
            password: credentials.password,
          });
          
          const user = response.data.data;
          if (user) {
            user.rememberMe = credentials.rememberMe;
            // console.log('API Response:', user);
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error('Login error:', error.response ? error.response.data : error.message);
          return Promise.resolve(null);
        }
      },
    }),

  ],

  callbacks: {
    async jwt({token, user}) {
      if (user) {
        // token.id = user.id;
        // token.email = user.email;
        // token.name = user.name;
        token.rememberMe = user.rememberMe || false;
        token.apiToken = user.token;
      }
      return token;
    },
    async session({session, token}) {
      // console.log(session);
      session.token = token.token;
      if (token.rememberMe) {
        session.maxAge = 30 * 24 * 60 * 60; // 30 days in seconds
      }
      return session;
    }
  },
  session: {
    jwt: true,
  },
  pages: {
    signOut: `${process.env.API_BASE_URL}/auth/logout`,
  },
};
export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
