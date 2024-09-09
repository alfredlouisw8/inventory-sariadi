"use client";

import { Log } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

export const logsColumns: ColumnDef<Log>[] = [
	{
		accessorKey: "details",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Detail
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<Button
				variant="ghost"
				onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
			>
				Tanggal
				<ArrowUpDown className="ml-2 h-4 w-4" />
			</Button>
		),
		cell: ({ row }) => format(row.original.createdAt, "Pp"),
	},
];
