"use client";

import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import React from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "../ui/checkbox";

interface DataTableProps<TData extends { id: string }, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filterColumn?: string;
	showRowSelection?: boolean;
	rowSelection?: string[];
	setRowSelection?: (
		value: string[] | ((prevSelected: string[]) => string[])
	) => void;
}

export function DataTable<TData extends { id: string }, TValue>({
	columns,
	data,
	filterColumn = "",
	showRowSelection = false,
	rowSelection = [],
	setRowSelection = () => {},
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[]
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	const handleSelectionChange = (serviceId: string, isSelected: boolean) => {
		setRowSelection((prevSelected: string[]) => {
			if (isSelected) {
				return [...prevSelected, serviceId];
			} else {
				return prevSelected.filter((id) => id !== serviceId);
			}
		});
	};

	return (
		<div className="w-full">
			{filterColumn && (
				<div className="flex items-center py-4">
					<Input
						placeholder={`Filter ${filterColumn}`}
						value={
							(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
						}
						onChange={(event) =>
							table.getColumn(filterColumn)?.setFilterValue(event.target.value)
						}
						className="max-w-sm"
					/>
				</div>
			)}

			<div className="rounded-md border w-full">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{showRowSelection && (
									<TableHead>
										<Checkbox
											className="mx-4"
											checked={rowSelection.length === data.length}
											onCheckedChange={(isChecked) =>
												setRowSelection(
													isChecked ? data.map((item) => item.id) : []
												)
											}
											aria-label="Select all"
										/>
									</TableHead>
								)}
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{showRowSelection && (
										<TableCell>
											<Checkbox
												checked={rowSelection.includes(row.original.id)}
												onCheckedChange={(isChecked) =>
													handleSelectionChange(
														row.original.id,
														isChecked as boolean
													)
												}
												aria-label="Select row"
											/>
										</TableCell>
									)}
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				{(table.getCanPreviousPage() || table.getCanNextPage()) && (
					<>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							Previous
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							Next
						</Button>
					</>
				)}
			</div>
		</div>
	);
}
