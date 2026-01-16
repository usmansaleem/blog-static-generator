import { Category } from "./Category";

export class BlogItem {
  public id?: string | undefined;
  public urlFriendlyId: string;
  public title: string;
  public description: string;
  public body: string;
  public blogSection: string;
  public readonly createdOn: string;
  public modifiedOn: string;

  public categories: Category[];

  constructor(
    id: string | undefined,
    urlFriendlyId: string,
    title: string,
    description: string,
    body: string,
    blogSection: string,
    createdOn: string,
    modifiedOn: string,
    categories: Category[]
  ) {
    this.id = id;
    this.urlFriendlyId = urlFriendlyId;
    this.title = title;
    this.description = description;
    this.body = body;
    this.blogSection = blogSection;
    this.createdOn = createdOn;
    this.modifiedOn = modifiedOn;

    this.categories = categories;
  }
}
