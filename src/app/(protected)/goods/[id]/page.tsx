import getGoodDetail from "@/actions/goods/getGoodDetail";
import BackButton from "@/components/back-button";
import DeleteGoodDialog from "@/components/goods/delete-good-dialog";
import EditGoodDialog from "@/components/goods/edit-good-dialog";
import { goodsWithServiceColumns } from "@/components/serviceGoods/columns";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { PencilIcon, Trash2 } from "lucide-react";

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
				<div className="flex items-center gap-2">
					<EditGoodDialog
						goodData={goodDetail}
						triggerComponent={
							<Button variant="outline" size="icon">
								<PencilIcon className=" h-4 w-4" />
							</Button>
						}
					/>
					<DeleteGoodDialog
						goodData={goodDetail}
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
