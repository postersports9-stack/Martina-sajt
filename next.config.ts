import type { NextConfig } from "next";

/*
  The page itself has no dynamic server work -- it prerenders to static HTML. The
  only runtime endpoint is /_next/image, which is what replaces `astro:assets`
  here: WebP conversion, srcset, intrinsic width/height (no CLS), and no upscaling
  past a source file's native width.

  To go back to a pure "drop it on any static host" build, set
  `output: "export"` + `images.unoptimized: true` below -- that trades the image
  optimizer for the original 640px JPEGs. See README.
*/
const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    // Photos render at quality 82, matching the old astro:assets pass. Next 16
    // rejects any quality not listed here.
    qualities: [82],
    // Sources are 640x428 and nothing renders wider than 600 CSS px, so the
    // candidate widths stop where the pixels do. 320/480/600 mirror the widths
    // the Astro build emitted; 48/96 cover the 44px logo at 1x/2x.
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 320, 384, 480, 600],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;
