import { Plugin } from "vite";
export default function vitePlugin(): Plugin;
export function createMdast(markdown: string, options?: {
	remarkPlugins?: any[];
}): object;
export function createHast(hast: object, options?: {
	rehypePlugins?: any[];
	allowDangerousHtml?: boolean;
}): Promise<object>;
export function parse(content: string, options?: {
	remarkPlugins?: any[];
	rehypePlugins?: any[];
	allowDangerousHtml?: boolean;
}): {
	meta: Record<string, unknown>;
	ast: object;
};
export function stringify(ast: object, options?: {
	allowDangerousHtml?: boolean;
}): string;
export function toJSX(
	ast: object, 
	jsx: {
		jsx: any,
		jsxs: any,
		Fragment: any,
	}, 
	components: object
): any