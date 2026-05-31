# Images for AuraAlign by Shalini

Both images below are **already in place** — Shalini's real portrait has been added,
enhanced, and a branded social-share card generated from it. You only need to touch
this folder if you want to **replace** a photo later.

| File name              | Used for                          | Status | Recommended size      | Format | Target weight |
|------------------------|-----------------------------------|--------|-----------------------|--------|---------------|
| `shalini-portrait.jpg` | Hero + About sections + structured data | ✓ added (600×800) | **600 × 800 px** (3:4 portrait) | JPG | under 150 KB |
| `og-image.jpg`         | Social share preview (Open Graph / Twitter) | ✓ added (1200×630) | **1200 × 630 px** (1.91:1) | JPG | under 200 KB |

To replace the portrait later, just save a new photo over `shalini-portrait.jpg`
at 600 × 800 px — the pages already use `<img>` tags pointing to it, so it updates
everywhere automatically.

## How to swap a placeholder for your real portrait

The pages currently show a tasteful SVG placeholder. Once `shalini-portrait.jpg`
is in this folder, open `index.html` and `about.html`, find the comment:

```html
<!-- REPLACE: Drop assets/img/shalini-portrait.jpg here ... -->
```

and replace the `<div class="portrait-frame"> ... </div>` block's inner `<svg>…</svg>`
with:

```html
<img src="assets/img/shalini-portrait.jpg" alt="Shalini Chaudhary, astrologer and numerologist" />
```

(Keep the surrounding `<div class="portrait-frame">` — it provides the gold frame.)

## Tips for a great portrait
- Soft, even lighting; a calm, warm expression.
- Plain or gently blurred background works best with the celestial theme.
- Head positioned in the upper-middle of the frame (the frame crops to the top).
- Export as JPG at ~80% quality to stay under 150 KB.

## OG image
If you don't have a custom share image yet, you can reuse a nicely cropped
1200 × 630 version of your portrait with the brand name overlaid. Until you add
`og-image.jpg`, social previews simply won't show a picture — everything else
still works.
