import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { object, string, ZodError } from "zod";
// Notice this is only an object, not a full Auth.js instance

export const signInSchema = object({
	email: string({ required_error: "Harus diisi" })
		.min(1, "Harus diisi")
		.email("Email tidak valid"),
	password: string({ required_error: "Harus diisi" }).min(1, "Harus diisi"),
});

async function getUserFromDb(email: string, password: string) {
	const user = await prisma.user.findUnique({
		where: {
			email,
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
				email: {},
				password: {},
			},

			//@ts-ignore
			authorize: async (credentials) => {
				try {
					let user = null;

					const { email, password } = await signInSchema.parseAsync(
						credentials
					);

					// logic to verify if the user exists
					user = await getUserFromDb(email, password);

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
