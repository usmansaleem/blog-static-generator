import * as Handlebars from 'handlebars';
import * as fs from 'fs-extra';
import * as path from 'path';

export class TemplateRenderer {
  private static instance: TemplateRenderer;
  private handlebars: typeof Handlebars;
  private templatesDir: string;

  private constructor() {
    this.handlebars = Handlebars;
    // Point to src/templates directory (templates are not compiled, they stay in src/)
    this.templatesDir = path.join(__dirname, '../../src/templates');
    this.registerPartials();
  }

  public static getInstance(): TemplateRenderer {
    if (!TemplateRenderer.instance) {
      TemplateRenderer.instance = new TemplateRenderer();
    }
    return TemplateRenderer.instance;
  }

  private registerPartials(): void {
    const partialsDir = path.join(this.templatesDir, 'partials');

    if (!fs.existsSync(partialsDir)) {
      throw new Error(`Partials directory not found: ${partialsDir}`);
    }

    const partialFiles = fs.readdirSync(partialsDir);

    partialFiles.forEach((file) => {
      if (file.endsWith('.hbs')) {
        const partialName = file.replace('.hbs', '');
        const partialPath = path.join(partialsDir, file);
        const partialContent = fs.readFileSync(partialPath, 'utf-8');

        this.handlebars.registerPartial(partialName, partialContent);
        console.log(`Registered partial: ${partialName}`);
      }
    });
  }

  public render(templateName: string, data: any): string {
    const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);

    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template not found: ${templatePath}`);
    }

    const templateContent = fs.readFileSync(templatePath, 'utf-8');
    const template = this.handlebars.compile(templateContent);

    return template(data);
  }
}
