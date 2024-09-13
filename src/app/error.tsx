"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Honeybadger } from "@honeybadger-io/react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "authenticated") {
			Honeybadger.setContext({
				user_id: session.user.id,
				user_email: session.user.email,
				user_username: session.user.username,
			});
		}

		// Log error and digest for debugging
		console.log("error", error);
		console.log("digest", error.digest);

		// Report the error to Honeybadger, including the digest
		if (process.env.NEXT_PUBLIC_HONEYBADGER_REPORT_ERROR) {
			Honeybadger.notify(error, {
				context: {
					digest: error.digest || "No digest provided",
					env: process.env.NODE_ENV, // Capture the environment (prod, dev)
				},
			});
		}
	}, [error, session, status]);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100">
			<Card className="max-w-md p-4">
				<CardHeader>Something went wrong!</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-3">
						{process.env.NODE_ENV === "development"
							? error.message
							: "An unexpected error occurred."}
						<Button onClick={() => reset()}>Try again</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
