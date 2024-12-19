import { cn, getOgImageUrl } from "@/lib/utils";
import { getGallery } from "@/server/storage";
import Link from "next/link";

export default async function GalleryPage() {
	const gallery = await getGallery();
	return (
		<main className="p-4">
			<h1 className="font-montserrat text-[2em] font-light mb-10">Gallery</h1>
			<div className="flex flex-wrap gap-4 md:gap-6 xl:gap-8 justify-center">
				{gallery.map((item) => (
					<Link
						href={`/apps/${item.sessionId}/${item.version}`}
						key={item.sessionId}
						className={cn(
							"flex flex-col gap-2 bg-secondary  rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition-all duration-100",
							"w-[150px] md:w-[200px] xl:w-[250px]",
						)}
					>
						<div
							className={cn(
								"bg-blue-500 h-[150px] bg-[url('/images/placeholder.png')] bg-cover bg-center",
								"h-[150px] md:h-[200px] xl:h-[250px]",
							)}
							style={{
								backgroundImage: `url(${getOgImageUrl(item.sessionId, item.version)})`,
							}}
						/>
						<div className="p-2 flex flex-col gap-2">
							<div className="text-sm">{item.title}</div>
							<div className="text-xs opacity-50 h-[95px] overflow-hidden text-ellipsis line-clamp-6">
								{item.description}
							</div>
						</div>
					</Link>
				))}
			</div>
		</main>
	);
}
