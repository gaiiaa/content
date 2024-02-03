import { toJsxRuntime } from "hast-util-to-jsx-runtime";

export function toJSX(
  node: any,
  jsx: {
    jsx: any;
    jsxs: any;
    Fragment: any;
  },
  components: Record<string, any> = {},
) {
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
  }) as any;
}