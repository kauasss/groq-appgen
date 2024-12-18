"use client";

import { Suspense } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyButton } from "@/components/CopyButton";
import { ReloadButton } from "@/components/ReloadButton";
import { ShareButton } from "@/components/ShareButton";
import { ExternalButton } from "@/components/ExternalButton";
import { VersionSwitcher } from "@/components/VersionSwitcher";

import { useStudio } from "@/providers/studio-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Ellipsis, Plus, X } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function StudioView() {
	return (
		<Suspense>
			<HomeContent />
		</Suspense>
	);
}

function HomeContent() {
	const {
		query,
		setQuery,
		setStudioMode,
		history,
		historyIndex,
		navigateHistory,
		mode,
		currentHtml,
		currentFeedback,
		setCurrentFeedback,
		isOverlayOpen,
		setIsOverlayOpen,
		isGenerating,
		isApplying,
		generateHtml,
		submitFeedback,
		getFormattedOutput,
		iframeRef,
	} = useStudio();

	return (
		<main className="h-screen flex flex-col overflow-hidden">
			{/* Top Input Bar */}
			<div className="p-4 bg-background border-b flex-shrink-0">
				<div className="flex flex-col gap-4">
					{/* Version Switcher - Separate row on mobile */}
					<VersionSwitcher
						className="lg:hidden justify-center"
						currentVersion={historyIndex + 1}
						totalVersions={history.length}
						onPrevious={() => navigateHistory("prev")}
						onNext={() => navigateHistory("next")}
					/>

					{/* Main Input Row */}
					<div className="flex items-center gap-4">
						<Button
							className="flex items-center gap-2"
							onClick={() => {
								setStudioMode(false);
								setQuery("");
							}}
						>
							<Plus size={16} />
							New
						</Button>
						{/* Version Switcher - Only visible on desktop */}
						<VersionSwitcher
							className="lg:flex hidden"
							currentVersion={historyIndex + 1}
							totalVersions={history.length}
							onPrevious={() => navigateHistory("prev")}
							onNext={() => navigateHistory("next")}
						/>

						<Input
							type="text"
							value={mode === "query" ? query : currentFeedback}
							onChange={(e) =>
								mode === "query"
									? setQuery(e.target.value)
									: setCurrentFeedback(e.target.value)
							}
							className="flex-1 p-2 border rounded"
							placeholder={
								mode === "query"
									? "Describe your app..."
									: "Enter your feedback..."
							}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									mode === "query" ? generateHtml() : submitFeedback();
								}
							}}
						/>
						<Button
							disabled={
								(mode === "query" && (!query.trim() || isGenerating)) ||
								(mode === "feedback" && isApplying)
							}
							className={`bg-groq text-groq-foreground transition-all duration-200 ${
								isGenerating || isApplying
									? "loading-animation"
									: "bg-[#F55036] hover:bg-[#D93D26]"
							}`}
							onClick={mode === "query" ? generateHtml : submitFeedback}
						>
							{mode === "query"
								? isGenerating
									? "Generating..."
									: "Generate"
								: isApplying
									? "Applying..."
									: "Apply edit"}
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									<Ellipsis size={16} />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									onClick={() => setIsOverlayOpen(!isOverlayOpen)}
								>
									Show prompt
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Left Column - Code View */}
				<div className="w-1/2 p-4 border-r overflow-auto lg:block hidden">
					<div className="relative h-full">
						<SyntaxHighlighter
							language="html"
							style={vscDarkPlus}
							className="h-full rounded"
							customStyle={{ margin: 0, height: "100%", width: "100%" }}
						>
							{currentHtml || "<!-- HTML preview will appear here -->"}
						</SyntaxHighlighter>
						<div className="absolute bottom-4 left-4">
							<CopyButton code={currentHtml} />
						</div>
					</div>
				</div>

				{/* Right Column - Preview */}
				<div className="lg:w-1/2 w-full overflow-hidden">
					<div className="h-full p-4 relative">
						<div className="absolute top-6 right-6 flex gap-2 z-10">
							<ReloadButton iframeRef={iframeRef} />
							<ShareButton
								sessionId={history[historyIndex]?.sessionId}
								version={history[historyIndex]?.version}
								disabled={
									!history[historyIndex]?.sessionId ||
									!history[historyIndex]?.version
								}
								onShare={async () => {
									// The HTML is already saved when generated
								}}
							/>
							<ExternalButton
								sessionId={history[historyIndex]?.sessionId}
								version={history[historyIndex]?.version}
								disabled={
									!history[historyIndex]?.sessionId ||
									!history[historyIndex]?.version
								}
							/>
						</div>
						<iframe
							title="Studio Preview"
							ref={iframeRef}
							srcDoc={currentHtml}
							className="w-full h-full border rounded bg-background shadow-sm"
							style={{ minHeight: "100%", minWidth: "100%" }}
							scrolling="no"
							sandbox="allow-scripts"
						/>
					</div>
				</div>

				{/* Sliding Debug Overlay */}
				<div
					className={`fixed top-0 right-0 h-screen w-[60vw] bg-background shadow-lg transform transition-transform duration-300 overflow-hidden z-50 ${isOverlayOpen ? "translate-x-0" : "translate-x-full"}`}
				>
					<div className="h-full flex flex-col p-4">
						<div className="flex justify-between items-center mb-4 flex-shrink-0">
							<h2 className="font-medium">Prompt</h2>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setIsOverlayOpen(false)}
								className="text-gray-500 hover:text-gray-700"
							>
								<X size={16} />
							</Button>
						</div>
						<pre className="flex-1 text-sm bg-background p-4 rounded overflow-auto">
							{getFormattedOutput()}
						</pre>
					</div>
				</div>
			</div>
			<div className="flex w-full max-w-3xl mx-auto">
				{/* Left column */}
				<div className="w-1/2 pr-4 pb-4 border-r">
					<div className="flex items-center justify-end text-sm text-gray-600">
						<span>Powered by</span>
						<img
							src="/groq-logo.webp"
							alt="Groq Logo"
							width={48}
							className="ml-2"
						/>
					</div>
				</div>
				{/* Right column */}
				<div className="w-1/2 pl-4 pb-4">
					<div className="flex items-center justify-start text-sm text-gray-600">
						{history[historyIndex]?.usage && (
							<span>
								{(history[historyIndex].usage.total_time * 1000).toFixed(0)}ms •{" "}
								{Math.round(
									history[historyIndex].usage.total_tokens /
										history[historyIndex].usage.total_time,
								)}{" "}
								tokens/sec •{" "}
								<a
									rel="noreferrer"
									target="_blank"
									className="underline"
									href="https://console.groq.com/docs/models"
								>
									llama-3.3-70b-specdec
								</a>
							</span>
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
