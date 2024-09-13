import NextAuth from "next-auth";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	session: {
		strategy: "jwt",
	},
	callbacks: {
		// This is called when the JWT is created or updated
		async jwt({ token, user }) {
			// If the user is signing in, we add `id` and `role` to the JWT
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.username = user.username;
			}

			return token;
		},

		// This is called whenever a session is checked/created
		async session({ session, token }) {
			// Include `id` and `role` in the session object
			if (token) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
				session.user.username = token.username as string;
			}

			return session;
		},
	},
	...authConfig,
});
