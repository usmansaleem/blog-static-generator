import * as fs from 'fs-extra';
import * as path from 'path';

export class AssetCopier {
  private sourceDir: string;
  private outputDir: string;

  constructor(outputDir: string) {
    this.sourceDir = path.join(__dirname, '../../static-assets');
    this.outputDir = outputDir;
  }

  public async copyAll(): Promise<void> {
    console.log(`\nCopying static assets from: ${this.sourceDir}`);

    if (!fs.existsSync(this.sourceDir)) {
      throw new Error(`Source directory not found: ${this.sourceDir}`);
    }

    // Copy CSS files
    await this.copyDirectory('css');

    // Copy JS vendor files (jQuery, Modernizr)
    await this.copyDirectory('js/vendor');

    // Copy plugins.js (keep for reference, though pagination logic is now in HTML)
    await this.copyFile('js/plugins.js', 'js/plugins.js');

    // Copy static HTML pages
    await this.copyFile('info.html', 'info.html');
    await this.copyFile('404.html', '404.html');

    // Copy icons and favicons
    await this.copyFile('favicon.ico', 'favicon.ico');
    await this.copyFile('icon.png', 'icon.png');
    await this.copyFile('tile.png', 'tile.png');
    await this.copyFile('tile-wide.png', 'tile-wide.png');

    // Copy metadata files
    await this.copyFile('robots.txt', 'robots.txt');
    await this.copyFile('site.webmanifest', 'site.webmanifest');
    await this.copyFile('browserconfig.xml', 'browserconfig.xml');

    // Copy img directory if it exists
    const imgDir = path.join(this.sourceDir, 'img');
    if (fs.existsSync(imgDir)) {
      await this.copyDirectory('img');
    }

    // Create a minimal main.js (no AJAX calls needed)
    await this.createMinimalMainJs();

    console.log(`✓ Copied all static assets`);
  }

  private async copyDirectory(relativePath: string): Promise<void> {
    const source = path.join(this.sourceDir, relativePath);
    const dest = path.join(this.outputDir, relativePath);

    if (!fs.existsSync(source)) {
      console.log(`  Skipping ${relativePath} (not found)`);
      return;
    }

    await fs.copy(source, dest);
    console.log(`  Copied: ${relativePath}/`);
  }

  private async copyFile(relativePath: string, destPath: string): Promise<void> {
    const source = path.join(this.sourceDir, relativePath);
    const dest = path.join(this.outputDir, destPath);

    if (!fs.existsSync(source)) {
      console.log(`  Skipping ${relativePath} (not found)`);
      return;
    }

    await fs.ensureDir(path.dirname(dest));
    await fs.copy(source, dest);
    console.log(`  Copied: ${relativePath}`);
  }

  private async createMinimalMainJs(): Promise<void> {
    // Create a minimal main.js with just Google Analytics
    // No AJAX calls needed since pagination is now static HTML
    const minimalMainJs = `// Minimal main.js for static site
// Google Analytics is already in the HTML templates
// No AJAX calls needed - pagination is now static HTML links
`;

    const dest = path.join(this.outputDir, 'js', 'main.js');
    await fs.ensureDir(path.dirname(dest));
    await fs.writeFile(dest, minimalMainJs, 'utf-8');
    console.log(`  Created: js/main.js (minimal version)`);
  }
}
