"use server";

import { revalidatePath } from "next/cache";

import { createSafeAction } from "@/lib/create-safe-action";

import { auth } from "@/lib/auth/auth";
import prisma from "@/lib/prisma";
import { InputType, ReturnType } from "../types";
import { LogSchema } from "../schema";

const handler = async (data: InputType): Promise<ReturnType> => {
	const session = await auth();

	if (!session?.user) {
		return {
			error: "Silahkan login",
		};
	}

	let result;

	const { logText } = data;

	try {
		result = await prisma.log.create({
			data: {
				text: logText,
			},
		});
	} catch (error: any) {
		console.error(error.message);
		return {
			error: error.message || "Gagal menambah logs.",
		};
	}

	revalidatePath(`/logs`);
	return { data: result };
};

export const createLog = createSafeAction(LogSchema, handler);
