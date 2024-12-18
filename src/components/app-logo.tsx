import { cn } from "@/lib/utils";
import GroqLogo from "./groq-logo";

export default function AppLogo({ className }: { className?: string }) {
	return (
		<div className={cn("flex flex-col items-center gap-2", className)}>
			<GroqLogo />
			<div className="text-2xl font-montserrat font-light text-[.8em] mt-[-15px] mr-[-50px]">
				mini-apps
			</div>
		</div>
	);
}
