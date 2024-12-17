import { FiExternalLink } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { Button } from "./ui/button";

interface ExternalButtonProps {
	sessionId?: string;
	version?: string;
	disabled?: boolean;
}

export function ExternalButton({
	sessionId,
	version,
	disabled,
}: ExternalButtonProps) {
	const handleOpen = () => {
		if (sessionId && version) {
			window.open(`/apps/${sessionId}/${version}`, "_blank");
		}
	};

	return (
		<>
			<Button
				onClick={handleOpen}
				disabled={disabled}
				variant="outline"
				size="icon"
				data-tooltip-id="external-tooltip"
				data-tooltip-content={
					disabled ? "Preview not available yet" : "Open in new tab"
				}
			>
				<FiExternalLink size={20} />
			</Button>
			<Tooltip id="external-tooltip" />
		</>
	);
}
