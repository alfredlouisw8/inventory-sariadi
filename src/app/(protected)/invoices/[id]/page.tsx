import getInvoiceDetail from "@/actions/invoices/getInvoiceDetail";
import getServices from "@/actions/services/getServices";
import BackButton from "@/components/back-button";
import { invoiceServicesColumns } from "@/components/invoices/columns";
import DeleteInvoiceDialog from "@/components/invoices/delete-invoice-dialog";
import EditInvoiceDialog from "@/components/invoices/edit-invoice-dialog";
import { serviceColumns } from "@/components/services/columns";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { format } from "date-fns";
import { PencilIcon, Trash2 } from "lucide-react";

export default async function InvoiceDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const invoiceId = params.id;

	const invoiceDetail = await getInvoiceDetail(invoiceId);

	if (!invoiceDetail) {
		return <div>Invoice tidak ditemukan</div>;
	}

	return (
		<>
			<BackButton />
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold md:text-2xl">Detail Invoice</h1>
				<div className="flex items-center gap-2">
					<EditInvoiceDialog
						invoiceData={invoiceDetail}
						triggerComponent={
							<Button variant="outline" size="icon">
								<PencilIcon className=" h-4 w-4" />
							</Button>
						}
					/>
					<DeleteInvoiceDialog
						invoiceData={invoiceDetail}
						triggerComponent={
							<Button variant="destructive" size="icon">
								<Trash2 className=" h-4 w-4" />
							</Button>
						}
					/>
				</div>
			</div>
			<div className="flex rounded-lg shadow-sm ">
				<div className="flex flex-col gap-5 w-full">
					<div>
						<p>
							<b>Invoice ID</b>: {invoiceDetail.invoiceCode}
						</p>
						<p>
							<b>Tanggal Pembayaran</b>:{" "}
							{invoiceDetail.paymentDate
								? format(invoiceDetail.paymentDate, "P")
								: "-"}
						</p>
						<p>
							<b>PPN</b>: {invoiceDetail.tax ? "Ya" : "Tidak"}
						</p>
						<p>
							<b>Keterangan</b>: {invoiceDetail.remarks}
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-xl font-bold">Jasa</p>
						</div>
						<div>
							<DataTable
								columns={invoiceServicesColumns}
								data={invoiceDetail.services}
								filterColumn={{
									label: "kode jasa",
									name: "serviceCode",
								}}
								dateFilter={{
									label: "tanggal jasa",
									name: "date",
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
