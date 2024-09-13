import getCustomers from "@/actions/customers/getCustomers";
import getLogs from "@/actions/logs/getLogs";
import BackButton from "@/components/back-button";
import AddCustomerDialog from "@/components/customers/add-customer-dialog";
import { customerColumns } from "@/components/customers/columns";
import { logsColumns } from "@/components/logs/columns";
import { DataTable } from "@/components/ui/data-table";

export default async function LogsPage() {
	const data = await getLogs();
	const filterColumn = {
		label: "log",
		name: "details",
	};

	const dateFilter = {
		label: "tanggal",
		name: "createdAt",
	};

	return (
		<>
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold md:text-2xl">Logs</h1>
			</div>
			<div className="flex rounded-lg shadow-sm" x-chunk="dashboard-02-chunk-1">
				<DataTable
					columns={logsColumns}
					data={data}
					filterColumn={filterColumn}
					dateFilter={dateFilter}
				/>
			</div>
		</>
	);
}
