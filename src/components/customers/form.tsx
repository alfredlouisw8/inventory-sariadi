"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "@/hooks/useAction";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { CreateCustomer } from "@/actions/customers/createCustomer/schema";
import { createCustomer } from "@/actions/customers/createCustomer";
import { Textarea } from "@/components/ui/textarea";

type Props = {
	type: "create" | "update";
};

export default function CustomerForm({ type }: Props) {
	const closeDialogRef = useRef<HTMLButtonElement>(null);

	const formSchema = CreateCustomer;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			company: "",
			remarks: "",
		},
	});

	const { execute, fieldErrors } = useAction(createCustomer, {
		onSuccess: () => {
			toast({
				title: `Customer successfully created`,
			});
			closeDialogRef.current?.click();
		},
		onError: (error) => {
			toast({
				title: error,
				variant: "destructive",
			});
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		await execute(values);

		if (fieldErrors) {
			for (const [key, value] of Object.entries(fieldErrors)) {
				form.setError(key as keyof typeof fieldErrors, {
					type: "manual",
					message: value.join(","),
				});
			}
			return;
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nama customer</FormLabel>
							<FormControl>
								<Input placeholder="Nama customer" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="company"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nama perusahaan</FormLabel>
							<FormControl>
								<Input placeholder="Nama perusahaan" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="remarks"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Keterangan</FormLabel>
							<FormControl>
								<Textarea placeholder="Keterangan" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<DialogFooter>
					<Button type="submit">Submit</Button>
					<DialogClose asChild>
						<Button style={{ display: "none" }} ref={closeDialogRef}>
							Close
						</Button>
					</DialogClose>
				</DialogFooter>
			</form>
		</Form>
	);
}
