import { useCallback, useEffect, useState } from "react";
import { IoShareOutline } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useStudio } from "@/providers/studio-provider";
import { Check, Copy } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
	sessionId?: string;
	version?: string;
	disabled?: boolean;
}

export function ShareButton({
	sessionId,
	version,
	disabled,
}: ShareButtonProps) {
	const { currentHtml } = useStudio();
	const { isCopied, copyToClipboard } = useCopyToClipboard({});
	const [status, setStatus] = useState<"idle" | "sharing" | "shared">("idle");
	const [open, setOpen] = useState(false);
	const [url, setUrl] = useState("");

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

	const handleShare = async () => {
		setStatus("sharing");
		const version = crypto.randomUUID();
		await fetch(`/api/apps/${sessionId}/${version}`, {
			method: "POST",
			body: JSON.stringify({
				html: currentHtml,
				title,
				description,
			}),
		});
		const url = `/apps/${sessionId}/${version}`;
		setUrl(window.location.origin + url);
		setStatus("shared");
	};

	const shareEnabled = title && description;

	useEffect(() => {
		if (version) {
			setStatus("idle");
		}
	}, [version]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					disabled={disabled || status === "sharing"}
					variant="outline"
					data-tooltip-id="share-tooltip"
					data-tooltip-content={
						status === "sharing"
							? "Sharing..."
							: status === "shared"
								? "URL copied!"
								: disabled
									? "Sharing not available yet"
									: "Share this page"
					}
				>
					<IoShareOutline size={20} /> Share
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className="flex flex-col justify-center items-center w-full h-[350px]">
					{status === "sharing" && <div>Sharing...</div>}
					{status === "shared" && (
						<div className="flex flex-col justify-center items-center w-full h-[350px]">
							<h2 className="text-lg font-montserrat">Shared!</h2>
							<p className="text-sm text-gray-500">
								Your app has been shared! You can now share the link with your
								friends.
							</p>
							<div className="flex flex-col gap-2">
								<div className="text-sm font-medium">Link:</div>
								<div className="flex gap-2">
									<Input autoFocus value={url} />
									<Button
										size="icon"
										onClick={() => copyToClipboard(url)}
										className=" shrink-0"
									>
										{isCopied ? <Check size={16} /> : <Copy size={16} />}
									</Button>
								</div>
								<div
									className={cn(
										"text-sm opacity-0 text-center",
										isCopied && "opacity-50",
									)}
								>
									Link copied to clipboard!
								</div>
								<div className="flex gap-2">
									<Button variant="outline" onClick={() => setOpen(false)}>
										Close
									</Button>
									<Button onClick={() => window.open(url, "_blank")}>
										Open in new tab
									</Button>
								</div>
							</div>
						</div>
					)}
					{status === "idle" && (
						<div className="flex flex-col gap-6">
							<h2 className="text-lg font-montserrat">Share your app</h2>
							<p className="text-sm text-gray-500">
								These entries will be shown when you share them around.
							</p>
							<div className="flex flex-col gap-2">
								<div className="text-sm font-medium">App name:</div>
								<div>
									<Input
										value={title}
										onChange={(e) => setTitle(e.target.value)}
										placeholder="e.g. Rainbow Calculator"
									/>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<div className="text-sm font-medium">
									Describe your app in a few words:
								</div>
								<div>
									<Textarea
										value={description}
										onChange={(e) => setDescription(e.target.value)}
										placeholder="e.g. A calculator that shows the rainbow colors"
									/>
								</div>
							</div>
							<div className="flex justify-end">
								<Button onClick={handleShare} disabled={!shareEnabled}>
									Share
								</Button>
							</div>
						</div>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}
