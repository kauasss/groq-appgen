"use client";

import { StudioProvider } from "@/providers/studio-provider";

export default function StudioLayout({
	children,
}: { children: React.ReactNode }) {
	return <StudioProvider>{children}</StudioProvider>;
}
