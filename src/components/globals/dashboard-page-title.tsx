import { ReactNode } from "react";

export default function DashboardPageTitle({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <h1 className="w-min bg-fg px-1 py-0.5 text-2xl font-bold text-bg">
      {children}
    </h1>
  );
}
