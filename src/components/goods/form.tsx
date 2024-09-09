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
import { Textarea } from "@/components/ui/textarea";
import { createGood } from "@/actions/goods/createGoods";
import NumberInput from "../ui/number-input";
import { GoodSchema } from "@/actions/goods/schema";
import { updateGood } from "@/actions/goods/updateGoods";
import { deleteGood } from "@/actions/goods/deleteGoods";
import { Good } from "@prisma/client";
import { useRouter } from "next/navigation";

type Props = {
	type: "create" | "update" | "delete";
	customerId: string;
	goodData?: Good;
	successMessage: string;
};

export default function GoodForm({
	type,
	customerId,
	goodData,
	successMessage,
}: Props) {
	const closeDialogRef = useRef<HTMLButtonElement>(null);

	const formSchema = GoodSchema;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			goodId: goodData?.id || "",
			name: goodData?.name || "",
			specification: goodData?.specification || "",
			packing: goodData?.packing || "",
			currentCount: goodData?.currentCount || 0,
			customerId,
			remarks: goodData?.remarks || "",
		},
	});

	const action = {
		create: createGood,
		update: updateGood,
		delete: deleteGood,
	};

	const router = useRouter();

	const { execute, fieldErrors } = useAction(action[type], {
		onSuccess: () => {
			toast({
				title: successMessage,
			});
			closeDialogRef.current?.click();

			if (window.location.pathname.startsWith("/goods") && type === "delete") {
				// Navigate to the customer detail page
				router.replace(`/customers/${customerId}`);
			}
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
					<p>Apakah anda yakin ingin menghapus barang ini?</p>
				) : (
					<>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nama barang</FormLabel>
									<FormControl>
										<Input placeholder="Nama barang" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="specification"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Spek barang</FormLabel>
									<FormControl>
										<Input placeholder="Spek barang" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="packing"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Packing barang</FormLabel>
									<FormControl>
										<Input placeholder="Packing barang" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="currentCount"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Total barang</FormLabel>
									<FormControl>
										<NumberInput control={form.control} {...field} />
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
