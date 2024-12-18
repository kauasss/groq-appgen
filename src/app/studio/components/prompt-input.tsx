import { Input } from "@/components/ui/input";
import { useStudio } from "@/providers/studio-provider";
import { SubmitButton } from "./submit-button";

export function PromptInput() {
	const {
		mode,
		query,
		currentFeedback,
		setQuery,
		setCurrentFeedback,
		generateHtml,
		submitFeedback,
	} = useStudio();
	return (
		<div className=" flex items-center gap-2 flex-1 border-border border-2 focus-within:border-groq rounded-full p-1">
			<Input
				autoFocus
				type="text"
				value={mode === "query" ? query : currentFeedback}
				onChange={(e) =>
					mode === "query"
						? setQuery(e.target.value)
						: setCurrentFeedback(e.target.value)
				}
				className="flex-1 p-2 border-0 rounded focus:border-0 focus:ring-0 focus-visible:ring-0 focus-visible:border-0"
				placeholder={
					mode === "query" ? "Describe your app..." : "Enter your feedback..."
				}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						mode === "query" ? generateHtml() : submitFeedback();
					}
				}}
			/>
			<SubmitButton />
		</div>
	);
}
