"use client";

import { Good } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, EyeIcon, PencilIcon, Trash2 } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import EditGoodDialog from "./edit-good-dialog";
import DeleteGoodDialog from "./delete-good-dialog";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const goodColumns: ColumnDef<Good>[] = [
	{
		accessorKey: "name",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Nama barang
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "specification",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Spek barang
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "packing",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Packing
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "currentCount",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Total barang
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "remarks",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Keterangan
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
						href={`/goods/${row.original.id}`}
						className={buttonVariants({ size: "icon" })}
					>
						<EyeIcon className="h-4 w-4" />
					</Link>
					<EditGoodDialog
						goodData={row.original}
						triggerComponent={
							<Button variant="outline" size="icon">
								<PencilIcon className=" h-4 w-4" />
							</Button>
						}
					/>
					<DeleteGoodDialog
						goodData={row.original}
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
