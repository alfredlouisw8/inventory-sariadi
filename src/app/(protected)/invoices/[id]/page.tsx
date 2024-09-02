import getInvoiceDetail from "@/actions/invoices/getInvoiceDetail";
import getServices from "@/actions/services/getServices";
import BackButton from "@/components/back-button";
import { serviceColumns } from "@/components/services/columns";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";

export default async function InvoiceDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const invoiceId = params.id;

	const invoiceDetail = await getInvoiceDetail(invoiceId);

	if (!invoiceDetail) {
		return <div>Invoice not found</div>;
	}

	const servicesData = await getServices(invoiceDetail.customerId);

	return (
		<>
			<BackButton />
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold md:text-2xl">Invoice Detail</h1>
			</div>
			<div className="flex rounded-lg shadow-sm ">
				<div className="flex flex-col gap-5 w-full">
					<div>
						<p>Invoice ID: {invoiceDetail.invoiceId}</p>
						<p>
							Tanggal Pembayaran:{" "}
							{invoiceDetail.paymentDate
								? format(invoiceDetail.paymentDate, "P")
								: "-"}
						</p>
						<p>
							PPN:
							{invoiceDetail.tax ? "Ya" : "Tidak"}
						</p>
						<p>Keterangan: {invoiceDetail.remarks}</p>
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-xl font-bold">Jasa</p>
							{/* <AddServiceGoodDialog service={serviceDetail} goods={goods} /> */}
						</div>
						<div>
							<DataTable
								columns={serviceColumns}
								data={invoiceDetail.services}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
