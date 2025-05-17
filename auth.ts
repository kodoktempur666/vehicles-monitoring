import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/db/drizzle"
import { compare } from "bcryptjs";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
                //debugger
          console.log("Missing credentials");
          return null;
        }
      
        try {
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email.toString()))
            .limit(1);

            //debugger
          console.log("User query result:", user.length > 0 ? "Found user" : "No user found");
      
          if (user.length === 0) return null;
      
          const isPasswordValid = await compare(
            credentials.password.toString(),
            user[0].password
          );
            //debugger
          console.log("Password validation:", isPasswordValid ? "Valid" : "Invalid");
      
          if (!isPasswordValid) return null;
      
          return {
            id: user[0].id.toString(),
            email: user[0].email,
          } as User;
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      }
    }),
  ],

  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});
