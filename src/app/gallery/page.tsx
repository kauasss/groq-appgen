"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { GalleryListing } from "../components/gallery-listing";

export default function GalleryPage() {
	return (
		<main className="p-4">
			<div className="flex items-center gap-2 mb-10">
				<Link href="/" className=" w-10 h-10 flex items-center justify-center ">
					<ArrowLeft size={20} />
				</Link>
				<h1 className="font-montserrat text-[2em] font-light ">Gallery</h1>
			</div>
			<GalleryListing />
		</main>
	);
}
