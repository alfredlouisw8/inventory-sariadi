"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { signIn, signOut } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { signInSchema } from "@/lib/auth/auth.config";

export default function LoginForm() {
	const router = useRouter();

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	async function onSubmit({ email, password }: z.infer<typeof signInSchema>) {
		try {
			const signInResult = await signIn("credentials", {
				email,
				password,
				callbackUrl: "/customers",
				redirect: false, // Change this to false to handle redirection manually
			});

			if (signInResult?.error) {
				// Show toast notification when there's an error
				toast({
					title: "Login Failed",
					variant: "destructive",
				});
			} else if (signInResult?.ok) {
				// Redirect manually if login is successful
				router.push("/customers");
			}
		} catch (error) {
			// Catch any unexpected errors
			toast({
				title: "An Unexpected Error Occurred",
				description: "Please try again later.",
				variant: "destructive",
			});
			console.error("Unexpected error during sign in:", error);
		}
	}

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="capitalize">Login</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="name@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input type="password" placeholder="******" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								loading={form.formState.isSubmitting}
								type="submit"
								className="w-full"
							>
								Login
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</>
	);
}
