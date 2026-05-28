# ArtMaker

A single-file web application for generating promotional flyers for retail stores. Built with HTML5, CSS3, and vanilla JavaScript — no frameworks, no build tools, no backend, no dependencies beyond a Google Fonts CDN call.

The output is a 1080×1920 px PNG (9:16 ratio), ready for Instagram Stories, Facebook Stories, and WhatsApp Status.

---

## Quick Start

Download `index.html` and open it in any modern browser. That is all.

To add the store logo, convert your PNG to Base64 (any free online converter works), open `index.html` in a text editor, and paste the string into:

```js
const LOGO_BASE64 = ""; // paste here
```

---

## Features

### Content
- Offer validity date (defaults to tomorrow)
- Editable store address and header text
- 1 to 6 products per flyer
- Per-product name, price, photo upload, and image frame toggle
- Individual photo clear button per product

### Design — full visual control
- 8 ready-made color palettes: Black & Gold, Classic Gold, Red Market, Organic Green, Premium Blue, Elegant Purple, Vibrant Orange, Dark Mode
- Individual color pickers for every element: header background, header text, card background, card border, product name, price, flyer background, footer background, footer text
- Each color section combines 8 preset swatches with a free color input

### Layout
- 4 card styles: thin border, drop shadow, filled background, gradient
- 4 header styles: classic, split, banner, minimal
- 4 footer styles: solid, dark, minimal, wave
- 4 price display styles: plain text, tag, circle, ribbon
- 4 corner radius options: square, slight, medium, rounded
- 4 border weight options: none, thin, medium, thick

### Dynamic grid layouts
| Products | Layout |
|---|---|
| 1 | Single large centered card |
| 2 | Side by side |
| 3 | T-shaped (one full-width on top, two below) |
| 4 | 2×2 grid |
| 5 | 3+2 grid |
| 6 | 2×3 grid |

### Usability
- All changes render in real-time via debounced canvas redraws
- Status indicator: Editing... / Ready
- Download button with Generating... and Saved! feedback states
- Responsive: desktop shows panel + live preview side by side; mobile shows the full form with a floating button that opens the preview in a modal

---

## Technical Notes

- Rendering: HTML5 Canvas API at 1080×1920 px, scaled for preview via CSS `aspect-ratio`
- No runtime dependencies; Google Fonts (Poppins + JetBrains Mono) loaded via CDN
- `ctx.roundRect()` with manual fallback for older browsers
- First render waits for `document.fonts.ready`
- `font-size: 16px` on all inputs prevents automatic zoom on iOS Safari
- `100dvh` (dynamic viewport height) used throughout to fix the iOS Safari toolbar bug
- Canvas shadows explicitly reset with `ctx.restore()` to prevent bleed between elements
- XSS prevention: all user strings are HTML-escaped before `innerHTML` insertion
- Price input validated against `/^[\d.,]*$/` with inline error display

---

## Project Structure

```
index.html        — the entire application (HTML + CSS + JS, single file)
README.md         — this file
README.pt-BR.md   — Portuguese documentation
```

---

## Built by

**AFN Systems** — by Alyssom Fernandes

---

## License

MIT
