import { NextRequest, NextResponse } from "next/server";
import { exportGoodsData } from "@/actions/goods/exportGoods";

export async function GET(req: NextRequest) {
	try {
		// Get the customerId from the query parameters
		const { searchParams } = new URL(req.url);
		const customerId = searchParams.get("customerId");

		if (!customerId) {
			return NextResponse.json(
				{ error: "Missing customerId" },
				{ status: 400 }
			);
		}

		const result = await exportGoodsData(customerId);

		return NextResponse.json({ data: result }, { status: 200 });
	} catch (error: any) {
		console.error("Error fetching goods:", error);
		return NextResponse.json(
			{ error: "Failed to fetch goods" },
			{ status: 500 }
		);
	}
}
