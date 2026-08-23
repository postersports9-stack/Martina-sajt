## Development

`npm run dev` starts the Next.js dev server on http://localhost:3000.

Verify a change with `npm run build` (type-checks and prerenders) and `npm run lint`.

## Documentation

Full documentation: https://nextjs.org/docs

Consult these guides before working on related tasks:

- [App Router: pages and layouts](https://nextjs.org/docs/app/api-reference/file-conventions/layout)
- [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Images and the image optimizer](https://nextjs.org/docs/app/api-reference/components/image)
- [Metadata and SEO](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Styling with Tailwind CSS](https://nextjs.org/docs/app/guides/tailwind-css)
- [Static exports](https://nextjs.org/docs/app/guides/static-exports)

## Toolchain pins

`typescript` and `eslint` are deliberately not on their latest major -- see the
"Toolchain pins" section of README.md before bumping either.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
