"use client";

import { Customer } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import {
	ArrowUpDown,
	EyeIcon,
	MoreHorizontal,
	PencilIcon,
	Trash2,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";

import Link from "next/link";
import EditCustomerDialog from "./edit-customer-dialog";
import DeleteCustomerDialog from "./delete-customer-dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const customerColumns: ColumnDef<Customer>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nama
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "company",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nama Perusahaan
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			return (
				<div className="flex items-center gap-3 justify-end">
					<Link
						href={`/customers/${row.original.id}`}
						className={buttonVariants({ size: "icon" })}
					>
						<EyeIcon className="h-4 w-4" />
					</Link>
					<EditCustomerDialog
						customerData={row.original}
						triggerComponent={
							<Button variant="outline" size="icon">
								<PencilIcon className=" h-4 w-4" />
							</Button>
						}
					/>
					<DeleteCustomerDialog
						customerData={row.original}
						triggerComponent={
							<Button variant="destructive" size="icon">
								<Trash2 className=" h-4 w-4" />
							</Button>
						}
					/>
				</div>
			);
		},
		size: 200,
	},
];
