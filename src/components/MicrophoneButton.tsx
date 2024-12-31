import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

interface MicrophoneButtonProps {
	onTranscription: (text: string) => void;
	disabled?: boolean;
}

export function MicrophoneButton({
	onTranscription,
	disabled,
}: MicrophoneButtonProps) {
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorder = useRef(null);
	const audioChunks = useRef([]);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorder.current = new MediaRecorder(stream);
			audioChunks.current = [];

			mediaRecorder.current.ondataavailable = (event) => {
				audioChunks.current.push(event.data);
			};

			mediaRecorder.current.onstop = async () => {
				const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
				const formData = new FormData();
				formData.append("audio", audioBlob);

				try {
					const response = await fetch("/api/transcribe", {
						method: "POST",
						body: formData,
					});

					const data = await response.json();
					if (response.ok) {
						onTranscription(data.transcription);
					} else {
						console.error("Transcription failed:", data.error);
					}
				} catch (error) {
					console.error("Error sending audio:", error);
				}

				// Clean up the media stream
				for (const track of stream.getTracks()) {
					track.stop();
				}
			};

			mediaRecorder.current.start();
			setIsRecording(true);
		} catch (error) {
			console.error("Error accessing microphone:", error);
		}
	};

	const stopRecording = () => {
		if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
			mediaRecorder.current.stop();
			setIsRecording(false);
		}
	};

	const toggleRecording = () => {
		if (isRecording) {
			stopRecording();
		} else {
			startRecording();
		}
	};

	return (
		<div className="relative">
			<Button
				disabled={disabled}
				type="button"
				variant="ghost"
				size="icon"
				className={`rounded-full relative z-10 ${
					isRecording ? "text-neutral-700 dark:text-neutral-200 hover:text-neutral-800 dark:hover:text-neutral-300" : ""
				}`}
				onClick={toggleRecording}
			>
				<Mic className="h-5 w-5" />
			</Button>
			{isRecording && (
				<div className="absolute inset-0 z-0">
					<div className="absolute inset-0 animate-ping rounded-full bg-neutral-300 dark:bg-neutral-600 opacity-75" />
					<div className="absolute inset-[-4px] animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-400 opacity-50" />
					<div className="absolute inset-[-8px] animate-pulse delay-75 rounded-full bg-neutral-100 dark:bg-neutral-800 opacity-25" />
				</div>
			)}
		</div>
	);
}
