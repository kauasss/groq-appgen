import { Redis } from "ioredis";

interface GalleryItem {
	sessionId: string;
	version: string;
	html: string;
	signature: string;
	title: string;
	description: string;
}

export async function saveToStorage(key: string, value: string) {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	await redis.set(key, value);
}

export async function getFromStorage(key: string) {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const value = await redis.get(key);
	return value;
}

export async function getGallery(): Promise<GalleryItem[]> {
	const gallery = await getFromStorage("gallery");
	return gallery ? JSON.parse(gallery) : [];
}

export async function addToGallery(item: GalleryItem) {
	const gallery = await getGallery();
	gallery.push(item);
	await saveToStorage("gallery", JSON.stringify(gallery));
}
