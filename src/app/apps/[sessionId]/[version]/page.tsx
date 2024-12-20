"use client";

import { useEffect, useState } from "react";
import { RemixButton } from "@/components/RemixButton";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ReportButton } from "@/app/components/report-button";
import { UpvoteButton } from "@/app/components/upvote-button";

export default function SharedApp({
	params,
}: {
	params: { sessionId: string; version: string };
}) {
	const [html, setHtml] = useState("");
	const [showWarning, setShowWarning] = useState(true);
	const [accepted, setAccepted] = useState(false);
	const { theme } = useTheme();

	useEffect(() => {
		const fetchHtml = async () => {
			try {
				const response = await fetch(
					`/api/apps/${params.sessionId}/${params.version}`,
				);
				if (!response.ok) {
					throw new Error("Failed to fetch HTML");
				}
				const htmlContent = await response.text();
				if (htmlContent.startsWith("{")) {
					const data = JSON.parse(htmlContent);
					setHtml(data.html);
				} else {
					setHtml(htmlContent);
				}
			} catch (error) {
				console.error("Error fetching HTML:", error);
			}
		};

		if (!showWarning && accepted) {
			fetchHtml();
		}
	}, [params.sessionId, params.version, showWarning, accepted]);

	const handleAccept = () => {
		if (accepted) {
			setShowWarning(false);
		}
	};

	return (
		<div className="w-screen h-screen relative">
			{showWarning && (
				<div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm">
					<div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-lg border border-gray-200 dark:border-gray-700">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
							Warning
						</h2>
						<div className="py-4">
							<p className="text-gray-700 dark:text-gray-300">
								This is user generated content.
							</p>
							<div className="flex items-center space-x-2 mt-4">
								<input
									type="checkbox"
									id="terms"
									checked={accepted}
									onChange={(e) => setAccepted(e.target.checked)}
									className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 dark:text-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700"
								/>
								<label
									htmlFor="terms"
									className="text-sm text-gray-700 dark:text-gray-300"
								>
									Groq is not responsible for the content
								</label>
							</div>
						</div>
						<div className="mt-2 flex justify-end">
							<Button onClick={handleAccept} disabled={!accepted}>
								Continue
							</Button>
						</div>
					</div>
				</div>
			)}
			{!showWarning && accepted && (
				<>
					<iframe
						title="Shared App"
						srcDoc={html}
						className="w-full h-full border-0"
						style={{ height: "100vh" }}
					/>
					<div className="absolute bottom-4 right-4 flex gap-2 z-10">
						<ReportButton
							sessionId={params.sessionId}
							version={params.version}
						/>
						<RemixButton
							sessionId={params.sessionId}
							version={params.version}
						/>
					</div>
					<div className="absolute bottom-4 left-4 z-10">
						<UpvoteButton
							sessionId={params.sessionId}
							version={params.version}
						/>
					</div>
				</>
			)}
		</div>
	);
}
