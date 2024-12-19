import { getOgImageUrl } from "@/lib/utils";
import { getGallery } from "@/server/storage";
import Link from "next/link";

export default async function GalleryPage() {
	const gallery = await getGallery();
	return (
		<main className="p-10">
			<h1 className="font-montserrat text-[2em] font-light mb-10">Gallery</h1>
			<div className="flex flex-wrap gap-4">
				{gallery.map((item) => (
					<Link
						href={`/apps/${item.sessionId}/${item.version}`}
						key={item.sessionId}
						className="flex flex-col gap-2 bg-secondary max-w-[200px] rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all duration-100"
					>
						<div
							className="bg-blue-500 h-[200px] w-[200px] bg-[url('/images/placeholder.png')] bg-cover bg-center"
							style={{
								backgroundImage: `url(${getOgImageUrl(item.sessionId, item.version)})`,
							}}
						/>
						<div className="p-4">
							<div>{item.title}</div>
							<div className="text-xs opacity-50">{item.description}</div>
						</div>
					</Link>
				))}
			</div>
		</main>
	);
}
