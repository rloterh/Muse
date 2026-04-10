"use client";

import Image from "next/image";
import { urlFor } from "@/lib/sanity/client";
import { cn } from "@/lib/utils/cn";
import type { SanityAssetReference, SanityImageSource } from "@/types";

interface SanityImageProps {
  image: SanityImageSource;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  quality?: number;
}

export function SanityImage({
  image,
  alt,
  width = 1200,
  height = 675,
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 50vw",
  priority = false,
  className,
  quality = 85,
}: SanityImageProps) {
  if (!image?.asset) {
    return (
      <div
        className={cn("bg-[var(--color-bg-elevated)] flex items-center justify-center", className)}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-xs text-[var(--color-text-dim)]">No image</span>
      </div>
    );
  }

  const src = urlFor(image).width(width).height(height).quality(quality).auto("format").url();

  // Low-quality blur placeholder
  const blurUrl = urlFor(image)
    .width(20)
    .height(Math.round(20 * (height / width)))
    .quality(10)
    .blur(50)
    .auto("format")
    .url();

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        placeholder="blur"
        blurDataURL={blurUrl}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={blurUrl}
      className={className}
    />
  );
}

/**
 * Gallery component — grid of Sanity images with optional lightbox
 */
interface GalleryProps {
  images: SanityAssetReference[];
  columns?: 2 | 3;
  className?: string;
}

export function SanityGallery({ images, columns = 2, className }: GalleryProps) {
  if (!images?.length) return null;

  return (
    <div
      className={cn("grid gap-4", columns === 2 ? "md:grid-cols-2" : "md:grid-cols-3", className)}
    >
      {images.map((img, i) => (
        <figure key={i} className="group overflow-hidden">
          <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-bg-elevated)]">
            <SanityImage
              image={img}
              alt={img.alt ?? `Gallery image ${i + 1}`}
              fill
              sizes={
                columns === 2 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"
              }
              className="transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          {img.caption && (
            <figcaption className="mt-2 text-xs text-[var(--color-text-dim)]">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
