import { ServiceCalculationType, ServiceType } from "@prisma/client";

export function serviceTypeText(type: string) {
	switch (type) {
		case ServiceType.Loading:
			return "Bongkar";
		case ServiceType.Unloading:
			return "Muat";
		case ServiceType.Repacking:
			return "Repacking";
		case ServiceType.RepackingWeighing:
			return "Repacking + Timbang";
		case ServiceType.Stripping:
			return "Stripping";
		default:
			// You may want to add a default return value or throw an error here
			return "";
	}
}

export function serviceCalculationTypeText(type: string) {
	switch (type) {
		case ServiceCalculationType.Add:
			return "Tambah";
		case ServiceCalculationType.Substract:
			return "Kurang";
		case ServiceCalculationType.Equal:
			return "Tetap";
		default:
			// You may want to add a default return value or throw an error here
			return "";
	}
}
