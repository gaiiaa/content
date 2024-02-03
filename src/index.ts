import yaml from "js-yaml";
import { unified } from "unified";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import remarkParse from "remark-parse";
import { visit } from "unist-util-visit";
import remarkRehype from "remark-rehype";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkFrontmatter from "remark-frontmatter";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import remarkCodeFrontmatter from "remark-code-frontmatter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

function customComponents() {
  return function (tree: any) {
    visit(tree, function (node) {
      if (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
      ) {
        const data = node.data || (node.data = {});
        data.hName = node.name;
        data.hProperties = node.attributes;
      }
    });
  };
}

function customCodeFrontmatter() {
  return function (tree: any) {
    visit(tree, function (node) {
      if (node.type === "code") {
        const data = node.data || (node.data = {});
        data.hProperties = node.frontmatter;
      }
    });
  };
}

export function createMdast(
  markdown: string,
  options: {
    remarkPlugins?: any[];
  } = {},
) {
  const u = unified();
  u.use(remarkParse);
  u.use(remarkFrontmatter, {
    type: "yaml",
    marker: "-",
    anywhere: true,
  });
  u.use(remarkCodeFrontmatter);
  u.use(customCodeFrontmatter);
  u.use(remarkDirective);
  u.use(customComponents);
  u.use(options.remarkPlugins || []);
  return u.run(u.parse(markdown));
}

export async function createHast(
  mdast,
  options: {
    rehypePlugins?: any[];
  } = {},
) {
  const u = unified();
  u.use(remarkRehype, { allowDangerousHtml: true });
  u.use(rehypeRaw);
  u.use(rehypeSanitize);
  u.use(options.rehypePlugins || []);
  u.use(rehypeSlug);
  u.use(rehypeAutolinkHeadings);
  return u.run(mdast) as unknown as any;
}

export async function parse(
  markdown: string,
  options: {
    remarkPlugins?: any[];
    rehypePlugins?: any[];
  } = {},
) {
  const mdast = await createMdast(markdown, options);
  const meta = yaml.load(
    (mdast as any)?.children?.find?.((node) => node.type === "yaml")?.value ??
      "",
  );
  const hast = await createHast(mdast, options);
  return {
    meta,
    ast: hast,
  };
}

export function stringify(node) {
  const n = "ast" in node ? node.ast : node;
  const u = unified();
  u.use(rehypeSlug);
  u.use(rehypeAutolinkHeadings);
  u.use(rehypeStringify);
  return u.stringify(u.runSync(n)).toString();
}

export { vitePluginFactory as default } from "./vite.js";
