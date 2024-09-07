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
import { Check, ChevronsUpDown } from "lucide-react";

import { Good, Service } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import NumberInput from "../ui/number-input";
import { CreateServiceGood } from "@/actions/serviceGoods/createServiceGoods/schema";
import { createServiceGood } from "@/actions/serviceGoods/createServiceGoods";

type Props = {
	type: "create" | "update";
	service: Service;
	goods: Good[];
};

export default function ServiceGoodForm({ type, service, goods }: Props) {
	const closeDialogRef = useRef<HTMLButtonElement>(null);

	const formSchema = CreateServiceGood;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			serviceId: service.id,
			serviceCalculationType: service.serviceCalculationType,
			goodId: "",
			goodCount: 0,
			containerNumber: "",
			truckNumber: "",
		},
	});

	const { execute, fieldErrors } = useAction(createServiceGood, {
		onSuccess: () => {
			toast({
				title: `Jasa berhasil dibuat`,
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
					name="goodId"
					render={({ field }) => (
						<FormItem className="flex flex-col">
							<FormLabel>Barang</FormLabel>
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											role="combobox"
											className={cn(
												"w-full justify-between",
												!field.value && "text-muted-foreground"
											)}
										>
											{field.value
												? goods.find((good) => good.id === field.value)?.name
												: "Pilih barang"}
											<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-full p-0">
									<Command>
										<CommandInput placeholder="Search good..." />
										<CommandList>
											<CommandEmpty>No good found.</CommandEmpty>
											<CommandGroup>
												{goods.map((good) => (
													<CommandItem
														value={good.id}
														key={good.id}
														onSelect={() => {
															form.setValue("goodId", good.id);
														}}
													>
														<Check
															className={cn(
																"mr-2 h-4 w-4",
																good.id === field.value
																	? "opacity-100"
																	: "opacity-0"
															)}
														/>
														{good.name}
													</CommandItem>
												))}
											</CommandGroup>
										</CommandList>
									</Command>
								</PopoverContent>
							</Popover>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="goodCount"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Jumlah barang</FormLabel>
							<FormControl>
								<NumberInput control={form.control} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="containerNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nomor container</FormLabel>
							<FormControl>
								<Input placeholder="No container" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="truckNumber"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Nomor truck</FormLabel>
							<FormControl>
								<Input placeholder="No truck" {...field} />
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
