"""
Exposure-corrects the supplied gallery photos and writes them into src/assets/gallery/.

The source set is 640x428 and underexposed with a warm tungsten cast. This pass lifts
brightness/contrast and neutralises some of the cast so the photos read as intentional
rather than murky. Correction happens here, once, at build-asset time -- not as a CSS
`filter:` on the live page, which would cost paint time on every scroll.

Output stays JPEG at high quality; the Next.js image optimizer does the WebP conversion and srcset.

Usage: npm run images
"""

from pathlib import Path

from PIL import Image, ImageEnhance

SRC = Path(r"C:\Users\user2\Downloads\fwdslikiodobukasobaze")
OUT = Path(__file__).resolve().parent.parent / "src" / "assets" / "gallery"

# Curated in PLAN.md section 2. image1 and image11 are dropped as near-duplicates.
# `image8` is deliberately absent. The hero photo was resupplied at 1533x1026,
# already exposure-corrected, and lives at src/assets/gallery/hero.jpg. Running the
# tungsten pass over it again would double-apply the correction, and regenerating it
# from the 640px original would silently throw the resolution away.
KEEP = [
    "image4",
    "image5",
    "image0",
    "image2",
    "image7",
    "image6",
    "image9",
    "image10",
]

BRIGHTNESS = 1.10
CONTRAST = 1.05
# Scales the red and blue channels to pull down the tungsten cast.
WHITE_BALANCE = (0.97, 1.0, 1.06)


def correct(im: Image.Image) -> Image.Image:
    im = ImageEnhance.Brightness(im).enhance(BRIGHTNESS)
    im = ImageEnhance.Contrast(im).enhance(CONTRAST)
    r, g, b = im.split()
    r = r.point(lambda v: min(255, int(v * WHITE_BALANCE[0])))
    g = g.point(lambda v: min(255, int(v * WHITE_BALANCE[1])))
    b = b.point(lambda v: min(255, int(v * WHITE_BALANCE[2])))
    return Image.merge("RGB", (r, g, b))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for name in KEEP:
        src = SRC / f"{name}.jpeg"
        if not src.exists():
            print(f"missing, skipped: {src}")
            continue
        im = Image.open(src).convert("RGB")
        correct(im).save(OUT / f"{name}.jpg", "JPEG", quality=95, optimize=True)
        print(f"{name}: {im.size[0]}x{im.size[1]} -> {OUT / (name + '.jpg')}")


if __name__ == "__main__":
    main()
