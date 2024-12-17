import { Redis } from "ioredis";

export async function saveToStorage(key: string, value: string) {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	await redis.set(key, value);
}

export async function getFromStorage(key: string) {
	const redis = new Redis(process.env.UPSTASH_REDIS_URL);
	const value = await redis.get(key);
	return value;
}
