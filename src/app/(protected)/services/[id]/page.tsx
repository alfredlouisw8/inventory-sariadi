import getGoods from "@/actions/goods/getGoods";
import getServiceDetail from "@/actions/services/getServiceDetail";
import BackButton from "@/components/back-button";
import AddServiceGoodDialog from "@/components/serviceGoods/add-service-goods-dialog";
import { serviceWithGoodsColumns } from "@/components/serviceGoods/columns";
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
		return <div>Jasa tidak ditemukan</div>;
	}

	const goods = await getGoods(serviceDetail.customerId);

	return (
		<>
			<BackButton />
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold md:text-2xl">Detail Jasa</h1>
			</div>
			<div className="flex rounded-lg shadow-sm ">
				<div className="flex flex-col gap-5 w-full">
					<div>
						<p>
							<b>Kode Jasa</b>: {serviceDetail.serviceCode}
						</p>
						<p>
							<b>Tipe Jasa</b>: {serviceTypeText(serviceDetail.serviceType)}
						</p>
						<p>
							<b>Tambah / Kurang</b>:{" "}
							{serviceCalculationTypeText(serviceDetail.serviceCalculationType)}
						</p>
						<p>
							<b>Tanggal Pengerjaan</b>: {format(serviceDetail.date, "P")}
						</p>
						<p>
							<b>Keterangan</b>: {serviceDetail.remarks}
						</p>
						<p>
							<b>Harga Beli</b>: {serviceDetail.buyPrice}
						</p>
						<p>
							<b>Harga Jual</b>: {serviceDetail.sellPrice}
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between">
							<p className="text-xl font-bold">Barang</p>
							<AddServiceGoodDialog service={serviceDetail} goods={goods} />
						</div>
						<div>
							<DataTable
								columns={serviceWithGoodsColumns}
								data={serviceDetail.serviceGoods}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
