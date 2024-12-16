import NavAuth from "./nav-auth";
import { Logo } from "../globals/logo";

export function Nav() {
  return (
    <nav className="w-full border-b border-border h-[var(--fd-nav-height)] backdrop-blur-sm bg-bg/70 sticky top-0 z-50">
      <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
        <a href={"/"}>
          <Logo className="w-20 h-10" />
        </a>
        <NavAuth />
      </div>
    </nav>
  );
}
