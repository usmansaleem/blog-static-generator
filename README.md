# Blog Static Site Generator

Static site generator for Usman's blog. Converts blog posts from JSON data into a fully static website ready for deployment to Cloudflare Pages.

## Features

- Generates 126 individual blog post pages from `data.json`
- Creates 13 pagination pages (10 posts per page)
- Preserves existing URL structure: `/view/blog/{urlFriendlyId}/`
- Chronological pagination (Page 1 = oldest posts, Page 13 = newest posts)
- Uses Handlebars templating
- Copies all static assets (CSS, JS, images)
- Future-ready for markdown content support

## Prerequisites

- Node.js 18.x or 20.x
- npm

## Installation

```bash
npm install
```

## Usage

### Build the Static Site

```bash
npm run build
```

This will:
1. Clean the output directory
2. Compile TypeScript code
3. Load blog data from `data/data.json`
4. Generate 126 blog post pages
5. Generate 13 pagination pages
6. Copy all static assets
7. Output everything to `public_site/` directory

### Test Locally

```bash
npm run serve
```

Opens the site at http://localhost:8080

### Development

```bash
# Clean output directories
npm run clean

# Compile TypeScript only
npm run build:ts

# Generate site only (after TypeScript compilation)
npm run build:site

# Build and serve in one command
npm run dev
```

## Project Structure

```
blog-static-generator/
├── src/
│   ├── builder.ts                    # Main build orchestrator
│   ├── generators/
│   │   ├── BlogPageGenerator.ts      # Generates individual blog posts
│   │   ├── IndexPageGenerator.ts     # Generates pagination pages
│   │   └── AssetCopier.ts            # Copies static assets
│   ├── models/
│   │   ├── BlogItem.ts               # Blog post data model
│   │   ├── BlogItemDate.ts           # Date formatting helper
│   │   └── Category.ts               # Category model
│   ├── templates/
│   │   ├── blog.hbs                  # Individual blog post template
│   │   ├── index.hbs                 # Pagination page template
│   │   └── partials/
│   │       ├── header.hbs            # Shared header
│   │       ├── footer.hbs            # Shared footer
│   │       └── blog-card.hbs         # Blog card component
│   └── utils/
│       ├── DataLoader.ts             # Loads and sorts blog data
│       └── TemplateRenderer.ts       # Handlebars setup
├── data/
│   ├── data.json                     # Blog posts data (126 posts)
│   └── markdown/                     # Future: markdown blog posts
├── public_site/                      # Output directory (gitignored)
├── package.json
├── tsconfig.json
└── README.md
```

## Output Structure

```
public_site/
├── index.html                                    # Homepage (page 1)
├── page/
│   ├── 2/index.html                             # Pagination pages
│   ├── 3/index.html
│   └── ... (through 13)
├── view/
│   └── blog/
│       ├── 7zip/index.html                      # Individual blog posts
│       ├── tcp_client_using_vertx_kotlin_gradle/index.html
│       └── ... (126 total)
├── css/                                          # Stylesheets
├── js/                                           # JavaScript files
├── img/                                          # Images
├── info.html                                     # Info page
├── 404.html                                      # Error page
└── favicon.ico, robots.txt, etc.                 # Static assets
```

## URL Structure

- Homepage: `/`
- Pagination: `/page/2/`, `/page/3/`, etc.
- Blog posts: `/view/blog/{urlFriendlyId}/`

This matches the existing production URL structure at https://usmans.info

## Adding New Blog Posts

To add new blog posts, edit the `data/data.json` file and add entries following this structure:

```json
{
  "id": "127",
  "urlFriendlyId": "my_new_blog_post",
  "title": "My New Blog Post",
  "description": "A brief description of the post",
  "body": "<p>Blog content in HTML format...</p>",
  "blogSection": "Technology",
  "createdOn": "2024-01-15",
  "modifiedOn": "2024-01-15",
  "categories": [
    { "name": "TypeScript" },
    { "name": "Node.js" }
  ]
}
```

After adding new entries, run `npm run build` to regenerate the static site.

## Future Enhancements / TODO

- **Markdown Support**: Add ability to write blog posts in Markdown format instead of HTML
  - Create markdown files in `data/markdown/` directory
  - Use frontmatter for metadata (YAML)
  - Automatically convert markdown to HTML during build
  - Libraries to use: `marked` for parsing, `gray-matter` for frontmatter

- **Search Functionality**: Client-side search using lunr.js or fuse.js

- **RSS Feed**: Auto-generate RSS/Atom feed during build

- **Sitemap Generation**: Auto-generate sitemap.xml with all pages

- **Category Pages**: Generate dedicated pages for each category/tag

- **Archive Pages**: Generate yearly/monthly archive pages

## Build Performance

- Generates 139 HTML pages in ~0.15 seconds
- Fast incremental builds
- No runtime dependencies - pure static HTML

## License

(Apache-2.0 OR MIT)

## Author

Usman Saleem
