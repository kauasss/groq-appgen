import { getGallery } from "@/server/storage";
import { NextResponse } from "next/server";

export async function GET() {
	const gallery = await getGallery();
	return NextResponse.json(gallery);
}
