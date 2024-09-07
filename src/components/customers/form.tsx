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
import { createCustomer } from "@/actions/customers/createCustomer";
import { Textarea } from "@/components/ui/textarea";
import { Customer } from "@prisma/client";
import { CustomerSchema } from "@/actions/customers/schema";
import { updateCustomer } from "@/actions/customers/updateCustomer";
import { deleteCustomer } from "@/actions/customers/deleteCustomer";

type Props = {
	customerData?: Customer;
	successMessage: string;
	type: "create" | "update" | "delete";
};

export default function CustomerForm({
	type,
	customerData,
	successMessage,
}: Props) {
	const closeDialogRef = useRef<HTMLButtonElement>(null);

	const formSchema = CustomerSchema;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: customerData?.name || "",
			company: customerData?.company || "",
			remarks: customerData?.remarks || "",
			customerId: customerData?.id || "",
		},
	});

	const actions = {
		create: createCustomer,
		update: updateCustomer,
		delete: deleteCustomer,
	};

	const { execute, fieldErrors } = useAction(actions[type], {
		onSuccess: () => {
			toast({
				title: successMessage,
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
				{type === "delete" ? (
					<p>Apakah anda yakin ingin menghapus customer ini?</p>
				) : (
					<>
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
					</>
				)}

				<DialogFooter>
					<Button loading={form.formState.isSubmitting} type="submit">
						Confirm
					</Button>
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
