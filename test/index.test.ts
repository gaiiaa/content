import { expect, it, describe } from "vitest";
import {} from "../src";

describe("packageName", () => {
  it.todo("pass", () => {
    expect(true).toBe(true);
  });
});

const markdown = `
---
title: Hello World
---
# Hello World
this is a test
## Subtitle
this is a subtitle

:::code{lang=ts}
this is a custom component
:::

## Another subtitle
this is another subtitle
`;

const file = await parse(markdown);
console.log()

const j = toJSX(file.ast, jsx, {
	custom: {
		code: "lol",
	},
});
