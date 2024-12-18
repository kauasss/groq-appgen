import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStudio } from "@/providers/studio-provider";
import { Plus } from "lucide-react";

export function NewButton({ className }: { className?: string }) {
	const { setStudioMode, setQuery } = useStudio();
	return (
		<Button
			className={cn("flex items-center gap-2", className)}
			onClick={() => {
				setStudioMode(false);
				setQuery("");
			}}
		>
			<Plus size={16} />
			<span className="hidden lg:flex">New</span>
		</Button>
	);
}
