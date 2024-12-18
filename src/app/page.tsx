import { redirect } from "next/navigation";

export default function Home() {
	redirect("/studio");
	return <></>;
}

export const metadata = {
	title: "Groq Mini-Apps",
};
