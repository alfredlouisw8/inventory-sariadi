"use client";

import { useEffect, useRef, useState } from "react";
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
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "@/hooks/useAction";
import { toast } from "@/components/ui/use-toast";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, Check, ChevronsUpDown, Trash2 } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import {
	Good,
	Service,
	ServiceCalculationType,
	ServiceType,
} from "@prisma/client";
import { serviceCalculationTypeText, serviceTypeText } from "@/utils/functions";
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
import { Calendar } from "../ui/calendar";
import NumberInput from "../ui/number-input";
import { ServiceSchema } from "@/actions/services/schema";
import { createService } from "@/actions/services/createService";
import { ServiceWithGoods } from "@/utils/types";
import { updateService } from "@/actions/services/updateService";
import { deleteService } from "@/actions/services/deleteService";

type Props = {
	type: "create" | "update" | "delete";
	customerId: string;
	serviceData?: ServiceWithGoods;
	successMessage: string;
};

export default function ServiceForm({
	type,
	customerId,
	serviceData,
	successMessage,
}: Props) {
	const closeDialogRef = useRef<HTMLButtonElement>(null);

	const formSchema = ServiceSchema;

	const [goods, setGoods] = useState<Good[]>([]);

	const fetchGoodsByCustomerId = async (customerId: string) => {
		const response = await fetch(`/api/goods?customerId=${customerId}`);
		const data = await response.json();
		if (response.ok) {
			return data.data; // Array of goods
		} else {
			throw new Error(data.error || "Failed to fetch goods");
		}
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			serviceId: serviceData?.id || "",
			serviceType: serviceData?.serviceType || "",
			serviceCalculationType: serviceData?.serviceCalculationType || "",
			date: serviceData?.date || undefined,
			buyPrice: serviceData?.buyPrice || 0,
			sellPrice: serviceData?.sellPrice || 0,
			remarks: serviceData?.remarks || "",
			customerId,
			goods:
				serviceData?.serviceGoods.map(
					({ goodId, goodCount, containerNumber, truckNumber }) => ({
						goodId,
						goodCount: goodCount ?? 0, // Ensure goodCount is never null
						containerNumber: containerNumber ?? "", // Ensure containerNumber is never null
						truckNumber: truckNumber ?? "", // Ensure truckNumber is never null
					})
				) || [],
		},
	});

	useEffect(() => {
		if (customerId) {
			fetchGoodsByCustomerId(customerId).then((data) => {
				setGoods(data);
			});
		}
	}, [customerId]);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "goods",
	});

	const actions = {
		create: createService,
		update: updateService,
		delete: deleteService,
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

	function onServiceTypeChange(value: string) {
		if (value === ServiceType.Loading) {
			form.setValue("serviceCalculationType", ServiceCalculationType.Add);
		} else if (value === ServiceType.Unloading) {
			form.setValue("serviceCalculationType", ServiceCalculationType.Substract);
		} else {
			form.setValue("serviceCalculationType", "");
		}
		form.setValue("serviceType", value);
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				{type === "delete" ? (
					<p>Apakah Anda yakin ingin menghapus jasa ini?</p>
				) : (
					<>
						<div className="flex items-center gap-5">
							<FormField
								control={form.control}
								name="serviceType"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Tipe Jasa</FormLabel>
										<Select
											onValueChange={onServiceTypeChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Pilih tipe jasa" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(ServiceType).map((value) => (
													<SelectItem key={value} value={value}>
														{serviceTypeText(value)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="serviceCalculationType"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Tambah/Kurang</FormLabel>
										<Select
											onValueChange={field.onChange}
											value={field.value}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Pilih tambah/kurang" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Object.values(ServiceCalculationType).map((value) => (
													<SelectItem key={value} value={value}>
														{serviceCalculationTypeText(value)}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem className="flex flex-col flex-1">
										<FormLabel>Tanggal Pengerjaan</FormLabel>
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
						</div>

						<div className="flex items-center gap-5">
							<FormField
								control={form.control}
								name="buyPrice"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Harga Beli</FormLabel>
										<FormControl>
											<NumberInput control={form.control} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="sellPrice"
								render={({ field }) => (
									<FormItem className="flex-1">
										<FormLabel>Harga Jual</FormLabel>
										<FormControl>
											<NumberInput control={form.control} {...field} />
										</FormControl>
										<FormMessage />
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

						{/* Goods Array Field with Combobox for goodId */}
						<div className="flex flex-col gap-3">
							<div className="flex items-center justify-between w-full">
								<FormLabel>Barang</FormLabel>
								<Button
									type="button"
									onClick={() =>
										append({
											goodId: "",
											goodCount: 0,
											containerNumber: "",
											truckNumber: "",
										})
									}
								>
									Add Good
								</Button>
							</div>
							{fields.map((item, index) => (
								<div key={item.id} className="flex space-x-2 items-center">
									{/* Combobox for selecting goodId */}
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant="outline"
													role="combobox"
													className={cn(
														"min-w-[400px] justify-between",
														!form.watch(`goods.${index}.goodId`) &&
															"text-muted-foreground"
													)}
												>
													{form.watch(`goods.${index}.goodId`)
														? goods.find(
																(good) =>
																	good.id ===
																	form.watch(`goods.${index}.goodId`)
														  )?.name
														: "Pilih barang"}
													<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="min-w-[400px] p-0">
											<Command>
												<CommandInput placeholder="Search good..." />
												<CommandList>
													<CommandEmpty>Barang tidak ditemukan</CommandEmpty>
													<CommandGroup>
														{goods.map((good) => (
															<CommandItem
																value={good.name}
																key={good.id}
																onSelect={() => {
																	form.setValue(
																		`goods.${index}.goodId`,
																		good.id,
																		{
																			shouldValidate: true,
																			shouldDirty: true,
																		}
																	);
																}}
															>
																<Check
																	className={cn(
																		"mr-2 h-4 w-4",
																		good.id ===
																			form.watch(`goods.${index}.goodId`)
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

									{/* Other fields for good */}
									<FormControl>
										<NumberInput
											className="w-[100px]"
											{...form.register(`goods.${index}.goodCount`)}
											control={form.control}
										/>
									</FormControl>
									<FormControl>
										<Input
											{...form.register(`goods.${index}.containerNumber`)}
											placeholder="Container Number"
										/>
									</FormControl>
									<FormControl>
										<Input
											{...form.register(`goods.${index}.truckNumber`)}
											placeholder="Truck Number"
										/>
									</FormControl>
									<Button
										type="button"
										variant="destructive"
										onClick={() => remove(index)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
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
