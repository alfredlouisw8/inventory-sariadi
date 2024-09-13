// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
	/**
	 * Returned by `useSession`, `getSession`, and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		user: {
			/** The user's ID. */
			id: string;
			/** The user's role. */
			role: string;
			username: string;
		} & DefaultSession["user"];
	}

	interface User extends DefaultUser {
		/** The user's ID. */
		id: string;
		/** The user's role. */
		role: string;
		username: string;
	}

	interface JWT {
		id: string;
		role: string;
		username: string;
	}
}
