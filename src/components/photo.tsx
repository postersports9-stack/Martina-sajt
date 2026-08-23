import Image, { type StaticImageData } from "next/image";

/**
 * Every photo on the page goes through here so the optimizer settings stay in one
 * place. Static imports carry intrinsic width/height, so nothing shifts on load,
 * and Next will not upscale past a file's native 640px.
 *
 * The tile now owns an explicit aspect ratio and crops with `object-cover`.
 * Previously each photo was `h-auto`, which only looked tidy because all eleven
 * sources happen to be exactly 640x428 -- one replacement at a different ratio
 * and every grid row would have gone ragged.
 */
interface Props {
  src: StaticImageData;
  alt: string;
  sizes: string;
  /** Only the first photo below the fold is worth fetching eagerly. */
  priority?: boolean;
  /** Tailwind aspect utility. Sources are 3:2, so anything else crops. */
  ratio?: string;
  className?: string;
}

export default function Photo({
  src,
  alt,
  sizes,
  priority = false,
  ratio = "aspect-[3/2]",
  className = "",
}: Props) {
  return (
    <div className={`photo-frame ${ratio} ${className}`}>
      <Image
        src={src}
        alt={alt}
        sizes={sizes}
        quality={82}
        priority={priority}
        fill
        className="object-cover"
      />
    </div>
  );
}
