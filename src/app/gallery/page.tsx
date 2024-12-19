import { getGallery } from "@/server/storage";
import Link from "next/link";

export default async function GalleryPage() {
	const gallery = await getGallery();
	return (
		<main className="p-10">
			<h1 className="font-montserrat text-[2em] font-light">Gallery</h1>
			<div>
				{gallery.map((item) => (
					<Link
						href={`/apps/${item.sessionId}/${item.version}`}
						key={item.sessionId}
						className="flex flex-col gap-2 bg-red-500 max-w-[200px] rounded-lg overflow-hidden"
					>
						<div className="bg-blue-500 h-[200px] w-[200px] bg-[url('/images/placeholder.png')] bg-cover bg-center" />
						<div>
							<div>{item.title}</div>
							<div>{item.description}</div>
						</div>
					</Link>
				))}
			</div>
		</main>
	);
}
