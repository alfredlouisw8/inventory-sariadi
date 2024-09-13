import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { object, string, ZodError } from "zod";
// Notice this is only an object, not a full Auth.js instance

export const signInSchema = object({
	username: string({ required_error: "Harus diisi" }).min(1, "Harus diisi"),
	password: string({ required_error: "Harus diisi" }).min(1, "Harus diisi"),
});

async function getUserFromDb(username: string, password: string) {
	const user = await prisma.user.findUnique({
		where: {
			username,
		},
	});

	if (!user) {
		return null;
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		return null;
	}

	return user;
}

export default {
	pages: {
		signIn: "/",
		error: "/",
	},
	providers: [
		Credentials({
			// You can specify which fields should be submitted, by adding keys to the `credentials` object.
			// e.g. domain, username, password, 2FA token, etc.
			credentials: {
				username: {},
				password: {},
			},

			//@ts-ignore
			authorize: async (credentials) => {
				try {
					let user = null;

					const { username, password } = await signInSchema.parseAsync(
						credentials
					);

					// logic to verify if the user exists
					user = await getUserFromDb(username, password);

					// return JSON object with the user data
					return user;
				} catch (error) {
					if (error instanceof ZodError) {
						// Return `null` to indicate that the credentials are invalid
						return null;
					}
				}
			},
		}),
	],
} satisfies NextAuthConfig;
