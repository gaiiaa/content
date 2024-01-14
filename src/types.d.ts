declare module "*.md" {
  const content: {
    meta: Record<string, unknown>;
    ast: any;
  };
  export default content;
}
declare module "*.md?html" {
  const content: string;
  export default content;
}
declare module "*.md?meta" {
  const content: Record<string, unknown>;
  export default content;
}
