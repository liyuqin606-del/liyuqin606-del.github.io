# Yuqin Li — Academic homepage

A responsive, bilingual academic homepage with **清枫玉林**, 李昱嵚’s Chinese essay blog. Built with plain HTML, CSS and JavaScript; hosted on GitHub Pages. Fonts and the mathematical diagram are served locally. There are no analytics, remote font requests, or third-party JavaScript dependencies.

## Preview

From this directory:

```sh
npm ci --ignore-scripts
npm run build
python3 -m http.server 4180 --bind 127.0.0.1 --directory _site
```

Open `http://127.0.0.1:4180/`. English is the default; `?lang=zh` opens Chinese. The language button remembers the last selection when browser storage is available.

## Edit

- `index.html`: English content, research interests and profile links, education, contact information, SEO metadata.
- `script.js`: Chinese translations, language switching, copy-email interaction.
- `styles.css`: responsive layout, typography, colors and print styles.
- `index.html`, `figure.css`, `figure.js`: three inline SVG illustrations for recurrent depth, latent-state iteration, and revising the improvement method, with animation styles and motion controls. The inner Transformer loop depicts recurrent hidden states through shared weights; RSI feedback is a separate conceptual representation of evaluating and revising an improvement process. Recurrent inference alone does not establish recursive self-improvement. The latent surface and trajectories are illustrative geometry, not measured activations or a convergence claim.
- `assets/geometry.svg`: the original mathematical wireframe, retained as a source asset.
- `assets/fonts/`: self-hosted Cormorant Garamond and Manrope for Latin text, Noto Serif SC for Chinese headings, and Noto Sans SC for Chinese body text, with their SIL Open Font Licenses. Chinese WOFF2 files are subsets of the current page text; refresh the subsets when adding Chinese characters.

Update the English HTML and corresponding Chinese translation together. The public site currently presents research interests and public projects. Add specific papers only when the owner decides they are ready for public display.

## GitHub Pages

The personal homepage repository is `liyuqin606-del.github.io` and its site address is `https://liyuqin606-del.github.io/`.

Use **Settings → Pages → GitHub Actions**. `.github/workflows/pages.yml` installs locked dependencies, runs the blog checks, builds `_site/`, and deploys that artifact after each push to `main`. Only the generated artifact is hosted; draft sources, build tools and node_modules are excluded. The deployment must finish successfully before a change is considered live.

Official setup documentation: <https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site>

To move this site to another host, run `npm ci --ignore-scripts && npm run build` and upload `_site/` to a static web host. Update the URL in `tools/build.mjs`, homepage metadata and robots.txt when changing the domain. Node.js 22 is used at build time; the hosted site needs no server runtime, database or account system.

## Content and credits

Education and Computer Science minor: supplied by the site owner; 2025 enrollment confirmed. Chinese name: 李昱嵚. Institution naming: DIICSU official site. Research interests: owner's OpenReview profile and owner's update on 5 September 2026, with recursive self-improvement (RSI) as the current primary focus. Specific submission entries are intentionally omitted from this public site. Project summaries: public repository READMEs, checked the same day. Summary text describes research questions, not independently verified scientific results.

Fonts: Cormorant Garamond, Manrope, [Noto Serif SC](https://github.com/google/fonts/tree/main/ofl/notoserifsc), and [Noto Sans SC](https://github.com/google/fonts/tree/main/ofl/notosanssc), distributed under SIL OFL 1.1; license files are included. Fig. 01 is an original conceptual illustration, not an experiment trace. The shared-block recurrence is informed by [Universal Transformers](https://arxiv.org/abs/1807.03819) and the architecture description in [Looped Transformers with Source-Centered State Evolution](https://arxiv.org/abs/2607.27656). The site contains no generated portrait or invented achievements.

The figure rotates through three scenes every 10 seconds, with direct scene selection and a pause toggle. Choosing a scene resets the interval while preserving its motion; hover and keyboard focus suspend automatic scene changes for inspection. Motion stops outside the viewport, in a hidden tab, or under the system's reduced-motion preference. Without JavaScript the first diagram remains readable. Motion runs locally in CSS; the controller uses one timeout for scene changes, without a rendering loop or remote dependency.

## 清枫玉林

Read [WRITING.md](WRITING.md) for the Chinese writing and publishing guide. Use Markdown with YAML front matter in `content/posts/`; only `published: true` posts are rendered. Private drafts belong in the ignored local `content/drafts/` directory. No essays are fabricated or pre-published.

`blog.css` provides Chinese book typography, section numbering, a contents sidebar, footnotes and print styles. `tools/build.mjs` renders Markdown and KaTeX on the server at build time; the blog works without client JavaScript. Noto Serif SC is locally hosted in Unicode-range segments (SIL OFL), so new Chinese essays do not require regenerating a character subset. KaTeX and its fonts are included in the deployment with their MIT license. RSS and sitemap are regenerated with every build.
