import * as fs from 'fs-extra';
import * as path from 'path';
import { BlogItem } from '../models/BlogItem';
import { TemplateRenderer } from '../utils/TemplateRenderer';

export class IndexPageGenerator {
  private renderer: TemplateRenderer;
  private outputDir: string;
  private readonly ITEMS_PER_PAGE = 10;

  constructor(outputDir: string) {
    this.renderer = TemplateRenderer.getInstance();
    this.outputDir = outputDir;
  }

  public async generateAll(blogItems: BlogItem[]): Promise<void> {
    console.log(`\nGenerating pagination pages...`);

    const totalPages = Math.ceil(blogItems.length / this.ITEMS_PER_PAGE);
    console.log(`Total pages to generate: ${totalPages}`);
    console.log(`Note: Page ${totalPages} = newest, Page 1 = oldest`);

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      await this.generatePage(pageNum, totalPages, blogItems);
    }

    console.log(`✓ Generated ${totalPages} pagination pages`);
  }

  private async generatePage(
    pageNum: number,
    totalPages: number,
    allBlogItems: BlogItem[]
  ): Promise<void> {
    // Reverse page numbering: Page 13 has newest (index 0-9), Page 1 has oldest
    const reversedPageNum = totalPages - pageNum + 1;
    const startIndex = (reversedPageNum - 1) * this.ITEMS_PER_PAGE;
    const endIndex = startIndex + this.ITEMS_PER_PAGE;
    const blogItems = allBlogItems.slice(startIndex, endIndex);

    // Calculate pagination data (reversed order)
    const hasPrevPage = pageNum < totalPages; // Previous = higher number
    const hasNextPage = pageNum > 1; // Next = lower number
    const prevPageUrl = pageNum === totalPages - 1 ? '/' : `/page/${pageNum + 1}/`;
    const nextPageUrl = `/page/${pageNum - 1}/`;

    // Generate page numbers for pagination links with ellipsis (reversed)
    const pages = this.generatePaginationItems(pageNum, totalPages);

    // Render template
    const html = this.renderer.render('index', {
      blogItems,
      currentPage: pageNum,
      totalPages,
      blogCount: allBlogItems.length,
      hasPrevPage,
      hasNextPage,
      prevPageUrl,
      nextPageUrl,
      pages,
    });

    // Determine output path
    let outputPath: string;
    if (pageNum === totalPages) {
      // Homepage shows the highest page number (newest posts)
      outputPath = path.join(this.outputDir, 'index.html');
    } else {
      // Pagination pages
      const pageDir = path.join(this.outputDir, 'page', pageNum.toString());
      await fs.ensureDir(pageDir);
      outputPath = path.join(pageDir, 'index.html');
    }

    // Write file
    await fs.writeFile(outputPath, html, 'utf-8');
    console.log(`  Generated page ${pageNum}/${totalPages}`);
  }

  private generatePaginationItems(
    currentPage: number,
    totalPages: number
  ): Array<{ number?: number; url?: string; isCurrent: boolean; isEllipsis?: boolean }> {
    const pages: Array<{ number?: number; url?: string; isCurrent: boolean; isEllipsis?: boolean }> = [];
    const delta = 2; // Number of pages to show on each side of current page

    // Generate in reverse order: totalPages down to 1
    for (let i = totalPages; i >= 1; i--) {
      // Always show first (highest), last (1), current page, and pages within delta of current
      if (
        i === totalPages ||
        i === 1 ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push({
          number: i,
          url: i === totalPages ? '/' : `/page/${i}/`,
          isCurrent: i === currentPage,
          isEllipsis: false,
        });
      } else if (
        // Add ellipsis before or after the current range
        (i === currentPage + delta + 1 && i < totalPages) ||
        (i === currentPage - delta - 1 && i > 1)
      ) {
        pages.push({
          isEllipsis: true,
          isCurrent: false,
        });
      }
    }

    return pages;
  }
}
