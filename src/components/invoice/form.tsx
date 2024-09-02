"use client";

import React, { useRef } from "react";
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
import { CreateInvoice } from "@/actions/invoices/createInvoice/schema";
import { createInvoice } from "@/actions/invoices/createInvoice";
import { Checkbox } from "../ui/checkbox";
import { DataTable } from "../ui/data-table";
import { Service } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { serviceColumns } from "../services/columns";

type Props = {
	type: "create" | "update";
	customerId: string;
	services: Service[];
};

export default function InvoiceForm({ type, customerId, services }: Props) {
	const closeDialogRef = useRef<HTMLButtonElement>(null);

	const formSchema = CreateInvoice;

	// Use array of strings to track selected service IDs
	const [selectedServiceIds, setSelectedServiceIds] = React.useState<string[]>(
		[]
	);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			invoiceId: "",
			customerId,
			remarks: "",
			tax: false,
			serviceIds: [],
		},
	});

	const { execute, fieldErrors } = useAction(createInvoice, {
		onSuccess: () => {
			toast({
				title: `Invoice berhasil dibuat`,
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
		values.serviceIds = selectedServiceIds; // Pass the selected service IDs to backend

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
				<div className="flex items-center gap-5">
					<FormField
						control={form.control}
						name="invoiceId"
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel>Invoice ID</FormLabel>
								<FormControl>
									<Input placeholder="Invoice ID" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="paymentDate"
						render={({ field }) => (
							<FormItem className="flex flex-col flex-1">
								<FormLabel>Tanggal Pembayaran</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-full pl-3 text-left font-normal",
													!field.value && "text-muted-foreground"
												)}
											>
												{field.value ? (
													format(field.value, "PPP")
												) : (
													<span>Pilih tanggal</span>
												)}
												<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											selected={field.value}
											onSelect={field.onChange}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="tax"
						render={({ field }) => (
							<FormItem className="flex flex-row items-start space-x-3 space-y-0">
								<FormControl>
									<Checkbox
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</FormControl>
								<div className="space-y-1 leading-none">
									<FormLabel>PPN</FormLabel>
								</div>
							</FormItem>
						)}
					/>
				</div>

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

				{/* Pass state and setter to the DataTable */}
				<DataTable
					columns={serviceColumns}
					data={services}
					rowSelection={selectedServiceIds}
					setRowSelection={setSelectedServiceIds}
					showRowSelection
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
