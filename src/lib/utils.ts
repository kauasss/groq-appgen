import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getOgImageUrl(sessionId: string, version: string) {
	return `https://image.thum.io/get/https://appgen.groqlabs.com/api/apps/${sessionId}/${version}/raw`;
}
