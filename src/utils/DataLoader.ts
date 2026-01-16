import * as fs from 'fs-extra';
import * as path from 'path';
import { BlogItem } from '../models/BlogItem';
import { Category } from '../models/Category';

export class DataLoader {
  private static readonly DATA_JSON_PATH = path.join(
    __dirname,
    '../../data/data.json'
  );

  public static loadBlogData(): BlogItem[] {
    console.log(`Loading blog data from: ${this.DATA_JSON_PATH}`);

    if (!fs.existsSync(this.DATA_JSON_PATH)) {
      throw new Error(`Data file not found: ${this.DATA_JSON_PATH}`);
    }

    const rawData = fs.readJsonSync(this.DATA_JSON_PATH);

    if (!Array.isArray(rawData)) {
      throw new Error('Data file does not contain an array');
    }

    const blogItems: BlogItem[] = rawData.map((item: any) => {
      const categories = item.categories.map((cat: any) => new Category(cat.name));

      return new BlogItem(
        item.id,
        item.urlFriendlyId,
        item.title,
        item.description,
        item.body,
        item.blogSection,
        item.createdOn,
        item.modifiedOn,
        categories
      );
    });

    // Sort by createdOn descending (newest first)
    // Page 1 = newest posts, Page 13 = oldest posts
    blogItems.sort((a, b) => {
      return new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime();
    });

    console.log(`Loaded ${blogItems.length} blog posts`);
    return blogItems;
  }
}
