import * as fs from 'fs-extra';
import * as path from 'path';
import { DataLoader } from './utils/DataLoader';
import { BlogPageGenerator } from './generators/BlogPageGenerator';
import { IndexPageGenerator } from './generators/IndexPageGenerator';
import { AssetCopier } from './generators/AssetCopier';

async function build() {
  console.log('='.repeat(60));
  console.log('Starting static site generation...');
  console.log('='.repeat(60));

  const startTime = Date.now();

  try {
    // Define output directory
    const outputDir = path.join(__dirname, '../public_site');

    // 1. Clean output directory
    console.log('\n[Step 1/5] Cleaning output directory...');
    await fs.emptyDir(outputDir);
    console.log('✓ Output directory cleaned');

    // 2. Load data
    console.log('\n[Step 2/5] Loading blog data...');
    const blogItems = DataLoader.loadBlogData();
    const totalPages = Math.ceil(blogItems.length / 10);
    console.log(`✓ Loaded ${blogItems.length} blog posts`);
    console.log(`  - Newest post: ${blogItems[0]?.createdOn} (page ${totalPages})`);
    console.log(`  - Oldest post: ${blogItems[blogItems.length - 1]?.createdOn} (page 1)`);

    // 3. Generate individual blog post pages
    console.log('\n[Step 3/5] Generating blog post pages...');
    const blogPageGenerator = new BlogPageGenerator(outputDir);
    await blogPageGenerator.generateAll(blogItems);

    // 4. Generate pagination pages
    console.log('\n[Step 4/5] Generating pagination pages...');
    const indexPageGenerator = new IndexPageGenerator(outputDir);
    await indexPageGenerator.generateAll(blogItems);

    // 5. Copy static assets
    console.log('\n[Step 5/5] Copying static assets...');
    const assetCopier = new AssetCopier(outputDir);
    await assetCopier.copyAll();

    // Build complete
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n' + '='.repeat(60));
    console.log(`✓ Build complete in ${duration}s!`);
    console.log('='.repeat(60));
    console.log(`Output directory: ${outputDir}`);
    console.log('\nTo preview locally, run:');
    console.log('  npm run serve');
    console.log('');
  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('✗ Build failed!');
    console.error('='.repeat(60));
    console.error(error);
    process.exit(1);
  }
}

// Run the build
build();
