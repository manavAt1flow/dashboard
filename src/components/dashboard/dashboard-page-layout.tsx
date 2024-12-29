export default function DashboardPageLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <>
      <div className="flex flex-col gap-1 bg-gradient-to-r from-bg-200 from-80% to-transparent to-20% bg-[length:22px_1px] bg-left-bottom bg-repeat-x pb-4">
        <h1 className="text-2xl font-medium text-fg-100">
          <span className="text-fg-500">{"\\\\ "}</span>
          {title}
        </h1>
        {description && (
          <p className="ml-3 text-sm text-fg-500">{description}</p>
        )}
      </div>
      <div className="relative h-full max-h-full w-full overflow-y-auto p-8 px-5">
        {children}
      </div>
    </>
  );
}
