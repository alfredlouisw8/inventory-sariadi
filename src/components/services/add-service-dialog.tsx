import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import ServiceForm from "./form";

type Props = {
	customerId: string;
};

export default function AddServiceDialog({ customerId }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Tambah</Button>
			</DialogTrigger>
			<DialogContent className="max-w-5xl">
				<DialogHeader>
					<DialogTitle>Tambah Jasa</DialogTitle>
				</DialogHeader>
				<ServiceForm
					type="create"
					customerId={customerId}
					successMessage="Jasa berhasil ditambahkan"
				/>
			</DialogContent>
		</Dialog>
	);
}
