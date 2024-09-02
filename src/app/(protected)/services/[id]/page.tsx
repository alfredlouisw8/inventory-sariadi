import getGoods from "@/actions/goods/getGoods";
import getServiceDetail from "@/actions/services/getServiceDetail";
import BackButton from "@/components/back-button";
import AddGoodDialog from "@/components/goods/add-good-dialog";
import { goodColumns } from "@/components/goods/columns";
import AddServiceGoodDialog from "@/components/serviceGoods/add-service-goods-dialog";
import { serviceGoodsColumns } from "@/components/serviceGoods/columns";
import { DataTable } from "@/components/ui/data-table";
import { serviceCalculationTypeText, serviceTypeText } from "@/utils/functions";
import { format } from "date-fns";

export default async function ServiceDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const serviceId = params.id;

	const serviceDetail = await getServiceDetail(serviceId);

	if (!serviceDetail) {
		return <div>Service not found</div>;
	}

	const goods = await getGoods(serviceDetail.customerId);

	return (
		<>
			<BackButton />
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold md:text-2xl">Service Detail</h1>
			</div>
			<div className="flex rounded-lg shadow-sm ">
				<div className="flex flex-col gap-5 w-full">
					<div>
						<p>Tipe Jasa: {serviceTypeText(serviceDetail.serviceType)}</p>
						<p>
							Tambah / Kurang:{" "}
							{serviceCalculationTypeText(serviceDetail.serviceCalculationType)}
						</p>
						<p>Tanggal Pengerjaan: {format(serviceDetail.date, "P")}</p>
						<p>Keterangan: {serviceDetail.remarks}</p>
						<p>Harga Beli: {serviceDetail.buyPrice}</p>
						<p>Harga Jual: {serviceDetail.sellPrice}</p>
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-xl font-bold">Barang</p>
							<AddServiceGoodDialog service={serviceDetail} goods={goods} />
						</div>
						<div>
							<DataTable
								columns={serviceGoodsColumns}
								data={serviceDetail.serviceGoods}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
