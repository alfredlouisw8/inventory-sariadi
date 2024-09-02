import getCustomerDetail from "@/actions/customers/getCustomerDetail";
import getServices from "@/actions/services/getServices";
import { DataTable } from "@/components/ui/data-table";
import getGoods from "@/actions/goods/getGoods";
import { goodColumns } from "@/components/goods/columns";
import AddGoodDialog from "@/components/goods/add-good-dialog";
import AddServiceDialog from "@/components/services/add-service-dialog";
import BackButton from "@/components/back-button";
import getInvoices from "@/actions/invoices/getInvoices";
import { invoicesColumns } from "@/components/invoice/columns";
import AddInvoiceDialog from "@/components/invoice/add-invoice-dialog";
import { serviceColumns } from "@/components/services/columns";

export default async function CustomerDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const customerId = params.id;

	const customerDetailData = await getCustomerDetail(customerId);

	if (!customerDetailData) {
		return <div>Customer not found</div>;
	}

	const servicesData = customerDetailData.services;
	const goodsData = customerDetailData.goods;
	const invoicesData = customerDetailData.invoices;

	const unpaidServices = servicesData.filter(
		(service) => service.invoiceId === null
	);

	return (
		<>
			<BackButton />
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold md:text-2xl">Customer Detail</h1>
			</div>
			<div className="flex rounded-lg shadow-sm ">
				<div className="flex flex-col gap-5 w-full">
					<div>
						<p>Nama: {customerDetailData.name}</p>
						<p>Perusahaan: {customerDetailData.company}</p>
						<p>Keterangan: {customerDetailData.remarks}</p>
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-xl font-bold">Jasa</p>
							<AddServiceDialog customerId={customerId} goods={goodsData} />
						</div>
						<div>
							<DataTable columns={serviceColumns} data={servicesData} />
						</div>
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-xl font-bold">Barang</p>
							<AddGoodDialog customerId={customerId} />
						</div>
						<div>
							<DataTable columns={goodColumns} data={goodsData} />
						</div>
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-xl font-bold">Invoice</p>
							<AddInvoiceDialog
								customerId={customerId}
								services={unpaidServices}
							/>
						</div>
						<div>
							<DataTable columns={invoicesColumns} data={invoicesData} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
