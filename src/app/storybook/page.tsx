export const dynamic = "force-static";

/*
  This page is used to serve the storybook build.
  It is served from the public/storybook directory.

  Run `pnpm storybook:build` to build the storybook.
*/
export default function StorybookPage() {
  return (
    <iframe
      src="/storybook/index.html"
      className="h-screen w-full border-0"
      title="Storybook"
    />
  );
}
