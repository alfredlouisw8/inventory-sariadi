import { Invoice, Service, ServiceGood } from "@prisma/client";

// Extend the Service type to include serviceGoods
export type ServiceWithGoods = Service & {
	serviceGoods: ServiceGood[];
};

export type InvoiceWithServices = Invoice & {
	services: Service[];
};
