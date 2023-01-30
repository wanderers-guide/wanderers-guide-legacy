import * as React from "react";

function NavLink({ href, children }: any) {
  return (
    <li className="text-zinc-100">
      <a href={href}>{children}</a>
    </li>
  );
}

export function Header() {
  return (
    <nav className="bg-zinc-900 flex justify-between px-4 py-3 border-b-[1px] border-zinc-400">
      <div className="shrink-0 pr-2">
        <a href="/">
          <img
            src="/images/logo.png"
            style={{
              height: 50,
              width: 282,
            }}
            alt="Wanderer's Guide"
          ></img>
        </a>
      </div>
      <ul className="flex gap-6 items-center">
        <NavLink>Home</NavLink>
        <NavLink>Characters</NavLink>
        <NavLink>Builds</NavLink>
        <NavLink>Homebrew</NavLink>
        <NavLink>GM Tools</NavLink>
        <NavLink>Browse</NavLink>
        <NavLink>Profile</NavLink>
      </ul>
    </nav>
  );
}
