import * as fs from 'fs-extra';
import * as path from 'path';
import { BlogItem } from '../models/BlogItem';
import { BlogItemDate } from '../models/BlogItemDate';
import { TemplateRenderer } from '../utils/TemplateRenderer';

export class BlogPageGenerator {
  private renderer: TemplateRenderer;
  private outputDir: string;

  constructor(outputDir: string) {
    this.renderer = TemplateRenderer.getInstance();
    this.outputDir = outputDir;
  }

  public async generateAll(blogItems: BlogItem[]): Promise<void> {
    console.log(`\nGenerating ${blogItems.length} individual blog post pages...`);

    let count = 0;
    for (const blogItem of blogItems) {
      await this.generateBlogPage(blogItem);
      count++;

      if (count % 10 === 0) {
        console.log(`Generated ${count}/${blogItems.length} blog posts...`);
      }
    }

    console.log(`✓ Generated all ${count} blog post pages`);
  }

  private async generateBlogPage(blogItem: BlogItem): Promise<void> {
    // Create BlogItemDate for date formatting
    const blogItemDate = new BlogItemDate(blogItem.createdOn);

    // Render template
    const html = this.renderer.render('blog', {
      blogItem,
      blogItemDate,
    });

    // Create output directory: public_site/view/blog/{urlFriendlyId}/
    const blogDir = path.join(this.outputDir, 'view', 'blog', blogItem.urlFriendlyId);
    await fs.ensureDir(blogDir);

    // Write index.html
    const outputPath = path.join(blogDir, 'index.html');
    await fs.writeFile(outputPath, html, 'utf-8');
  }
}
