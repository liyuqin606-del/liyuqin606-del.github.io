# Yuqin Li — Academic homepage

A responsive, bilingual academic homepage. Built with plain HTML, CSS and JavaScript; hosted on GitHub Pages. Fonts and the mathematical diagram are served locally. There are no analytics, remote font requests, or third-party JavaScript dependencies.

## Preview

From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open `http://127.0.0.1:4173/`. English is the default; `?lang=zh` opens Chinese. The language button remembers the last selection when browser storage is available.

## Edit

- `index.html`: English content, research interests and profile links, education, contact information, SEO metadata.
- `script.js`: Chinese translations, language switching, copy-email interaction.
- `styles.css`: responsive layout, typography, colors and print styles.
- `assets/geometry.svg`: a mathematical wireframe of the one-sheet hyperboloid x² + y² − z² = 1.
- `assets/fonts/`: self-hosted Cormorant Garamond and Manrope with their SIL Open Font Licenses.

Update the English HTML and corresponding Chinese translation together. The public site currently presents research interests and public projects. Add specific papers only when the owner decides they are ready for public display.

## GitHub Pages

The personal homepage repository is `liyuqin606-del.github.io` and its site address is `https://liyuqin606-del.github.io/`.

Publish the `main` branch from `/(root)` in **Settings → Pages → Deploy from a branch**. `.nojekyll` keeps the site as plain static files. GitHub Pages builds and deploys changes after each push; the deployment must finish successfully before the change is considered live.

Official setup documentation: <https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site>

To move this site to another host, upload the files unchanged to any static web host. Update the canonical/OG URLs, sitemap and robots.txt when changing the domain. No build step, database, account system or paid service is required by this source.

## Content and credits

Education and Computer Science minor: supplied by the site owner; 2025 enrollment confirmed. Institution naming: DIICSU official site. Research interests: owner's OpenReview profile, checked 5 September 2026. Specific submission entries are intentionally omitted from this public site. Project summaries: public repository READMEs, checked the same day. Summary text describes research questions, not independently verified scientific results.

Fonts: Cormorant Garamond and Manrope, distributed under SIL OFL 1.1; license files are included. The geometry is computed from a mathematical parameterization. The site contains no generated portrait or invented achievements.
