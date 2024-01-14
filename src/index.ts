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
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { HastRoot, MdastRoot } from "remark-rehype/lib/index.js";

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

export function createMdast(markdown: string, options: {
  remarkPlugins?: any[];
} = {}) {
	const u = unified();
	u.use(remarkParse);
	u.use(remarkFrontmatter, {
		type: "yaml",
		marker: "-",
		anywhere: true,
	});
	u.use(remarkDirective);
	u.use(customComponents);
	u.use(options.remarkPlugins || []);
	return u.run(u.parse(markdown));
}

export async function createHast(mdast, options: {
  rehypePlugins?: any[];
} = {}) {
	const u = unified();
	u.use(remarkRehype, { allowDangerousHtml: true });
	u.use(rehypeRaw);
	u.use(rehypeSanitize)
	u.use(options.rehypePlugins || []);
	u.use(rehypeSlug);
	u.use(rehypeAutolinkHeadings);
	return u.run(mdast) as unknown as HastRoot;
}

export async function parse(markdown: string, options: {
  remarkPlugins?: any[];
  rehypePlugins?: any[];
} = {}) {
	const mdast = await createMdast(markdown, options);
	const meta = yaml.load(
		(mdast as any).children.find((node) => node.type === "yaml").value ?? ""
	);
	const hast = await createHast(mdast, options)
	console.log(hast.children[8]);
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

export function toJSX(node: any, jsx: {
  jsx: any;
  jsxs: any;
  Fragment: any;
}, components: Record<string, any> = {}) {
	const customComponents = components?.custom ?? {};
	if (components?.custom) delete components.custom;
	Object.entries(customComponents).forEach(([key, value]) => {
		components["content-" + key] = value;
	});
	const n = "ast" in node ? node.ast : node;
	return toJsxRuntime(n, {
		jsx: jsx.jsx,
		jsxs: jsx.jsxs,
		Fragment: jsx.Fragment,
		components,
	});
}

export { vitePluginFactory as default } from "./vite.js";