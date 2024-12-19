import { getFromStorage } from "@/server/storage";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface LayoutProps {
	children: React.ReactNode;
	params: {
		sessionId: string;
		version: string;
	};
}

export async function generateMetadata({
	params,
}: LayoutProps): Promise<Metadata> {
	console.log(JSON.stringify(params));
	const { sessionId, version } = params;

	try {
		const res = await getFromStorage(`${sessionId}/${version}`);

		if (res.startsWith("{")) {
			const data = JSON.parse(res);
			return {
				title: data.title,
				description: data.description,
				openGraph: {
					title: data.title,
					description: data.description,
					type: "website",
				},
			};
		}
		return {
			title: "Groq Micro-App (No metadata)",
			description: "This app was created in Groq Micro-Apps",
			openGraph: {
				title: "Groq Micro-App (No metadata)",
				description: "This app was created in Groq Micro-Apps",
				type: "website",
			},
		};
	} catch (error) {
		console.error("Error generating metadata:", error);
		notFound(); // Handle navigation to a 404 page if the fetch fails or data is invalid
	}
}

export default async function Layout({ children, params }: LayoutProps) {
	return <>{children}</>;
}
