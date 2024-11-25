import NextAuth from "next-auth";
import { loginSchema } from "@/schemas/login-form";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "./db";

export enum AuthenticationAction {
  GOOGLE = "google",
  GITHUB = "github",
  CREDENTIALS = "credentials",
}
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }
        const { email, password } = validatedFields.data;

        const user = await db.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        if (!user.isActive) throw new Error("User is not active");

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch)
          return { id: user.id, name: user.name, email: user.email };

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      let dbUser = await db.user.findUnique({
        where: { email: token.email! },
      });

      if (!dbUser) {
        dbUser = await db.user.create({
          data: {
            email: token.email!,
            name: token.name!,
            isActive: true,
            password: "",
          },
        });
      }

      token.id = dbUser.id;
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
});
