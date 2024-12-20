import { Redis } from "ioredis";

interface GalleryItem {
	sessionId: string;
	version: string;
	html: string;
	signature: string;
	title: string;
	description: string;
	upvotes?: string[]; // Array of IP addresses that have upvoted
	createdAt: string; // ISO date string
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
	// Initialize upvotes array and add creation date
	item.upvotes = [];
	item.createdAt = new Date().toISOString();
	// add item to the beginning of the array
	gallery.unshift(item);
	await saveToStorage("gallery", JSON.stringify(gallery));
}

export async function upvoteGalleryItem(sessionId: string, version: string, ip: string): Promise<number> {
	const gallery = await getGallery();
	const item = gallery.find(item => item.sessionId === sessionId && item.version === version);
	
	if (!item) {
		throw new Error("Gallery item not found");
	}

	// Initialize upvotes array if it doesn't exist
	if (!item.upvotes) {
		item.upvotes = [];
	}

	// Check if user already voted
	if (item.upvotes.includes(ip)) {
		throw new Error("Already voted");
	}

	// Add upvote
	item.upvotes.push(ip);
	await saveToStorage("gallery", JSON.stringify(gallery));

	return item.upvotes.length;
}

export async function getUpvotes(sessionId: string, version: string): Promise<number> {
	const gallery = await getGallery();
	const item = gallery.find(item => item.sessionId === sessionId && item.version === version);
	
	if (!item) {
		throw new Error("Gallery item not found");
	}

	return item.upvotes?.length || 0;
}
