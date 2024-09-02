import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import ServiceGoodForm from "./form";
import { Good, Service } from "@prisma/client";

type Props = {
	goods: Good[];
	service: Service;
};

export default function AddServiceGoodDialog({ service, goods }: Props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button>Tambah</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Tambah Barang</DialogTitle>
				</DialogHeader>
				<ServiceGoodForm type="create" service={service} goods={goods} />
			</DialogContent>
		</Dialog>
	);
}
