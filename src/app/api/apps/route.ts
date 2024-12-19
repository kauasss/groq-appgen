import { getGallery } from "@/server/storage";
import { NextResponse } from "next/server";

export async function GET() {
	const gallery = await getGallery();

	return new NextResponse(JSON.stringify(gallery), {
		headers: {
			"Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
			Pragma: "no-cache",
			Expires: "0",
		},
	});
}
