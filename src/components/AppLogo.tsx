import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import Image from "next/image";

export default function AppLogo({ className, size = 80 }: { className?: string; size?: number }) {
	const { resolvedTheme } = useTheme();
	const logoSrc = resolvedTheme === "dark" ? "/groqlabs_logo-white.png" : "/groqlabs_logo-black.png";

	return (
		<div className={cn("flex flex-col items-center gap-2", className)}>
			<Image key={resolvedTheme} src={logoSrc} alt="Groq" width={size} height={size/3.41333333333} />
		</div>
	);
}
