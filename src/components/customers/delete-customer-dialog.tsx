import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import CustomerForm from "./form";
import { Customer } from "@prisma/client";

type Props = {
	triggerComponent: React.ReactNode;
	customerData: Customer;
};

export default function DeleteCustomerDialog({
	triggerComponent,
	customerData,
}: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>{triggerComponent}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Hapus Customer</DialogTitle>
				</DialogHeader>
				<CustomerForm
					type="delete"
					customerData={customerData}
					successMessage="Customer berhasil dihapus"
				/>
			</DialogContent>
		</Dialog>
	);
}
