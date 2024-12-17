import { type NextRequest, NextResponse } from "next/server";
import { getFromStorage, saveToStorage } from "@/server/storage";

export async function GET(
	request: NextRequest,
	{ params }: { params: { sessionId: string; version: string } },
) {
	const { sessionId, version } = params;

	try {
		const html = await getFromStorage(`${sessionId}/${version}`);

		if (!html) {
			return new NextResponse("Not found", { status: 404 });
		}

		return new NextResponse(html, {
			headers: {
				"Content-Type": "text/html",
			},
		});
	} catch (error) {
		return new NextResponse("Internal Server Error", { status: 500 });
	}
}

export async function POST(
	request: NextRequest,
	{ params }: { params: { sessionId: string; version: string } },
) {
	const { sessionId, version } = params;
	const html = await request.text();
	const key = `${sessionId}/${version}`;

	try {
		await saveToStorage(key, html);

		return new NextResponse(JSON.stringify({ success: true }), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		return new NextResponse(JSON.stringify({ error: "Failed to save HTML" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
