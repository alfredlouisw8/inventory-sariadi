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
import { Good } from "@prisma/client";

type Props = {
	customerId: string;
	goods: Good[];
};

export default function AddServiceDialog({ customerId, goods }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Tambah</Button>
			</DialogTrigger>
			<DialogContent className="max-w-5xl">
				<DialogHeader>
					<DialogTitle>Tambah Jasa</DialogTitle>
				</DialogHeader>
				<ServiceForm type="create" customerId={customerId} goods={goods} />
			</DialogContent>
		</Dialog>
	);
}
