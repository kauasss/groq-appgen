import { NextRequest, NextResponse } from "next/server";
import { getFromStorage, getStorageKey } from "@/server/storage";

export async function GET(
	request: NextRequest,
	{ params }: { params: { sessionId: string; version: string } }
) {
	const { sessionId, version } = params;

	try {
		const ip = request.headers.get("x-forwarded-for") || request.ip || "unknown";
		const key = getStorageKey(sessionId, version, ip);
		const value = await getFromStorage(key);

		if (!value) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}

		const data = JSON.parse(value);
		return new NextResponse(data.html, {
			headers: {
				"Content-Type": "text/html",
			},
		});
	} catch (error) {
		console.error("Error retrieving raw app:", error);
		return NextResponse.json(
			{ error: "Failed to retrieve app" },
			{ status: 500 }
		);
	}
}
