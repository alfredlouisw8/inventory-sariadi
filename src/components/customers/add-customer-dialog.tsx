import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import CustomerForm from "./form";
export default function AddCustomerDialog() {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Tambah</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Tambah Customer</DialogTitle>
				</DialogHeader>
				<CustomerForm
					type="create"
					successMessage="Customer berhasil ditambahkan"
				/>
			</DialogContent>
		</Dialog>
	);
}
