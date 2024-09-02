import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import GoodForm from "./form";

type Props = {
	customerId: string;
};

export default function AddGoodDialog({ customerId }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Tambah</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Tambah Barang</DialogTitle>
				</DialogHeader>
				<GoodForm type="create" customerId={customerId} />
			</DialogContent>
		</Dialog>
	);
}
