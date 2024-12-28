import { ReactNode } from "react";

export function DashboardPageDescription({
  children,
}: {
  children: ReactNode;
}) {
  return <p className="text-md text-fg-300">{children}</p>;
}

export function DashboardPageTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="w-min whitespace-nowrap bg-fg px-1.5 py-0.5 text-2xl font-light text-bg">
      {children}
    </h1>
  );
}

export function DashboardPageHeader({
  title,
  description,
}: {
  title: ReactNode;
  description?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <DashboardPageTitle>{title}</DashboardPageTitle>
      {description && (
        <DashboardPageDescription>{description}</DashboardPageDescription>
      )}
    </div>
  );
}
