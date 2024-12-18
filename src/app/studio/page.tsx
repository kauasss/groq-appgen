"use client";

import { useStudio } from "@/providers/studio-provider";
import PromptView from "./components/prompt-view";
import StudioView from "./components/studio-view";
import { useEffect } from "react";

export default function Home() {
	const { studioMode, setStudioMode } = useStudio();

	useEffect(() => {
		if (location.search.startsWith("?source=")) {
			setStudioMode(true);
		}
	}, [setStudioMode]);

	if (studioMode) {
		return <StudioView />;
	}

	return <PromptView />;
}
