import { useStudio } from "@/providers/studio-provider";
import { useEffect } from "react";

export default function StudioPage({
	params: { sessionId },
}: { params: { sessionId: string } }) {
	const { setSessionId } = useStudio();

	useEffect(() => {
		setSessionId(sessionId);
	}, [sessionId, setSessionId]);

	return <div>StudioPage</div>;
}
