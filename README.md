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
3. Load blog data from `../blog-nodejs-ts/data/data.json`
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

## Deployment to Cloudflare Pages

### Option 1: Wrangler CLI

```bash
# Build the site
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy public_site --project-name=usmans-blog
```

### Option 2: GitHub Integration

Connect your GitHub repository to Cloudflare Pages with these settings:

- **Build command**: `cd blog-static-generator && npm install && npm run build`
- **Build output directory**: `blog-static-generator/public_site`
- **Root directory**: `/` (or `blog-static-generator`)
- **Node version**: 18 or 20

### Custom Domain

Configure your custom domain (`usmans.info`) in the Cloudflare Pages dashboard.

## Adding New Blog Posts

### Method 1: JSON (Current)

Add new entries to `../blog-nodejs-ts/data/data.json` and rebuild.

### Method 2: Markdown (Future Enhancement)

1. Install markdown dependencies:
   ```bash
   npm install marked gray-matter
   ```

2. Create markdown file in `data/markdown/`:
   ```markdown
   ---
   id: "187"
   urlFriendlyId: "new_blog_post_2024"
   title: "New Blog Post"
   description: "Description here"
   createdOn: "2024-01-15"
   modifiedOn: "2024-01-15"
   categories:
     - TypeScript
     - Cloudflare
   ---

   # Blog Content

   Write content in **markdown** format...
   ```

3. Update DataLoader to parse markdown files (implementation pending)

## Build Performance

- Generates 139 HTML pages in ~0.15 seconds
- Fast incremental builds
- No runtime dependencies - pure static HTML

## License

(Apache-2.0 OR MIT)

## Author

Usman Saleem
