import { useState } from "react";
import { providerFactory } from "./provider-factory";

const [StudioProvider, useStudio] = providerFactory(() => {
	const [query, setQuery] = useState("");
	const [studioMode, setStudioMode] = useState(false);
	const [triggerGeneration, setTriggerGeneration] = useState(false);

	return {
		query,
		setQuery,
		studioMode,
		setStudioMode,
		triggerGeneration,
		setTriggerGeneration,
	};
});

export { StudioProvider, useStudio };
