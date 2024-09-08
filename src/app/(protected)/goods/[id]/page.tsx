import getGoodDetail from "@/actions/goods/getGoodDetail";
import BackButton from "@/components/back-button";
import { goodsWithServiceColumns } from "@/components/serviceGoods/columns";
import { DataTable } from "@/components/ui/data-table";

export default async function GoodDetailPage({
	params,
}: {
	params: { id: string };
}) {
	const goodId = params.id;

	const goodDetail = await getGoodDetail(goodId);

	if (!goodDetail) {
		return <div>Barang tidak ditemukan</div>;
	}

	return (
		<>
			<BackButton />
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-semibold md:text-2xl">Detail Barang</h1>
			</div>
			<div className="flex rounded-lg shadow-sm ">
				<div className="flex flex-col gap-5 w-full">
					<div>
						<p>
							<b>Nama Barang</b>: {goodDetail.name}
						</p>
						<p>
							<b>Spek Barang</b>: {goodDetail.specification}
						</p>
						<p>
							<b>Packing</b>: {goodDetail.packing}
						</p>
						<p>
							<b>Jumlah Barang</b>: {goodDetail.currentCount}
						</p>
						<p>
							<b>Keterangan</b>: {goodDetail.remarks}
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<div>
							<DataTable
								columns={goodsWithServiceColumns}
								data={goodDetail.serviceGoods}
								filterColumn={{
									label: "kode jasa",
									name: "serviceCode",
								}}
								dateFilter={{
									label: "tanggal jasa",
									name: "service.date",
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
