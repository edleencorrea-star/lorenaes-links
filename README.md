# Lorena’s rotary links

A dependency-free static link page. Open `index.html` directly, or start a local server:

```sh
cd /workspace/lorenaes-links
python -m http.server 8000 --bind 0.0.0.0
```

Edit the `LINKS` array at the top of `script.js` to change labels, exact destinations, and local icons. Both the dial and text list use that array. Openings are evenly distributed at `360 / LINKS.length`; the current design is intended for 4–9 links. Keep each destination public and complete. Do not include secrets.

The background is `#fffded` in `styles.css`. The fixed center and finger stop are in `index.html`; the outer plate, opening rims, and icons rotate together. Regular clicks dial before navigating in the same tab. Ctrl/Cmd-click retains native link behavior. Pause, keyboard focus, reduced motion, touch holds, and page-return cancellation are supported.

## First-preview artwork

The chrome dial is original layered SVG artwork approximating the approved screenshot, not a photograph or Anna’s production artwork. The ELLÄS icon is a vector recreation of the supplied screenshot, not the original uploaded image file. Other icons are simplified local vector representations. Replace these with owner-approved source assets for an exact brand match.

The script font is Yellowtail by Astigmatic, a visual approximation of Anna’s center lettering. It is bundled locally under Apache 2.0; see `assets/LICENSE.txt`. Font source: https://github.com/google/fonts/tree/main/apache/yellowtail.

## Review and versions

Desktop and simulated phone checks are stored outside the deployable project, under `/workspace/rotary-preview`. The first preview has not yet been approved. Before major visual changes to an approved version, archive the project outside the deployable folder. Never include backups or private reference files in the deployed site.

No package installation or build step is required. Publishing requires the owner’s explicit approval. External destination availability could not be checked because the current environment blocks their hosts; verify each destination in a normal browser before publication.
