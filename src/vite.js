import { parse, stringify } from "./index.js";

export function vitePluginFactory() {
	return {
		name: "vite-plugin-content",
		async transform(code, id) {
			if (id.endsWith(".md")) {
				return `export default ${JSON.stringify(await parse(code))};`;
			}
			if (id.endsWith(".md?html")) {
				return `export default ${JSON.stringify(
					stringify(await parse(code))
				)};`;
			}
			if (id.endsWith(".md?meta")) {
				return `export default ${JSON.stringify((await parse(code)).meta)};`;
			}
		}
	};
}
