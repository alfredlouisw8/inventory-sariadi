import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import ServiceForm from "./form";
import { Service } from "@prisma/client";
import getGoods from "@/actions/goods/getGoods";
import { InvoiceWithServices, ServiceWithGoods } from "@/utils/types";

type Props = {
	triggerComponent: React.ReactNode;
	invoiceData: InvoiceWithServices;
};

export default function DeleteInvoiceDialog({
	triggerComponent,
	invoiceData,
}: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>{triggerComponent}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Hapus Invoice</DialogTitle>
				</DialogHeader>
				<ServiceForm
					type="delete"
					invoiceData={invoiceData}
					successMessage="Invoice berhasil dihapus"
					customerId={invoiceData.customerId}
				/>
			</DialogContent>
		</Dialog>
	);
}
