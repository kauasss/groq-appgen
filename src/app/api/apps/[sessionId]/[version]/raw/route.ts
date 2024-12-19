import { getFromStorage } from "@/server/storage";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: { sessionId: string; version: string } },
) {
	const { sessionId, version } = params;

	try {
		const content = await getFromStorage(`${sessionId}/${version}`);
		let html = "";

		if (content.startsWith("{")) {
			const json = JSON.parse(content);
			html = json.html;
		} else {
			html = content;
		}

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
