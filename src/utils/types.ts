import { Service, ServiceGood } from "@prisma/client";

// Extend the Service type to include serviceGoods
export type ServiceWithGoods = Service & {
	serviceGoods: ServiceGood[];
};
