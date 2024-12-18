"use client";

import { useStudio } from "@/providers/studio-provider";
import PromptView from "./components/prompt-view";
import StudioView from "./components/studio-view";

export default function Home() {
	const { studioMode } = useStudio();

	if (studioMode) {
		return <StudioView />;
	}

	return <PromptView />;
}
