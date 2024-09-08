import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the path to your Prisma client instance

export async function GET(req: NextRequest) {
	try {
		// Get customerId and optional serviceIds from the query parameters
		const { searchParams } = new URL(req.url);
		const customerId = searchParams.get("customerId");
		const serviceIdsParam = searchParams.get("serviceIds");

		if (!customerId) {
			return NextResponse.json(
				{ error: "Missing customerId" },
				{ status: 400 }
			);
		}

		// Parse serviceIds into an array if provided
		const serviceIds = serviceIdsParam ? serviceIdsParam.split(",") : [];

		// Fetch unpaid services and include those with provided serviceIds
		const unpaidServices = await prisma.service.findMany({
			where: {
				customerId: customerId,
				OR: [
					{ invoiceId: null }, // Unpaid services
					{ id: { in: serviceIds } }, // Include services from serviceIds (e.g., for updates)
				],
			},
		});

		return NextResponse.json({ data: unpaidServices }, { status: 200 });
	} catch (error: any) {
		console.error("Error fetching unpaid services:", error);
		return NextResponse.json(
			{ error: "Failed to fetch unpaid services" },
			{ status: 500 }
		);
	}
}
