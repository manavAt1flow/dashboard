export default function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto h-full max-h-full w-full max-w-7xl overflow-y-auto px-4 pt-16">
      {children}
    </div>
  );
}
