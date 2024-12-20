import AppLogo from "@/components/AppLogo";
import { MicrophoneButton } from "@/components/MicrophoneButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudio } from "@/providers/studio-provider";
import { DrawingCanvas } from "@/components/DrawingCanvas";
import { useState } from "react";
import { APP_EXAMPLES } from "@/data/app-examples";
import { Pencil } from "lucide-react";
import Link from "next/link";

import { GalleryListing } from "./gallery-listing";

const APP_SUGGESTIONS = APP_EXAMPLES.map((example) => example.label);

export default function PromptView() {
	const {
		setStudioMode,
		query,
		setQuery,
		setTriggerGeneration,
		drawingData,
		setDrawingData,
	} = useStudio();
	const [showDrawing, setShowDrawing] = useState(false);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStudioMode(true);
		setTriggerGeneration(true);
	};

	const handleDrawingComplete = async (imageData: string) => {
		setDrawingData(imageData);
		setShowDrawing(false);
	};

	const handleSuggestionClick = (suggestion: string) => () => {
		const example = APP_EXAMPLES.find((ex) => ex.label === suggestion);
		setQuery(example?.prompt || suggestion);
		setStudioMode(true);
		setTriggerGeneration(true);
	};

	const handleTranscription = (transcription: string) => {
		setQuery(transcription);
		setStudioMode(true);
		setTriggerGeneration(true);
	};

	return (
		<div className="flex flex-col gap-6 items-center justify-center h-screen relative">
			<AppLogo className="top-10 absolute" size={120} />
			<div className="flex flex-col gap-3 items-center justify-center min-w-[30%] px-4 md:px-0">
				<div>
					<h1 className="text-[2em] md:text-[3em] font-montserrat text-center">
						Build a micro-app
					</h1>
					<h2 className="text-[1.2em] md:text-[1.4em] font-montserrat mb-4 md:mb-8 text-center text-muted-foreground">
						in seconds
					</h2>
				</div>
				<form
					className="flex row gap-2 items-center justify-center w-full border-border border-solid border-2 rounded-full p-2 focus-within:border-groq"
					onSubmit={handleSubmit}
				>
					<Input
						autoFocus
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="flex-1 w-full border-0 md:text-lg p-3 bg-transparent shadow-none focus:outline-none focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:border-0"
						placeholder="Describe your app..."
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="rounded-full relative z-10 shrink-0 flex items-center justify-center"
						onClick={() => setShowDrawing(true)}
					>
						{drawingData ? "Edit Drawing" : <Pencil className="h-5 w-5" />}
					</Button>
					<MicrophoneButton onTranscription={handleTranscription} />
					<Button className="rounded-full" type="submit">
						Create
					</Button>
				</form>
			</div>
			{showDrawing && (
				<DrawingCanvas
					onDrawingComplete={handleDrawingComplete}
					onClose={() => setShowDrawing(false)}
				/>
			)}
			<div className="flex  flex-wrap justify-center gap-3 items-center w-[90%] md:w-[60%] lg:w-[30%] pb-4 px-2 ">
				{APP_SUGGESTIONS.map((suggestion) => (
					<Button
						key={suggestion}
						variant="outline"
						className="rounded-full text-xs whitespace-nowrap shrink-0"
						onClick={handleSuggestionClick(suggestion)}
					>
						{suggestion}
					</Button>
				))}
			</div>
			<div>
				<Link href="/gallery">
					<h2 className="font-montserrat text-xl mt-20 mb-10">Gallery</h2>
				</Link>
				<GalleryListing limit={10} />
			</div>
		</div>
	);
}
