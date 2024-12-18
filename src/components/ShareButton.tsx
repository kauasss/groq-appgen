import { useState } from "react";
import { IoShareOutline } from "react-icons/io5";
import { Tooltip } from "react-tooltip";
import { Button } from "./ui/button";

interface ShareButtonProps {
	sessionId?: string;
	version?: string;
	onShare: () => Promise<void>;
	disabled?: boolean;
}

export function ShareButton({
	sessionId,
	version,
	onShare,
	disabled,
}: ShareButtonProps) {
	const [shared, setShared] = useState(false);

	const handleShare = async () => {
		await onShare();
		const url = `/apps/${sessionId}/${version}`;
		await navigator.clipboard.writeText(window.location.origin + url);
		setShared(true);
		setTimeout(() => setShared(false), 2000);
	};

	return (
		<>
			<Button
				onClick={handleShare}
				disabled={disabled}
				variant="outline"
				data-tooltip-id="share-tooltip"
				data-tooltip-content={
					shared
						? "URL copied!"
						: disabled
							? "Sharing not available yet"
							: "Share this page"
				}
			>
				<IoShareOutline size={20} /> Share
			</Button>
			<Tooltip
				id="share-tooltip"
				place="left"
				className="!bg-gray-800 !px-2 !py-1 !text-sm !z-50"
			/>
		</>
	);
}
