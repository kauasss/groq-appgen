"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface RemoveButtonProps {
	sessionId: string;
	version: string;
}

export function RemoveButton({ sessionId, version }: RemoveButtonProps) {
	const [isRemoving, setIsRemoving] = useState(false);
	const router = useRouter();

	const handleRemove = async () => {
		try {
			setIsRemoving(true);
			const response = await fetch(`/api/apps/${sessionId}/${version}/remove`, {
				method: "POST",
			});
			
			const data = await response.json();
			
			if (!response.ok) {
				throw new Error(data.error || "Failed to remove app");
			}

			toast.success("App removed successfully");
			// Navigate back to gallery after successful removal
			router.push("/gallery");
		} catch (error) {
			console.error("Error removing app:", error);
			toast.error(error instanceof Error ? error.message : "Failed to remove app");
		} finally {
			setIsRemoving(false);
		}
	};

	return (
		<Button
			variant="destructive"
			onClick={handleRemove}
			disabled={isRemoving}
			className="flex items-center gap-2"
		>
			<Trash2 size={16} />
			{isRemoving ? "Removing..." : "Remove"}
		</Button>
	);
}
