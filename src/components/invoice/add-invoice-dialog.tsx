import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import InvoiceForm from "./form";
import { Service } from "@prisma/client";

type Props = {
	customerId: string;
	services: Service[];
};

export default function AddInvoiceDialog({ customerId, services }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Tambah</Button>
			</DialogTrigger>
			<DialogContent className="max-w-5xl">
				<DialogHeader>
					<DialogTitle>Tambah Invoice</DialogTitle>
				</DialogHeader>
				<InvoiceForm
					type="create"
					customerId={customerId}
					services={services}
				/>
			</DialogContent>
		</Dialog>
	);
}
