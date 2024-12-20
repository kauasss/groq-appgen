import { Redis } from "ioredis";
import crypto from "crypto";

interface GalleryItem {
	sessionId: string;
	version: string;
	html: string;
	signature: string;
	title: string;
	description: string;
	upvotes?: string[]; // Array of IP addresses that have upvoted
	createdAt: string; // ISO date string
	creatorIP: string; // IP address of the creator
}

function hashIP(ip: string): string {
	return crypto.createHash('sha256').update(ip).digest('hex').substring(0, 8);
}

export function getStorageKey(sessionId: string, version: string, ip: string): string {
	const ipHash = hashIP(ip);
	return `${sessionId}/${version}/${ipHash}`;
}

function getGalleryKey(timestamp: number, randomHash: string, ip: string): string {
	const ipHash = hashIP(ip);
	return `gallery_${timestamp}_${randomHash}_${ipHash}`;
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

export async function getGalleryKeys(): Promise<string[]> {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const keys = await redis.keys("gallery_*");
	return keys.sort().reverse(); // Sort in descending order to get latest first
}

export async function getBlockedIPs(): Promise<string[]> {
	const blockedIPsStr = await getFromStorage("blocked_ips");
	return blockedIPsStr ? JSON.parse(blockedIPsStr) : [];
}

export async function blockIP(ip: string, token: string) {
	if (token !== process.env.BLOCK_SECRET) {
		throw new Error("Invalid token");
	}

	const blockedIPs = await getBlockedIPs();
	if (!blockedIPs.includes(ip)) {
		blockedIPs.push(ip);
		await saveToStorage("blocked_ips", JSON.stringify(blockedIPs));
	}

	const ipHash = hashIP(ip);
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	
	// Remove gallery items with this IP hash
	const galleryKeys = await redis.keys(`gallery_*_${ipHash}`);
	for (const key of galleryKeys) {
		await redis.del(key);
	}

	// Remove stored apps with this IP hash
	const appKeys = await redis.keys(`*/${ipHash}`);
	for (const key of appKeys) {
		await redis.del(key);
	}
}

export async function isIPBlocked(ip: string): Promise<boolean> {
	const blockedIPs = await getBlockedIPs();
	return blockedIPs.includes(ip);
}

export async function getGallery(): Promise<GalleryItem[]> {
	const keys = await getGalleryKeys();
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const items: GalleryItem[] = [];

	for (const key of keys) {
		const itemStr = await redis.get(key);
		if (itemStr) {
			try {
				items.push(JSON.parse(itemStr));
			} catch (err) {
				console.error("Error parsing gallery item:", err);
			}
		}
	}

	return items;
}

export async function addToGallery(item: GalleryItem): Promise<boolean> {
	if (await isIPBlocked(item.creatorIP)) {
		console.warn(`Someone tried to submit from a blocked IP: ${item.creatorIP}`);
		return false;
	}

	// Initialize upvotes array and ensure createdAt is set
	item.upvotes = [];
	item.createdAt = item.createdAt || new Date().toISOString();
	
	// Generate unique key with timestamp and random hash
	const timestamp = Math.floor(Date.now() / 1000);
	const randomHash = Math.random().toString(36).substring(2, 8);
	const key = getGalleryKey(timestamp, randomHash, item.creatorIP);
	
	await saveToStorage(key, JSON.stringify(item));

	return true;
}

export async function removeGalleryItem(sessionId: string, version: string, requestIP: string): Promise<boolean> {
	const ipHash = hashIP(requestIP);
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	
	// Look for items with matching sessionId/version and IP hash
	const keys = await redis.keys(`gallery_*_${ipHash}`);
	for (const key of keys) {
		const itemStr = await redis.get(key);
		if (itemStr) {
			try {
				const item = JSON.parse(itemStr);
				if (item.sessionId === sessionId && item.version === version) {
					await redis.del(key);
					return true;
				}
			} catch (err) {
				console.error("Error parsing gallery item:", err);
			}
		}
	}
	
	throw new Error("Unauthorized: You can only remove your own submissions");
}

export async function upvoteGalleryItem(sessionId: string, version: string, ip: string): Promise<number> {
	const keys = await getGalleryKeys();
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	
	for (const key of keys) {
		const itemStr = await redis.get(key);
		if (itemStr) {
			try {
				const item = JSON.parse(itemStr);
				if (item.sessionId === sessionId && item.version === version) {
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
					await saveToStorage(key, JSON.stringify(item));

					return item.upvotes.length;
				}
			} catch (err) {
				console.error("Error parsing gallery item:", err);
			}
		}
	}
	throw new Error("Gallery item not found");
}

export async function getUpvotes(sessionId: string, version: string): Promise<number> {
	const keys = await getGalleryKeys();
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	
	for (const key of keys) {
		const itemStr = await redis.get(key);
		if (itemStr) {
			try {
				const item = JSON.parse(itemStr);
				if (item.sessionId === sessionId && item.version === version) {
					return item.upvotes?.length || 0;
				}
			} catch (err) {
				console.error("Error parsing gallery item:", err);
			}
		}
	}
	throw new Error("Gallery item not found");
}
