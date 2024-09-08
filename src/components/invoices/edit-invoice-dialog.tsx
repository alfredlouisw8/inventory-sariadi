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

export default function EditInvoiceDialog({
	triggerComponent,
	invoiceData,
}: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>{triggerComponent}</DialogTrigger>
			<DialogContent className="max-w-5xl">
				<DialogHeader>
					<DialogTitle>Ubah Invoice</DialogTitle>
				</DialogHeader>
				<ServiceForm
					type="update"
					invoiceData={invoiceData}
					successMessage="Invoice berhasil diubah"
					customerId={invoiceData.customerId}
				/>
			</DialogContent>
		</Dialog>
	);
}
