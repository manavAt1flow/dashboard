export const dynamic = "force-static";

export default function StorybookPage() {
  return (
    <iframe
      src="/storybook/index.html"
      className="h-screen w-full border-0"
      title="Storybook"
    />
  );
}
