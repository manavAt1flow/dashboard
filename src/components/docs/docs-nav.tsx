import Link from "next/link";
import LogoWithoutText from "../globals/logo-without-text";
import DocsNavLinks from "./docs-nav-links";

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 h-[var(--fd-nav-height)] w-full bg-bg/70 backdrop-blur-sm">
      <div className="flex w-full items-center justify-between p-3 px-4 text-sm">
        <Link href={"/"}>
          <span className="inline-flex -translate-x-2 items-center">
            <LogoWithoutText className="size-12" />
            <span className="font-mono text-sm text-fg-300">E2B</span>
          </span>
        </Link>
        <DocsNavLinks />
      </div>
    </nav>
  );
}
