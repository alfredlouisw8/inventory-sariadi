"use client";

import { ServiceGood } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Adjusted column definitions to work with individual ServiceGood objects

type ServiceGoodData = ServiceGood & {
	good: {
		name: string;
	};
};

export const serviceGoodsColumns: ColumnDef<ServiceGoodData>[] = [
	{
		accessorKey: "good.name", // Accessing the nested 'good' object's 'name' property directly
		id: "goodName",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Nama Barang
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => row.original.good.name, // Direct access to 'good.name'
	},
	{
		accessorKey: "goodCount", // Direct access to 'goodCount'
		id: "goodCount",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Jumlah Barang
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => row.original.goodCount, // Direct access to 'goodCount'
	},
	{
		accessorKey: "containerNumber", // Direct access to 'containerNumber'
		id: "containerNumber",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Nomor Kontainer
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => row.original.containerNumber, // Direct access to 'containerNumber'
	},
	{
		accessorKey: "truckNumber", // Direct access to 'truckNumber'
		id: "truckNumber",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Nomor Truk
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => row.original.truckNumber, // Direct access to 'truckNumber'
	},
];
