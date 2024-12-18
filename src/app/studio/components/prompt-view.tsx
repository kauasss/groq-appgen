import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudio } from "@/providers/studio-provider";

const suggestions = [
	"Calculator",
	"Todo List",
	"Weather App",
	"Quiz App",
	"Note Taker",
	"Recipe Finder",
	"Chatbot",
	"Image Gallery",
	"Music Player",
	"Video Player",
	"Calendar",
	"Task Manager",
	"Expense Tracker",
	"Budget Planner",
];

export default function PromptView() {
	const { setStudioMode, query, setQuery, setTriggerGeneration } = useStudio();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setStudioMode(true);
		setTriggerGeneration(true);
	};

	const handleSuggestionClick = (suggestion: string) => () => {
		setQuery(suggestion);
		setStudioMode(true);
		setTriggerGeneration(true);
	};

	return (
		<div className="flex flex-col gap-6 items-center justify-center h-screen">
			<div className="flex flex-col gap-3 items-center justify-center min-w-[30%]">
				<h1 className="text-2xl font-bold">Start a mini-app</h1>
				<form
					className="flex row gap-3 items-center justify-center w-full"
					onSubmit={handleSubmit}
				>
					<Input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="w-full max-w-md"
						placeholder="Describe your app..."
					/>
					<Button>Create</Button>
				</form>
			</div>
			<div className="flex row flex-wrap gap-3 items-center justify-center w-[30%] ">
				{suggestions.map((suggestion) => (
					<Button
						key={suggestion}
						variant="outline"
						className="rounded-full text-xs"
						onClick={handleSuggestionClick(suggestion)}
					>
						{suggestion}
					</Button>
				))}
			</div>
		</div>
	);
}
